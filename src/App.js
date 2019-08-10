import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Form, Input } from '@rocketseat/unform';

import 'bootstrap/dist/css/bootstrap.css';

import { IoIosArrowBack } from 'react-icons/io';

const DEFAULT_LIST = {
  id: false,
  name: '',
  items: []
};

const DEFAULT_ITEM = {
  name: '',
  ticks: []
};

class Index extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    console.log(this.state);
    return (
      <div>Hi</div>
    );
  }

}

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.handleAddList = this.handleAddList.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);

    let loadedData = localStorage.getItem('STORAGE');

    if (loadedData) {
      this.state = JSON.parse(loadedData);
    } else {

      this.state = {
        lists: [],
        counter: 0
      };

    }

  }

  handleAddList(data) {

    console.log(data);

    let currentState = this.state;
    let currentCounterValue = currentState.counter;
    currentState.counter += 1;

    let newList = DEFAULT_LIST;
    newList.id = currentState.counter;
    newList.name = data.name;

    currentState.lists.push(newList);
    this.setState(newList);

    this.upload();

  }

  handleAddItem(data) {

    console.log(data);

  }

  upload() {
    localStorage.setItem('STORAGE', JSON.stringify(this.state));
  }

  render() {

    return (
      <div>
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="/">Örwilist</a>
        </nav>

        <div className="container">
          <Router>
            <Route path="/" exact render={props => {

              return (
                <div className="App">
                  <div className="listContainer">
                    {this.state.lists.map((item, i) => {
                      return (
                        <Link key={i} to={`/list/${i + 1}`}>
                          <div className="listItem">
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <Form onSubmit={this.handleAddList} className="form-inline">
                    <div className="form-group">
                      <label htmlFor="addNewListInput">List Name</label>
                      <Input id="addNewListInput" name="name" />
                    </div>
                    <button type="submit" className="btn btn-primary">Add</button>
                  </Form>
                </div>
              );

            }} />
            <Route path="/list/:id" exact render={props => {

              let selectedItemId = parseInt(props.match.params.id);

              return (
                <div className="listPage">
                  {() => {

                    let currentItem = findObjectByKey(this.state.lists, 'id', selectedItemId);
                    return (
                      <div>
                        <h2>
                          <Link to="/">
                            <IoIosArrowBack />
                          </Link>
                          {currentItem.name}
                        </h2>
                        <Form onSubmit={this.handleAddItem} className="form-inline">
                          <div className="form-group">
                            <label htmlFor="addNewItemInput">Item Name</label>
                            <Input id="addNewItemInput" name="name" />
                          </div>
                          <button type="submit" className="btn btn-primary">Add</button>
                        </Form>
                      </div>
                    );

                  }}
                </div>
              );

            }} />
          </Router>
        </div>
      </div>
    );

  }
}

function findObjectByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
}
