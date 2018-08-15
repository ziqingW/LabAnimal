import React from 'react'
import {Navigation} from './Navigation.jsx'
import { AnimalTable } from './AnimalTable.jsx'

export class AnimalPage extends React.Component {
  render () {
    return (
      <div>
        <Navigation />
        <AnimalTable />
      </div>
    )
  }
}
