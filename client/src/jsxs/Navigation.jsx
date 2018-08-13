import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl } from 'react-bootstrap'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

export class Navigation extends React.Component {
  render() {
    return (
      <div>
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
}
}
