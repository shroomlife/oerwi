import React from 'react';
import { Link } from "react-router-dom";
import { FiMoreHorizontal, FiEdit, FiLock } from 'react-icons/fi';
import { MdPalette, MdRemoveCircle } from 'react-icons/md';

import { randomColor } from 'randomcolor';
import hexToRgba from 'hex-to-rgba';

import { AddForm } from './AddForm';

import moment from 'moment';

function showWelcome() {

  const justNow = moment().format("H:m a");

  return (
    <div className="col-12">
      <div className="tutorial-card">
        <p>hey, <span className="metadata"><span className="time">{justNow}</span></span></p>
        <p>to start with your first list, just enter the name into the field on the bottom <span className="metadata"><span className="time">{justNow}</span></span></p>
        <p>after you created your first list, you can enter it by clicking on it <span className="metadata"><span className="time">{justNow}</span></span></p>
        <p>much love, oerwi ♥ <span className="metadata"><span className="time">{justNow}</span></span></p>
      </div>
    </div>
  );
}

export class Index extends React.Component {

  render() {

    return (
      <div className="row">

        {this.props.lists.length === 0 ? showWelcome() : null}

        <div className="col-12 listContainer">


          {this.props.lists.map((list, i) => {

            const currentColor = list.color || randomColor();
            const currentColorString = hexToRgba(currentColor, 0.2);

            const listStyle = {
              backgroundColor: currentColorString
            };

            const menuOpened = list.menuOpened || false;
            const menuStyle = {
              display: menuOpened ? 'block' : 'none'
            };

            const listLocked = list.locked;

            return (
              <div key={i} className="row" style={listStyle}>

                <Link to={`/list/${i}`} className="col-10">

                  <div className="listItem">
                    <h5>
                      {list.name}
                    </h5>
                    <div className="listAttributes d-flex">
                    {(listLocked ? <FiLock /> : null)}
                    <small className="float-right ml-2">{list.items.length} items</small>
                    </div>
                  </div>
                </Link>


                <div className="col-2 d-flex align-items-center justify-content-around menu-separator" onClick={props => {
                  this.props.toggleMenu(i);
                }}>
                  <button type="button" className="btn btn-link btn-lg actionLink" >
                    <FiMoreHorizontal size="32px" />
                  </button>

                </div>

                <div className="col-12" style={menuStyle}>
                  <div className="row justify-content-between align-items-center listMenu">

                    <button className="btn btn-primary btn-lg" onClick={() => {
                      this.props.handleChangeList(i);
                    }}>
                      <FiEdit />
                      <span>edit name</span>
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={() => {
                      this.props.handleListColorChange(i);
                    }}>
                      <MdPalette />
                      <span>new color</span>
                    </button>
                    {(!listLocked ?

                      <button className="btn btn-danger btn-lg" onClick={() => {
                        this.props.handleRemoveList(i);
                      }}>
                        <MdRemoveCircle />
                        <span>remove</span>
                      </button> :
                      null

                    )}
                  </div>
                </div>

              </div>
            );
          })}

        </div>

        <AddForm
          type="list"
          handleAddList={this.props.handleAddList}
          handleAddItem={this.props.handleAddItem}
        />

      </div>
    );

  }

};
