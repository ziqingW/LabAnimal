import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Modal, HelpBlock } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { getUser } from '../actions.js'
import axios from 'axios'
const clone = require('clone')

export class Navigation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      redirect : false,
      modalShow : false
    }
  }

  componentDidMount = () => {
    let userInfo = clone(sessionStorage.getItem("userInfo"))
    if (!userInfo) {
      this.setState({
        redirect : true
      })
    } else {
      this.props.getUser(userInfo)
    }
  }
  
  logOff = () => {
    sessionStorage.removeItem("userInfo")
    let userInfo = {username: '', userId: 0}
    this.props.getUser(userInfo)
  }
  
  deleteAccountModal = () => {
    this.setState({
      modalShow : true
    })
  }
  
  closeModal = () => {
    this.setState({
      modalShow : false
    })  
  }
  
  deleteAccount =() => {
    let userInfo = clone(sessionStorage.getItem("userInfo"))
    this.logOff()
    axios.post("/submit/deleteaccount", {userId: userInfo.userId})
      .then(results => {
        return
      })
      .catch (err => {
        console.log(err)
      })
  }
  
  render() {
    return (this.state.redirect ? <Redirect to="/" />
      :(<div>
        <h2>Lab Animal Management Platform</h2>
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <NavItem eventKey={1} href="/main">Summary</NavItem>
              <NavItem eventKey={2} href="/animals">All Animals</NavItem>
              <NavItem eventKey={3} href="/projects">Projects</NavItem>
            </Nav>
            <Nav pullRight>
              <NavDropdown eventKey={4} title={"Hello "+ this.props.username.charAt(0).toUpperCase() + this.props.username.slice(1)} id="user-nav-dropdown">
                <MenuItem eventKey={4.1} onClick={this.logOff}>Log Off</MenuItem>
                <MenuItem eventKey={4.2} href="/user/password">Change Password</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={4.3} onClick={this.deleteAccountModal}><b>DELETE ACCOUNT</b></MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar>
          <Modal show={this.state.modalShow} onHide={this.closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>DELETE Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h3>Are you sure to DELETE your account?</h3>
              <HelpBlock>Deleted account can't be recovered</HelpBlock>
              <div>
                <Button onClick={this.deleteAccount}>YES</Button>
                <Button onClick={this.closeModal}>NO</Button>
              </div>
            </Modal.Body>
          </Modal>
      </div>)
    )
}
}

function mapStateToProps(state) {
    return {
        username : state.username
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUser: function(data) {
            dispatch(getUser(data))
        }
    };
}

Navigation = connect(mapStateToProps, mapDispatchToProps)(Navigation)
