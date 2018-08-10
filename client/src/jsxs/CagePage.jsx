import React from 'react'
import {Navigation} from './Navigation.jsx'
import {CageForm} from './CageForm.jsx'

export class CagePage extends React.Component {
  render () {
    return (
      <div>
        <Navigation />
        <CageForm />
      </div>
    )
  }
}
