import React from 'react'
import {useTranslation} from 'react-i18next'
import {Box, Button, Module, Table, Text} from 'gestalt'
import {Product} from '../../types/product.types'
import {Address} from '../../types/address.types'

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
  const [t] = useTranslation(['orders'])
  const {order} = props

  const {id, status, products, total} = order

  const statusText = t(`orders:${status}`)
  const statusType = (type: string) => {
    switch (type) {
      case 'ORDER_RECEIVED':
        return 'info'
      case 'ORDER_DISPATCHED':
        return 'warning'
      case 'DELIVERED':
        return 'success'
      case 'CANCELLED':
        return 'error'
    }
  }

  const badgeType = statusType(status)

  return (
    <Module.Expandable
      accessibilityExpandLabel="Expand Order Details"
      accessibilityCollapseLabel="Collapse Order Details"
      id={id}
      expandedIndex={status === 'DELIVERED' || status === 'CANCELLED' ? 1 : 0}
      items={[
        {
          children: (
            <Box padding={2}>
              <Table accessibilityLabel="Main example table">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      <Text weight="bold">Product(s)</Text>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Text weight="bold">Quantity</Text>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Text weight="bold">Price</Text>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {products.map(({product, quantity, price}) => (
                    <Table.Row key={product.id}>
                      <Table.Cell>
                        <Text>{product.name}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text>{quantity}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text>₹ {price}</Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.Cell>
                      <Text weight="bold">Total</Text>
                    </Table.Cell>
                    <Table.Cell />
                    <Table.Cell>
                      <Text weight="bold">₹ {total}</Text>
                    </Table.Cell>
                  </Table.Row>
                </Table.Footer>
              </Table>
              <Button
                role="link"
                text="Track"
                href={`/order/${id}`}
                color="red"
                fullWidth
              />
            </Box>
          ),
          badge: {
            text: statusText,
            type: badgeType,
          },
          title: `Order #${id}`,
        },
      ]}
    ></Module.Expandable>
  )
}

export default OrderCard
