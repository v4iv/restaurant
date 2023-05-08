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

interface AddressDocument {
  ref: any
  ts: number
  data: {
    name: string
    addressLineOne: string
    addressLineTwo: string
    landmark: string
    area: string
    phone: string
    location: string
    userRef: any
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

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
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

    switch (event.httpMethod) {
      case 'GET': {
        const id = event.path.split('/').pop()

        // Query FaunaDB for the order document
        const orderDocument: OrderDocument = await client.query(
          q.Get(q.Ref(q.Collection('orders'), id)),
        )

        // Extract the order data from the document
        const order = {
          id: orderDocument.ref.id,
          ...orderDocument.data,
        }

        const {
          products,
          status,
          address,
          specialInstructions,
          total,
          created,
          updated,
        } = order

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

        // Return the order as a JSON response
        return {
          statusCode: 200,
          body: JSON.stringify({
            id: order.id,
            status,
            products: formattedProducts,
            address: formattedAddress,
            total,
            specialInstructions,
            created,
            updated,
          }),
        }
      }
      case 'POST': {
        const {products, address, specialInstructions} = JSON.parse(event.body)

        const addressDocument: AddressDocument = await client.query(
          q.Get(q.Ref(q.Collection('addresses'), address)),
        )

        const productsFormatted = products.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
          name: product.name,
          price: product.price,
        }))

        // Call the submit_order FQL function with the necessary arguments
        const result: any = await client.query(
          q.Call(
            q.Function('submit_order'),
            productsFormatted,
            userDocument.ref.id,
            addressDocument.ref.id,
            specialInstructions,
          ),
        )

        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Order submitted successfully',
            order: result.data,
          }),
        }
      }
      default: {
        return {
          statusCode: 405,
          body: JSON.stringify({message: 'Method Not Allowed'}),
        }
      }
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Order Failed',
        error,
      }),
    }
  }
}

export {handler}
