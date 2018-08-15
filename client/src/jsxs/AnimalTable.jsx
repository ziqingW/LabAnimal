import ReactTable from 'react-table'
import 'react-table/react-table.css'
import checkboxHOC from "react-table/lib/hoc/selectTable"
import { Button } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getAnimals } from '../actions.js'
import React from 'react'
import axios from 'axios'
const clone = require('clone')
const CheckboxTable = checkboxHOC(ReactTable)

export class AnimalTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data : [],
      message : "",
      selection: [],
      selectAll: false,
      redirect : false
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
          let today = new Date()
          let data = clone(results.data.data)
          data.forEach(animal => {
            let dob = new Date(animal.birthday)
            let dobModified = dob.toLocaleDateString("en-US")
            let timeDiff = today.getTime() - dob.getTime()
            let diffWks = (timeDiff/(1000*3600*24*7)).toFixed(1)
            let _id = animal.id
            animal.birthday = dobModified
            animal['_id'] = _id
            animal['age'] = diffWks
          })
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

  toggleSelection = (key, shift, row) => {
    let selection = [...this.state.selection]
    const keyIndex = selection.indexOf(key)
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ]
    } else {
      // it does not exist so add it
      selection.push(key)
    }
    // update the state
    this.setState({ selection })
  }

  toggleAll = () => {
  /*
    'toggleAll' is a tricky concept with any filterable table
    do you just select ALL the records that are in your data?
    OR
    do you only select ALL the records that are in the current filtered data?

    The latter makes more sense because 'selection' is a visual thing for the user.
    This is especially true if you are going to implement a set of external functions
    that act on the selected information (you would not want to DELETE the wrong thing!).

    So, to that end, access to the internals of ReactTable are required to get what is
    currently visible in the table (either on the current page or any other page).

    The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
    ReactTable and then get the internal state and the 'sortedData'.
    That can then be iterrated to get all the currently visible records and set
    the selection state.
  */
  const selectAll = this.state.selectAll ? false : true
  const selection = []
  if (selectAll) {
    // we need to get at the internals of ReactTable
    const wrappedInstance = this.checkboxTable.getWrappedInstance()
    // the 'sortedData' property contains the currently accessible records based on the filter and sort
    const currentRecords = wrappedInstance.getResolvedState().sortedData
    // we just push all the IDs onto the selection array
    currentRecords.forEach(item => {
      selection.push(item._original._id)
    });
  }
  this.setState({ selectAll, selection })
};

  isSelected = key => {
    /*
      Instead of passing our external selection state we provide an 'isSelected'
      callback and detect the selection state ourselves. This allows any implementation
      for selection (either an array, object keys, or even a Javascript Set object).
    */
    return this.state.selection.includes(key)
  };

  editAnimal = () => {
    let selection = {}
    for (let i = 0; i < this.state.selection.length; i ++) {
      selection[this.state.selection[i]] = 1
    }
    let data = clone(this.state.data)
    let editAnimals = []
    data.forEach(animal => {
      if (animal.id in selection) {
        editAnimals.push(animal)
      }
    })
    this.props.getAnimals(editAnimals)
    this.setState({
      redirect : true
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
    const { toggleSelection, toggleAll, isSelected } = this
    const { selectAll } = this.state
    const checkboxProps = {
      selectAll,
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: "checkbox",
    }
    return (this.state.redirect ? <Redirect to="/animals/edit" /> :
      (<div>
        <CheckboxTable ref={r => (this.checkboxTable = r)} data={this.state.data} columns={columns} defaultPageSize={10} style={{
            height: "500px"
          }} noDataText="No records found" filterable className="-striped -highlight" {...checkboxProps} />
        <div>
          <Button><Link to="/animals/new">ADD ANIMAL</Link></Button>
          <Button onClick={this.editAnimal}>EDIT</Button>
        </div>
      </div>))
  }
}

function mapDispatchToProps(dispatch) {
    return {
        getAnimals: function(data) {
            dispatch(getAnimals(data))
        }
    }
}

AnimalTable = connect(null, mapDispatchToProps)(AnimalTable)
