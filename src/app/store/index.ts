import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../slices/auth.slice'
import cartReducer from '../slices/cart.slice'
import {authApi} from '../services/auth.service'
import {productApi} from '../services/products.service'
import {orderApi} from '../services/order.service'
import {addressApi} from '../services/address.service'
import {kitchenApi} from '../services/kitchen.service'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [kitchenApi.reducerPath]: kitchenApi.reducer,
  },
  middleware: (gDM) =>
    gDM().concat(
      authApi.middleware,
      orderApi.middleware,
      productApi.middleware,
      addressApi.middleware,
      kitchenApi.middleware,
    ),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
