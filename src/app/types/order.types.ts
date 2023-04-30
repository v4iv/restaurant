import {CartItem} from './cart.types.ts'

export interface Order {
  products: CartItem[]
  address: string
}
