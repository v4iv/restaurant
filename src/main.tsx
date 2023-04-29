import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'
import './i18n/config'
import 'gestalt/dist/gestalt.css'
import 'gestalt-datepicker/dist/gestalt-datepicker.css'
import './assets/stylesheets/styles.css'
import App from './app'
import {store} from './app/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
