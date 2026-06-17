import DeletePersons from './DeletePersons'

const Persons = (props) => {

  return (
    <div>
      {props.persons
        .filter(person => person.name.toUpperCase().includes(props.filtered.toUpperCase()))
        .map(person => (
          <p key={person.id}>
            {person.name} {person.number} <DeletePersons person={person} setSuccessMessage={props.setSuccessMessage} setPersons={props.setPersons}/>
           </p>
        ))
      }
    </div>
  )
}

export default Persons