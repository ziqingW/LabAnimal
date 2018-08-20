import React from 'react'
import { Navigation } from './Navigation.jsx'
import { Footer } from './Footer.jsx'
import ReactHighcharts from 'react-highcharts'
import axios from 'axios'
const clone = require('clone')

export class Main extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        data : [],
        projects : [],
        projectNames : []
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
          let projects = {}
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
            let ageInDay = parseFloat(diffWks) * 7
            let cost = 0
            if (animal.species === "Mouse") {
              cost =  1 * ageInDay
            } else if (animal.species === "Rat") {
              cost = 3 * ageInDay
            } else if (animal.species === "Rabbit") {
              cost = 3 * ageInDay
            } else if (animal.species === "Guinea Pig") {
              cost = 3 * ageInDay
            } else if (animal.species === "Pig") {
              cost = 8 * ageInDay
            } else if (animal.species === "Primate") {
              cost = 12 * ageInDay
            }
            if(!(animal.project in projects)) {
              projects[animal.project] = {
                projectName : animal.project,
                animalNumber : 1,
                cost : cost
              }
            } else {
              projects[animal.project].animalNumber += 1
              projects[animal.project].cost += cost
            }
            })
          projects = Object.values(projects)
          let projectNames = []
          projects.forEach(project => {
            projectNames.push(project.projectName)
          })
          this.setState({
            data : data,
            projects : clone(projects),
            projectNames : clone(projectNames)
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

    makeChart_2_cost = () => {
      let projects = clone(this.state.projects)
      let costs = []
      projects.forEach(project => {
        costs.push(parseInt(project.cost, 10))
      })
      return costs
    }

    makeChart_2_numbers = () => {
      let projects = clone(this.state.projects)
      let numbers = []
      projects.forEach(project => {
        numbers.push(parseInt(project.animalNumber, 10))
      })
      return numbers
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
      const config_2 = {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Summary of Ongoing Projects'
        },
        subtitle: {
            text: 'Price: Mouse $1/day, Rat $3/day, Rabbit $3/day'
        },
        xAxis: {
            categories: this.state.projectNames,
            crosshair: true
        },
        yAxis: [{
            min: 0,
            max: 30,
            gridLineWidth: 0,
            title: {
                text: 'Animal numbers',
                style: {
                    color: '#f7a35c'
                }
            },
            opposite: true,
            labels: {
                format: '{value}',
                style: {
                    color: '#f7a35c'
                }
            }
        }, {    min: 0,
                max: 4000,
                gridLineWidth: 0,
                labels: {
                    format: '{value}',
                    style: {
                        color: '#7798BF'
                    }
                },
                title: {
                    text: 'Cost in US dollar',
                    style: {
                        color: '#7798BF'
                    }
                },

            }],
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Animal numbers',
            data: this.makeChart_2_numbers(),
            color : '#f7a35c'
        }, {
            name: 'Cost by far',
            yAxis: 1,
            data: this.makeChart_2_cost(),
            color : '#7798BF'
        }]
      }
      return (
          <div>
          <Navigation />
          <ReactHighcharts config={config_1}/>
          <ReactHighcharts config={config_2}/>
          <Footer />
          </div>
          )
    }
}
