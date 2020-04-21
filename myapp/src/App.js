import React from 'react';
import ReactDOM from 'react-dom'; 
import './App.css';
import $ from 'jquery';


class LoginPage extends React.Component{
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUsernameChange(e){
    this.props.onUsernameChange(e.target.value);
  }

  handlePasswordChange(e){
    this.props.onPasswordChange(e.target.value);
  }

  handleLogin(e){
    this.props.onLogin(e);
  }

  render() {
    return (
      <div>
      <div id="wrapper">
        <h1>iAlbums</h1>
          <form>
          <label>
            User Name:
          <input type="text" name="name"  onChange = {this.handleUsernameChange}/>
          </label>
          <label>
            Password:
          <input type="text" name="name" onChange = {this.handlePasswordChange}/>
          </label>
          <input className="button" type="submit" value="Log In" onClick={this.handleLogin}/>
          </form>
      </div>

        <div id="wrapper2">
          <div id="displayFriends">
          </div>
          <div id="displayAlbums">
          </div>
        </div>
      </div>
    );
  }
}

class FriendRow extends React.Component{
  constructor(props) {
    super(props);

    this.handleUserAlbum = this.handleUserAlbum.bind(this);

    this.handleMyAlbums = this.handleMyAlbums.bind(this);
    
    this.state = {
    };
  }

  handleUserAlbum(e){
    this.props.handleUserAlbum(e)
  }

  handleMyAlbums(e){
    this.props.handleMyAlbums(e)
  }

  render() {
    const friend = this.props.friend;
    return ( 
      <li><a href=""  key={friend['friendID'].toString()} id={friend['friendID'].toString()} onClick={this.handleUserAlbum}>{friend['friendName']}</a></li>
    );
  }
}

class AlbumRow extends React.Component{
  constructor(props) {
    super(props);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    
    this.state = {
    };
  }

  handleDeleteImage(e){
    this.props.handleDeleteImage(e);
  }

  render() {
    const album = this.props.album;
    let saveImage;
    if (album['likedby'].length>0) {
      saveImage = 
      <p> {  
      album['likedby'].map((person) => {
          return (
               person + ", "
            );
          })
        } liked this photo!</p>;
    } else {
      saveImage = <p></p>
    }
    return ( 
      <div className="column">
        <img src={album['url']}></img>
        <input id="delete" id={album._id} onClick={this.handleDeleteImage} className="button" type="button" value="Delete"></input>
        {saveImage}
      </div>
      
    );
  }
}

class WelcomePage extends React.Component{
  constructor(props) {
    super(props);
    
    this.handleMyAlbums = this.handleMyAlbums.bind(this);

    this.handleUserAlbum=this.handleUserAlbum.bind(this);

    this.handleDeleteImage=this.handleDeleteImage.bind(this);

    this.handleImageToUpload=this.handleImageToUpload.bind(this);
    this.handleImageUpload=this.handleImageUpload.bind(this);

    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
    };
  }

  handleUserAlbum(e){
    this.props.handleUserAlbum(e);
  }
  
  handleMyAlbums(e){
    this.props.handleMyAlbums(e);
  }

  handleDeleteImage(e){
    console.log(e.target.id);
    this.props.handleDeleteImage(e)
  }

  handleImageToUpload(e){
    this.props.onImageToUpload(e.target.value);
  }

  handleImageUpload(e){
    this.props.onImageUpload(e);
  }


  handleLogout(e){
    this.props.onLogout(e);
  }

  

  render() {
    let rows = [];
    let rows2 = [];
    this.props.userfriends.map((friend) => {
        rows.push(
          <FriendRow 
            key={friend['friendID'].toString()}
            friend={friend}
            handleUserAlbum={this.handleUserAlbum}
            handleMyAlbums={this.handleMyAlbums}
          />
        );
    });

    
    this.props.myAlbums.map((album) => {
        rows2.push(
          <AlbumRow 
            key={album['_id'].toString()}
            album={album}
            handleDeleteImage={this.handleDeleteImage}
          />
        );
    });



    return (
      <div>
        <div id="wrapper">
        <h1>iAlbums</h1>
        <form>
          <label>
            Welcome {this.props.username}!    
          </label>
          <input className="button" type="submit" value="Log Out" onClick={this.handleLogout}/>
        </form>
        </div>
        <div id="wrapper2">
          <div id="displayFriends">
            <ul>
              <li><a href=""  key={this.props.userID} id="0" onClick={this.handleUserAlbum}>My Albums</a></li>
              {/* onClick="" */}
              {rows}
            </ul>
          </div>
          <div id="displayAlbums">
            {rows2}
          </div>
          <div id="upload">
            <input className="button" type="file" label="Choose Image" name="upload" onChange={this.handleImageToUpload}></input>
            <input className="button" type="submit" value="Upload Image" onClick={this.handleImageUpload}/>
          </div>
        </div>
        
      </div>
      
    );
  }
}

class LandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleDeleteImage = this.handleDeleteImage.bind(this);

    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleImageToUpload = this.handleImageToUpload.bind(this);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

    this.handleLogin = this.handleLogin.bind(this);

    this.handleUserAlbum = this.handleUserAlbum.bind(this);

    this.handleMyAlbums = this.handleMyAlbums.bind(this);

    this.state = {
      username: "",
      userfriends: [],
      loggedIn: false,
      try_username: "",
      try_password: "",
      myAlbums: [],
      userID:"",
      reloadPage: true,
      imageToUpload: "",
      photoToDelete: "",

      currentUser:"0"
    };
  }

  handleUserAlbum = (e) =>{

    this.setState({
      currentUser: "5defe182a14dccb065a7ba3c"
    });
    alert(e.target.id);
  }

  handleDeleteImage(e){
    e.preventDefault(e);

    let ref_this = this;
    
    var confirmation = window.confirm('Are you sure you want to delete this image?');
    if(confirmation === true){
      var id = (e.target.id).toString();
      $.ajax({
        type: 'DELETE',
        url: "http://localhost:3002/deletephoto/"+id,
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: function(data) {          
		    this.setState({
		      reloadPage: !this.state.reloadPage
        });
        
        ref_this.handleMyAlbums();
        }.bind(this),
	  	error: function (xhr, ajaxOptions, thrownError) {
          alert("error");
		      alert(xhr.status);
		      alert(thrownError);
      }.bind(this)
      });
    }
  }

  handleImageToUpload(e){
    this.setState({
      imageToUpload: e
    });
  }

  handleImageUpload(e){
    e.preventDefault();
    let image = this.state.imageToUpload;
    $.ajaxSetup({
      crossDomain: true,
      xhrFields: {
          withCredentials: true
      },
      processData: false,
      contentType: 'application/octet-stream',
      data: image
    });

    let ref_this = this;

    if (image!== undefined && image!==''){
      console.log(image);
      $.post("http://localhost:3002/uploadphoto", 
          {
            image
          },
          
          function(data, status){ 
            if (data['msg']==='Inserted'){	
              this.setState({
                reloadPage: !this.state.reloadPage,
              }); 
              
              ref_this.handleMyAlbums();
            } else 
              alert("Not Inserted");
          }.bind(this)
      );
    }
    else{
      alert("No image selected")
    }
  }

  handleMyAlbums(e){
    let id;
 
    // alert(this.state.currentUser);

    $.ajax({
          url: "http://localhost:3002/getalbum/"+this.state.currentUser,
          dataType: 'json',      
          xhrFields: {
            withCredentials: true
          },
          success: function(data) {
            this.setState({
              myAlbums: data['albums'],
              });
          }.bind(this),
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }.bind(this)
        });

    // if(this.state.currentUser==="0"){
    //   $.ajax({
    //     url: "http://localhost:3002/getalbum/0",
    //     dataType: 'json',      
    //     xhrFields: {
    //       withCredentials: true
    //     },
    //     success: function(data) {
    //       this.setState({
    //         myAlbums: data['albums'],
    //         });
    //     }.bind(this),
    //     error: function (xhr, ajaxOptions, thrownError) {
    //         alert(xhr.status);
    //         alert(thrownError);
    //     }.bind(this)
    //   });
    // }
    // else{
    //   let id = this.state.currentUser;
    //   $.ajax({
    //     url: "http://localhost:3002/getalbum/"+id,
    //     dataType: 'json',      
    //     xhrFields: {
    //       withCredentials: true
    //     },
    //     success: function(data) {
    //       this.setState({
    //         myAlbums: data['albums'],
    //         });
    //     }.bind(this),
    //     error: function (xhr, ajaxOptions, thrownError) {
    //         alert(xhr.status);
    //         alert(thrownError);
    //     }.bind(this)
    //   });
    
    // }


    
  }

  handleLogout(event){
    
    $.ajax({
      url: "http://localhost:3002/logout",
      dataType: 'json',      
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        this.setState({
          loggedIn: false,
          });
      }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
      }.bind(this)
    });
  
  }
  
  handleUsernameChange(n) {
    this.setState({
      try_username: n
    });
  }

  handlePasswordChange(p) {
    this.setState({
      try_password: p
    });
  }

  handleLogin(event) {
    $.ajaxSetup({
      crossDomain: true,
      xhrFields: {
          withCredentials: true
      },
    });

    if (this.state.try_username!=="" && this.state.try_password!==""){
      $.post("http://localhost:3002/login", 
          { 
            "username" : this.state.try_username, 
            "password" : this.state.try_password,
          },
          
          function(data, status){ 
            
            if (data['savedFriends']){	
              
              this.setState({
                loggedIn: true,
                username: this.state.try_username,
                savedFriends: data['savedFriends'],
                currentUser: "0"
              }); 
            } else 
              alert("No friends data received");
          }.bind(this)
      );
    }
    else{
      alert("Please enter username and password");
    }
  }


  componentDidMount() {
    // this.setState({
    //   currentUser: "0"
    // })
    this.initialize();
    // this.handleMyAlbums();
  }
  

  initialize(){
    let ref_this= this;
    $.ajaxSetup({
      crossDomain: true,
      xhrFields: {
          withCredentials: true
      },
    });
  
    $.ajax({
      url: "http://localhost:3002/init",
      dataType: 'json',      
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        if(data['username']){
          this.setState({
            loggedIn: true,
            username: data['username'],
            userfriends: data['savedFriends'],
          });
          ref_this.handleMyAlbums();
        }
      }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
      }.bind(this)
  });
  }

  
	
  render() {

    return (
      <div>
        {this.state.loggedIn ? (
        <WelcomePage 
          myAlbums={this.state.myAlbums}
          userfriends={this.state.userfriends}
          userID={this.userID}
          username={this.state.username}
          onLogout={this.handleLogout}
          onImageUpload={this.handleImageUpload}
          onImageToUpload={this.handleImageToUpload}
          onImageUpload={this.handleImageUpload}
          handleDeleteImage={this.handleDeleteImage}
          handleUserAlbum={this.handleUserAlbum}

          handleMyAlbums={this.handleMyAlbums}
        />
        ) : (
        <LoginPage 
          onLogin={this.handleLogin}
          onUsernameChange={this.handleUsernameChange}
          onPasswordChange={this.handlePasswordChange}
        />
        )}
      </div>
     );
  }
}

export default LandingPage;

