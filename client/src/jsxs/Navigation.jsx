import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Modal, HelpBlock, Button } from 'react-bootstrap'
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
    let userInfo = JSON.stringify({username: '', userId: 0})
    this.props.getUser(userInfo)
    this.setState({
      redirect : true
    })
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
  :(<div className="navi-wrap">
        <h2>Lab Animal Management Platform</h2>
          <Navbar inverse collapseOnSelect className="navbar-content">
            <Navbar.Header>
              <Navbar.Brand>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="/main">Summary</NavItem>
              <NavDropdown eventKey={2} title={"Animals"} id="animal-nav-dropdown">
                <MenuItem eventKey={2.1} href="/animals">Current Animals</MenuItem>
                <MenuItem eventKey={2.2} href="/animals/sacrifaced">Sacrifaced Animals</MenuItem>
              </NavDropdown>
              <NavItem eventKey={3} href="/projects">Projects</NavItem>
            </Nav>
            <Nav pullRight>
              <NavDropdown eventKey={4} title={"Hello "+ this.props.username.charAt(0).toUpperCase() + this.props.username.slice(1)} id="user-nav-dropdown">
                <MenuItem eventKey={4.1} onClick={this.logOff}>Log Off</MenuItem>
                <MenuItem eventKey={4.2} href="/user/password">Change Password</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={4.3} onClick={this.deleteAccountModal}><b><span className="deleteAccountSpan">DELETE ACCOUNT</span></b></MenuItem>
              </NavDropdown>
            </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Modal className="modal-wrap" show={this.state.modalShow} onHide={this.closeModal}>
            <Modal.Header closeButton>
              <Modal.Title className="deleteAccount-title"><b>DELETE ACCOUNT</b></Modal.Title>
            </Modal.Header>
            <Modal.Body className="user-modal-body">
              <h3>Are you sure to DELETE your account?</h3>
              <HelpBlock><b>Deleted account can't be recovered</b></HelpBlock>
              <div className="modal-buttons">
                <Button bsStyle="link" onClick={this.deleteAccount}>YES</Button>
                <Button bsStyle="primary" onClick={this.closeModal}>NO</Button>
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
