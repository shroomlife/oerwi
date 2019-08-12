import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { Link } from "react-router-dom";
import { Form, Input } from '@rocketseat/unform';
import { FiMoreHorizontal, FiEdit } from 'react-icons/fi';
import { FaPlusSquare } from 'react-icons/fa';
import { MdPalette, MdRemoveCircle } from 'react-icons/md';

import { randomColor } from 'randomcolor';
import hexToRgba from 'hex-to-rgba';

export class List extends React.Component {

  handleTickUp(tickItem, tickKey) {

    this.props.handleTickUp({
      item: tickItem,
      id: tickKey,
      list: this.props.item.id
    });

  }

  render() {

    const currentColor = this.props.item.color || randomColor();
    const currentColorString = hexToRgba(currentColor, 0.2);

    const listStyle = {
      backgroundColor: currentColorString
    };

    return (
      <div className="row">
        <div className="col-12 listHeadline" style={listStyle}>
          <h4>
            <Link to="/">
              <MdArrowBack />
            </Link>
            <span className="ml-2">{this.props.item.name}</span>
          </h4>
        </div>
        <div className="ticks col-12">
          {this.props.item.items.map((tickItem, itemKey) => {

            const currentColor = tickItem.color || randomColor();
            const currentColorString = hexToRgba(currentColor, 0.2);

            const itemStyle = {
              backgroundColor: currentColorString
            };

            return (
              <div key={itemKey} className="row tickItem" style={itemStyle}>
                <div className="col-9 tickItemButton" onClick={() => {
                  this.handleTickUp(tickItem, itemKey);
                }}>

                  <span>{tickItem.name}</span>
                  <span>{tickItem.ticks.length}</span>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-around">
                  <button type="button" className="btn btn-link btn-lg actionLink" onClick={() => {
                    this.props.handleChangeItem(this.props.item.id, itemKey);
                  }}>
                    <FiEdit />
                  </button>
                  <div className="dropdown dropleft show">
                    <button type="button" className="btn btn-link btn-lg dropdown-toggle actionLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <FiMoreHorizontal />
                    </button>


                    <div className="dropdown-menu">
                      <button className="btn btn-danger" onClick={() => {
                        this.props.handleRemoveItem(this.props.item.id, itemKey);
                      }}><MdRemoveCircle />  remove</button>
                    </div>

                  </div>
                </div>
              </div>
            );

          })}
        </div>
        <div className="col-12">
          <Form className="row" id="addNewItemForm" onSubmit={this.props.handleAddItem}>
            <Input type="hidden" name="id" value={this.props.item.id} />
            <Input className="form-control form-control-lg" name="name" placeholder="new item" />
            <button type="submit" className="btn btn-primary btn-lg">
              <FaPlusSquare className="mr-1" /> add
            </button>
          </Form>
        </div>
      </div>
    );

  }

}
