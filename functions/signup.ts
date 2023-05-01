import {Handler, HandlerContext, HandlerEvent} from '@netlify/functions'
import {Client, query as q} from 'faunadb'

interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  isManager: boolean
  isVerified: boolean
  isActive: boolean
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
    const data: SignupData = JSON.parse(event.body)

    // Connect to FaunaDB
    const client = new Client({secret: process.env.FAUNADB_SECRET})

    // Check if a user with the same email already exists
    const existingUser = await client.query(
      q.Exists(q.Match(q.Index('users_by_email'), data.email)),
    )

    if (existingUser) {
      // Return an error if a user with the same email already exists
      return {
        statusCode: 400,
        body: JSON.stringify({error: 'User already exists with this email'}),
      }
    }

    // Create a new user document in FaunaDB
    const userDocument: any = await client.query(
      q.Create(q.Collection('users'), {
        credentials: {
          password: data.password,
        },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          isManager: false,
          isVerified: false,
          isActive: true,
        },
      }),
    )

    // Format the user document and return a success response
    const user: User = {
      id: userDocument.ref.id,
      firstName: userDocument.data.firstName,
      lastName: userDocument.data.lastName,
      email: userDocument.data.email,
      phone: userDocument.data.phone,
      isManager: userDocument.data.isManager,
      isVerified: userDocument.data.isVerified,
      isActive: userDocument.data.isActive,
    }

    return {
      statusCode: 200,
      body: JSON.stringify({user}),
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
