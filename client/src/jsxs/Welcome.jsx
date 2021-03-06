import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getUser } from '../actions.js'
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button, Form, Image} from 'react-bootstrap'

export class Welcome extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username : "",
      password : "",
      rePassword : "",
      message : "",
      signup : false,
      redirect: false
    }
  }

  usernameInput = e => {
    e.preventDefault()
    let username = e.target.value
    this.setState({
      username : username,
      message : ""
    })
  }

  passwordInput = e => {
    e.preventDefault()
    let password = e.target.value
    this.setState({
      password : password,
      message : ""
    })
  }

  rePasswordInput = e => {
    e.preventDefault()
    let rePassword = e.target.value
    this.setState({
      rePassword : rePassword
    })
  }

  showSignForm = e => {
    e.preventDefault()
    this.setState({
      signup: true,
      username : "",
      password : "",
      rePassword : "",
      message : ""
    })
  }

  showLoginForm = e => {
    e.preventDefault()
    this.setState({
      signup: false,
      username : "",
      password : "",
      rePassword : "",
      message : ""
    })
  }

  loginSubmit = e => {
    e.preventDefault()
    this.setState({
      message: "Logging..."
    })
    let username = this.state.username
    let password = this.state.password
    axios.post("/login", {username: username, password: password})
      .then( response => {
        let message = response.data.message
        if (message !== "Logged in") {
          this.setState({
            message : message,
            password : ""
          })
        } else {
          let userInfo = JSON.stringify({"username": username, "userId": response.data.userId})
          sessionStorage.setItem("userInfo", userInfo)
          this.props.getUser(userInfo)
          this.setState({
            redirect : true
          })
        }
      })
      .catch( err => {
        console.log(err)
      })
  }

  signSubmit = e => {
    e.preventDefault()
    this.setState({
      message: "Signing up..."
    })
    let username = this.state.username
    let password = this.state.password
    let rePassword = this.state.rePassword
    if (password !== rePassword) {
      this.setState({
        message : "Password inconsistent",
        password : "",
        rePassword : ""
      })
    } else if (password.length < 8){
      this.setState({
        message : "Password can't be shorter than 8 characters",
        password : "",
        rePassword : ""
      })
    }
    else {
      axios.post("/signup", {username: username, password: password})
        .then( response => {
          let message = response.data.message
          if (message !== "Signed up") {
            this.setState({
              message : message
            })
          } else {
            let userInfo = JSON.stringify({"username": username, "userId": response.data.userId})
            sessionStorage.setItem("userInfo", userInfo)
            this.props.getUser(userInfo)
            this.setState({
              redirect : true
            })
          }
        })
        .catch( err => {
          console.log(err)
        })
    }
  }

  loginForm = () => {
      return (
        <div className="welcome-form-wrap">
          <div className="welcome-titles">
            <h1>Welcome to LAMP</h1>
            <h4><i>&#9866; Lab Animal Management Platform</i></h4>
          </div>
        <Form className="welcome-form" onSubmit={this.loginSubmit}>
          <h3>Login In</h3>
          <FormGroup controlId="formLoginUsername">
            <ControlLabel>Username</ControlLabel>
            <FormControl type="text" value={this.state.username} onChange={this.usernameInput} />
          </FormGroup>
          <FormGroup controlId="formLoginPassword">
            <ControlLabel>Password</ControlLabel>
            <FormControl type="password" value={this.state.password} onChange={this.passwordInput} />
          </FormGroup>
          <HelpBlock className="welcome-warning">{this.state.message}</HelpBlock>
          <div className="welcome-buttons">
            <Button onClick={this.showSignForm}>NEW USER</Button>
            <Button bsStyle="primary" type="submit">OK</Button>
          </div>
        </Form>
        <Image src={require("../images/labBackground.png")} responsive rounded/>
        </div>
      )
  }

  signupForm = () => {
    return (
      <div className="welcome-form-wrap">
        <div className="welcome-titles">
          <h1>Welcome to LAMP</h1>
          <h4><i>&#9866; Lab Animal Management Platform</i></h4>
        </div>
      <Form className="welcome-form" onSubmit={this.signSubmit}>
        <h3>Sign Up</h3>
        <FormGroup controlId="formSignUsername">
          <ControlLabel>Username</ControlLabel>
          <FormControl type="text" value={this.state.username} onChange={this.usernameInput} />
        </FormGroup>
        <FormGroup controlId="formSignPassword">
          <ControlLabel>Password</ControlLabel>
          <FormControl type="password" value={this.state.password} placeholder="Password must be longer than 8 characters" onChange={this.passwordInput} />
        </FormGroup>
        <FormGroup controlId="formSignRepassword">
          <ControlLabel>Re-Enter Password</ControlLabel>
          <FormControl type="password" value={this.state.rePassword} placeholder="Password must be longer than 8 characters" onChange={this.rePasswordInput} />
        </FormGroup>
        <HelpBlock className="welcome-warning">{this.state.message}</HelpBlock>
        <div className="welcome-buttons">
          <Button onClick={this.showLoginForm}>RETURNED USER</Button>
          <Button bsStyle="primary" type="submit">SUBMIT</Button>
        </div>
      </Form>
      <Image src={require("../images/labBackground.png")} responsive rounded/>
      </div>
    )
  }

  render() {
    return (
      this.state.redirect ? <Redirect to="/main" /> :
      (this.state.signup ? this.signupForm() : this.loginForm())
    )
  }
}

function mapDispatchToProps(dispatch) {
    return {
        getUser: function(data) {
            dispatch(getUser(data))
        }
    }
}

Welcome = connect(null, mapDispatchToProps)(Welcome)
