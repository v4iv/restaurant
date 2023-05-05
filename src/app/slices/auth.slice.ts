import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {User} from '../types/user.types'
import {authApi} from '../services/auth.service'

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
        localStorage.setItem('user', JSON.stringify(payload.user))
        localStorage.setItem('token', payload.token)
      },
    )
    builder.addMatcher(authApi.endpoints.signOut.matchFulfilled, (state) => {
      state.user = null
      state.error = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    })
    builder.addMatcher(authApi.endpoints.signOut.matchRejected, (state) => {
      state.user = null
      state.error = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    })
  },
})

export const {setUser, setError, clearError} = authSlice.actions

export const selectIsAuthenticated = () => !!localStorage.getItem('token')

export const selectUser = () => {
  const userDocument = localStorage.getItem('user') || '{}'
  return JSON.parse(userDocument)
}
export default authSlice.reducer
