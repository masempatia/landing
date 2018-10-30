import React from 'react';
import Parser from 'html-react-parser';
import * as firebase from 'firebase';
import Button from '../components/Button';

export default class ConnectBox extends React.Component {

  constructor() {
    super();
    this.googleAuth = this.googleAuth.bind(this);
    this.processLoginButton = this.processLoginButton.bind(this);
  }

  componentWillMount() {

    this.descriptionDefault = '<b>Hola! Conectate que pronto tendremos muchas novedades!!'+
    '</b> <br/> como videos, entrevistas, eventos, etc.  ｡(-‿•)｡';

  }

  googleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => console.log(result.user))
    .catch(error => console.log(error))
  }

  facebookAuth() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => console.log(result.user))
    .catch(error => {
      if(error && error.code){
        if(error.code === 'auth/account-exists-with-different-credential'){
          alert(error.message)
        }
      }
    })
  }

  processLoginButton() {
    return (
      <p>
        <Button auth={this.googleAuth}
          type="red"
          text="Conectate con Google"
          icon="account_circle_white"
          shape="rounded"
        />
        <Button auth={this.facebookAuth}
          type="blue"
          text="Conectate con Facebook"
          icon="account_circle_white"
          shape="rounded"
        />
      </p>
    )
  }

  processDescription() {
    return this.props.description || this.descriptionDefault;
  }

  render() {
    return (
      <div className="warning-color padding-10">
        <p className="font-20 padding-left-5">
          { Parser(this.processDescription()) }
        </p>
        {this.processLoginButton()}
      </div>
    )
  }
}
