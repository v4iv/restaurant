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

interface IAddresses {
  data: AddressDocument[]
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

    const addresses: IAddresses = await client.query(
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('addresses_by_customer'),
            q.Ref(q.Collection('users'), userDocument.ref.id),
          ),
        ),
        q.Lambda('addressRef', q.Get(q.Var('addressRef'))),
      ),
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        addresses: addresses.data.map((address) => ({
          id: address.ref.id,
          name: address.data.name,
          addressLineOne: address.data.addressLineOne,
          addressLineTwo: address.data.addressLineTwo,
          landmark: address.data.landmark,
          area: address.data.area,
          phone: address.data.phone,
          location: address.data.location,
          userRef: address.data.userRef,
        })),
      }),
    }
  } catch (error) {
    console.error(error)
    // Handle any errors that occur
    return {
      statusCode: 500,
      body: JSON.stringify({error: error.message}),
    }
  }
}

export {handler}
