import React from 'react';
import { Link } from "react-router-dom";
import { FiMoreHorizontal, FiEdit, FiArrowLeftCircle, FiUnlock, FiLock, FiSkipBack } from 'react-icons/fi';
import { MdRemoveCircle } from 'react-icons/md';

import { randomColor } from 'randomcolor';
import hexToRgba from 'hex-to-rgba';
import { AddForm } from '../AddForm';

import moment from 'moment';
import NoListComponent from '../NoListComponent';

function showTutorial(list) {

  const justNow = moment().format("H:m a");

  return (
    <div className="col-12">
      <div className="tutorial-card">
        <p>hey, again<span className="metadata"><span className="time">{justNow}</span></span></p>
        <p>now it's time to add new items for {list.name} <span className="metadata"><span className="time">{justNow}</span></span></p>
        <p>after you you added new items, you can click on them to count them up <span className="metadata"><span className="time">{justNow}</span></span></p>
        <p>happy counting! ♥ <span className="metadata"><span className="time">{justNow}</span></span></p>
      </div>
    </div>
  );
}

export class List extends React.Component {

  render() {

    if(typeof this.props.item === "undefined") {
      return <NoListComponent />;
    }

    const currentColor = this.props.item.color || randomColor();
    const currentColorString = hexToRgba(currentColor, 0.2);

    const listStyle = {
      backgroundColor: currentColorString
    };

    const listId = this.props.itemKey;
    const listLocked = this.props.item.locked;

    const listLockedButtonClassName = listLocked ? "danger" : "link";

    let totalTicks = 0;

    return (
      <div className="row">


        <div className="col-12 listHeadline" style={listStyle}>
          <h4>
            <Link to="/">
              <FiArrowLeftCircle size="28px" />
            </Link>
            <span className="ml-2">{this.props.item.name}</span>
          </h4>
          <div className="actions">
            <button type="button" className={`btn btn-${listLockedButtonClassName}`} onClick={() => {
              this.props.toggleLockedList(listId);
            }}>
              {(listLocked ? <FiUnlock size="24px" /> : <FiLock size="24px" />)}
            </button>
          </div>
        </div>

        {this.props.item.items.length === 0 ? showTutorial(this.props.item) : null}

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

            const colValues = {
              values: listLocked ? 12 : 10
            };

            totalTicks += tickItem.ticks;

            return (
              <div key={itemKey} className="row tickItem" style={itemStyle}>
                <div className={`col-${colValues.values} tickItemButton`} onClick={(event) => {
                  this.props.handleTickUp({
                    item: tickItem,
                    id: itemKey,
                    list: listId
                  });
                }}>
                  
                  <span className="itemName">{tickItem.name}</span>
                  <span className="itemCount">{tickItem.ticks}</span>                 

                </div>

                {(!listLocked ?
                  <div className={`col-2 d-flex align-items-center justify-content-around menu-separator`} onClick={props => {
                    this.props.toggleItemMenu(listId, itemKey);
                  }}>

                    <button type="button" className="btn btn-link btn-lg actionLink" >
                      <FiMoreHorizontal size="32px" />
                    </button>

                  </div>
                  : null)}

                {(!listLocked ?

                  <div className="col-12" style={menuStyle}>
                    <div className="row justify-content-between align-items-center listMenu">

                    <button className="btn btn-danger btn-lg" onClick={() => {
                        this.props.handleRemoveItem(listId, itemKey);
                      }}>
                        <MdRemoveCircle />
                        <span>remove</span>
                      </button>
                      <button className="btn btn-danger btn-lg" onClick={() => {
                        this.props.handleResetItemValue(listId, itemKey);
                      }}>
                        <FiSkipBack />
                        <span>reset</span>
                      </button>
                      <button className="btn btn-secondary btn-lg" onClick={() => {
                        this.props.handleChangeItemValue(listId, itemKey);
                      }}>
                        <FiEdit />
                        <span>value</span>
                      </button>
                      <button className="btn btn-primary btn-lg" onClick={() => {
                        this.props.handleChangeItem(listId, itemKey);
                      }}>
                        <FiEdit />
                        <span>name</span>
                      </button>
                    </div>
                  </div> : null)
                }


              </div>
            );

          })}

          {totalTicks > 0 ? 
            <div className="row totals">
            <div className="col-6 text-left totalCaption">Total</div>
            <div className="col-4 text-right totalTicks">{totalTicks}</div>

          </div>
            : null}

          
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
