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

    // Return the token and user document as a response
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: userDocument.ref.id,
        firstName: userDocument.data.firstName,
        lastName: userDocument.data.lastName,
        email: userDocument.data.email,
        phone: userDocument.data.phone,
        isManager: userDocument.data.isManager,
        isVerified: userDocument.data.isVerified,
        isActive: userDocument.data.isActive,
      }),
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
