const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

let persons = [
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    },
    {
      "name": "Arto Hellas",
      "number": "123",
      "id": 1
    }
]

const generateId = () => {
  return Math.floor(Math.random()*10**6)
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
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

  if (persons.filter(p => p.name === name).length > 0) {
    res.status(400).json({error: 'name must be unique'})
    return
  }

  const p = {
    name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(p)
  res.json(p)
})

app.get('/api/persons/:id', (req, res) => {

  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.get('/info', (req,res) => {
  res.send(
    `<div><p>puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${new Date()}</p></div>`
  )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})