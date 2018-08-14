import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button, Col} from 'react-bootstrap'

export class CageForm extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      cageNumber : "",
      date : "",
      project : "",
      animals : [],
      comment: ""
    }
  }

  render () {
    return (
      <Form horizontal onSubmit={this.cageSubmit}>
        <h3>New Cage</h3>
        <FormGroup controlId="cageNumber">
          <Col componentClass={ControlLabel} sm={2}>Cage #</Col>
          <Col sm={10}>
            <FormControl type="text" value={this.state.cageNumber} onChange={this.cageNumberInput} />
          </Col>
        </FormGroup>
        <FormGroup controlId="cageDate">
          <Col componentClass={ControlLabel} sm={2}>Created On</Col>
          <Col sm={10}>
            <FormControl type="date" value={this.state.date} onChange={this.dateInput} />
          </Col>
        </FormGroup>
        <FormGroup controlId="cageProject">
          <Col componentClass={ControlLabel} sm={2}>Project (Optional)</Col>
          <Col sm={10}>
            <FormControl type="text" value={this.state.project} onChange={this.projectInput} />
          </Col>
        </FormGroup>
        <FormGroup controlId="cageComment">
          <Col componentClass={ControlLabel} sm={2}>Comments</Col>
          <Col sm={10}>
            <FormControl componentClass="textarea" value={this.state.comment} onChange={this.commentInput} placeholder="Enter comments"/>
          </Col>
        </FormGroup>
        <div>
          <Button onClick={this.cancelCageForm}>CANCEL</Button>
          <Button bsStyle="success" type="submit">ADD</Button>
        </div>
      </Form>
    )
  }
}
