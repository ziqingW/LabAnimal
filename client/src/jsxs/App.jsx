import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store.js'
import { Welcome } from './Welcome.jsx'
import { Main } from './Main.jsx'
import { CagePage } from './CagePage.jsx'
import { AnimalPage } from './AnimalPage.jsx'

class App extends React.Component{
  render () {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route path="/main" component={Main} />
            <Route exact path="/newcage" component={CagePage} />
            <Route exact path="/newanimal" component={AnimalPage} />
          </Switch>
        </Provider>
      </BrowserRouter>
    )
  }
}
export default App
