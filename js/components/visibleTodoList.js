import React from 'react'
import {connect} from 'react-redux'
import {toggleTodo} from '../actions'

const Todo = ({onClick, completed, text}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
        completed ? 'line-through': 'none',
      cursor: 'pointer'
    }}
  >
    <p>{text}</p>
  </li>
)
const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
     return todos.filter(
       t => t.completed
     )
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      )
  }
}
const mapStateToTodoListProps = (state) => {
  return{
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
const mapDipatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id))
    }
  }
}
//propsをマージしてTodoListに渡す
const VisibleTodoList = connect(
  //この順番固定
  //どちらの関数にもpropsをreturnさせるが、
  //１個目の引数にはstate、２個目の引数にはdispatchが自動で入り、
  //それぞれstate / dispatchをpropsとして渡す
  //さらにconnectするとsubscribe / unsubscribeを全部やってくれる
  mapStateToTodoListProps,
  mapDipatchToTodoListProps
)(TodoList)

export default VisibleTodoList
