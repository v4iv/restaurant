import {Handler, HandlerContext, HandlerEvent} from '@netlify/functions'
import {Client, query as q} from 'faunadb'

interface KitchenDocument {
  ref: any
  ts: number
  data: {
    isOpen: boolean
  }
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  try {
    switch (event.httpMethod) {
      case 'GET': {
        // Connect to FaunaDB
        const client = new Client({secret: process.env.FAUNADB_SECRET})
        const id = event.path.split('/').pop()
        const kitchenDocument: KitchenDocument = await client.query(
          q.Get(q.Ref(q.Collection('kitchen'), id)),
        )
        const kitchen = {
          id: kitchenDocument.ref.id,
          ...kitchenDocument.data,
        }
        return {
          statusCode: 200,
          body: JSON.stringify({kitchen}),
        }
      }
      default: {
        return {
          statusCode: 405,
          body: JSON.stringify({message: 'Method Not Allowed'}),
        }
      }
    }
  } catch (err) {
    console.error('/api/kitchen :', err)
    return {
      statusCode: 500,
      body: JSON.stringify({error: err.message}),
    }
  }
}

export {handler}
