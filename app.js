const express = require('express')
const app = express()
const path = require('path')
const body_parser = require('body-parser')
const pgp = require('pg-promise')({})
const cors = require('cors')
const clone = require('clone')

let db_config = process.env.DATABASE_URL || {
    host: "localhost",
    user: "lindalee",
    database: "labAnimal"
}
const db = pgp(db_config)
const PORT = process.env.PORT || 8000

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: false}))
app.use(cors())
app.use(express.static(path.join(__dirname, './client/build')))

app.post('/login', function (req, resp, next) {
  let username = req.body.username
  let password = req.body.password
  let q = 'SELECT * FROM users WHERE name=${username}'
  db.query(q, {username: username})
    .then( results => {
      if (results.length > 0) {
        if (results[0].password === password) {
          resp.json({message: "Logged in", userId: results[0].id})
        } else {
          resp.json({message: "Wrong Password"})
        }
      } else {
        resp.json({message: "Inexistent User"})
      }
    })
    .catch (next)
})

app.post('/signup', function (req, resp, next) {
  let username = req.body.username
  let password = req.body.password
  let q = 'SELECT * FROM users WHERE name=${username}'
  db.query(q, {username: username})
    .then( results => {
      if (results.length > 0) {
        resp.json({message: "User Already Existed"})
      } else {
        let today = new Date()
        today = today.toLocaleString()
        q = "INSERT INTO users VALUES (DEFAULT, ${username}, ${password}, ${time}) RETURNING id"
        db.query(q, {username: username, password: password, time: today})
          .then( results => {
            resp.json({message: "Signed up", userId: results[0].id})
          })
      }
    })
    .catch (next)
})

app.post('/submit/newanimals', function(req, resp, next) {
  let submitAnimals = clone(req.body.submitAnimals)
  let userId = req.body.userId
  console.log(userId)
  submitAnimals.forEach(animal => {
    let tag = animal.animalNumber
    let genotype = animal.animalGeno
    let birthday = animal.animalDOB
    let gender = animal.animalGender
    let strain = animal.animalStrain
    let species = animal.animalSpecies
    let comments = animal.animalNotes
    let q = "SELECT * FROM animals WHERE tag=${tag} and user_id=${userId}"
    db.query(q, {tag: tag, userId: userId})
      .then(results => {
        if(results.length > 0) {
          resp.json({message: "number"})
        } else {
          q = "INSERT INTO animals VALUES (DEFAULT, ${tag}, ${genotype}, ${birthday}, ${gender}, ${strain}, ${species}, ${comments}, ${user_id})"
          db.query(q, {tag: tag, genotype: genotype, birthday: birthday, gender: gender, strain: strain, species: species, comments: comments, user_id: userId})
            .then(results => {
              resp.json({message: "OK"})
            })
            .catch(err=>{
              console.log(err)
            })
        }
      })
      .catch(next)
  })
})

app.post("/table/animals", function(req,resp,next) {
  let userId = req.body.userId
  let q = "SELECT * FROM animals WHERE user_id=${userId}"
  db.query(q, {userId: userId})
    .then(results=> {
      if(results.length > 0) {
        resp.json({message: "OK", data: results})
      } else {
        resp.json({message : "No animals found"})
      }
    })
    .catch(next)
})

app.get(/^\/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, './client/build', 'index.html'));
});

app.listen(PORT, function() {
	console.log(
		"\n\n===== listening for requests on port " + PORT + " =====\n\n"
	)
})
