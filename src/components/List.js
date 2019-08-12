import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { Link } from "react-router-dom";
import { Form, Input } from '@rocketseat/unform';
import { FiMoreHorizontal } from 'react-icons/fi';

export class List extends React.Component {

  handleTickUp(tickItem, tickKey) {

    this.props.handleTickUp({
      item: tickItem,
      id: tickKey,
      list: this.props.item.id
    });

  }

  render() {

    return (
      <div className="row">
        <div className="col-12">
          <h2>
            <Link to="/">
              <MdArrowBack />
            </Link>
            <span>{this.props.item.name}</span>
          </h2>
        </div>
        <div className="ticks col-12">
          {this.props.item.items.map((tickItem, tickKey) => {

            return (
              <div key={tickKey} className="row tickItem">
                <div className="col-10 tickItemButton" onClick={() => {
                  this.handleTickUp(tickItem, tickKey);
                }}>

                  <span>{tickItem.name}</span>
                  <span>{tickItem.ticks.length}</span>
                </div>
                <div className="col-2 d-flex align-items-center justify-content-center">
                  <div className="dropdown dropleft show">
                    <button type="button" className="btn btn-link btn-lg dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <FiMoreHorizontal />
                    </button>


                    <div className="dropdown-menu">
                    <button className="btn btn-link" onClick={() => {
                        this.props.handleRemoveItem(this.props.item.id, tickKey);
                      }}>Löschen</button>
                    </div>

                  </div>
                </div>
              </div>
            );

          })}
        </div>
        <Form className="form-inline col-12" onSubmit={this.props.handleAddItem}>
          <Input type="hidden" name="id" value={this.props.item.id} />
          <div className="form-group">
            <Input className="form-control form-control-lg" id="addNewListInput" name="name" placeholder="New Item" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg">Add</button>
        </Form>
      </div>
    );

  }

}
