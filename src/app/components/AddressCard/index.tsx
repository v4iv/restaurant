import React from 'react'
import {Address} from '../../types/address.types.ts'
import {Avatar, Box, IconButton, Link, Text, Tooltip} from 'gestalt'

interface IAddressCardProps {
  address: Address
  isDeleting: boolean
  handleDelete: (id: string) => void
}

const AddressCard: React.FC<IAddressCardProps> = (props) => {
  const {
    address: {id, name, phone, addressLineOne, addressLineTwo, landmark, area},
    handleDelete,
  } = props

  return (
    <Box
      alignItems="start"
      direction="row"
      display="flex"
      borderStyle="sm"
      rounding={1}
      padding={4}
      marginBottom={2}
    >
      <Box paddingX={1}>
        <Avatar name={name} size="sm" />
      </Box>
      <Box paddingX={1} flex="grow" wrap>
        <Text weight="bold">{name}</Text>
        <Text size="300">
          <Link href={`tel:+91${phone}`}>Phone: +91-{phone}</Link>
        </Text>
        <Text size="200">{addressLineOne}</Text>
        <Text size="200">{addressLineTwo}</Text>
        <Text size="200">{landmark}</Text>
        <Text size="200">{area}</Text>
      </Box>
      <Box paddingX={1}>
        <Tooltip inline text="Delete Address">
          <IconButton
            accessibilityLabel="Delete Address"
            icon="trash-can"
            onClick={() => handleDelete(id)}
          />
        </Tooltip>
      </Box>
    </Box>
  )
}

export default AddressCard
