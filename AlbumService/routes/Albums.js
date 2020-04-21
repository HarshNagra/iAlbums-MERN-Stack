var express = require('express'); 
var fs = require('fs');

var router = express.Router();

var cors = require('cors');


var corsOptions = {

	origin:'http://localhost:3000',

    credentials:true,

}

router.get('/', cors(corsOptions),function(req, res, next) {
    res.render('index', { title: 'iAlbums' });
});

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
    next();
}); 


/*
*  http://localhost:3002/init  GET
*/


router.get('/init', cors(corsOptions), function(req, res) { 
    
    if (req.cookies.userID) {
        var db = req.db;
        var collection = db.get('userList');

        collection.find({"_id": req.cookies.userID},{},function(err,docs){
            if (err === null){

                var save = docs[0];
                var saveName = save['username'];
                var saveFriends = save['friends'];
                var data = new Array();
                var counter=0;

                saveFriends.forEach(function (item, index) {
                    collection.find({'username': item},{},function(err,docs2){
                        if (err === null){
                            var temp=docs2[0];
                            data.push({'friendID': temp['_id'], 'friendName': item});
                            counter=counter+1;
                            if (counter===saveFriends.length){
                                res.send({'username': saveName, 'userID': req.cookies.userID, 'savedFriends': data});
                            }
                        }
                        else {
                            res.send({msg: "Friends not Retrieved"});
                        }
                    });
                });
            }
            else {
                
                res.send({msg: err});
            }
            
        }); 
        
    } else {
        res.send({});
    } 
});

/*
*  http://localhost:3002/login  POST
*/

router.post('/login', cors(corsOptions) , function(req, res) {
    //express.urlencoded({ extended: true })
    var sentUsername=req.body.username;
    var sentPassword=req.body.password;

    var db = req.db;
    var collection = db.get('userList');


    collection.find({'username': sentUsername},{},function(err,docs){
        if (err === null){
            if( docs[0]!==undefined){
                if (docs[0]['password']===sentPassword){
                    res.cookie("userID", docs[0]['_id'], {maxAge: 3600000});

                    var data = new Array();
                    var counter=0;
                    var saveFriends = docs[0]['friends'];
                    saveFriends.forEach(function (item, index) {
                        collection.find({'username': item},{},function(err,docs2){
                            if (err === null){
                                var temp=docs2[0];
                                data.push({'friendID': temp['_id'], 'friendName': item});
                                counter=counter+1;
                                if (counter===saveFriends.length){
                                    res.send({'savedFriends':data, 'userID': req.cookies.userID});
                                }
                            }
                            else {
                                res.send({msg: "Friends not retrieved"});
                            }
                        });
                    });
                }
                else{
                    res.send({msg: "Login Failue"});
                }
            }
            else{
                res.send({msg: "Login Failue"});
            }
        }
        else {
            res.send({msg: "Login Failue"});
        }
    });
});

/*
*  http://localhost:3002/logout GET
*/

router.get('/logout', cors(corsOptions), function(req, res) { 
    if (req.cookies.userID) {
        res.clearCookie("userID");
        res.send({});
    } else {
        res.send({});
    } 
});


/*
*  http://localhost:3002/getalbum/:userid GET
*/

function ResHTML(docs) {
	
	var data = new Array();
	for (var i = 0; i < docs.length; i++) {
        data.push(docs[i]);
	}
	return data;
}

router.get('/getalbum/:userid', cors(corsOptions), function(req, res) { 
    if (req.params.userid==="0") {
        var db = req.db;
        var collection = db.get('photoList');

        collection.find({'userid': req.cookies.userID},{},function(err,docs){
            if (err === null){
                res.send({'albums': ResHTML(docs)});
            }
            else {
                res.send({msg: "Error"});
            }
        });
    } else {
        var db = req.db;
        var collection = db.get('photoList');

        collection.find({'userid': req.params.userid},{},function(err,docs){
            if (err === null){
                res.send(ResHTML(docs));
            }
            else {
                res.send({msg: "Error"});
            }
        });
    } 
});

/*
* http://localhost:3002/uploadphoto POST
*/

router.post('/uploadphoto', cors(corsOptions), function(req, res) {
    var db = req.db;
    var collection = db.get('photoList');
    let randomNumber = Math.round(Math.random()*1000000).toString();
    let path = "./public/uploads/" + randomNumber + ".jpg";
    req.pipe(fs.createWriteStream(path));
    let sendURL="http://localhost:3002/uploads/" + randomNumber + ".jpg";
    let currentUser = req.cookies.userID;
    let insertData = {"url": sendURL, "userid": currentUser, "likedby": []};

    collection.insert(insertData, function(err, result){
        res.send(
            (err === null) ? {msg: "Inserted", data: insertData} : {msg: "Not uploaded"}
        );
    });
});

/*
* http://localhost:3002/deletephoto/:photoid DELETE
*/

router.delete('/deletephoto/:photoid', cors(corsOptions), function(req, res) {
    var photoID = req.params.photoid;
    var db = req.db;
    var collection = db.get('photoList');
    
    collection.find({'_id': photoID},{},function(err,docs){
        if (err === null){
            var urlUnlink = docs[0]['url'].substring(21);
            fs.unlink("./public"+urlUnlink, function (err) {
                if (err) throw err;
                console.log('File deleted!');
            });
            var photoID = req.params.photoid;
            var collection2 = db.get('photoList');
            collection2.remove({'_id': photoID}, function(err, result){
                res.send((err === null)?{msg:'fd'}:{msg:err});
            });
        }
        else {
            res.send({msg: "Error"});
        }
    });
});

/*
* http://localhost:3002/updatelike/:photoid PUT
*/
router.put('/updatelike/:photoid', cors(corsOptions), function (req, res) {

    var db = req.db;
    var collection_0 = db.get('userList');

    collection_0.find({'_id': req.cookies.userID},{},function(err,docs){
        if (err === null){
            var newName = docs[0]['username'];
            var photoID = req.params.photoid;
            var db = req.db;
            var collection = db.get('photoList');
            collection.find({'_id': photoID}, {}, function(err,docs){
                if(err ===null){
                    var saveArray = docs[0]['likedby'];
                    saveArray.push(newName);

                    var db = req.db;
                    var collection_1 = db.get('photoList');
                    var photoToUpdate = req.params.photoid;
    
                    var filter = { "_id": photoToUpdate};
                    collection_1.update(filter, { $set: {'likedby': saveArray}}, function (err, result) {
                        res.send(
                            (err === null) ? { msg: '' } : { msg: err }
                        );
                    })  
                }
                else{
                    res.send({msg: "Error"});
                }
            });

        }
        else {
            res.send({msg: "Error"});
        }
    });
    

    
  });

/*
 * Handle preflighted request
 */
router.options("/*d", cors(corsOptions));

module.exports = router;


