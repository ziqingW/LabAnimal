import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { ImportHeaderSelect } from './ImportHeaderSelect.jsx'
import { Button, Modal, HelpBlock } from 'react-bootstrap'
import axios from 'axios'
const clone = require('clone')

export class ImportExcel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectModalShow : false,
      redirect : false,
      message : ""
    }
  }

  showSelectModal = () => {
    this.setState({
      selectModalShow : true
    })
  }

  closeModal = () => {
    this.setState({
      selectModalShow : false
    })
  }

  importExcelSubmit = () => {
    let selectedHeaders = clone(this.props.selectedHeaders)
    axios.post('/submit/import', {selectedHeaders: selectedHeaders})
      .then(results => {
        if(results.data.message !== 'OK') {
          this.setState({
            message : results.data.message
          })
        } else {
            this.setState({
              message : ""
            })
        }
      })
  }

  render() {
    return (
      <div>
        <Button onClick={this.showSelectModal}>Import</Button>
        <Modal show={this.state.selectModalShow} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title><b>Select Excel Columns</b></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <HelpBlock><b>Before importing, select the columns in the <span>same</span> order as them in the Excel file (very important!)</b></HelpBlock>
            <HelpBlock><b>Column with name starting with * must be selected!</b></HelpBlock>
            <ImportHeaderSelect />
            <h3>{this.state.message}</h3>
            <div className="modal-buttons">
              <Button bsStyle="link" onClick={this.closeModal}>Cancel</Button>
              <Button bsStyle="primary" onClick={this.importExcelSubmit}>Confirm</Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
        selectedHeaders : state.selectedHeaders
    }
}

ImportExcel = connect(mapStateToProps)(ImportExcel)
