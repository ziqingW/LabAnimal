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
            <Navbar.Form pullLeft>
              <FormGroup>
                <FormControl type="text" placeholder="Search" />
                </FormGroup>{' '}
              </Navbar.Form>
            <Nav>
              <NavItem eventKey={1} href="/main">Summary</NavItem>
              <NavItem eventKey={2} href="/project">Project</NavItem>
              <NavItem eventKey={3} href="/cages">Cages</NavItem>
              <NavItem eventKey={4} href="/animals">Animals</NavItem>
            </Nav>
            <Nav pullRight>
              <NavDropdown eventKey={5} title="User" id="user-nav-dropdown">
                <MenuItem eventKey={5.1}>Log Off</MenuItem>
                <MenuItem eventKey={5.2} href="/user/password">Change Password</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={5.4} href="/user/delete">DELETE ACCOUNT</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar>
      </div>)
}
}
