import {createStore, combineReducers} from 'redux'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'

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

// container component
class FilterLink extends Component {
  //mount, unmountの時(LinkのonClick時)にstateを強制的に更新する
  componentDidMount(){
    this.unsubscribe = store.subscribe(() =>
    //強制的にrenderする
      this.forceUpdate()
    )
  }
  componentWillUnmount(){
    this.unsubscribe()
  }
  render(){
    const props = this.props
    const state = store.getState()
    return(
      <Link
        active={
          props.filter === state.visibilityFilter
        }
        onClick={() => {
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }}
      >
        {props.children}
      </Link>
    )
  }
}

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

const store = createStore(todoApp)

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

const AddTodo = () => {
  let input
  return(
    <div>
      <input ref={node => {
        input = node
      }} />
      <button
        onClick={() => {
          store.dispatch({
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

//container component
class VisibleTodoList extends Component{
  componentDidMount(){
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    )
  }
  componentWillUnmount(){
    this.unsubscribe()
  }
  render(){
    const props = this.props
    const state = store.getState()
    return(
      <TodoList
        todos={getVisibleTodos(state.todos, state.visibilityFilter)}
        onTodoClick={id => {
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }}
      />
    )
  }
}

let nextTodoId = 0
const TodoApp = ({todos, visibilityFilter}) => (
  <div>
    <AddTodo />
  <VisibleTodoList />
    <Footer />
  </div>
)

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()} />,
    document.getElementById('root')
  )
}
store.subscribe(render)
render()
