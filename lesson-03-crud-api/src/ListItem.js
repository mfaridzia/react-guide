import React from 'react';

const ListItem = (props) => {
  return <li className="list-group-item"> 
  <button 
    className="btn-info mr-4 btn-sm" 
    onClick={ props.editTodo }
  > U </button>
  { props.item.name } 
  <button 
    className="btn-danger ml-4 btn-sm" 
    onClick={ props.deleteTodo }
  > x </button>
  </li>
}

export default ListItem;