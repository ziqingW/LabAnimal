import React from 'react'
import {Navigation} from './Navigation.jsx'
import {ProjectTable} from './ProjectTable.jsx'
import { Footer } from './Footer.jsx'

export class ProjectPage extends React.Component {
  render () {
    return (
      <div className="content-wrap">
        <Navigation />
        <ProjectTable />
        <Footer />
      </div>
    )
  }
}
