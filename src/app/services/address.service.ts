import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {Address} from '../types/address.types'

interface AddressApi {
  addresses: Address[]
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
  tagTypes: ['Addresses'],
  endpoints: (builder) => ({
    getAddresses: builder.query<AddressApi['addresses'], void>({
      query: () => '/retrieve-addresses',
      providesTags: (result) =>
        result
          ? // successful query
            [
              ...result.map(({id}) => ({type: 'Addresses', id} as const)),
              {type: 'Addresses', id: 'ADDRESSES_LIST'},
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'ADDRESSES', id: 'LIST' }` is invalidated
            [{type: 'Addresses', id: 'ADDRESSES_LIST'}],
    }),
    createAddress: builder.mutation<AddressApi['address'], Address>({
      query: (address) => ({
        url: '/address',
        method: 'POST',
        body: address,
      }),
      invalidatesTags: [{type: 'Addresses', id: 'ADDRESSES_LIST'}],
    }),
    getAddress: builder.query<AddressApi['address'], string>({
      query: (id) => `/address/${id}`,
      // @ts-ignore
      providesTags: (result, error, id) => [{type: 'Addresses', id}],
    }),
    updateAddress: builder.mutation<AddressApi['address'], Address>({
      query: (address) => ({
        url: `/address/${address.id}`,
        method: 'PUT',
        body: address,
      }),
      // @ts-ignore
      invalidatesTags: (result, error, {id}) => [{type: 'Addresses', id}],
    }),
    deleteAddress: builder.mutation<AddressApi['address'], string>({
      query: (id) => ({
        url: `/address/${id}`,
        method: 'DELETE',
      }),
      // @ts-ignore
      invalidatesTags: (result, error, id) => [{type: 'Addresses', id}],
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
