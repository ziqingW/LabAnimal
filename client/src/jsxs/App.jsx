import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store.js'
import { Welcome } from './Welcome.jsx'
import { Main } from './Main.jsx'
import { ProjectPage } from './ProjectPage.jsx'
import { AnimalPage } from './AnimalPage.jsx'
import { AnimalNew } from './AnimalNew.jsx'
import { AnimalEdit } from './AnimalEdit.jsx'
import { ChangePassword } from './ChangePassword.jsx'
import { AnimalSacriPage } from './AnimalSacriPage.jsx'
import { ImportExcel } from './ImportExcel.jsx'

class App extends React.Component{
  render () {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route path="/user/password" component={ ChangePassword } />
            <Route path="/main" component={Main} />
            <Route exact path="/projects" component={ProjectPage} />
            <Route exact path="/animals" component={AnimalPage} />
            <Route exact path="/animals/sacrificed" component={AnimalSacriPage} />
            <Route exact path="/animals/new" component={AnimalNew} />
            <Route exact path="/animals/edit" component={AnimalEdit} />
            <Route exact path="/test/test" component={ImportExcel} />
          </Switch>
        </Provider>
      </BrowserRouter>
    )
  }
}
export default App
