import React from 'react'
import ReactDOM from 'react-dom'
import { Caller } from './Caller'
import { Callee } from './Callee'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import queryString from 'query-string'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={Caller} />
        <Route path="/callee" render={(props) => <Callee qs={queryString.parse(props.location.search)} />} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
