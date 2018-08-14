import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { getUser } from '../actions.js'

export class Navigation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      redirect : false
    }
  }

  componentDidMount = () => {
    let userInfo = sessionStorage.getItem("userInfo")
    if (!userInfo) {
      this.setState({
        redirect : true
      })
    } else {
      this.props.getUser(userInfo)
    }
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
              <NavItem eventKey={1} href="/main">SUMMARY</NavItem>
              <NavItem eventKey={2} href="/animals">ANIMALS</NavItem>
            </Nav>
            <Nav pullRight>
              <NavDropdown eventKey={3} title="USER" id="user-nav-dropdown">
                <MenuItem eventKey={3.1}>Log Off</MenuItem>
                <MenuItem eventKey={3.2} href="/user/password">Change Password</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={3.4} href="/user/delete">DELETE ACCOUNT</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar>
      </div>)
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

Navigation = connect(null, mapDispatchToProps)(Navigation);
