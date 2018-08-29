import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { ImportHeaderSelect } from './ImportHeaderSelect.jsx'
import { Button, Modal, HelpBlock } from 'react-bootstrap'
import axios from 'axios'

export class ImportExcel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectModalShow : false,
      redirect : false
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

  render() {
    return (
      <div>
        <Button onClick={this.showSelectModal}>Import</Button>
        <Modal show={this.state.selectModalShow} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title><b>Select Excel columns</b></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ImportHeaderSelect />
            <HelpBlock><b>Deleted account can't be recovered</b></HelpBlock>
            <div className="modal-buttons">
              <Button bsStyle="link">YES</Button>
              <Button bsStyle="primary" onClick={this.closeModal}>NO</Button>
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
