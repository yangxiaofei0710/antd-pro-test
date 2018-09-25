import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import {
  DragSource,
  DropTarget,
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DropTargetConnector,
  DragSourceConnector,
  DragSourceMonitor,
} from 'react-dnd';
import { Collapse } from 'antd';
import { connect } from 'dva';
import styles from './OperateRelease.less';
import ReleaseCardList from './ReleaseCardList';

const { Panel } = Collapse;

const style = {
  padding: '5px',
  marginBottom: '5px',
  borderRadius: '3px',
  backgroundColor: 'white',
  cursor: 'move',
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};
export const ItemTypes = {
  CARD: 'card',
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return true;
    }
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();


    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    props.moveCard(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

@connect((state) => {
  return {
    cards: state.release.cards,
    projectList: state.release.projectList,
  };
})
@DropTarget(ItemTypes.CARD, cardTarget, (dndConnect: DropTargetConnector) => ({
  connectDropTarget: dndConnect.dropTarget(),
}))
@DragSource(
  ItemTypes.CARD,
  cardSource,
  (dndConnect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: dndConnect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)

export default class ReleaseCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // cards: this.props.childNode,
    };
  }

  moveCard = (dragIndex, hoverIndex, ParentNode) => {
    const { dispatch, cards } = this.props;
    // console.log(dragIndex, hoverIndex, cards, this.props.projectList);
    const newCards = cards;
    const index = newCards.indexOf(ParentNode);
    const dragCard = newCards[index].children[dragIndex];
    newCards[index].children.splice(dragIndex, 1);
    newCards[index].children.splice(hoverIndex, 0, dragCard);
    // console.log('拖拽', cards);
    dispatch({
      type: 'release/saveCards',
      payload: newCards,
    });
  }

  render() {
    const {
      id,
      text,
      index,
      childNode,
      isDragging,
      parentNode,
      connectDragSource,
      connectDropTarget,
      changeParentNodeColor,
    } = this.props;
    const opacity = isDragging ? 0 : 1;

    return (
      connectDragSource(
        connectDropTarget(
          <li
            style={{ ...style, opacity }}
          >
            <Collapse>
              <Panel header={text} key={id}>
                <ul className={styles.serviceUl}>
                  {childNode.map((item, i) => {
                    return (
                      <ReleaseCardList
                        key={item.id}
                        index={i}
                        id={item.id}
                        text={item.name}
                        parentNode={parentNode}
                        currentNode={item}
                        moveCard={this.moveCard}
                        changeParentNodeColor={changeParentNodeColor}
                      />
                    );
                  })}
                </ul>
              </Panel>
            </Collapse>
          </li>


        ),
      )
    );
  }
}
