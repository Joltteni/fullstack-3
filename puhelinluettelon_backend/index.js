const Phonebook = require('./models/person')
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
var morgan = require('morgan')


//skippaa posti tiny muodos, vissii haluttii tällee tuo tehtävä?
app.use(morgan('tiny', {
  skip: (req) => req.method === 'POST'
}))

//cors
const cors = require('cors')
app.use(cors())

app.use(morgan((tokens, req, res) => {
  if (req.method === 'POST')
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body) //jsoniks info postist
    ].join(' ')
}))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>') //etusivu
})

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(people => {
    response.json(people)
  })
})

//yksittäine id
app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//poisto
app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//lisää uus
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name && !body.number) {
    return response.status(400).json({ error: 'name and number not set' })
  } else if (!body.name) {
    return response.status(400).json({ error: 'name not set' })
  } else if (!body.number) {
    return response.status(400).json({ error: 'number not set' })
  }

  const person = new Phonebook({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.status(201).json(savedPerson)
    })
    .catch(error => next(error))
})
app.put('/api/persons/:id', async (request, response) => {
  try {
    const { name, number } = request.body
    const { id } = request.params

    const updatedPerson = await Phonebook.findByIdAndUpdate(
      id,
      { name, number },
      { new: true, runValidators: true }
    )

    response.json(updatedPerson)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})


app.get('/info', (request, response) => {
  Phonebook.find({}).then(people => {
    response.send(`Phonebook has info for ${people.length} people<br><br>${Date()}`)
  })
})

//error middleware
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})