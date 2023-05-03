import {Handler, HandlerContext, HandlerEvent} from '@netlify/functions'
import {Client, query as q} from 'faunadb'

interface UserDocument {
  ref: any
  ts: number
  data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    isManager: boolean
    isVerified: boolean
    isActive: boolean
  }
}

interface Product {
  product: any
  price: number
  quantity: number
}

interface OrderDocument {
  ref: any
  ts: number
  data: {
    customer: any
    products: Product[]
    status: string
    address: any
    specialInstructions: string
    total: number
    created: any
    updated: any
  }
}

interface IOrders {
  data: OrderDocument[]
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({message: 'Method Not Allowed'}),
    }
  }

  try {
    const authHeader = event.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({error: 'Unauthorized'}),
      }
    }
    const faunaSecret = authHeader.split(' ')[1]

    // Connect to FaunaDB
    const client = new Client({secret: faunaSecret})

    const userDocument: UserDocument = await client.query(
      q.Get(q.CurrentIdentity()),
    )

    const orders: IOrders = await client.query(
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('orders_by_customer'),
            q.Ref(q.Collection('users'), userDocument.ref.id),
          ),
        ),
        q.Lambda('order', q.Get(q.Var('order'))),
      ),
    )

    return {
      statusCode: 200,
      body: JSON.stringify(
        orders.data.map((order) => {
          const {
            customer,
            products,
            status,
            address,
            specialInstructions,
            total,
            created,
            updated,
          } = order.data

          const formattedProducts = products.map(
            ({product, price, quantity}) => ({
              product: {id: product.ref.id, ...product.data},
              price,
              quantity,
            }),
          )

          const formattedAddress = {id: address.ref.id, ...address.data}

          return {
            id: order.ref.id,
            status,
            products: formattedProducts,
            address: formattedAddress,
            customer: customer.data,
            total,
            specialInstructions,
            created: created.toISOString(),
            updated: updated.toISOString(),
          }
        }),
      ),
    }
  } catch (error) {
    console.error(error)
    // Handle any errors that occur
    return {
      statusCode: 500,
      body: JSON.stringify({error: error.message}),
    }
  }
}

export {handler}
