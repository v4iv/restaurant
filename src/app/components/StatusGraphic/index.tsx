import React from 'react'
import orderReceived from '../../../assets/vectors/ORDER_RECEIVED.svg'
import orderDispatched from '../../../assets/vectors/ORDER_DISPATCHED.svg'
import delivered from '../../../assets/vectors/DELIVERED.svg'
import cancelled from '../../../assets/vectors/CANCELLED.svg'
import {Box, Image} from 'gestalt'

interface IStatusGraphic {
  status: string | undefined
}
const StatusGraphic: React.FC<IStatusGraphic> = (props) => {
  const {status} = props

  switch (status) {
    case 'ORDER_RECEIVED':
      return (
        <Box>
          <Image
            alt="ORDER_RECEIVED"
            color="transparent"
            naturalHeight={1}
            naturalWidth={1}
            src={orderReceived}
          />
        </Box>
      )
    case 'ORDER_DISPATCHED':
      return (
        <Box>
          <Image
            alt="ORDER_DISPATCHED"
            color="transparent"
            naturalHeight={1}
            naturalWidth={1}
            src={orderDispatched}
          />
        </Box>
      )
    case 'DELIVERED':
      return (
        <Box>
          <Image
            alt="DELIVERED"
            color="transparent"
            naturalHeight={1}
            naturalWidth={1}
            src={delivered}
          />
        </Box>
      )
    case 'CANCELLED':
      return (
        <Box>
          <Image
            alt="CANCELLED"
            color="transparent"
            naturalHeight={1}
            naturalWidth={1}
            src={cancelled}
          />
        </Box>
      )
    default:
      return (
        <Box>
          <Image
            alt="CANCELLED"
            color="transparent"
            naturalHeight={1}
            naturalWidth={1}
            src={cancelled}
          />
        </Box>
      )
  }
}

export default StatusGraphic
