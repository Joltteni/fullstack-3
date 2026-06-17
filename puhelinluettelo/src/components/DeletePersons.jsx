import axios from "axios"

const DeletePersons = (props) => {
    const personDeletor = (person) => {
  if (!window.confirm(`are you sure you want to delete ${person.name}?`)) return
  axios.delete(`http://localhost:3001/api/persons/${person.id}`)
    .then(() => { //hyväksytty poisto, näytä uusi lista ihmisistä
      props.setPersons(persons => persons.filter(p => p.id !== person.id))
    })
    //onnistumisen ilmoitus
    props.setSuccessMessage(`Deleted ${person.name} from the phonebook`)
    setTimeout(() => {
      props.setSuccessMessage(null)
    }, 5000)
}
    return (
<button onClick={() => personDeletor(props.person)}>delete</button>
    )
}

export default DeletePersons