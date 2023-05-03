import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {Order} from '../types/order.types'

interface OrderApi {
  orders: Order[]
  order: Order
}

export const orderApi = createApi({
  reducerPath: 'orderApi',
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
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    getOrders: builder.query<OrderApi['orders'], void>({
      query: () => '/retrieve-orders',
      providesTags: (result) =>
        result
          ? // successful query
            [
              ...result.map(({id}) => ({type: 'Orders', id} as const)),
              {type: 'Orders', id: 'ORDERS_LIST'},
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Orders', id: 'ORDERS_LIST' }` is invalidated
            [{type: 'Orders', id: 'ORDERS_LIST'}],
    }),
    getOrder: builder.query<OrderApi['order'], string>({
      query: (id) => `/orders/${id}`,
      // @ts-ignore
      providesTags: (result, error, id) => [{type: 'Orders', id}],
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{type: 'Orders', id: 'ORDERS_LIST'}],
    }),
  }),
})

export const {useCreateOrderMutation} = orderApi
