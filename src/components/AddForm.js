import React from 'react';
import { Form, Input } from '@rocketseat/unform';
import { FaPlusSquare } from 'react-icons/fa';

export class AddForm extends React.Component {

  render() {

    return (
      <footer className="footer">
      <div className="container">
        {(
          this.props.type === "item" ?
            <Form onSubmit={this.props.handleAddItem} className="row" id="addNewItemForm">
              <Input type="hidden" name="id" value={this.props.listId} />
              <Input className="form-control form-control-lg" name="name" placeholder="new item" />
              <button type="submit" className="btn btn-primary btn-lg">
                <FaPlusSquare />
                <span className="ml-2">add</span>
              </button>
            </Form> :
            <Form onSubmit={this.props.handleAddList} className="row" id="addNewListForm">
              <Input className="form-control form-control-lg" name="name" placeholder="new list" />
              <button type="submit" className="btn btn-primary btn-lg btn-block">
                <FaPlusSquare />
                <span className="ml-2">add</span>
              </button>
            </Form>
        )}

      </div>
      </footer>
    );

  }

}
