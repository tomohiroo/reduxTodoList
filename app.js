import {createStore, combineReducers} from 'redux'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

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
  componentDidMount(){
    const {store} = this.context
    // returnでunmount用の関数が返ってくる
    this.unsubscribe = store.subscribe(() =>
    //このコンポーネントにprop / stateが来てないのでreactがスキップする
    //強制的にrenderする
      this.forceUpdate()
    )
  }
  componentWillUnmount(){
    this.unsubscribe()
  }
  render(){
    const props = this.props
    const {store} = this.context
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
FilterLink.contextTypes = {
  store: PropTypes.object
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

//dispatch以外にcontainer的な要素がないから、presantionalの中にdispatch入れておk
const AddTodo = (props, {store}) => { //第二引数がcontextになる
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
AddTodo.contextTypes = {
  store: PropTypes.object
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
    const {store}= this.context
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    )
  }
  componentWillUnmount(){
    this.unsubscribe()
  }
  render(){
    const {store} = this.context
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
VisibleTodoList.contextTypes = {
  store: PropTypes.object
}

let nextTodoId = 0
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

//childrenのどこからでもthis.contextで参照できる
class Provider extends Component {
  getChildContext(){
    return{
      store: this.props.store
    }
  }
  render(){
    return this.props.children
  }
}
//context使ったcompentで必須
Provider.childContextTypes = {
  store: PropTypes.object
}

//最初の一度しか呼ばれない
//コードの見通しがききやすい時にpresantional componentをわける
// さらに、propsをわたしまくってるcomponentがあったらcontainer componentを分けてみる
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
)
