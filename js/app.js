import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import AddTodo from './addTodo'
import VisibleTodoList from './visibleTodoList'
import Footer from './footer'
import todoApp from './reducer'

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
