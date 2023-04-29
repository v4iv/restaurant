import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {User} from '../types/user.types.ts'

interface AuthResponse {
  token: string
  user: User
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthResponse, User>({
      query: (user) => ({
        url: '/signup',
        method: 'POST',
        body: user,
      }),
    }),
    signIn: builder.mutation<AuthResponse, {email: string; password: string}>({
      query: ({email, password}) => ({
        url: '/signin',
        method: 'POST',
        body: {email, password},
      }),
    }),
    signOut: builder.mutation<any, void>({
      query: () => ({
        url: '/signout',
        method: 'GET',
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
      }),
    }),
  }),
})

export const {useSignUpMutation, useSignInMutation, useSignOutMutation} =
  authApi
