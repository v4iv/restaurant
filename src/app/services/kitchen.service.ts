import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

interface KitchenResponse {
  id?: string
  isOpen: boolean
}

export const kitchenApi = createApi({
  reducerPath: 'kitchenApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Kitchen'],
  endpoints: (builder) => ({
    getKitchen: builder.query<KitchenResponse, string>({
      query: (id) => `/kitchen/${id}`,
      // @ts-ignore
      providesTags: (result, error, id) => [{type: 'Kitchen', id}],
    }),
  }),
})

export const {useGetKitchenQuery} = kitchenApi
