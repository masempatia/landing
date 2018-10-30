import React from 'react';

export default class Button extends React.Component {

  processIcon(){
    if(this.props.icon){
      return(
        <span className={`icon ${ this.props.icon }`}>
        </span>
      )
    }
  }

  render() {
    return (
    <button className={`${ this.props.shape } ${ this.props.type }`}
      onClick={this.props.auth}>
       { this.processIcon() }
       { this.props.text }
    </button>
    )
  }
}
