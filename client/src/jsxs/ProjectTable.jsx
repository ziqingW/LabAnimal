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
  render () {
    return (
      <div></div>
    )
  }
}
