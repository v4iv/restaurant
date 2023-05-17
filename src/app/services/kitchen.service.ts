import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

interface KitchenResponse {
  kitchen: {id?: string; isOpen: boolean}
}

export const kitchenApi = createApi({
  reducerPath: 'kitchenApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Kitchen'],
  endpoints: (builder) => ({
    getKitchen: builder.query<KitchenResponse, void>({
      query: () => `/kitchen`,
    }),
  }),
})

export const {useGetKitchenQuery} = kitchenApi
