import React, {lazy, Suspense, useEffect, useState} from 'react'
import {Route, Switch, useLocation} from 'wouter'
import {useTranslation} from 'react-i18next'
import {
  Box,
  ColorSchemeProvider,
  ColorSchemeProviderProps,
  Container,
  OnLinkNavigationProvider,
  Spinner,
} from 'gestalt'
import ThemeContext from './contexts/theme.context'
import NavBar from './components/NavBar'
import AuthenticatedRoute from './components/AuthenticatedRoute'

// Pages
const HomePage = lazy(() => import('./pages/HomePage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const SignInPage = lazy(() => import('./pages/SignInPage'))
const AddressPage = lazy(() => import('./pages/AddressPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const OrderPage = lazy(() => import('./pages/OrderPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const PageNotFound = lazy(() => import('./pages/404'))

const App: React.FC = () => {
  const {t} = useTranslation(['common'])
  const [, navigate] = useLocation()
  const [theme, setTheme] =
    useState<ColorSchemeProviderProps['colorScheme']>('light')

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('colorScheme', nextTheme)
    setTheme(nextTheme)
  }

  // @ts-ignore
  const useOnNavigation = ({href}) => {
    // @ts-ignore
    return ({event}) => {
      event.preventDefault()
      navigate(href)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (localStorage && localStorage.getItem('colorScheme')) {
      const colorScheme = localStorage.getItem('colorScheme')

      // @ts-ignore
      setTheme(colorScheme)
    }
  }, [])

  return (
    <>
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <ColorSchemeProvider colorScheme={theme}>
          {/* @ts-ignore */}
          <OnLinkNavigationProvider onNavigation={useOnNavigation}>
            <Box color="default" minHeight="100vh">
              <Container>
                <NavBar />
                <Suspense
                  fallback={
                    <Box
                      position="fixed"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      top
                      left
                      right
                      bottom
                    >
                      <Spinner accessibilityLabel={t('common:loading')} show />
                    </Box>
                  }
                >
                  <Switch>
                    <Route path="/" component={HomePage} />
                    <Route path="/sign-in" component={SignInPage} />
                    <Route path="/sign-up" component={SignUpPage} />
                    <AuthenticatedRoute
                      path="/address"
                      component={AddressPage}
                    />
                    <AuthenticatedRoute path="/orders" component={OrdersPage} />
                    <AuthenticatedRoute
                      path="/settings"
                      component={SettingsPage}
                    />
                    <AuthenticatedRoute path="/order/:id">
                      {/* @ts-ignore */}
                      {(params) => <OrderPage id={params.id} />}
                    </AuthenticatedRoute>
                    <Route component={PageNotFound} />
                  </Switch>
                </Suspense>
              </Container>
            </Box>
          </OnLinkNavigationProvider>
        </ColorSchemeProvider>
      </ThemeContext.Provider>
    </>
  )
}

export default App
