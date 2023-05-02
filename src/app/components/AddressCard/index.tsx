import React, {useState} from 'react'
import {Address} from '../../types/address.types'
import {
  Avatar,
  Box,
  CompositeZIndex,
  FixedZIndex,
  IconButton,
  Layer,
  Link,
  Modal,
  ModalAlert,
  Text,
  Tooltip,
} from 'gestalt'
import {AddressForm} from '../_forms'

interface IAddressCardProps {
  address: Address
  isDeleting: boolean
  handleDelete: (id: string | undefined) => void
}

const AddressCard: React.FC<IAddressCardProps> = (props) => {
  const {address, isDeleting, handleDelete} = props

  const {id, name, phone, addressLineOne, addressLineTwo, landmark, area} =
    address

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const HEADER_ZINDEX = new FixedZIndex(10)
  const modalZIndex = new CompositeZIndex([HEADER_ZINDEX])

  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal)
  const toggleEditModal = () => setShowEditModal(!showEditModal)

  return (
    <>
      <Box
        alignItems="start"
        direction="row"
        display="flex"
        borderStyle="sm"
        rounding={1}
        padding={4}
        marginStart={1}
        marginEnd={1}
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
          <Tooltip inline text="Edit Address">
            <IconButton
              accessibilityLabel="Edit Address"
              icon="edit"
              size="xs"
              onClick={toggleEditModal}
            />
          </Tooltip>
          <Tooltip inline text="Delete Address">
            <IconButton
              accessibilityLabel="Delete Address"
              icon="trash-can"
              size="xs"
              onClick={toggleDeleteModal}
            />
          </Tooltip>
        </Box>
      </Box>

      {showEditModal && (
        <Layer zIndex={modalZIndex}>
          <Modal
            accessibilityModalLabel="Update Address"
            align="start"
            heading="Update Address"
            onDismiss={toggleEditModal}
          >
            <AddressForm address={address} toggleEditModal={toggleEditModal} />
          </Modal>
        </Layer>
      )}

      {showDeleteModal && (
        <Layer zIndex={modalZIndex}>
          <ModalAlert
            accessibilityModalLabel="Delete Address"
            heading="Delete this Address?"
            primaryAction={{
              accessibilityLabel: 'Confirm Delete Address',
              label: 'Yes, delete',
              disabled: isDeleting,
              onClick: () => handleDelete(id),
            }}
            secondaryAction={{
              accessibilityLabel: 'Cancel',
              label: 'No, keep',
              onClick: toggleDeleteModal,
            }}
            onDismiss={toggleDeleteModal}
          >
            <Text>
              Your Address will be deleted forever. This cannot be undone.
            </Text>
          </ModalAlert>
        </Layer>
      )}
    </>
  )
}

export default AddressCard
