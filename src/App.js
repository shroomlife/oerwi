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

import { TiSpiral } from 'react-icons/ti';

import Swal from 'sweetalert2';

const DEFAULT_STATE = {
  lists: [],
  counter: 0
};

const DEFAULT_LIST = {
  id: false,
  name: '',
  items: [],
  color: '',
  locked: false,
  menuOpened: false
};

const DEFAULT_ITEM = {
  name: '',
  ticks: 0,
  color: '',
  menuOpened: false
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
    this.handleChangeItemValue = this.handleChangeItemValue.bind(this);

    this.handleListColorChange = this.handleListColorChange.bind(this);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleLockedList = this.toggleLockedList.bind(this);

    this.toggleItemMenu = this.toggleItemMenu.bind(this);

    this.handleTickUp = this.handleTickUp.bind(this);
    this.resetAll = this.resetAll.bind(this);

    let loadedData = localStorage.getItem('STORAGE');

    if (loadedData) {

      let parsedState = JSON.parse(loadedData);

      if (parsedState.lists.length) {

        parsedState.lists.forEach((list) => {
          list.menuOpened = DEFAULT_LIST.menuOpened;
          list.locked = list.locked || DEFAULT_LIST.locked;

          if (list.items.length) {
            list.items.forEach((item) => {

              if (typeof item.ticks === "object") {
                console.log(item.ticks, typeof item.ticks, item.ticks == null);

                if (item.ticks == null) {
                  item.ticks = 0;
                } else {
                  item.ticks = item.ticks.length;
                }

              }

              item.menuOpened = DEFAULT_ITEM.menuOpened;
            });
          }

        });

      }

      this.state = parsedState;

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

    let currentState = Object.assign({}, this.state);

    Swal.fire({
      type: "warning",
      title: "remove list",
      text: `do you want to delete ${currentState.lists[id].name}?`,
      showCancelButton: true
    }).then((result) => {

      if (typeof result.value === "boolean" && result.value === true) {
        delete currentState.lists[id];
        currentState.lists = currentState.lists.filter(() => { return true; });
        this.setState(currentState, this.upload);
      } else {
        this.toggleMenu(id);
      }

    });

  }

  handleRemoveItem(listId, id) {

    let currentState = Object.assign({}, this.state);

    Swal.fire({
      type: "warning",
      title: "remove item from list",
      text: `do you want to delete ${currentState.lists[listId].items[id].name}?`,
      showCancelButton: true
    }).then((result) => {

      if (typeof result.value === "boolean" && result.value === true) {
        delete currentState.lists[listId].items[id];
        currentState.lists[listId].items = currentState.lists[listId].items.filter(() => { return true; });
        this.setState(currentState, this.upload);
      } else {
        this.toggleItemMenu(id);
      }

    });

  }

  handleChangeList(id) {

    let currentState = Object.assign({}, this.state);
    let currentName = String(currentState.lists[id].name);

    Swal.fire({
      type: 'question',
      input: 'text',
      inputValue: currentName
    }).then((result) => {

      console.log(result);
      if (typeof result.value === "string" && result.value.length > 0) {

        let rawInputName = result.value;

        if (rawInputName === null) {
          return toast.error('rename canceled');
        }
    
        let newName = String(rawInputName);
    
        if (currentName === newName) {
          return toast.warn('nothing changed');
        }
    
        if (newName.length < 1) {
          return toast.error('name can\'t be empty');
        }
    
        currentState.lists[id].name = newName;
        this.setState(currentState, () => {
          this.toggleMenu(id);
          this.upload();
        });

      }

    });

  }

  handleListColorChange(id) {
    let currentState = Object.assign({}, this.state);
    currentState.lists[id].color = randomColor();
    this.setState(currentState, this.upload);
  }

  handleChangeItem(listId, id) {

    let currentState = Object.assign({}, this.state);
    let currentName = String(currentState.lists[listId].items[id].name);

    Swal.fire({
      type: 'question',
      input: 'text',
      inputValue: currentName
    }).then((result) => {

      if (typeof result.value === "string" && result.value.length > 0) {

        let rawInputName = result.value;

        if (rawInputName === null) {
          return toast.error('rename canceled');
        }
    
        let newName = String(rawInputName);
    
        if (currentName === newName) {
          return toast.warn('nothing changed');
        }
    
        if (newName.length < 1) {
          return toast.error('name can\'t be empty');
        }
    
        currentState.lists[listId].items[id].name = newName;
        this.setState(currentState, () => {
          this.toggleItemMenu(id);
          this.upload();
        });

      }

    });

  }

  handleChangeItemValue(listId, id) {

    let currentState = Object.assign({}, this.state);
    let currentItem = currentState.lists[listId].items[id];

    console.log(listId, id);
    Swal.fire({
      title: "change",
      input: "number",
      inputValue: currentItem.ticks,
      inputAttributes: {
        min: 0
      },
      buttons: true,
      inputValidator: (value) => {
        if (!value) {
          return 'invalid number'
        }
      }
    }).then((input) => {

      if (typeof input.value !== 'undefined') {
        let inputValue = parseInt(input.value);

        if (inputValue >= 0) {
          currentItem.ticks = inputValue;
          this.setState(currentState, this.upload);
        } else {
          toast.error('invalid number');
        }

      }

    });

  }

  handleAddItem(data, form) {

    if (typeof data.name === 'undefined') {
      return toast.error("name is missing");
    }

    if (data.name.length < 1) {
      return toast.error("name is too short");
    }

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

    console.log(conf);
    let currentState = this.state;

    if (currentState.lists[conf.list].locked === true) {
      return;
    }

    let newItem = Object.assign({}, currentState.lists[conf.list].items[conf.id]);

    newItem.ticks += 1;
    newItem.color = randomColor();

    currentState.lists[conf.list].items[conf.id] = newItem;

    this.setState(currentState, this.upload);

  }

  resetAll() {


    Swal.fire({
      type: "warning",
      title: "reset all to defaults",
      text: `do you want to reset all to defaults?`,
      showCancelButton: true
    }).then((result) => {

      if (typeof result.value === "boolean" && result.value === true) {

        let newState = Object.assign({}, DEFAULT_STATE);
        this.setState(newState, () => {
          localStorage.removeItem('STORAGE');
          this.upload();
        })

      }

    });

  }

  upload() {
    localStorage.setItem('STORAGE', JSON.stringify(this.state));
  }

  toggleMenu(id) {
    let currentState = Object.assign({}, this.state);
    currentState.lists[id].menuOpened = !currentState.lists[id].menuOpened;
    this.setState(currentState);
  }

  toggleLockedList(id) {
    let currentState = Object.assign({}, this.state);
    currentState.lists[id].locked = !currentState.lists[id].locked;
    this.setState(currentState, this.upload);
  }

  toggleItemMenu(listId, id) {
    let currentState = Object.assign({}, this.state);
    currentState.lists[listId].items[id].menuOpened = !currentState.lists[listId].items[id].menuOpened;
    this.setState(currentState);
  }

  render() {

    return (
      <div className="App">
        <ToastContainer />
        <nav className="navbar navbar-dark">
          <a className="navbar-brand" href="/">
            <img src="/logo192.png" width="32" height="32" className="d-inline-block align-top rounded-circle mr-2" alt="" />
            <span className="mr-2">oerwilist</span>
            <span className="badge badge-danger">alpha</span>
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto mt-2">
              <li className="nav-item active">
                <button type="button" className="btn btn-danger btn-lg btn-block" onClick={this.resetAll}>
                  <TiSpiral /> reset all
                  </button>
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
                handleListColorChange={this.handleListColorChange}
                toggleMenu={this.toggleMenu} />} />
            <Route path="/list/:id" exact render={props =>
              <List
                itemKey={props.match.params.id}
                item={this.state.lists[props.match.params.id]}
                handleAddItem={this.handleAddItem}
                handleTickUp={this.handleTickUp}
                handleRemoveItem={this.handleRemoveItem}
                handleChangeItem={this.handleChangeItem}
                handleChangeItemValue={this.handleChangeItemValue}
                handleItemColorChange={this.handleItemColorChange}
                toggleItemMenu={this.toggleItemMenu}
                toggleLockedList={this.toggleLockedList} />} />
            <Route render={() => <Redirect to="/" />} />
          </Router>
        </div>

      </div>
    );

  }
}
