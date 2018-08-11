import React from 'react'
import {Navigation} from './Navigation.jsx'
import {AnimalForm} from './AnimalForm.jsx'

export class AnimalPage extends React.Component {
  render () {
    return (
      <div>
        <Navigation />
        <AnimalForm />
      </div>
    )
  }
}