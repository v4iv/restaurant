import React from 'react'
import {Redirect, Route, RouteProps} from 'wouter'
import {useAppSelector} from '../../hooks/useAppSelector'
import {selectIsAuthenticated} from '../../slices/auth.slice'

const AuthenticatedRoute: React.FC<RouteProps> = (props) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  return isAuthenticated ? <Route {...props} /> : <Redirect to="/sign-in" />
}

export default AuthenticatedRoute
