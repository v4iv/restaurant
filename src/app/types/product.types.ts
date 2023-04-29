export interface Product {
  id: string
  name: string
  description?: string
  image: string
  isVegetarian: boolean
  price: number
  discount?: number
  isAvailable: boolean
  quantity: number
}
