import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from '../store'
import {CartItem} from '../types/cart.types'

interface CartState {
  items: CartItem[]
  shippingAddress: string
  billingAddress: string
}

const initialState: CartState = {
  items: [],
  shippingAddress: '',
  billingAddress: '',
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) {
        item.quantity += 1
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== action.payload)
        } else {
          item.quantity -= 1
        }
      }
    },
    setShippingAddress: (state, action: PayloadAction<string>) => {
      state.shippingAddress = action.payload
    },
    setBillingAddress: (state, action: PayloadAction<string>) => {
      state.billingAddress = action.payload
    },
  },
})

export const selectCartItems = (state: RootState) => state.cart.items
export const selectShippingAddress = (state: RootState) =>
  state.cart.shippingAddress
export const selectBillingAddress = (state: RootState) =>
  state.cart.billingAddress

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  setShippingAddress,
  setBillingAddress,
} = cartSlice.actions

export default cartSlice.reducer
