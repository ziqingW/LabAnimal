import React from 'react'
import { Navigation } from './Navigation.jsx'

export class AnimalEdit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      deleteAnimals = []
    }
  }

  editAnimal = () => {

  }

  render () {
    return (
      <div>
        <Navigation />

      </div>
    )
  }
}
