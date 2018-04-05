import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {createStore, combineReducers} from 'redux'
import PropTypes from 'prop-types'
import {Provider, connect} from 'react-redux'

// presentational component と container componentを分ける
// presentational componentにした
const Link = ({active, children, onClick}) => {
  if(active) {
    return(
      <span>{children}</span>
    )
  }
  return(
    <a href='#'
       onClick={e => {
         e.preventDefault()
         onClick()
       }}
    >
      {children}
    </a>
  )
}
//第二引数にpropsがくる
const mapStateToLinkProps = (state, ownProps) => {
  return{
    active: ownProps.filter === state.visibilityFilter
  }
}
//これも第二引数はprops
const mapDipatchToLinkProps = (dispatch, ownProps) => {
  return{
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      })
    }
  }
}
const FilterLink = connect(
  mapStateToLinkProps,
  mapDipatchToLinkProps
)(Link)

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      if(state.id !== action.id){
        return state
      }
      return {
        ...state,
        completed: !state.completed
      }
    default:
      return state
  }
}

const todos = (state = [], action) => {
  switch(action.type){
    case 'ADD_TODO':
      return[
        ...state,
        todo(undefined, action)
      ]
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action))
    default:
      return state
  }
}
const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type){
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

const todoApp = combineReducers({
  todos,
  visibilityFilter
})

const Todo = ({onClick, completed, text}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
        completed ?
          'line-through': 'none',
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

let AddTodo = ({dispatch}) => {
  let input
  return(
    <div>
      <input ref={node => {
        input = node
      }} />
      <button
        onClick={() => {
          dispatch({
            type: 'ADD_TODO',
            text: input.value,
            id: nextTodoId++
          })
          input.value = ''
        }}
      >
        Add Todo
      </button>
    </div>
  )
}
AddTodo = connect()(AddTodo)

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink filter='SHOW_ALL'>
      All
    </FilterLink>
    {' '}
    <FilterLink filter='SHOW_ACTIVE'>
    Active
    </FilterLink>
    {' '}
    <FilterLink filter='SHOW_COMPLETED'>
      Completed
    </FilterLink>
  </p>
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

//selector func
const mapStateToTodoListProps = (state) => {
  return{
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
const mapDipatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: id => {
      dispatch({
        type: 'TOGGLE_TODO',
        id
      })
    }
  }
}
const VisibleTodoList = connect(
  //この順番固定
  //どちらの関数にもpropsをreturnさせるが、
  //１個目の引数にはstate、２個目の引数にはdispatchが自動で入り、
  //それぞれstate / dispatchをpropsとして渡す
  //さらにconnectするとsubscribe / unsubscribeを全部やってくれる
  mapStateToTodoListProps,
  mapDipatchToTodoListProps
)(TodoList)

let nextTodoId = 0
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

//最初の一度しか呼ばれない
//コードの見通しがききやすい時にpresantional componentをわける
// さらに、propsをわたしまくってるcomponentがあったらcontainer componentを分けてみる
//childrenのどこからでもthis.contextで参照できる
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
)
