import React from 'react'
import {Box, Module, Text} from 'gestalt'
import {Product} from '../../types/product.types'
import {Address} from '../../types/address.types.ts'

interface IOrderCardProps {
  order: {
    id: string
    products: {
      product: Product
      quantity: number
      price: number
    }[]
    status: string
    address: Address
    specialInstructions: string
    total: number
    created: any
    updated: any
  }
}

const OrderCard: React.FC<IOrderCardProps> = (props) => {
  const {order} = props

  const {id, status, products, total} = order

  return (
    <Module.Expandable
      accessibilityExpandLabel="Expand the module"
      accessibilityCollapseLabel="Collapse the module"
      id={id}
      expandedIndex={status === 'DELIVERED' || status === 'CANCELLED' ? 1 : 0}
      items={[
        {
          children: (
            <Box padding={2}>
              {products.map((item) => {
                return (
                  <Text size="200">
                    {item.product.name} ₹ {item.price} x {item.quantity}
                  </Text>
                )
              })}
              <Text>₹ {total}</Text>
            </Box>
          ),
          summary: ['DELIVERED'],
          title: id,
        },
      ]}
    ></Module.Expandable>
  )
}

export default OrderCard
