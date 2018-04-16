import React from 'react'
import {connect} from 'react-redux'

let nextTodoId = 0
//action creater
const addTodo = (text) => {
  return{
    type: 'ADD_TODO',
    text,
    id: nextTodoId++
  }
}

let AddTodo = ({onClick}) => {
  let input
  return(
    <div>
      <input ref={node => {
        input = node
      }} />
      <button
        onClick={() => {
          onClick(input.value)
          input.value = ''
        }}
      >
        Add Todo
      </button>
    </div>
  )
}
const mapDispatchToAddTodo = (dispatch) => {
  return{
    onClick: (text) => {
      dispatch(addTodo(text))
    }
  }
}
AddTodo = connect(
  null, mapDispatchToAddTodo
)(AddTodo)
// AddTodo = connect()(AddTodo)
// 以下と同じ
// AddTodo = connect(
//     null,
//     dispatch => dispatch
//   )
// )(AddTodo)
export default AddTodo
