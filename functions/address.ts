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

    switch (event.httpMethod) {
      case 'GET': {
        const id = event.path.split('/').pop()

        // Query FaunaDB for the address document
        const addressDocument: AddressDocument = await client.query(
          q.Get(q.Ref(q.Collection('addresses'), id)),
        )

        // Extract the address data from the document
        const address = {
          id: addressDocument.ref.id,
          ...addressDocument.data,
        }

        // Return the address as a JSON response
        return {
          statusCode: 200,
          body: JSON.stringify({address}),
        }
      }
      case 'POST': {
        const {
          name,
          addressLineOne,
          addressLineTwo,
          landmark,
          area,
          phone,
          location,
        } = JSON.parse(event.body)

        // Create the address document
        const addressDocument: AddressDocument = await client.query(
          q.Create(q.Collection('addresses'), {
            data: {
              name,
              addressLineOne,
              addressLineTwo,
              landmark,
              area,
              phone,
              location,
              userRef: userDocument.ref,
            },
          }),
        )

        // Return the created address document as a response
        return {
          statusCode: 201,
          body: JSON.stringify({
            address: {
              name: addressDocument.data.name,
              addressLineOne: addressDocument.data.addressLineOne,
              addressLineTwo: addressDocument.data.addressLineTwo,
              landmark: addressDocument.data.landmark,
              area: addressDocument.data.area,
              phone: addressDocument.data.phone,
              location: addressDocument.data.location,
              userRef: addressDocument.data.userRef,
            },
          }),
        }
      }
      case 'PUT': {
        // Parse the incoming request body
        const {
          name,
          addressLineOne,
          addressLineTwo,
          landmark,
          area,
          phone,
          location,
        } = JSON.parse(event.body)

        // Get the address document to be updated
        const addressRef = q.Ref(
          q.Collection('addresses'),
          event.path.split('/').pop(),
        )
        const addressDocument: AddressDocument = await client.query(
          q.Get(addressRef),
        )

        // Ensure the address belongs to the authenticated user
        if (userDocument.ref.id !== addressDocument.data.userRef.id) {
          return {
            statusCode: 401,
            body: JSON.stringify({error: 'Unauthorized'}),
          }
        }

        // Update the address document
        const updatedAddressDocument: AddressDocument = await client.query(
          q.Update(addressRef, {
            data: {
              name,
              addressLineOne,
              addressLineTwo,
              landmark,
              area,
              phone,
              location,
              userRef: addressDocument.data.userRef,
            },
          }),
        )

        // Return the updated address document as a response
        return {
          statusCode: 200,
          body: JSON.stringify({
            address: {
              id: updatedAddressDocument.ref.id,
              name: updatedAddressDocument.data.name,
              addressLineOne: updatedAddressDocument.data.addressLineOne,
              addressLineTwo: updatedAddressDocument.data.addressLineTwo,
              landmark: updatedAddressDocument.data.landmark,
              area: updatedAddressDocument.data.area,
              phone: updatedAddressDocument.data.phone,
              location: updatedAddressDocument.data.location,
              userRef: updatedAddressDocument.data.userRef,
            },
          }),
        }
      }
      case 'DELETE': {
        const id = event.path.split('/').pop()

        // Get the address document from FaunaDB
        const addressDocument: AddressDocument = await client.query(
          q.Get(q.Ref(q.Collection('addresses'), id)),
        )

        // Delete the address document from FaunaDB
        await client.query(q.Delete(addressDocument.ref))

        // Return a success response
        // Return a success response
        return {
          statusCode: 204,
          body: '',
        }
      }
      default: {
        return {
          statusCode: 405,
          body: JSON.stringify({message: 'Method Not Allowed'}),
        }
      }
    }
  } catch (error) {
    // Handle any errors that occur
    console.error('/api/address :', error)
    return {
      statusCode: 500,
      body: JSON.stringify({error: error.message}),
    }
  }
}

export {handler}
