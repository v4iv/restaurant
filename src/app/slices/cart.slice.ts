import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from '../store'
import {CartItem} from '../types/cart.types'

interface CartState {
  products: CartItem[]
  address: string | undefined
  specialInstructions: string
}

const initialState: CartState = {
  products: [],
  address: undefined,
  specialInstructions: '',
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.products.push(action.payload)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      )
    },
    clearCart: (state) => {
      state.products = []
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const product = state.products.find(
        (product) => product.id === action.payload,
      )
      if (product) {
        product.quantity += 1
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const product = state.products.find(
        (product) => product.id === action.payload,
      )
      if (product) {
        if (product.quantity === 1) {
          state.products = state.products.filter(
            (item) => item.id !== action.payload,
          )
        } else {
          product.quantity -= 1
        }
      }
    },
    setAddress(state, action: PayloadAction<string>) {
      state.address = action.payload
    },
    setSpecialInstructions(state, action: PayloadAction<string>) {
      state.specialInstructions = action.payload
    },
  },
})

export const selectCart = (state: RootState) => state.cart

export const selectCartProducts = (state: RootState) => state.cart.products
export const selectCartAddress = (state: RootState) => state.cart.address

export const selectSpecialInstruction = (state: RootState) =>
  state.cart.specialInstructions

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  setSpecialInstructions,
  setAddress,
} = cartSlice.actions

export default cartSlice.reducer
