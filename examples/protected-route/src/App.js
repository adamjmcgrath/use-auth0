import React from 'react'; // eslint-disable-line no-unused-vars
import { Router, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import history from './history';

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path="/" exact />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
