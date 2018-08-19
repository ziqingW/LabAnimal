import React from 'react'
import { Navigation } from './Navigation.jsx'
import ReactHighcharts from 'react-highcharts'
import { connect } from 'react-redux'
import axios from 'axios'
const clone = require('clone')

// const config = {
//   /* HighchartsConfig */
//   chart: {
//       plotBackgroundColor: null,
//       plotBorderWidth: null,
//       plotShadow: false,
//       type: 'pie'
//   },
//   title: {
//       text: 'Browser market shares in January, 2018'
//   },
//   tooltip: {
//       pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//   },
//   plotOptions: {
//       pie: {
//           allowPointSelect: true,
//           cursor: 'pointer',
//           dataLabels: {
//               enabled: true,
//               format: '<b>{point.name}</b>: {point.percentage:.1f} %',
//               style: {
//                   color: (ReactHighcharts.theme && ReactHighcharts.theme.contrastTextColor) || 'black'
//               }
//           }
//       }
//   },
//   series: [{
//       name: 'Brands',
//       colorByPoint: true,
//       data: [{
//           name: 'Chrome',
//           y: 61.41,
//           sliced: true,
//           selected: true
//       }, {
//           name: 'Internet Explorer',
//           y: 11.84
//       }, {
//           name: 'Firefox',
//           y: 10.85
//       }, {
//           name: 'Edge',
//           y: 4.67
//       }, {
//           name: 'Safari',
//           y: 4.18
//       }, {
//           name: 'Sogou Explorer',
//           y: 1.64
//       }, {
//           name: 'Opera',
//           y: 1.6
//       }, {
//           name: 'QQ',
//           y: 1.2
//       }, {
//           name: 'Other',
//           y: 2.61
//       }]
//   }]
// }

export class Main extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        data : []
      }
    }

    componentDidMount = () => {
      this.getData()
    }

    getData = () => {
      let userId = JSON.parse(sessionStorage.getItem("userInfo")).userId
      axios.post("/table/projects", {userId: userId})
        .then(results => {
          let data = clone(results.data.data)
          data.forEach(animal => {
            let dob = animal.birthday.split("T")[0]
            let creation_date = animal.creation_date.split("T")[0]
            animal.birthday = dob
            animal.creation_date = creation_date
            let today = new Date()
            dob = new Date(dob)
            let timeDiff = today.getTime() - dob.getTime()
            let diffWks = (timeDiff/(1000*3600*24*7)).toFixed(1)
            animal.age = diffWks
          })
          this.setState({
            data : data
          })
        })
        .catch (err => {
          console.log(err)
        })
    }

    makeChart_1 = () => {
      let data = clone(this.state.data)
      let species = {}
      data.forEach(animal => {
        if(!(animal.species in species)) {
          species[animal.species] = {
            name : animal.species,
            y : 1,
          }
        } else {
          species[animal.species].y += 1
        }
      })
      species = Object.values(species)
      species.sort(function(a,b) {
        return b.y - a.y
      })
      if(species.length > 0){
        species[0].sliced = true
        species[0].selected = true
      }
      return species
    }

    render () {
      const config_1 = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Summary of animal species'
        },
        tooltip: {
            pointFormat: 'Numbers: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (ReactHighcharts.theme && ReactHighcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
           name: 'Species',
           colorByPoint: true,
           data: this.makeChart_1()
       }]
      }

      return (
          <div>
          <Navigation />
          <ReactHighcharts config={config_1}/>
          </div>
          )
    }
}
