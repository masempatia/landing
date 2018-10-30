import React from 'react';

export default class Message extends React.Component {

  processMessage() {
    if(this.props.type){
      return(
        <div className={`message ${ this.props.type }`}>
          {this.props.message}
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        {this.processMessage()}
      </div>
    )
  }
}
