import {CartItem} from './cart.types.ts'

export interface Order {
  products: CartItem[]
  shippingAddress: string
  billingAddress: string
}
