import React from 'react'
import {Navigation} from './Navigation.jsx'
import { AnimalTable } from './AnimalTable.jsx'
import { Footer } from './Footer.jsx'

export class AnimalPage extends React.Component {
  render () {
    return (
      <div>
        <Navigation />
        <AnimalTable />
        <Footer />
      </div>
    )
  }
}
