import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { connect } from 'react-redux'
import React from 'react'
import axios from 'axios'
const clone = require('clone')

export class ProjectTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data : []
    }
  }

  componentDidMount = () => {
    this.getData()
  }

  getData = () => {
    let userId = JSON.parse(sessionStorage.getItem("userInfo")).userId
    axios.post("/table/projects", {userId: userId})
      .then(results => {
        let data = clone(results.data.data)
        data.forEach(animal => {
          let dob = animal.birthday.split("T")[0]
          let creation_date = animal.creation_date.split("T")[0]
          animal.birthday = dob
          animal.creation_date = creation_date
          let today = new Date()
          dob = new Date(dob)
          let timeDiff = today.getTime() - dob.getTime()
          let diffWks = (timeDiff/(1000*3600*24*7)).toFixed(1)
          animal.age = diffWks
        })
        this.setState({
          data : data
        })
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
          species : animal.species,
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
        cageData[animal.cage_number].animalNumber += 1
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
      Header: 'Animal numbers/Total',
      accessor: 'animalNumber',
      filterable: false
    }]
    const columnsCage = [{
      Header: 'Cage #',
      accessor: 'cage_number'
    }, {
      Header: 'Animal numbers/Cage',
      accessor: 'animalNumber',
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
    const dataProject = this.makeProjectData()
    return (
      <div>
        <ReactTable
          data={dataProject}
          columns={columnsProject} className="-striped -highlight"
          defaultPageSize={10} filterable
          SubComponent={row => {
            return (
              <div style={{ padding: "20px" }}>
                <br />
                <ReactTable
                  data={this.makeCageData(row.original.projectName)}
                  columns={columnsCage}
                  defaultPageSize={5}
                  SubComponent={row => {
                    return (
                      <div style={{ padding: "20px" }}>
                        <ReactTable data={this.makeAnimalData(row.original.cage_number)}
                          columns={columnsAnimal} defaultPageSize={5} showPagination={false} />
                      </div>
                    )
                  }}/>
              </div>
            )
          }}
          />
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
        userId : state.userId
    }
}

ProjectTable = connect(mapStateToProps)(ProjectTable)
