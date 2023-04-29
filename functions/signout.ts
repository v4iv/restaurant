import {Handler, HandlerContext, HandlerEvent} from '@netlify/functions'
import {Client, query as q} from 'faunadb'

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

    const response = await client.query(q.Logout(true))

    return {
      statusCode: 200,
      body: JSON.stringify(response),
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
