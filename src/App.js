import React from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Form, Text } from 'informed';

import List from './List.js';

function Home() {
  return (
    <div>
      <div className="listContainer"></div>
      <Form>
        <label>
          Name:
          <Text field="name" />
        </label>
        <button type="submit">Submit</button>
      </Form>

    </div>
  );
}

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/list/:id" exact component={List} />
    </Router>
  );
}

export default App;
