import React from 'react';
import { Link } from "react-router-dom";
import { Form, Input } from '@rocketseat/unform';
import { FiMoreHorizontal } from 'react-icons/fi';

export class Index extends React.Component {

  render() {

    return (
      <div className="row">

        <div className="col-12 listContainer">


        {this.props.lists.map((item, i) => {
              return (
                <div key={i} className="row">

                  <Link to={`/list/${i}`} className="col-10">

                    <div className="listItem">
                      <span>{item.name}</span>
                    </div>
                  </Link>


                  <div className="col-2 d-flex align-items-center justify-content-center">
                  <div className="dropdown dropleft show">
                    <button type="button" className="btn btn-link btn-lg dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <FiMoreHorizontal />
                    </button>


                    <div className="dropdown-menu">
                      <button className="btn btn-link" onClick={() => {
                        this.props.handleRemoveList(i);
                      }}>Löschen</button>
                    </div>

                  </div>
                </div>

                </div>
              );
            })}

        </div>

        <div className="col-12">

          <Form onSubmit={this.props.handleAddList} className="form-inline row">
            <div className="form-group">
              <Input className="form-control form-control-lg" id="addNewListInput" name="name" placeholder="New List" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Add</button>
          </Form>

        </div>


      </div>
    );

  }

};
