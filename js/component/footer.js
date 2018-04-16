import React from 'react'
import {connect} from 'react-redux'
import Link from './link'

const setVisibilityFilter = (filter) => {
  return{
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}
const mapStateToLinkProps = (state, ownProps) => {
  return{
    active: ownProps.filter === state.visibilityFilter
  }
}
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
