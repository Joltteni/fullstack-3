import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import { useEffect } from 'react'
import personsService from './services/persons'
import Notification from './components/Notification'
import './index.css'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filtered, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [succesMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response)
      })  
}, [persons])

  const addPhoneNumber = (event) => {
    event.preventDefault()
  
    const phoneBookObject = {
      name: newName,
      number: newNumber,
      id: persons.length+1 //randomize servul
    }
    if (!persons.some(person => person.name === newName)) { //nimi listassa?
    personsService.create(phoneBookObject)
    setPersons(persons.concat(phoneBookObject))
    setSuccessMessage(`Added ${newName}`)
    setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
    }
  
    else {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) return
      let updatePerson=persons.find(person => person.name === newName)
      personsService.update(updatePerson.id,phoneBookObject)
      .then(() => {
          setSuccessMessage(`Updated ${updatePerson.name}'s phone number`)
    setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)})
        .catch (() => {
           setErrorMessage(`${updatePerson.name} has already been removed from the server`)
      setTimeout(() => setErrorMessage(null), 5000)
        }
        )
    }
    setNewName('') //input tyhjäks
    setNewNumber('') //input tyhjäks
  }

    const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
    const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
      const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification successMessage={succesMessage} errorMessage={errorMessage} />
      <Filter filtered={filtered} handleFilterChange={handleFilterChange}/>
      <h3>add a new</h3>
      <PersonForm addPhoneNumber={addPhoneNumber} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>

      <h3>Numbers</h3>
      <Persons persons={persons} setPersons={setPersons} setSuccessMessage={setSuccessMessage} filtered={filtered}/>
    </div>
  )
}

export default App