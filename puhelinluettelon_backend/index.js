const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
var morgan = require('morgan')

//cors
const cors = require('cors')
app.use(cors())

//TODO morgan('tiny')

//TODO tee tää vaa posteille
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body) //jsoniks info postist
  ].join(' ')
}))

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523" 
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>') //etusivu
})


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

//yksittäine id
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person)
  response.json(person)
  else
  response.status(404).end()
})

//poisto
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

//lisää uus
app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.name && !person.number){
    return response.status(400).json({ error: 'name and number not set' })
  }
  else if (!person.name){
    return response.status(400).json({ error: 'name not set' })
  }
  else if(!person.number){
    return response.status(400).json({ error: 'number not set'})
  }
  if(persons.find(p => p.name === person.name)){
    return response.status(409).json({ error: 'name must be unique'})
  }

  person.id = String(Math.floor(Math.random() * 20000)) //20k väli
  persons = persons.concat(person)
  

  response.status(200).send(persons)
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people<br><br>${Date()}`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})