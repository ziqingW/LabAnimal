import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getUser } from '../actions.js'
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button, Form} from 'react-bootstrap'
import { Navigation } from './Navigation.jsx'

export class ChangePassword extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      oldPassword : "",
      newPassword : "",
      re_newPassword : "",
      message : "",
      redirect : false
    }
  }
  
  handlerInput = (tag, e) => {
    let tagValue = e.target.value
    this.setState({
      [tag] : tagValue,
      message : ""
    })
  }
  
  changePWValid = tag => {
    let value = this.state.tag
    if ( value >= 8) {
      return "success"
    } else if ( value > 4) {
      return "warning"
    } else {
      return "error"
    }
  }
  
  changePWSubmit = e => {
    e.preventDefault()
    let userId = this.props.userId
    let oldPassword = this.state.oldPassword
    let newPassword = this.state.newPassword
    let re_newPassword = this.state.re_newPassword
    if (newPassword !== re_newPassword) {
      this.setState({
        message : "New password not consistent",
        newPassword : "",
        re_newPassword : ""
      })
    } else {
      axios.post("/submit/newpassword", {oldPassword: oldPassword, newPassword: newPassword, userId: userId})
        .then(results => {
          if(results.data.message === "wrong password") {
            this.setState({
              message : "Error: Wrong old password for user",
              oldPassword : ""
            })
          } else {
            this.setState({
              oldPassword : "",
              newPassword : "",
              re_newPassword : "",
              message : "Password updated successfully"
            }, function() {
              this.delay = setInterval(() => {
              this.setState({
                redirect : true
              })
            }, 2000)
            })
          }
        })
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.delay)
  }
    
  render () {
    return ( this.state.redirect ? <Redirect to="/main" /> :
      (<div>
      <Navigation />
      <Form onSubmit={this.changePWSubmit}>
        <h3>Change Password</h3>
        <FormGroup controlId="oldPassword">
          <ControlLabel>Old Password</ControlLabel>
          <FormControl type="password" value={this.state.oldPassword} onChange={e => {this.handlerInput("oldPassword", e)}} />
        </FormGroup>
        <FormGroup controlId="newPassword">
          <ControlLabel>New Password</ControlLabel>
          <FormControl type="password" value={this.state.newPassword} placeholder="Password must be longer than 8 characters" onChange={e => {this.handlerInput("newPassword", e)}}  validationState={this.changePWValid("newPassword")} />
        </FormGroup>
        <FormGroup controlId="reNewRepassword">
          <ControlLabel>Re-Enter New Password</ControlLabel>
          <FormControl type="password" value={this.state.re_newPassword} placeholder="Password must be longer than 8 characters" onChange={e => {this.handlerInput("re_newPassword", e)}}  validationState={this.changePWValid("re_newPassword")} />
        </FormGroup>
        <HelpBlock>{this.state.message}</HelpBlock>
        <div>
          <Button bsStyle="success" type="submit">Submit</Button>
        </div>
      </Form>
      </div>)
      )
  }
}

function mapStateToProps(state) {
    return {
        userId : state.userId
    }
}

ChangePassword = connect(mapStateToProps)(ChangePassword)
