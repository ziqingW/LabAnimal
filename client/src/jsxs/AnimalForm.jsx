import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button, Col, Table} from 'react-bootstrap'
const clone = require('clone')

let animalsBase = []
for (let i = 0; i < 50; i ++) {
  animalsBase.push({
    animalNumber : "",
    animalSpecies : "",
    animalStrain : "C57/BL6",
    animalGender : "",
    animalDOB : "",
    animalAge : "",
    animalGeno : "PLD1KO"
  })
}

export class AnimalForm extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      animalFormNumberAdd : "",
      animalFormNumber: 0,
      animalRows: [],
      showForm : false,
      animals : animalsBase,
      updateIndex: "",
      updateTag : ""
    }
  }

  eventHandler = (tag, key, event) => {
    event.preventDefault()
    let tagValue = event.target.value
    let animals = clone(this.state.animals)
    animals[key][tag] = tagValue
    this.setState({
      animals : animals,
      updateIndex : key,
      updateTag : tag
    })
  }

  animalFormNumberValid = () => {
      let animalFormNumberAdd = this.state.animalFormNumberAdd
      if (animalFormNumberAdd <= 0 || animalFormNumberAdd > 20) {
        return "error"
      } else {
        return "success"
      }
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

  animalFormNumberInput = () => {
      return (
          <Form horizontal onSubmit={this.animalFormNumberAdd}>
            <FormGroup controlId="animalFormNumber" validationState={this.animalFormNumberValid()}>
              <Col componentClass={ControlLabel} sm={2}>New Animals</Col>
              <Col sm={3}>
                <FormControl type="number" value={this.state.animalFormNumberAdd} onChange={this.animalFormNumberChange} placeholder="Enter number" max="20" min="1"/>
              </Col>
              <Col sm={1}>
                <Button bsStyle="success" type="submit">ADD</Button>
              </Col>
              {this.state.showForm ? (
              <Col sm={1}>
                <Button bsStyle="primary">COPY</Button>
              </Col>
            ) : null}
            </FormGroup>
          </Form>
      )
  }

  animalFormNumberChange = e => {
      let animalFormNumberAdd = parseInt(e.target.value)
      this.setState({
        animalFormNumberAdd : animalFormNumberAdd
      })
  }

  makeRows = num => {
    const rows = []
    for (let i = 0; i < num; i ++) {
      rows.push(
        (<tr key={i}>
            <td>
              <FormGroup controlId="animalNumber">
                  <FormControl type="text" value={this.state.animals[i].animalNumber} onChange={ e => {this.eventHandler("animalNumber", i, e)}} />
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
                <FormControl type="text" value={this.state.animals[i].animalStrain} onChange={e => {this.eventHandler("animalStrain", e)}} />
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
        </tr>))
        this.setState({
          animalRows : rows
        })
      }
    }

  animalFormNumberAdd = e => {
      e.preventDefault()
      if (this.state.animalFormNumberAdd) {
        let animalFormNumber = this.state.animalFormNumber + this.state.animalFormNumberAdd
        this.makeRows(animalFormNumber)
        this.setState({
          animalFormNumber : animalFormNumber,
          showForm : true
        })
      }
    }

  componentDidUpdate = (prevProps, prevState) => {
      let prevAnimals = clone(prevState.animals)
      let nowAnimals = clone(this.state.animals)
      let index = this.state.updateIndex
      let content = this.state.updateTag
      console.log("haha")
      if (index!=="" && content) {
        console.log(index, content)
        console.log(prevAnimals[index][content])
        console.log(nowAnimals[index][content])
        if (prevAnimals[index][content] !== nowAnimals[index][content]) {
          this.makeRows(this.state.animalFormNumber)
        }
      }
  }

  render () {
    return (
      <div>
        {this.state.showForm ?
        (<Form>
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
              {this.state.animalRows.map( row => {
                return row
              })}
            </tbody>
          </Table>
        </Form>): null}
        {this.animalFormNumberInput()}
      </div>
    )
  }
}
