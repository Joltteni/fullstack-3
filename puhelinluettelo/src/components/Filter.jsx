 const Filter = (props) => {
 return (
    <div>
<p>filter shown with</p><input value={props.filtered} onChange={props.handleFilterChange}></input>
    </div>
 )
}
export default Filter