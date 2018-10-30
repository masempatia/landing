import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Welcome extends Component {

  processRedirect(){
    if(this.props.location.pathname===this.props.match.path){
      return(
        <Redirect from="/" exact to="publicaciones" />
      )
    }
  }

  render() {
    return(
      <div>
        {this.processRedirect()}
      </div>
    )
  }
}

export default Welcome;
