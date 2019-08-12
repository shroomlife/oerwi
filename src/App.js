import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { List } from './components/List';
import { Index } from './components/Index';

import 'bootstrap/dist/css/bootstrap.css';


import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min';

import * as firebase from "firebase/app";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { randomColor } from 'randomcolor';

const DEFAULT_STATE = {
  lists: [],
  counter: 0
};

const DEFAULT_LIST = {
  id: false,
  name: '',
  items: [],
  color: ''
};

const DEFAULT_ITEM = {
  name: '',
  ticks: [],
  color: ''
};

const firebaseConfig = {
  apiKey: "AIzaSyDtDE467cX3ifGy9r45alG2MEQJl2AMc9Q",
  authDomain: "oerwilist.firebaseapp.com",
  databaseURL: "https://oerwilist.firebaseio.com",
  projectId: "oerwilist",
  storageBucket: "",
  messagingSenderId: "511591272153",
  appId: "1:511591272153:web:996c5708ff500901"
};



export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.handleAddList = this.handleAddList.bind(this);
    this.handleRemoveList = this.handleRemoveList.bind(this);

    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);

    this.handleChangeList = this.handleChangeList.bind(this);
    this.handleChangeItem = this.handleChangeItem.bind(this);

    this.handleListColorChange = this.handleListColorChange.bind(this);
    this.handleItemColorChange = this.handleItemColorChange.bind(this);

    this.handleTickUp = this.handleTickUp.bind(this);
    this.resetAll = this.resetAll.bind(this);

    let loadedData = localStorage.getItem('STORAGE');

    if (loadedData) {
      this.state = JSON.parse(loadedData);
    } else {
      this.state = Object.assign({}, DEFAULT_STATE);
    }

  }

  componentDidMount() {
    firebase.initializeApp(firebaseConfig);
  }

  handleAddList(data, form) {

    if (typeof data.name === 'undefined') {
      return toast.error("name is missing");
    }

    if (data.name.length < 1) {
      console.log('error');
      return toast.error("name is too short");
    }

    let currentState = Object.assign({}, this.state);

    let newList = Object.assign({}, DEFAULT_LIST);
    newList.id = currentState.lists.length;
    newList.name = data.name;

    // add random color for new list
    newList.color = randomColor();

    currentState.lists = currentState.lists.concat([newList]);

    this.setState(currentState, this.upload);
    form.resetForm();

  }

  handleRemoveList(id) {

    let confirmRemove = window.confirm('really delete?');

    if(confirmRemove) {
      let currentState = Object.assign({}, this.state);
      delete currentState.lists[id];
      currentState.lists = currentState.lists.filter(() => {return true;});
      this.setState(currentState, this.upload);
    }

  }

  handleRemoveItem(listId, id) {

    let confirmRemove = window.confirm('really delete?');

    if(confirmRemove) {
      let currentState = Object.assign({}, this.state);      
      delete currentState.lists[listId].items[id];
      currentState.lists[listId].items = currentState.lists[listId].items.filter(() => {return true;});
      this.setState(currentState, this.upload);
    }

  }

  handleChangeList(id) {

    let currentState = Object.assign({}, this.state);
    let currentName = String(currentState.lists[id].name);

    let rawInputName = window.prompt('enter new name', currentName);
    if(rawInputName === null) {
      return toast.error('rename canceled');
    }
    
    let newName = String(rawInputName);

    if(currentName === newName) {
      return toast.warn('nothing changed');
    }

    if(newName.length < 1) {
      return toast.error('name can\'t be empty');
    }

    currentState.lists[id].name = newName;
    this.setState(currentState, this.upload);

  }

  handleListColorChange(id) {
    let currentState = Object.assign({}, this.state);
    currentState.lists[id].color = randomColor();
    this.setState(currentState, this.upload);
  }

  handleChangeItem(listId, id) {

    let currentState = Object.assign({}, this.state);
    let currentName = String(currentState.lists[listId].items[id].name);

    let rawInputName = window.prompt('enter new name', currentName);
    if(rawInputName === null) {
      return toast.error('rename canceled');
    }

    let newName = String(rawInputName);

    if(currentName === newName) {
      return toast.warn('nothing changed');
    }

    if(newName.length < 1) {
      return toast.error('name can\'t be empty');
    }

    currentState.lists[listId].items[id].name = newName;
    this.setState(currentState, this.upload);

  }

  handleItemColorChange(listId, id) {
    let currentState = Object.assign({}, this.state);
    currentState.lists[listId].items[id].color = randomColor();
    this.setState(currentState, this.upload);
  }

  handleAddItem(data, form) {

    let currentState = Object.assign({}, this.state);

    let newItem = Object.assign({}, DEFAULT_ITEM);
    newItem.name = data.name;
    newItem.color = randomColor();

    let itemKey = parseInt(data.id);
    currentState.lists[itemKey].items = currentState.lists[itemKey].items.concat([newItem]);

    this.setState(currentState, this.upload);
    form.resetForm();

  }

  handleTickUp(conf) {

    let currentState = this.state;
    let newItem = Object.assign({}, currentState.lists[conf.list].items[conf.id]);

    newItem.ticks = newItem.ticks.concat([true]);
    newItem.color = randomColor();

    currentState.lists[conf.list].items[conf.id] = newItem;

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
      <div className="App">
        <ToastContainer />
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="/">
          <img src="/logo192.png" width="32" height="32" className="d-inline-block align-top rounded-circle mr-1" alt="" />
            Örwilist
            </a>
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
            <Route path="/" exact render={props =>
              <Index
                lists={this.state.lists}
                handleAddList={this.handleAddList}
                handleRemoveList={this.handleRemoveList}
                handleChangeList={this.handleChangeList}
                handleListColorChange={this.handleListColorChange} />} />
            <Route path="/list/:id" exact render={props =>
              <List
                item={this.state.lists[props.match.params.id]}
                handleAddItem={this.handleAddItem}
                handleTickUp={this.handleTickUp}
                handleRemoveItem={this.handleRemoveItem}
                handleChangeItem={this.handleChangeItem}
                handleItemColorChange={this.handleItemColorChange} />} />
            <Route render={() => <Redirect to="/" />} />
          </Router>
        </div>
      </div>
    );

  }
}


