import React from 'react'
import {Navigation} from './Navigation.jsx'
import { AnimalTable } from './AnimalTable.jsx'
import { Footer } from './Footer.jsx'

export class AnimalPage extends React.Component {
  render () {
    return (
      <div className="content-wrap">
        <Navigation />
        <AnimalTable />
        <Footer />
      </div>
    )
  }
}
