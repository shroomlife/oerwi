import React from 'react';
import { Link } from "react-router-dom";
import { Form, Input } from '@rocketseat/unform';
import { FiMoreHorizontal, FiEdit } from 'react-icons/fi';
import { FaPlusSquare } from 'react-icons/fa';
import { MdPalette, MdRemoveCircle } from 'react-icons/md';

import { randomColor } from 'randomcolor';
import hexToRgba from 'hex-to-rgba';

export class Index extends React.Component {

  render() {

    return (
      <div className="row">

        <div className="col-12 listContainer">


          {this.props.lists.map((item, i) => {

            const currentColor = item.color || randomColor();
            const currentColorString = hexToRgba(currentColor, 0.2);

            const listStyle = {
              backgroundColor: currentColorString
            };

            return (
              <div key={i} className="row">

                <Link to={`/list/${i}`} className="col-9" style={listStyle}>

                  <div className="listItem">
                    <h5>{item.name}</h5>
                    <small className="float-right">{item.items.length} items</small>
                  </div>
                </Link>


                <div className="col-3 d-flex align-items-center justify-content-around">
                    <button type="button" className="btn btn-link btn-lg actionLink" onClick={() => {
                        this.props.handleChangeList(i);
                      }}>
                      <FiEdit />
                    </button>
                  <div className="dropdown dropleft show">
                    <button type="button" className="btn btn-link btn-lg dropdown-toggle actionLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <FiMoreHorizontal />
                    </button>


                    <div className="dropdown-menu">
                      <button className="btn btn-link" onClick={() => {
                        this.props.handleListColorChange(i);
                      }}><MdPalette /> new color</button>
                      <button className="btn btn-danger" onClick={() => {
                        this.props.handleRemoveList(i);
                      }}><MdRemoveCircle /> remove</button>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}

        </div>

        <div className="col-12">

          <Form onSubmit={this.props.handleAddList} className="row" id="addNewListForm">
            <Input className="form-control form-control-lg" name="name" placeholder="New List" />
            <button type="submit" className="btn btn-primary btn-lg">
              <FaPlusSquare />
            </button>
          </Form>

        </div>


      </div>
    );

  }

};
