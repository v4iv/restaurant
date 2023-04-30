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

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({message: 'Method Not Allowed'}),
    }
  }

  try {
    const {products, address, specialInstructions} = JSON.parse(event.body)
    // Get the bearer token from the Authorization header
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

    // Get the user document from the bearer token
    const userDocument: UserDocument = await client.query(q.Get(q.Identity()))

    const addressDocument: AddressDocument = await client.query(
      q.Get(q.Ref(q.Collection('addresses'), address)),
    )

    const productsFormatted = products.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      name: product.name,
      price: product.price,
    }))

    console.log('Products Formatted', productsFormatted)
    console.log('User ID', userDocument.ref)
    console.log('Address ID', addressDocument.ref)
    console.log('Special Instructions', specialInstructions)

    // Call the submit_order FQL function with the necessary arguments
    const result: any = await client.query(
      q.Call(
        q.Function('submit_order'),
        productsFormatted,
        userDocument.ref,
        addressDocument.ref,
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
  } catch (error) {
    console.error(error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Order submission failed',
        error,
      }),
    }
  }
}
