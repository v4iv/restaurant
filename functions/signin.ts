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

interface LoginResult {
  secret: string
  instance: UserDocument
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
    // Parse the incoming request body
    const {email, password} = JSON.parse(event.body)

    // Connect to FaunaDB
    const client = new Client({secret: process.env.FAUNADB_SECRET})

    // Call the built-in Login function to authenticate the user
    const result: LoginResult = await client.query(
      q.Login(q.Match(q.Index('users_by_email'), email), {
        password,
      }),
    )

    // Get the user document from the Login result
    const userDocument: UserDocument = result.instance

    // Return the token and user document as a response
    return {
      statusCode: 200,
      body: JSON.stringify({
        token: result.secret,
        user: {
          firstName: userDocument.data.firstName,
          lastName: userDocument.data.lastName,
          email: userDocument.data.email,
          phone: userDocument.data.phone,
          isManager: userDocument.data.isManager,
          isVerified: userDocument.data.isVerified,
          isActive: userDocument.data.isActive,
        },
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
