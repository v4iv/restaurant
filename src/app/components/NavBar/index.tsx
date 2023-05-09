import React, {useContext, useRef, useState} from 'react'
import {useLocation} from 'wouter'
import {useTranslation} from 'react-i18next'
import {Box, Button, Flex, IconButton, Link, Text, Tooltip} from 'gestalt'
import ThemeContext from '../../contexts/theme.context'
import {useAppSelector} from '../../hooks/useAppSelector'
import {selectCartProducts} from '../../slices/cart.slice'
import {selectIsAuthenticated} from '../../slices/auth.slice'
import Logo from './Logo'
import CartOverlay from './CartOverlay'
import MenuDropdown from './MenuDropdown'

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
  const themeContext = useContext(ThemeContext)

  return (
    <Box
      color="default"
      rounding={1}
      margin={1}
      borderStyle={themeContext.theme === 'light' ? 'raisedTopShadow' : 'sm'}
      padding={4}
      display="flex"
      alignItems="center"
    >
      <Flex gap={{row: 4, column: 0}} alignItems="center" flex="grow">
        <Text color="default" weight="bold">
          {/* @ts-ignore */}
          <Link accessibilityLabel={t('common:home')} href="/">
            <Box paddingX={2}>
              <Flex alignItems="center">
                <Logo width={32} height={32} />
                <Box
                  display="none"
                  lgDisplay="block"
                  paddingX={1}
                  dangerouslySetInlineStyle={{
                    __style: {
                      marginBottom: '1px',
                      fontSize: '20px',
                    },
                  }}
                >
                  {t('common:brand-name')}
                </Box>
              </Flex>
            </Box>
          </Link>
        </Text>

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
  const cartItems = useAppSelector(selectCartProducts)
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
        borderStyle={themeContext.theme === 'light' ? 'raisedTopShadow' : 'sm'}
        padding={4}
        display="flex"
        alignItems="center"
      >
        <Flex gap={{row: 4, column: 0}} alignItems="center" flex="grow">
          <Text color="default" weight="bold">
            {/* @ts-ignore */}
            <Link accessibilityLabel={t('common:home')} href="/">
              <Box paddingX={2}>
                <Flex alignItems="center">
                  <Logo width={32} height={32} />
                  <Box
                    display="none"
                    lgDisplay="block"
                    paddingX={1}
                    dangerouslySetInlineStyle={{
                      __style: {
                        marginBottom: '1px',
                        fontSize: '20px',
                      },
                    }}
                  >
                    {t('common:brand-name')}
                  </Box>
                </Flex>
              </Box>
            </Link>
          </Text>
          <Flex.Item flex="grow" />
          <Tooltip
            inline
            text={
              themeContext.theme === 'light'
                ? t('common:dark-mode')
                : t('common:light-mode')
            }
          >
            <IconButton
              accessibilityLabel={t('common:toggle-color-scheme')}
              size="md"
              onClick={themeContext.toggleTheme /* @ts-ignore */}
              icon={themeContext.theme === 'light' ? 'moon' : 'sun'}
            />
          </Tooltip>
          <Tooltip inline text={t('common:cart')}>
            <IconButton
              accessibilityLabel={t('common:cart')}
              icon="shopping-bag"
              size="md"
              onClick={toggleShowCart}
              iconColor={cartItems.length ? 'brandPrimary' : undefined}
            />
          </Tooltip>
          <Tooltip inline text={t('common:profile-options')}>
            <IconButton
              accessibilityLabel={t('common:profile-options')}
              icon="person"
              size="md"
              ref={menuAnchorRef}
              onClick={toggleMenu}
            />
          </Tooltip>
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
