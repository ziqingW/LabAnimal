import React from 'react'
import axios from 'axios'
import {Form, FormGroup, ControlLabel, FormControl, Button, Col, Table, Modal} from 'react-bootstrap'
import { connect } from 'react-redux'
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
    animalGeno : "PLD1KO",
    animalNotes : ""
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
      updateTag : "",
      modalShow : false,
      warning: "",
      submitAnimals: []
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
      updateTag : tag,
      warning: ""
    })
  }

  showModal = () => {
    let animals = clone(this.state.animals)
    let animalFormNumber = this.state.animalFormNumber
    animals = animals.slice(0,animalFormNumber)
    let animalNumbers = {}
    let flag = true
    animals.forEach(animal => {
      if (animal.animalNumber === "" || animal.animalSpecies === "" || animal.animalStrain === "" || animal.animalGender === "" || animal.animalDOB === "" || animal.animalGeno === "") {
        this.setState({
          warning: "Column with * can't be left blank"
        })
        flag = false
        return
      } else {
        if (!(animal.animalNumber in animalNumbers)) {
        animalNumbers[animal.animalNumber] = 1
      } else {
        this.setState({
          warning : "Animal # can't be the same"
        })
        flag =false
        return
      }
      }
    })
    if (flag) {
      this.setState({
        modalShow: true,
        submitAnimals : animals
      })
    }
  }

  closeModal = () => {
    this.setState({
      modalShow: false
    })
  }

  animalTableSubmit = () => {
    let submitAnimals = clone(this.state.submitAnimals)
    axios.post("/submit/newanimals", {submitAnimals: submitAnimals, userId:this.props.userId})
      .then(response => {
        let message = response.data.message
        if (message === "number") {
          this.setState({
            modalShow : false,
            warning : "Error: same animal # found in database"
          })
        } else {
          this.setState({
            animalFormNumberAdd : "",
            animalFormNumber: 0,
            animalRows: [],
            showForm : false,
            animals : animalsBase,
            updateIndex: "",
            updateTag : "",
            modalShow : false,
            warning: "New animals added",
            submitAnimals: []
          })
        }
      })
      .catch (err => {
        console.log(err)
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

  animalFormNumberInput = () => {
      return (
          <Form horizontal onSubmit={this.animalFormNumberAdd}>
            <FormGroup controlId="animalFormNumber" validationState={this.animalFormNumberValid()}>
              <Col componentClass={ControlLabel} sm={2}>New Animals</Col>
              <Col sm={3}>
                <FormControl type="number" value={this.state.animalFormNumberAdd} onChange={this.animalFormNumberChange} placeholder="Enter number" max="20" min="1"/>
              </Col>
              <Col sm={1}>
                <Button bsStyle="primary" type="submit">ADD</Button>
              </Col>
              {this.state.showForm ? (
                <div>
              <Col sm={1}>
                <Button onClick={this.copyRow} bsStyle="primary">COPY</Button>
              </Col>
              <Col sm={1}>
                <Button onClick={this.showModal} bsStyle="success">SUBMIT</Button>
              </Col>
              </div>
            ) : null}
            </FormGroup>
          </Form>
      )
  }

  copyRow = () => {
      let animals = clone(this.state.animals)
      let animalFormNumber = this.state.animalFormNumber
      let copyrow = clone(animals[animalFormNumber - 1])
      animals[animalFormNumber] = copyrow
      animals[animalFormNumber]["animalNumber"] = ""
      this.setState({
        animals : animals,
        animalFormNumber : animalFormNumber+1,
        warning: ""
      }, function() {
        this.makeRows(this.state.animalFormNumber)
      })
  }

  deleteRow = (key, event) => {
      event.preventDefault()
      let animals = clone(this.state.animals)
      animals.splice(key,1)
      animals.push({
        animalNumber : "",
        animalSpecies : "",
        animalStrain : "C57/BL6",
        animalGender : "",
        animalDOB : "",
        animalAge : "",
        animalGeno : "PLD1KO"
      })
      let animalFormNumber = this.state.animalFormNumber - 1
      if (animalFormNumber === 0) {
        this.setState({
          animals : animals,
          animalFormNumber : animalFormNumber,
          showForm : false,
          warning: ""
        })
      } else {
      this.setState({
        animals : animals,
        animalFormNumber : this.state.animalFormNumber - 1,
        warning: ""
      }, function() {
        this.makeRows(this.state.animalFormNumber)
      })
    }
  }

  animalFormNumberChange = e => {
      let animalFormNumberAdd = e.target.value
      if (animalFormNumberAdd) {
      this.setState({
        animalFormNumberAdd : parseInt(animalFormNumberAdd, 10),
        warning: ""
      })
    } else {
      this.setState({
        animalFormNumberAdd : "",
        warning: ""
      })
    }
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
                  <FormControl componentClass="select" placeholder="Select" value={this.state.animals[i].animalSpecies} onChange={ e => {this.eventHandler("animalSpecies",i, e)}}>
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
                <FormControl type="text" value={this.state.animals[i].animalStrain} onChange={ e => {this.eventHandler("animalStrain",i, e)}} />
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="animalGender">
                <FormControl componentClass="select" placeholder="-" value={this.state.animals[i].animalGender} onChange={ e => {this.eventHandler("animalGender",i, e)}}>
                  <option value="">-</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </FormControl>
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="animalDOB">
                <FormControl type="date" value={this.state.animals[i].animalDOB} onChange={ e => {this.animalDOBInput(i,e)}} />
              </FormGroup>
            </td>
            <td>
              {this.state.animals[i].animalAge}
            </td>
            <td>
              <FormGroup controlId="animalGeno">
                <FormControl type="text" value={this.state.animals[i].animalGeno} onChange={ e => {this.eventHandler("animalGeno", i, e)}} />
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="animalNotes">
                <FormControl componentClass="textarea" value={this.state.animals[i].animalNotes} onChange={ e => {this.eventHandler("animalNotes", i, e)}} />
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="animalGeno">
                <Button bsStyle="danger" onClick={e => {this.deleteRow(i,e)}}>Delete</Button>
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
          showForm : true,
          warning: ""
        })
      }
    }

  componentDidUpdate = (prevProps, prevState) => {
      let prevAnimals = clone(prevState.animals)
      let nowAnimals = clone(this.state.animals)
      let index = this.state.updateIndex
      let content = this.state.updateTag
      if (index !== "" && content) {
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
              {this.state.animalRows.map( row => {
                return row
              })}
            </tbody>
          </Table>
        </Form>): null}
        {this.animalFormNumberInput()}
        <h4>{this.state.warning}</h4>
        <Modal show={this.state.modalShow} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Animals</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>Are you sure to add these animals?</h3>
            <div>
              <Button onClick={this.closeModal}>NO</Button>
              <Button onClick={this.animalTableSubmit}>YES</Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
        userId : state.userId
    }
}

AnimalForm = connect(mapStateToProps)(AnimalForm);
