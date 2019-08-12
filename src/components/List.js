import React from 'react';
import { Link } from "react-router-dom";
import { FiMoreHorizontal, FiEdit, FiArrowLeftCircle, FiUnlock, FiLock } from 'react-icons/fi';
import { MdRemoveCircle } from 'react-icons/md';

import { randomColor } from 'randomcolor';
import hexToRgba from 'hex-to-rgba';
import { AddForm } from './AddForm';

export class List extends React.Component {

  render() {

    const currentColor = this.props.item.color || randomColor();
    const currentColorString = hexToRgba(currentColor, 0.2);

    const listStyle = {
      backgroundColor: currentColorString
    };

    const listId = this.props.itemKey;
    const listLocked = this.props.item.locked;

    return (
      <div className="row">
        <div className="col-12 listHeadline" style={listStyle}>
          <h4>
            <Link to="/">
              <FiArrowLeftCircle size="28px" />
            </Link>
            <span className="ml-2">{this.props.item.name}</span>
            {(listLocked ? <span className="badge badge-danger ml-2">Locked</span> : null)}
          </h4>
          <div className="actions">
            <button type="button" className="btn btn-link" onClick={() => {
              this.props.toggleLockedList(listId);
            }}>
              {(listLocked ? <FiUnlock size="24px" /> : <FiLock size="24px" />)}
            </button>
          </div>
        </div>
        <div className="ticks col-12">
          {this.props.item.items.map((tickItem, itemKey) => {

            const currentColor = tickItem.color || randomColor();
            const currentColorString = hexToRgba(currentColor, 0.2);

            const itemStyle = {
              backgroundColor: currentColorString
            };

            const menuOpened = tickItem.menuOpened || false;
            const menuStyle = {
              display: menuOpened ? 'block' : 'none'
            };

            return (
              <div key={itemKey} className="row tickItem" style={itemStyle}>
                <div className="col-10 tickItemButton" onClick={() => {
                  this.props.handleTickUp({
                    item: tickItem,
                    id: itemKey,
                    list: listId
                  });
                }}>

                  <span className="itemName">{tickItem.name}</span>
                  <span>{tickItem.ticks}</span>
                </div>
                <div className="col-2 d-flex align-items-center justify-content-around menu-separator" onClick={props => {
                  this.props.toggleItemMenu(listId, itemKey);
                }}>

                  <button type="button" className="btn btn-link btn-lg actionLink" >
                    <FiMoreHorizontal size="32px" />
                  </button>

                </div>



                <div className="col-12" style={menuStyle}>
                  <div className="row justify-content-between align-items-center listMenu">

                  <button className="btn btn-primary btn-lg" onClick={() => {
                      this.props.handleChangeItem(listId, itemKey);
                    }}>
                      <FiEdit />
                      <span>edit name</span>
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={() => {
                      this.props.handleChangeItemValue(listId, itemKey);
                    }}>
                      <FiEdit />
                      <span>edit value</span>
                    </button>
                    <button className="btn btn-danger btn-lg" onClick={() => {
                      this.props.handleRemoveItem(listId, itemKey);
                    }}>
                      <MdRemoveCircle />
                      <span>remove</span>
                    </button>
                  </div>
                </div>


              </div>
            );

          })}
        </div>
        
        <AddForm
            type="item"
            listId={listId}
            handleAddList={this.props.handleAddList}
            handleAddItem={this.props.handleAddItem}
          />
      </div>
    );

  }

}
