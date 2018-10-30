import React from 'react';
import FormErrors from './FormErrors';
import Message from './Message';
import * as firebase from 'firebase';

export default class Form extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      nombres: '',
      telefono: '',
      email: '',
      formErrors: {nombres: '', telefono: '', email: ''},
      message: {
        type: '',
        text: ''
      },
      nombresValid: false,
      telefonoValid: false,
      emailValid: false,
    }

    this.registerPeople = this.registerPeople.bind(this);
  }

  verifyAccount(user){
    const email = "mixc21@gmail.com";
    const db = firebase.database();
    const accounts = db.ref('people');
    const query = accounts.orderByChild('email').equalTo(email);

    query.on('value', function(data){
      console.log(data)
      //this.checkUserMail(user, data);
    });
  }

  checkUserMail(user, data){
    let message = this.state.message;
    message.type = "info";
    message.text = "Esta cuenta ya fue registrada!";

    if(!data.val()){
      this.registerPeople(user);
    }else{
      this.setState({ message });
    }
  }

  registerPeople(){
    const user = {
      "nombres": "Estefano",
      "telefono": "972153303",
      "email": "mixc21@gmail.com"
    }

    const rootRef = firebase.database().ref('people');
    /*const user = {
      mail: data.email,
      name: data.displayName,
      picture: data.photoURL
    }*/
    const newUser = rootRef.push();
    let message = this.state.message;

    newUser.set(user, function(error){
      if(error){
        message.type = "error";
        message.text = "Error! hubo un problema al registrar";
      }else{
        message.type = "success";
        message.text = "Registro satisfactorio";
      }

      this.setState({ message });

    }.bind(this));

  }

  handleUserInput (e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value});
  }

  handleUserInput (e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value},
                  () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let nombresValid = this.state.nombresValid;
    let telefonoValid = this.state.telefonoValid;

    switch(fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? '' : ' es invalido';
        break;
      case 'nombres':
        nombresValid = value.length >= 3;
        fieldValidationErrors.nombres = nombresValid ? '': ' es muy corto';
        break;
      case 'telefono':
        telefonoValid = value.match(/^(?:[\+]{1})?(?:\([0-9]{1,2}\) ?)?(?:[0-9] ?-?){6,14}[0-9]$/i);
        fieldValidationErrors.telefono = telefonoValid ? '' : ' es invalido';
        break;
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                    emailValid: emailValid,
                    nombresValid: nombresValid,
                    telefonoValid: telefonoValid
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.emailValid && this.state.nombresValid && this.state.telefonoValid});
  }

  render() {
    return (
      <div>
        <div className="panel panel-default">
          <FormErrors formErrors={this.state.formErrors} />
        </div>
        <Message type={this.state.message.type}
          message={this.state.message.text} />
          <label>¿Comó te llamas?</label>
          <input value={this.state.nombre}
            onChange={(event) => this.handleUserInput(event)}
            className="margin-top-5 red"
            name="nombres"
            placeholder="Escribe tus nombres y apellidos" />
          <label>Deja tu Whatsapp</label>
          <input value={this.state.telefono}
            onChange={(event) => this.handleUserInput(event)}
            className="margin-top-5 red"
            name="telefono"
            placeholder="Pon aquí tu numero telefonico" />
          <label>Pon aquí tu E-mail</label>
          <input value={this.state.email}
            onChange={(event) => this.handleUserInput(event)}
            className="margin-top-5 red"
            name="email"
            placeholder="Ejemplo alias@dominio.com" />
          <div className="text-center">
            <button className="red rounded"
              disabled={!this.state.formValid}
              onClick={this.verifyAccount}>
              Quiero Empatizar
            </button>
          </div>

      </div>
    )
  }
}
