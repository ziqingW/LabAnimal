import React from 'react'
import { Navigation } from './Navigation.jsx'
import { AnimalForm } from './AnimalForm.jsx'
import { Footer } from './Footer.jsx'

export class AnimalNew extends React.Component {
  render () {
    return (
    <div className="content-wrap">
      <Navigation />
      <AnimalForm />
      <Footer />
    </div>
  )
  }
}
