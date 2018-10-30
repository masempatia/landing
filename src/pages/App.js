import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import Config from '../config/App';
import * as firebase from 'firebase';
import Image from '../asset/img/png/empatia.png';
import face from '../asset/img/png/face.png';
import insta from '../asset/img/png/insta.png';
import you from '../asset/img/png/you.png';

import Welcome from './Welcome';

import Button from '../components/Button';
import Loader from '../components/Loader';
import Form from '../components/Form';
import YoutubeTag from '../components/YoutubeTag';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      listUsers: [],
      user: null,
      loader: false,
      menu: false,
      options: false
    }
    this.userLogout = this.userLogout.bind(this);
    this.menuToggle = this.menuToggle.bind(this);
    this.optionsToggle = this.optionsToggle.bind(this);
    this.googleAuth = this.googleAuth.bind(this);
    this.facebookAuth = this.facebookAuth.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState ({ user })
      this.setState({ loader: true })
    })

  }

  findUserByMail(user){
    const db = firebase.database();
    const accounts = db.ref('accounts');
    const query = accounts.orderByChild('mail').equalTo(user.email).limitToFirst(1);
    var self = this;
    query.once('value', function(data){
      self.checkUserMail(user, data)
    });
  }

  checkUserMail(user, data){
    if(!data.val()){
      this.registerUser(user);
    }
  }

  registerUser(data){
    const rootRef = firebase.database().ref('accounts');
    const user = {
      mail: data.email,
      name: data.displayName,
      picture: data.photoURL
    }
    const newUser = rootRef.push()
    newUser.set(user);
  }

  googleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => this.findUserByMail(result.user))
    .catch(error => console.log(error))
  }

  facebookAuth() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => this.findUserByMail(result.user))
    .catch(error => {
      if(error && error.code){
        if(error.code === 'auth/account-exists-with-different-credential'){
          alert(error.message)
        }
      }
    })
  }

  onRouteChanged() {
    console.log("ROUTE CHANGED");
  }

  userLogout() {
    firebase.auth().signOut()
    .then(result => {
      console.log('success');
    })
    .catch(error => console.log(error))
  }

  processLogoutButton() {
    if(this.state.user){
      return (
        <div>
          <Button auth={this.userLogout}
            type="blue"
            text=""
            icon="account_circle_white"
            shape="square"
          />
        </div>
      )
    }
  }

  processUserName() {
    if(this.state.user){
      const user = this.state.user.providerData[0];
      return(
        <div className="user name"
          onClick={this.optionsToggle}>
          <span>
            {user.displayName}
          </span>
        </div>
      )
    }
  }

  processUserPic() {
    if(this.state.user){
      const user = this.state.user.providerData[0];
      return(
        <span>
          <img onClick={this.optionsToggle}
            src={user.photoURL}
            alt={user.displayName}
            height="50"/>
        </span>
      )
    }
  }

  // processAdminRoutes() {
  //   if(this.state.user){
  //     const user = this.state.user.providerData[0];
  //     if(user.type === 'root' || 'admin'){
  //       return (
  //         <Route exact path="/publicar" component={Publish} />
  //       )
  //     }
  //   }
  // }

  processApp() {
    if(this.state.loader){
      return (
        <div>
          <Switch>
            <Route exact path="/" component={Welcome} />
          </Switch>
        </div>
      )
    }else{
      return(
        <div className="app center">
          <Loader />
        </div>
      )
    }

  }

  processGoogleButton() {
    if(!this.state.user){
      return (
        <div>
          <Button auth={this.googleAuth}
            type="red hide_media"
            text="Conectate con Google"
            icon="account_circle_white"
            shape="rounded"
          />
          <Button auth={this.googleAuth}
            type="red show_media"
            text="G"
            shape="circle"
          />
        </div>
      )
    }
  }

  processFacebookButton() {
    if(!this.state.user){
      return (
        <div>
          <Button auth={this.facebookAuth}
            type="blue dark hide_media"
            text="Conectate con Facebook"
            icon="account_circle_white"
            shape="rounded"
          />
          <Button auth={this.facebookAuth}
            type="blue dark show_media"
            text="F"
            shape="circle"
          />
        </div>
      )
    }
  }

  menuToggle() {
    this.setState({ menu: !this.state.menu })
    console.log('menu')
  }

  optionsToggle() {
    this.setState({ options: !this.state.options })
  }

  render() {
    return (
      <Router>
        <div>
          <div className="container">
            <div className="row">
             <div className="twelve column text-center margin-top-20 margin-bottom-20">
               <img height="50" src={Image} />
             </div>
            </div>
            <div className="row">
             <div className="twelve column text-center margin-bottom-30">
               <h1 className="margin-clear">Muy pronto descubre <br/> ¿qué es la empatía?</h1>
             </div>
            </div>
            <div className="row">
             <div className="eight columns">
               <YoutubeTag
                videoId="" >
               </YoutubeTag>
             </div>
             <div className="four columns">
               <h2>Anotate para empatizar</h2>
               <Form />
             </div>
            </div>
            <div className="row">
              <div className="twelve column text-center margin-top-30">
                <h2 className="margin-clear">
                  Stalkeanos en nuestras redes
                </h2>
              </div>
            </div>
            <div className="social-container text-center margin-top-20">
              <div className="row">
              <div className="four column text-center">
                <a href="https://www.instagram.com/mas.empatia/?hl=es-la">
                  <img src={insta} />
                </a>
              </div>
              <div className="four column text-center">
                <a href="https://www.facebook.com/masEmpatia/">
                  <img src={face} />
                </a>
              </div>
              <div className="four column text-center">
                <a href="https://www.youtube.com/channel/UCCkzVFwN7_2-uK3V77ahhHg">
                  <img src={you} />
                </a>
              </div>
            </div>
            </div>
          </div>
          {this.processApp()}
          <footer className="text-center padding-20">
            Empatía.pe | Derechos reservados
          </footer>
        </div>
      </Router>
    );
  }
}
