import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {Address} from '../types/address.types'

interface AddressApi {
  data: {addresses: Address[]}
  address: Address
}

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getAddresses: builder.query<AddressApi['data'], void>({
      query: () => '/retrieve-addresses',
    }),
    createAddress: builder.mutation<AddressApi['address'], Address>({
      query: (address) => ({
        url: '/address',
        method: 'POST',
        body: address,
      }),
    }),
    getAddress: builder.query<AddressApi['address'], string>({
      query: (id) => `/address/${id}`,
    }),
    updateAddress: builder.mutation<AddressApi['address'], Address>({
      query: (address) => ({
        url: `/address/${address.id}`,
        method: 'PUT',
        body: address,
      }),
    }),
    deleteAddress: builder.mutation<AddressApi['address'], string>({
      query: (id) => ({
        url: `/address/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetAddressesQuery,
  useGetAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi
