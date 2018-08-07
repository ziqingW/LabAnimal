import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getUser } from '../actions.js'

export class Welcome extends React.component {
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
      username : username
    })
  }

  passwordInput = e => {
    e.preventDefault()
    let password = e.target.value
    this.setState({
      password : password
    })
  }

  rePasswordInput = e => {
    e.preventDefault()
    let rePassword = e.target.value
    this.setState({
      rePassword : rePassword
    })
  }

  showSignForm = () => {
    this.setState({
      signup: true,
      username : "",
      password : "",
      rePassword : ""
    })
  }

  showLoginForm = () => {
    this.setState({
      signup: false,
      username : "",
      password : "",
      rePassword : ""
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
            username : "",
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
        message : "Password must be longer than 8",
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
        <form onSubmit={this.loginSubmit}>
          <div>
            <input type="text" value={this.state.username} name="username" placeholder="USERNAME" onChange={this.usernameInput} />
            <input type="password" value={this.state.password} name="password" placeholder="PASSWORD" onChange={this.passwordInput} />
          </div>
          <h3>{this.state.message}</h3>
          <div>
            <button onClick={this.showSignForm}>NEW USER</button>
            <button type="submit">OK</button>
          </div>
        </form>
      )
  }

  signupForm = () => {
    return (
      <form onSubmit={this.signSubmit}>
        <div>
          <input type="text" value={this.state.username} name="username" placeholder="USERNAME" onChange={this.usernameInput} />
          <input type="password" value={this.state.password} name="password" placeholder="PASSWORD" onChange={this.passwordInput} />
          <input type="password" value={this.state.rePassword} name="rePassword" placeholder="RE-ENTER PASSWORD" onChange={this.rePasswordInput} />
        </div>
        <h3>{this.state.message}</h3>
        <div>
          <button onClick={this.showLoginForm}>RETURNED USER</button>
          <button type="submit">SUBMIT</button>
        </div>
      </form>
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
            dispatch(getUser(data));
        }
    };
}

Welcome = connect(null, mapDispatchToProps)(Welcome);