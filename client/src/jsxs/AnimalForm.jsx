import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button, Col, Table} from 'react-bootstrap'

export class AnimalForm extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      animalNumber : "",
      animalSpecies : "",
      animalStrain : "C57/BL6",
      animalGender : "Male",
      animalDOB : "",
      animalGeno : "PLD1KO",
      animalAge : ""
    }
  }
  
  eventHandler = (tag, event) => {
    event.preventDefault()
    let tagValue = event.target.value
    this.setState({
      [tag] : tagValue
    })
  }
  
  animalDOBInput = e => {
    e.preventDefault()
    let today = new Date()
    let pattern = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
    let animalDOB = e.target.value
    if (pattern.test(animalDOB)) {
      let [year, month, day] = animalDOB.split("-")
      let dob = `${month}/${day}/${year}`
      dob = new Date(dob)
      let timeDiff = today.getTime() - dob.getTime()
      if (timeDiff < 0) {
        this.setState({
          animalDOB: "",
          animalAge : ""
        })
      } else {
        let diffWks = (timeDiff/(1000*3600*24*7)).toFixed(1)
        this.setState({
          animalDOB: animalDOB,
          animalAge : diffWks
        })
      }
    }
  }
  
  render () {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Animal #</th>
            <th>Species</th>
            <th>Strain</th>
            <th>Gender</th>
            <th>Date Of Birth</th>
            <th>Age (Weeks)</th>
            <th>Genotype</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>        
              <FormGroup controlId="animalNumber">
                  <FormControl type="text" value={this.state.animalNumber} onChange={e => {this.eventHandler("animalNumber", e)}} />
              </FormGroup>
            </td>
            <td>        
              <FormGroup controlId="animalSpecies">
                  <FormControl componentClass="select" placeholder="Select" onChange={e => {this.eventHandler("animalSpecies", e)}}>
                    <option value="">- Select -</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Rat">Rat</option>
                    <option value="Guinea Pig">Guinea Pig</option>
                    <option value="Pig">Pig</option>
                    <option value="Primate">Primate</option>
                  </FormControl>
              </FormGroup>
            </td>
            <td>              
              <FormGroup controlId="animalStrain">
                <FormControl type="text" value={this.state.animalStrain} onChange={e => {this.eventHandler("animalStrain", e)}} />
              </FormGroup>
            </td>
            <td>              
              <FormGroup controlId="animalGender">
                <FormControl componentClass="select" placeholder="-" onChange={e => {this.eventHandler("animalGender", e)}}>
                  <option value="">-</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </FormControl>
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="animalDOB">
                <FormControl type="date" value={this.state.animalDOB} onChange={this.animalDOBInput} />
              </FormGroup>
            </td>
            <td>
              {this.state.animalAge}
            </td>
            <td>
              <FormGroup controlId="animalGeno">
                <FormControl type="text" value={this.state.animalGeno} onChange={e => {this.eventHandler("animalGeno", e)}} />
              </FormGroup>
            </td>
          </tr>
        </tbody>
      </Table>
      )
  }
}
