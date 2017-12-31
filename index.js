const express = require('express')
const app = express()

const persons = [
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

app.get('/api/persons', (req, res) => {
  res.json(persons)
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