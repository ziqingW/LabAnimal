import React from 'react'
import { Navigation } from './Navigation.jsx'
import { Link } from 'react-router-dom'
import {Form, FormGroup, ControlLabel, FormControl, Button, Col, Table, HelpBlock} from 'react-bootstrap'
import { connect } from 'react-redux'
const clone = require('clone')

export class AnimalEdit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      animals : [],
      editlRows : [],
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
  
  animalDOBInput = (i,e) => {
    e.preventDefault()
    let today = new Date()
    let pattern = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
    let animalDOB = e.target.value
    if (pattern.test(animalDOB)) {
      let [year, month, day] = animalDOB.split("-")
      let dob = `${month}/${day}/${year}`
      dob = new Date(dob)
      let timeDiff = today.getTime() - dob.getTime()
      let animals = clone(this.state.animals)
      if (timeDiff < 0) {
        animals[i].animalDOB = ""
        animals[i].animalAge = ""
      } else {
        let diffWks = (timeDiff/(1000*3600*24*7)).toFixed(1)
        animals[i].animalDOB = animalDOB
        animals[i].animalAge = diffWks
      }
      this.setState({
        animals : animals,
        updateIndex : i,
        updateTag : "animalDOB"
      })
    }
  }
  
  makeEditRows = () => {
    let rows = []
    this.state.animals.forEach((animal, i) => {
      rows.push(
        (<tr key={i}>
            <td>
              <FormGroup controlId="editanimalNumber">
                  <FormControl type="text" value={animal.animalNumber} onChange={ e => {this.eventHandler("animalNumber", i, e)}} />
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="animalSpecies">
                  <FormControl componentClass="select" placeholder="Select" value={animal.animalSpecies} onChange={ e => {this.eventHandler("animalSpecies",i, e)}}>
                    <option value="">- Select -</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Rat">Rat</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Guinea Pig">Guinea Pig</option>
                    <option value="Pig">Pig</option>
                    <option value="Primate">Primate</option>
                  </FormControl>
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="animalStrain">
                <FormControl type="text" value={animal.animalStrain} onChange={ e => {this.eventHandler("animalStrain",i, e)}} />
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="animalGender">
                <FormControl componentClass="select" placeholder="-" value={animal.animalGender} onChange={ e => {this.eventHandler("animalGender",i, e)}}>
                  <option value="">-</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </FormControl>
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="animalDOB">
                <FormControl type="date" value={animal.animalDOB} onChange={ e => {this.animalDOBInput(i,e)}} />
              </FormGroup>
            </td>
            <td>
              {animal.animalAge}
            </td>
            <td>
              <FormGroup controlId="animalGeno">
                <FormControl type="text" value={animal.animalGeno} onChange={ e => {this.eventHandler("animalGeno", i, e)}} />
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="animalNotes">
                <FormControl componentClass="textarea" value={animal.animalNotes} onChange={ e => {this.eventHandler("animalNotes", i, e)}} />
              </FormGroup>
            </td>
        </tr>))
    })
    this.setState({
      editlRows : rows
    })
  }
  
  componentDidMount = () => {
    this.setState({
      animals : clone(this.props.editAnimals)
    }, this.makeEditRows())
  }
  
  componentDidUpdate = (prevProps, prevState) => {
    let prevAnimals = clone(prevState.animals)
    let nowAnimals = clone(this.state.animals)
    let index = this.state.updateIndex
    let content = this.state.updateTag
    if (index !== "" && content) {
      if (prevAnimals[index][content] !== nowAnimals[index][content]) {
        this.makeEditRows()
      }
    }
  }
  
  render () {
    return (
      <div>
        <Navigation />
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>*Animal #</th>
              <th>*Species</th>
              <th>*Strain</th>
              <th>*Gender</th>
              <th>*Date Of Birth</th>
              <th>Age (Weeks)</th>
              <th>*Genotype</th>
              <th>Notes</th>
              <th>{" "}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.editlRows.map( row => {
              return row
            })}
          </tbody>
        </Table>
        <div>
          <Link to="/animals"><Button>CANCEL</Button></Link>
          <Button onClick={this.editAnimals}>OK</Button>
        </div>
        <HelpBlock>Column with * can't be left blank</HelpBlock>
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
        editAnimals : state.editAnimals
    }
}

AnimalEdit = connect(mapStateToProps)(AnimalEdit)
