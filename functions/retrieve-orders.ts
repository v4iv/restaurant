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
          q.Reverse(
            q.Match(
              q.Index('orders_by_customer'),
              q.Ref(q.Collection('users'), userDocument.ref.id),
            ),
          ),
        ),
        q.Lambda('order', q.Get(q.Var('order'))),
      ),
    )

    const formattedOrders = await Promise.all(
      orders.data.map(async (order) => {
        const {
          products,
          status,
          address,
          specialInstructions,
          total,
          created,
          updated,
        } = order.data

        const formattedProducts = await Promise.all(
          products.map(async ({product, price, quantity}) => {
            const productData: any = await client.query(
              q.Get(q.Ref(q.Collection('products'), product.id)),
            )

            return {
              product: {
                id: product.id,
                ...productData.data,
              },
              price,
              quantity,
            }
          }),
        )

        const addressData: any = await client.query(
          q.Get(q.Ref(q.Collection('addresses'), address.id)),
        )
        const formattedAddress = {id: address.id, ...addressData.data}

        return {
          id: order.ref.id,
          status,
          products: formattedProducts,
          address: formattedAddress,
          total,
          specialInstructions,
          created,
          updated,
        }
      }),
    )

    return {
      statusCode: 200,
      body: JSON.stringify(formattedOrders),
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
