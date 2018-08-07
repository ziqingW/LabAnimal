import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store.js'
import { Welcome } from './Welcome.jsx'

class App extends React.Component{
  render () {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Switch>
            <Route exact path="/" component={Welcome} />
          </Switch>
        </Provider>
      </BrowserRouter>
    )
  }
}
export default App
