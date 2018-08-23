import ReactTable from 'react-table'
import 'react-table/react-table.css'
import React from 'react'
import axios from 'axios'
import { Navigation } from './Navigation.jsx'
import { Footer } from './Footer.jsx'
const clone = require('clone')

export class AnimalSacriPage extends React.Component {
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
    axios.post("/table/sacrificed", {userId: userId})
      .then(results => {
        let data = clone(results.data.data)
        data.forEach(animal => {
          let dob = animal.birthday.split("T")[0]
          let death_date = animal.death_date.split("T")[0]
          animal.birthday = dob
          animal.death_date = death_date
        })
        this.setState({
          data : data
        })
      })
      .catch (err => {
        console.log(err)
      })
  }

  render () {
    const columns = [{
        Header: 'Cage #',
        accessor: 'cage_number' // String-based value accessors!
      },{
        Header: 'Animal #',
        accessor: 'animal_tag' // String-based value accessors!
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
        Header: 'Genotype',
        accessor: 'genotype'
      }, {
        Header: 'Project',
        accessor: 'project' // String-based value accessors!
      }, {
        Header: 'Sacriface date',
        accessor: 'death_date' // String-based value accessors!
      }]
    return (
      <div className="content-wrap">
        <Navigation />
        <div className="user-tables">
          <h3>Sacrificed Animals</h3>
          <ReactTable data={this.state.data} columns={columns} defaultPageSize={10} style={{
        height: "500px"
      }} noDataText="No records found" filterable className="-striped -highlight" />
        </div>
        <Footer />
      </div>
    )
  }
}
