const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

const formatPerson = (p) => {
  const formattedPerson = { ...p._doc, id: p._id }
  delete formattedPerson._id
  delete formattedPerson.__v

  return formattedPerson
}

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body === undefined) {
    res.status(400).json({error: 'content missing'})
    return
  }

  if (body.name === undefined ) {
    res.status(400).json({error: 'name missing'})
    return
  }

  if (body.number === undefined ) {
    res.status(400).json({error: 'number missing'})
    return
  }

  const name = body.name
  const number = body.number

  Person
    .find({name})
    .then(result => {
      if(result.length > 0) {
        res.status(400).json({error: 'name must be unique'})
      } else {
        const person = new Person({name, number})
        person
          .save()
          .then(savedPerson => {
            res.json(formatPerson(savedPerson))
          }
        )
      }
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({error: err})
    })
})

app.get('/api/persons/:id', (req, res) => {

  Person
    .findById(req.params.id)
    .then(p => {
      if (p) {
        res.json(formatPerson(p))
      } else {
        res.status(404).end()
      }
    })
    .catch(err => {
      console.log(err)
      res.status(400).send({error: 'malformatted id'})
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => {
      res.status(400).send({error: 'malformatted id'})
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body
  
  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(formatPerson(updatedPerson))
    })
    .catch(err => {
      console.log(error)
      res.status(400).send({error: 'malformatted id'})
    })
})

app.get('/info', (req,res) => {
  Person
    .find({})
    .then(persons => {
      res.send(
        `<div><p>puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${new Date()}</p></div>`
      )
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})