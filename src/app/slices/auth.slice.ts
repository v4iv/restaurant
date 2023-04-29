import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {User} from '../types/user.types'
import {authApi} from '../services/auth.service'
import {RootState} from '../store'

interface AuthState {
  user: User | null
  error: string | null
}

const initialState: AuthState = {
  user: null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    signOut: (state) => {
      state.user = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.signUp.matchFulfilled,
      (state, {payload}) => {
        state.user = payload.user
        state.error = null
      },
    )
    builder.addMatcher(
      authApi.endpoints.signIn.matchFulfilled,
      (state, {payload}) => {
        state.user = payload.user
        state.error = null
        localStorage.setItem('token', payload.token)
      },
    )
  },
})

export const {setUser, setError, clearError, signOut} = authSlice.actions

export const selectIsAuthenticated = (state: RootState) => !!state.auth.user
export default authSlice.reducer
