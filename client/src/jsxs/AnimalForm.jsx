import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button, Col, Table} from 'react-bootstrap'

export class AnimalForm extends React.Component {
  render () {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td colSpan="2">Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
      )
  }
}
        // <FormGroup controlId="cageSpecies">
        //   <Col componentClass={ControlLabel} sm={2}>Species</Col>
        //   <Col sm={10}>
        //     <FormControl componentClass="select" placeholder="Select" onChange={this.speciesInput}>
        //       <option value="Mouse">Mouse</option>
        //       <option value="Rat">Rat</option>
        //       <option value="Guinea Pig">Guinea Pig</option>
        //       <option value="Pig">Pig</option>
        //       <option value="Primate">Primate</option>
        //     </FormControl>
        //   </Col>
        // </FormGroup>
        
        
        
