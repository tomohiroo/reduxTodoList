import React from 'react'
import {connect} from 'react-redux'
import {addTodo} from '../actions'

const AddTodo = ({onClick}) => {
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
export default connect(
  null, mapDispatchToAddTodo
)(AddTodo)
