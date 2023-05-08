interface Products {
  product?: {
    id: string
    name: string
    description?: string
    image?: string
    isVegetarian?: boolean
    price: number
    isAvailable?: boolean
    quantity: number
  }
  quantity: number
  price: number
}

export interface Order {
  id?: string
  products: Products[]
  address: string
  status?: string
  specialInstructions?: string
  total?: number | string
}
