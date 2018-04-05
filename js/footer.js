import React from 'react'
import {connect} from 'react-redux'

const setVisibilityFilter = (filter) => {
  return{
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}
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
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}
const FilterLink = connect(
  mapStateToLinkProps,
  mapDipatchToLinkProps
)(Link)
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

export default Footer
