import ReactTable from 'react-table'
import 'react-table/react-table.css'
import React from 'react'
import axios from 'axios'
const clone = require('clone')

export class AnimalTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data : [],
      message : ""
    }
  }

  componentDidMount = () => {
    this.getAnimalTable()
  }
  //
  getAnimalTable = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    axios.post("/table/animals",{userId: userInfo.userId})
      .then(results=>{
        if (results.data.message === "OK") {
          let data = clone(results.data.data)
          this.setState({
            data : data
          })
        } else {
          this.setState({
            message : results.data.message
          })
        }
      })
      .catch(err=>{
        console.log(err)
      })
  }

  render() {
    const columns = [{
      Header: 'Animal #',
      accessor: 'tag' // String-based value accessors!
    }, {
      Header: 'Species',
      accessor: 'species',
    }, {
      // id: 'friendName', // Required because our accessor is not a string
      Header: 'Strain',
      accessor: 'strain' // Custom value accessors!
    }, {
      // Header: props => <span>Friend Age</span>, // Custom header components!
      Header: 'Gender',
      accessor: 'gender'
    }, {
      Header: 'Birthday',
      accessor: 'birthday'
    }, {
      Header: 'Genotype',
      accessor: 'genotype'
    }, {
      Header: 'Comments',
      accessor: 'comments'
    }]
    return (<ReactTable className="-highlight -striped" data={this.state.data} columns={columns} />)
  }
}
