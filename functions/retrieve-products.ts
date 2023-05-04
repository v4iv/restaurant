import {Handler, HandlerContext, HandlerEvent} from '@netlify/functions'
import {Client, query as q} from 'faunadb'

interface Product {
  id: string
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
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({message: 'Method Not Allowed'}),
    }
  }

  try {
    // Connect to FaunaDB
    const client = new Client({secret: process.env.FAUNADB_SECRET})

    // Retrieve all product documents from FaunaDB
    const productDocuments: any = await client.query(
      q.Map(
        q.Paginate(q.Reverse(q.Match(q.Index('all_products')))),
        q.Lambda('product', q.Get(q.Var('product'))),
      ),
    )

    // Format the product documents and return a success response
    const products: Product[] = productDocuments.data.map(
      (productDocument) => ({
        id: productDocument.ref.id,
        name: productDocument.data.name,
        description: productDocument.data.description,
        image: productDocument.data.image,
        isVegetarian: productDocument.data.isVegetarian,
        price: productDocument.data.price,
        quantity: productDocument.data.quantity,
        isAvailable: productDocument.data.isAvailable,
      }),
    )

    return {
      statusCode: 200,
      body: JSON.stringify({products}),
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
