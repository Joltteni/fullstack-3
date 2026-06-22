const mongoose = require('mongoose')

if (process.argv.length < 5) {
  console.log('give password as argument, name and number as arguments')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url = `mongodb+srv://fullstack:${password}@fullstackopen.mtprbsu.mongodb.net/?appName=fullstackopen`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
    },
    required: true
  }
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

const person = new Phonebook({
  name: name,
  number: number,
})

person.save().then(() => { //result =>
  console.log('person saved!')
  mongoose.connection.close()
})