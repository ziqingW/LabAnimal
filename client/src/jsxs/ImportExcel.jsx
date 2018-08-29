import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { ImportHeaderSelect } from './ImportHeaderSelect.jsx'
import { getSelectedHeaders, headerCheck } from '../actions.js' 
import { Button, Modal, HelpBlock, FormGroup, FormControl } from 'react-bootstrap'
import axios from 'axios'
const clone = require('clone')

export class ImportExcel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectModalShow : false,
      redirect : false,
      message : "",
      filePath : "",
      pathPass : false
    }
  }

  showSelectModal = () => {
    this.setState({
      selectModalShow : true
    })
  }

  closeModal = () => {
    this.props.getSelectedHeaders([])
    this.props.headerCheck(false)
    this.setState({
      selectModalShow : false,
      message : "",
      filePath : "",
      pathPass : false
    })
  }
  
  findExcelPath = e => {
    let excelPath = e.target.value
    let extension = excelPath.slice(excelPath.length-3)
    if (extension === 'csv') {
      this.setState({
        filePath : excelPath,
        pathPass : true
    })  
    } else {
      this.setState({
        filePath : "",
        pathPass : false
      })
    }
  }
  
  importExcelSubmit = () => {

  }

  render() {
    return (
      <div>
        <Button onClick={this.showSelectModal}>Import</Button>
        <Modal show={this.state.selectModalShow} onHide={this.closeModal} className="modal-wrap">
          <Modal.Header closeButton>
            <Modal.Title className="import-title"><b>Select Excel Columns</b></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <HelpBlock><b>Before importing, select the columns in the <span className="import-span">SAME</span> order as them in the Excel file (very important!)</b></HelpBlock>
            <HelpBlock><b>Column with name starting with * must be selected!</b></HelpBlock>
            <ImportHeaderSelect />
            <h5 className="import-fail">{this.props.headerPass ? "" : "All columns with * must be selected"}</h5>
            <h5 className="import-fail">{this.state.pathPass ? "" : "Only .csv file can be imported"}</h5>
            {(this.props.headerPass && this.state.pathPass) ? <h5 className="import-success">Ready for import</h5> : ""}
            <FormGroup controlId="importExcel">
                <FormControl type="file" onChange={this.findExcelPath} />
            </FormGroup>
            <div className="modal-buttons">
              <Button bsStyle="link" onClick={this.closeModal}>Cancel</Button>
              {(this.props.headerPass && this.state.pathPass) ? <Button bsStyle="primary" onClick={this.importExcelSubmit}>Confirm</Button> : <Button bsStyle="primary" disabled>Confirm</Button>}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
        selectedHeaders : state.selectedHeaders,
        headerPass : state.headerPass
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

ImportExcel = connect(mapStateToProps, mapDispatchToProps)(ImportExcel)
