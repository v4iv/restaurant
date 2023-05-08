import {Handler, HandlerContext, HandlerEvent} from '@netlify/functions'
import {Client, query as q} from 'faunadb'

interface User {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  if (event.httpMethod !== 'PUT') {
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

    // Parse the request body
    const {firstName, lastName, email, phone}: User = JSON.parse(event.body)

    // Connect to FaunaDB
    const client = new Client({secret: faunaSecret})

    const userDocument: any = await client.query(q.Get(q.CurrentIdentity()))

    // Update the user's information in FaunaDB
    const updatedUserDocument: any = await client.query(
      q.Update(userDocument.ref, {
        data: {
          firstName: firstName || userDocument.data.firstName,
          lastName: lastName || userDocument.data.lastName,
          email: email || userDocument.data.email,
          phone: phone || userDocument.data.phone,
        },
      }),
    )

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User information updated successfully!',
        user: {id: updatedUserDocument.ref.id, ...updatedUserDocument.data},
      }),
    }
  } catch (error) {
    // Handle any errors that occur
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({error: error.message}),
    }
  }
}

export {handler}
