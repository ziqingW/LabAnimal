import React from 'react'
import { Navigation } from './Navigation.jsx'
import { Footer } from './Footer.jsx'
import { Link, Redirect } from 'react-router-dom'
import {FormGroup, FormControl, Button, Table, HelpBlock} from 'react-bootstrap'
import { connect } from 'react-redux'
import axios from 'axios'
const clone = require('clone')

export class AnimalEdit extends React.Component {
  constructor (props) {
    super(props)
    let animals = clone(this.props.editAnimals)
    animals.forEach(animal => {
      let dob = animal.birthday
      let [month, day, year] = dob.split("/")
      if (parseInt(month, 10) - 10 < 0) {
        month = '0' + month
      }
      if (parseInt(day, 10) - 10 < 0) {
        day = '0' + day
      }
      dob = `${year}-${month}-${day}`
      animal.birthday = dob
    })
    this.state = {
      animals : animals,
      editlRows : [],
      updateIndex: "",
      updateTag : "",
      redirect : false,
      message : ""
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
        animals[i].birthday = ""
        animals[i].age = ""
      } else {
        let diffWks = (timeDiff/(1000*3600*24*7)).toFixed(1)
        animals[i].birthday = animalDOB
        animals[i].age = diffWks
      }
      this.setState({
        animals : animals,
        updateIndex : i,
        updateTag : "birthday"
      })
    }
  }

  makeEditRows = () => {
    let rows = []
    this.state.animals.forEach((animal, i) => {
      rows.push(
        (<tr key={i}>
          <td>
            <FormGroup controlId="editCageNumber">
                <FormControl type="text" value={animal.cage_number} onChange={ e => {this.eventHandler("cage_number", i, e)}} />
            </FormGroup>
          </td>
            <td>
              <FormGroup controlId="editanimalNumber">
                  <FormControl type="text" value={animal.tag} onChange={ e => {this.eventHandler("tag", i, e)}} />
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="editanimalSpecies">
                  <FormControl componentClass="select" placeholder="Select" value={animal.species} onChange={ e => {this.eventHandler("species",i, e)}}>
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
              <FormGroup controlId="editanimalStrain">
                <FormControl type="text" value={animal.strain} onChange={ e => {this.eventHandler("strain",i, e)}} />
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="editanimalGender">
                <FormControl componentClass="select" placeholder="-" value={animal.gender} onChange={ e => {this.eventHandler("gender",i, e)}}>
                  <option value="">-</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </FormControl>
              </FormGroup>
            </td>
            <td>
              <FormGroup controlId="editanimalDOB">
                <FormControl type="date" value={animal.birthday} onChange={ e => {this.animalDOBInput(i,e)}} />
              </FormGroup>
            </td>
            <td>
              {animal.age}
            </td>
            <td>
              <FormGroup controlId="editanimalGeno">
                <FormControl type="text" value={animal.genotype} onChange={ e => {this.eventHandler("genotype", i, e)}} />
              </FormGroup>
            </td>
            <td>
            <FormGroup controlId="editanimalProject">
                <FormControl type="text" value={animal.project} onChange={ e => {this.eventHandler("project", i, e)}} />
            </FormGroup>
            </td>
            <td>
              <FormGroup controlId="editanimalNotes">
                <FormControl componentClass="textarea" value={animal.comments} onChange={ e => {this.eventHandler("comments", i, e)}} />
              </FormGroup>
            </td>
        </tr>))
    })
    this.setState({
      editlRows : rows
    })
  }

  componentDidMount = () => {
    this.makeEditRows()
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

  editAnimals = () => {
    let animals = clone(this.state.animals)
    let animalNumbers = {}
    let flag = true
    animals.forEach(animal => {
      if (animal.tag === "" || animal.species === "" || animal.strain === "" || animal.gender === "" || animal.birthday === "" || animal.genotype === "" || animal.cage_number === "") {
        this.setState({
          message: "Column with * can't be left blank"
        })
        flag = false
        return
      } else {
        if (!(animal.tag in animalNumbers)) {
        animalNumbers[animal.tag] = 1
      } else {
        this.setState({
          message : "Animal # can't be the same"
        })
        flag =false
        return
      }
      }
    })
    if (flag) {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
      axios.post("/submit/editanimals", {animals: animals, userId: userInfo.userId})
        .then(results=> {
          if(results.data.message === "OK") {
            this.setState({
              redirect : true
            })
          } else {
            console.log("2")
            this.setState({
              message: "Error: same animal # found in database"
            })
          }
        })
        .catch (err => {
          console.log(err)
        })
      }
  }

  render () {
    return (this.state.redirect ? <Redirect to="/animals" /> :
      (<div>
        <Navigation />
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>*Cage #</th>
              <th>*Animal #</th>
              <th>*Species</th>
              <th>*Strain</th>
              <th>*Gender</th>
              <th>*Date Of Birth</th>
              <th>Age (Weeks)</th>
              <th>*Genotype</th>
              <th>Project</th>
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
          <Link to="/animals"><Button>Cancel</Button></Link>
          <Button onClick={this.editAnimals}>OK</Button>
        </div>
        <div>
          <HelpBlock>Column with * can't be left blank</HelpBlock>
          <HelpBlock>{this.state.message}</HelpBlock>
        </div>
        <Footer />
      </div>)
    )
  }
}

function mapStateToProps(state) {
    return {
        editAnimals : state.editAnimals
    }
}

AnimalEdit = connect(mapStateToProps)(AnimalEdit)
