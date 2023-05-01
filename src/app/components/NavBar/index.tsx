import React, {useContext, useRef, useState} from 'react'
import {useLocation} from 'wouter'
import {useTranslation} from 'react-i18next'
import {Box, Button, Flex, IconButton} from 'gestalt'
import {fireVector} from '../../../assets/vectors'
import ThemeContext from '../../contexts/theme.context'
import {useAppSelector} from '../../hooks/useAppSelector'
import {selectIsAuthenticated} from '../../slices/auth.slice'
import MenuDropdown from './MenuDropdown'
import CartOverlay from './CartOverlay'

const NavBar: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <AuthenticatedNavBar />
  } else {
    return <UnauthenticatedNavBar />
  }
}

const UnauthenticatedNavBar = () => {
  const [t] = useTranslation(['common'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLocation] = useLocation()

  return (
    <Box
      color="default"
      rounding={1}
      margin={1}
      borderStyle="sm"
      padding={4}
      display="flex"
      alignItems="center"
    >
      <Flex gap={{row: 4, column: 0}} alignItems="center" flex="grow">
        <IconButton
          dangerouslySetSvgPath={fireVector}
          iconColor="red"
          size="xl"
          accessibilityLabel={t('common:kitchen')}
          onClick={() => setLocation('/')}
        />

        <Flex.Item flex="grow" />

        <Button
          accessibilityLabel={t('common:sign-in') || 'Sign In'}
          text={t('common:sign-in')}
          color="red"
          onClick={() => setLocation('/sign-in')}
        />

        <Button
          accessibilityLabel={t('common:sign-up') || 'Sign Up'}
          color="red"
          text={t('common:sign-up')}
          onClick={() => setLocation('/sign-up')}
        />
      </Flex>
    </Box>
  )
}

const AuthenticatedNavBar: React.FC = () => {
  const [t] = useTranslation(['common'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLocation] = useLocation()
  const themeContext = useContext(ThemeContext)
  const menuAnchorRef = useRef(null)
  const [showCart, setShowCart] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)

  const toggleShowCart = () => setShowCart(!showCart)
  const toggleMenu = () => setOpenMenu(!openMenu)

  return (
    <>
      <Box
        color="default"
        rounding={1}
        margin={1}
        borderStyle="sm"
        padding={4}
        display="flex"
        alignItems="center"
      >
        <Flex gap={{row: 4, column: 0}} alignItems="center" flex="grow">
          <IconButton
            dangerouslySetSvgPath={fireVector}
            iconColor="red"
            size="xl"
            accessibilityLabel={t('common:kitchen')}
            onClick={() => setLocation('/')}
          />
          <Flex.Item flex="grow" />
          <IconButton
            accessibilityLabel={t('common:toggle-color-scheme')}
            icon="workflow-status-in-progress"
            size="md"
            onClick={themeContext.toggleTheme}
          />
          <IconButton
            accessibilityLabel={t('common:cart')}
            icon="shopping-bag"
            size="md"
            onClick={toggleShowCart}
          />
          <IconButton
            accessibilityLabel={t('common:profile-options')}
            icon="person"
            size="md"
            ref={menuAnchorRef}
            onClick={toggleMenu}
          />
        </Flex>
      </Box>
      {openMenu && (
        <MenuDropdown toggleMenu={toggleMenu} menuAnchorRef={menuAnchorRef} />
      )}
      {showCart && <CartOverlay toggleShowCart={toggleShowCart} />}
    </>
  )
}

export default NavBar
