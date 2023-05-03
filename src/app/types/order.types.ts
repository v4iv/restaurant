import {CartItem} from './cart.types.ts'

export interface Order {
  id?: string
  products: CartItem[]
  address: string
  specialInstructions?: string
}
