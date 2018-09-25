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
import { Collapse, Checkbox } from 'antd';
import { connect } from 'dva';
import styles from './OperateRelease.less';

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
  CARDLIST: 'cardlist',
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragParentNode = component.props.parentNode;
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
    props.moveCard(dragIndex, hoverIndex, dragParentNode);
    monitor.getItem().index = hoverIndex;
  },
};
@connect((state) => {
  return {
    projectList: state.release.projectList,
    configlist: state.release.configlist,
    cards: state.release.cards,
    checkNodeIds: state.release.checkNodeIds,
  };
})
@DropTarget(ItemTypes.CARDLIST, cardTarget, (dndConnect: DropTargetConnector) => ({
  connectDropTarget: dndConnect.dropTarget(),
}))
@DragSource(
  ItemTypes.CARDLIST,
  cardSource,
  (dndConnect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: dndConnect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)

export default class ReleaseCardList extends Component {
  getParentNode = (key, tree) => {
    let parentNode;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.id === key)) {
          parentNode = node;
        } else if (this.getParentNode(key, node.children)) {
          parentNode = this.getParentNode(key, node.children);
        }
      }
    }
    return parentNode;
  }
  // 获取父级元素的下标
  getParentNodeIndex = (node, tree) => {
    return tree.indexOf(node);
  }
  // 过滤发布进度中节点
  filterNode = (tree, treeNode) => {
    const treeData = tree;
    treeData.forEach((el) => {
      if (el.children) { // 树节点的子节点判断是否匹配当前check树节点的id
        el.children.forEach((item, i) => {
          if (item.id == treeNode.id) { // 如果匹配节点id，查找当前节点所在索引，并删除
            const index = el.children.findIndex((data) => { return data.id == item.id; });
            const idIndex = this.props.checkNodeIds.indexOf(treeNode.id);
            el.children.splice(index, 1);
            this.props.checkNodeIds.splice(idIndex, 1); // 在已选择配置文件id数组中，删除当前check节点的id
          }
          if (!item.checked) {
            el.children.splice(i, 1);
          }
        });
      }
      if (el.children.length == 0) { // 如果子节点为空，删除当前节点
        treeData.splice(treeData.findIndex((data) => { return data.id == el.id; }), 1);
      }
    });
    return treeData;
  }


  /**
   * 发布进度列表中，点击已选择的配置文件，删除cards中对应的本条数据
   * 选择发布进度中配置文件要更新版本列表和配置文件列表
   */
  checkedChange = async (index, e) => {
    const projectList = [...this.props.projectList.private, ...this.props.projectList.public];
    const parentNode = this.getParentNode(this.props.currentNode.id, projectList);
    const grandpaNode = this.getParentNode(parentNode.id, projectList);
    parentNode.children[index].checked = e.target.checked; // 改变配置文件列表中当前点击文件checked状态
    // console.log(parentNode, grandpaNode, projectList);

    const grandpaNodeIndex = this.getParentNodeIndex(grandpaNode, projectList);
    const parentNodeIndex = this.getParentNodeIndex(parentNode, grandpaNode.children);

    const { dispatch, configlist } = this.props;
    await dispatch({ // 更新版本列表列表显示
      type: 'release/saveVersionList',
      payload: grandpaNode.children,
    });
    await dispatch({ // 更新配置文件列表显示
      type: 'release/saveConfiglist',
      payload: parentNode.children,
    });
    this.props.changeParentNodeColor(grandpaNodeIndex, parentNodeIndex);
    dispatch({
      type: 'release/saveCards',
      payload: this.filterNode(this.props.cards, this.props.currentNode),
    });
  }
  render() {
    const {
      text,
      index,
      isDragging,
      currentNode,
      connectDragSource,
      connectDropTarget,
    } = this.props;
    const opacity = isDragging ? 0 : 1;

    return (
      connectDragSource(
        connectDropTarget(
          <li
            style={{ ...style, opacity }}
          >
            <Checkbox
              checked={currentNode.checked}
              onChange={this.checkedChange.bind(this, index)}
              className={styles.checkBoxWrp}
            >
              {text}
            </Checkbox>
          </li>
        ),
      )
    );
  }
}
