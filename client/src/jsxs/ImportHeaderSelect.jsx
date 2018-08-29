import React from 'react'
import { Button } from 'react-bootstrap'
import { getSelectedHeaders } from '../actions.js'
import { connect } from 'react-redux'
const clone = require('clone')

export class ImportHeaderSelect extends React.Component {
  constructor (props) {
    super (props)
    let headersClicked = {}
    let headers = ['tag', 'gender', 'dob', 'genotype', 'project', 'cage_number', 'species', 'comments', 'age']
    headers.forEach(header => {
      headersClicked[header] = false
    })
    this.state = {
      headers : clone(headers),
      headersClicked : clone(headersClicked),
      selectedHeaders : []
    }
  }

  upperPanel = () => {
    return (
      <div>
        {this.state.headers.map((header,i) => {
          return (<div key={i}>{this.upperOptions(header)}</div>)
        })}
      </div>
    )
  }

  lowerPanel = () => {
    return(
      <div>
        {this.state.selectedHeaders.map((header,i) => {
          return (<div key={i}>{this.lowerOptions(header)}</div>)
        })}
      </div>
    )
  }

  upperOptions = tag => {
    return (
      <Button bsStyle={this.state.headersClicked[tag] ? "warning" : "default"} onClick={e=>{this.selectOption(e,tag)}}>{tag}</Button>
    )
  }

  lowerOptions = tag => {
    return (
      <Button bsStyle="warning" onClick={e=>{this.selectOption(e,tag)}}>{tag}</Button>
    )
  }

  selectOption = (e, tag) => {
    let headersClicked = clone(this.state.headersClicked)
    headersClicked[tag] = !headersClicked[tag]
    let selectedHeaders = clone(this.state.selectedHeaders)
    if (headersClicked[tag]) {
      selectedHeaders.push(tag)
    } else {
      let index = selectedHeaders.indexOf(tag)
      selectedHeaders.splice(index,1)
    }
    this.props.getSelectedHeaders(selectedHeaders)
    this.setState({
      headersClicked : clone(headersClicked),
      selectedHeaders : clone(selectedHeaders)
    })
  }

  render() {
    return (
      <div>
      {this.upperPanel()}
      {this.lowerPanel()}
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
    return {
        getSelectedHeaders: function(data) {
            dispatch(getSelectedHeaders(data))
        }
    }
}

ImportHeaderSelect = connect(null, mapDispatchToProps)(ImportHeaderSelect)
