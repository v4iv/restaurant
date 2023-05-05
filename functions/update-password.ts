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
    const {email, currentPassword, newPassword} = JSON.parse(event.body)

    // Connect to FaunaDB
    const client = new Client({secret: process.env.FAUNADB_SECRET})

    // Call the built-in Login function to authenticate the user
    const loginResult: LoginResult = await client.query(
      q.Login(q.Match(q.Index('users_by_email'), email), {
        currentPassword,
      }),
    )

    const newClient = new Client({secret: loginResult.secret})

    // Get the user document from the Login result
    const userDocument: UserDocument = await newClient.query(
      q.Get(loginResult.instance),
    )

    const result = await newClient.query(
      q.Update(q.Ref(q.Collection('users'), userDocument.ref.id), {
        credentials: {password: newPassword},
      }),
    )

    // Return the token and user document as a response
    return {
      statusCode: 200,
      body: JSON.stringify(result),
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
