import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import { Form, Input } from '@rocketseat/unform';

import 'bootstrap/dist/css/bootstrap.css';

import { MdArrowBack } from 'react-icons/md';

import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min';

const DEFAULT_STATE = {
  lists: [],
  counter: 0
};

const DEFAULT_LIST = {
  id: false,
  name: '',
  items: []
};

const DEFAULT_ITEM = {
  name: '',
  ticks: []
};

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.handleAddList = this.handleAddList.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleTickUp = this.handleTickUp.bind(this);
    this.resetAll = this.resetAll.bind(this);

    let loadedData = localStorage.getItem('STORAGE');

    if (loadedData) {
      this.state = JSON.parse(loadedData);
    } else {
      this.state = Object.assign({}, DEFAULT_STATE);
    }

  }

  handleAddList(data, form) {

    let currentState = Object.assign({}, this.state);

    let newList = Object.assign({}, DEFAULT_LIST);
    newList.id = currentState.lists.length;
    newList.name = data.name;

    currentState.lists = currentState.lists.concat([newList]);

    this.setState(currentState, this.upload);
    form.resetForm();

  }

  handleAddItem(data, form) {

    let currentState = Object.assign({}, this.state);

    let newItem = Object.assign({}, DEFAULT_ITEM);
    newItem.name = data.name;

    let itemKey = parseInt(data.id);
    currentState.lists[itemKey].items = currentState.lists[itemKey].items.concat([newItem]);

    this.setState(currentState, this.upload);
    form.resetForm();

  }

  handleTickUp(conf) {
    let currentState = this.state;
    currentState.lists[conf.list].items[conf.id].ticks = currentState.lists[conf.list].items[conf.id].ticks.concat([true]);
    this.setState(currentState, this.upload);
  }

  resetAll() {
    this.setState(Object.assign({}, DEFAULT_STATE), () => {
      localStorage.removeItem('STORAGE');
    });
  }

  upload() {
    localStorage.setItem('STORAGE', JSON.stringify(this.state));
  }

  render() {

    return (
      <div>
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="/">Örwilist</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <button type="button" className="btn btn-link" onClick={this.resetAll}>Alles zurücksetzen</button>
              </li>
            </ul>
          </div>

        </nav>

        <div className="container">
          <Router>
            <Route path="/" exact render={props => {

              return (
                <div className="App">
                  <div className="listContainer">
                    {this.state.lists.map((item, i) => {
                      return (
                        <Link key={i} to={`/list/${i}`}>
                          <div className="listItem">
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <Form onSubmit={this.handleAddList} className="form-inline">
                    <div className="form-group">
                      <Input className="form-control form-control-lg" id="addNewListInput" name="name" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg">Add</button>
                  </Form>
                </div>
              );

            }} />
            <Route path="/list/:id" exact render={props => {

              let selectedItemId = parseInt(props.match.params.id);
              let selectedItem = this.state.lists[selectedItemId];

              if(!selectedItem) {
                return <Redirect to="/" />
              }

              return (
                <List item={selectedItem} handleAddItem={this.handleAddItem} handleTickUp={this.handleTickUp} />
              );

            }} />
            <Route render={props => {
              return <Redirect to="/" />;
            }} />
          </Router>
        </div>
      </div>
    );

  }
}

class List extends React.Component {

  render() {

    return (
      <div>
        <h2>
          <Link to="/">
            <MdArrowBack />
          </Link>
          <span>{this.props.item.name}</span>
        </h2>
        <div className="ticks">
          {this.props.item.items.map((tickItem, tickKey) => {

            return (
              <div key={tickKey} className="tickItem" onClick={() => {
                this.props.handleTickUp({
                  item: tickItem,
                  id: tickKey,
                  list: this.props.item.id
                });
              }}>
                <span>{tickItem.name}</span>
                <span>{tickItem.ticks.length}</span>
              </div>
            );

          })}
        </div>
        <Form className="form-inline" onSubmit={this.props.handleAddItem}>
          <Input type="hidden" name="id" value={this.props.item.id} />
          <div className="form-group">
            <Input className="form-control form-control-lg" id="addNewListInput" name="name" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg">Add</button>
        </Form>
      </div>
    );

  }

}
