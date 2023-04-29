import {Handler, HandlerContext, HandlerEvent} from '@netlify/functions'
import {Client, query as q} from 'faunadb'

interface Product {
  name: string
  description: string
  image: string
  isVegetarian: boolean
  price: number
  quantity: number
  isAvailable: boolean
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
    // Extract the FaunaDB secret from the authorization header
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

    // Check if the user is a manager
    const user: any = await client.query(q.Get(q.CurrentIdentity()))
    if (!user.data.isManager) {
      return {
        statusCode: 401,
        body: JSON.stringify({error: 'Unauthorized'}),
      }
    }

    // Parse the products from the request body
    const products: Product[] = JSON.parse(event.body)

    // Batch create the products in FaunaDB
    const createdProductDocuments: any = await client.query(
      q.Map(
        products,
        q.Lambda(
          'product',
          q.Create(q.Collection('products'), {
            data: {
              name: q.Select('name', q.Var('product')),
              description: q.Select('description', q.Var('product')),
              image: q.Select('image', q.Var('product')),
              isVegetarian: q.Select('isVegetarian', q.Var('product')),
              price: q.Select('price', q.Var('product')),
              quantity: q.Select('quantity', q.Var('product')),
              isAvailable: q.Select('isAvailable', q.Var('product')),
            },
          }),
        ),
      ),
    )

    // Format the created product documents and return a success response
    const createdProducts = createdProductDocuments.map(
      (createdProductDocument) => ({
        id: createdProductDocument.ref.id,
        ...createdProductDocument.data,
      }),
    )

    return {
      statusCode: 201,
      body: JSON.stringify({products: createdProducts}),
    }
  } catch (error) {
    // Handle any errors that occur
    return {
      statusCode: 500,
      body: JSON.stringify({error: error.message}),
    }
  }
}

export {handler}
