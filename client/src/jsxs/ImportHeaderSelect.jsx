import React from 'react'
import { Button } from 'react-bootstrap'
import { getSelectedHeaders, headerCheck } from '../actions.js'
import { connect } from 'react-redux'
const clone = require('clone')

export class ImportHeaderSelect extends React.Component {
  constructor (props) {
    super (props)
    let headersClicked = {}
    let headers = ['tag', 'gender', 'birthday', 'genotype', 'project', 'cage_number', 'species', 'comments', 'strain']
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
      <div className="header-wrap">
        {this.state.headers.map((header,i) => {
          return (<div key={i}>{this.upperOptions(header)}</div>)
        })}
      </div>
    )
  }

  lowerPanel = () => {
    return(
      <div className="header-wrap">
        {this.state.selectedHeaders.map((header,i) => {
          return (<div key={i}>{this.lowerOptions(header)}</div>)
        })}
      </div>
    )
  }

  upperOptions = tag => {
    return (
      <Button bsStyle={this.state.headersClicked[tag] ? "warning" : "default"} onClick={e=>{this.selectOption(e,tag)}}>{(tag === 'tag' || tag === 'gender' || tag === 'birthday' || tag === 'genotype' || tag ==='cage_number' || tag === 'strain')? ('*' + tag): tag}</Button>
    )
  }

  lowerOptions = tag => {
    return (
      <Button onClick={e=>{this.selectOption(e,tag)}}>{tag}</Button>
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
    let headerCheck = {'tag': false, 'gender': false, 'birthday': false, 'genotype': false, 'cage_number': false, 'strain': false}
    selectedHeaders.forEach(header => {
      headerCheck[header] = true
    })
    if (Object.values(headerCheck).indexOf(false) > -1) {
      this.props.headerCheck(false)
    } else {
      this.props.headerCheck(true)
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
      <hr />
      {this.lowerPanel()}
      <br />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
    return {
        getSelectedHeaders: function(data) {
          dispatch(getSelectedHeaders(data))
        },
        headerCheck: function(data) {
          dispatch(headerCheck(data))
        }
    }
}

ImportHeaderSelect = connect(null, mapDispatchToProps)(ImportHeaderSelect)
