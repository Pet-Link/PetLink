import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './pages/login';
import RegisterAdmin from './pages/administrator/registerAdmin';
// ... import other pages as needed

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={RegisterAdmin} />
        {/* Define more routes as needed */}
      </Switch>
    </Router>
  );
}

export default App;
