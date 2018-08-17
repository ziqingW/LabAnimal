import ReactTable from 'react-table'
import 'react-table/react-table.css'
import checkboxHOC from "react-table/lib/hoc/selectTable"
import { Button, Modal, HelpBlock } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getAnimals } from '../actions.js'
import React from 'react'
import axios from 'axios'
const clone = require('clone')
const CheckboxTable = checkboxHOC(ReactTable)

export class ProjectTable extends React.Component {
  constructor (props) {
    axios.post("/table/projects", {userId: this.props.userId})
      .then(results => {
        let data = clone(results.data.data)
        this.state = {
          data : data
        }
      })
      .catch (err => {
        console.log(err)
      })
  }
  
  makeProjectData = () => {
    let data = clone(this.state.data)
    let projectData = {}
    data.forEach(animal => {
      if (!(animal.project in projectData)) {
        projectData[animal.project] = {
          projectName : animal.project,
          species : animal.speices,
          animalNumber : 1,
          creation_date : animal.creation_date
        }
      } else {
        projectData[animal.project].animalNumber += 1
      }
    })
    return Object.values(projectData)
  }
  
  makeCageData = project => {
    let data = clone(this.state.data)
    let cageData = {}
    data.forEach(animal => {
      if (animal.project === project) {
        if (!(animal.cage_number in cageData)) {
          cageData[animal.cage_number] = {
            cage_number : animal.cage_number,
            animalNumber : 1
          }
        } else {
        cageData[animal.project].animalNumber += 1
      }
      } 
    })
    return Object.values(cageData)
  }
  
  makeAnimalData = cage => {
    let data = clone(this.state.data)
    let animalData = []
    data.forEach(animal => {
      if (animal.cage_number === cage) {
        animalData.push(animal)
      }
    })
    return animalData
  }
  
  render () {
    const columnsProject = [{
      Header: 'Project Name',
      accessor: 'projectName' // String-based value accessors!
    },{
      Header: 'Species',
      accessor: 'species' // String-based value accessors!
    }, {
      Header: 'Creation Date',
      accessor: 'creation_date'
    }, {
      Header: 'Animal numbers',
      accessor: 'animalNumber',
      filterable: false
    }]
    
    const columnsCage = [{
      Header: 'Cage #',
      accessor: 'cage_number'
    }, {
      Header: 'Animal numbers',
      accessor: 'animalNumber_cage',
      filterable: false
    }]
    
    const columnsAnimal = [{
      Header: 'Animal #',
      accessor: 'tag' // String-based value accessors!
    }, {
      Header: 'Species',
      accessor: 'species',
    }, {
      Header: 'Strain',
      accessor: 'strain'
    }, {
      Header: 'Gender',
      accessor: 'gender'
    }, {
      Header: 'Birthday',
      accessor: 'birthday',
      filterable: false
    }, {
      Header: 'Age (Wks)',
      accessor: 'age',
      filterable: false
    },
    {
      Header: 'Genotype',
      accessor: 'genotype'
    }, {
      Header: 'Comments',
      accessor: 'comments',
      filterable: false
    }]
    
    // const dataProject = this.makeProjectData()
    // const dataCage = this.makeCageData()
    // const dataAnimal = this.makeAnimalData()
    
    return (
      <div></div>
    )
  }
}
