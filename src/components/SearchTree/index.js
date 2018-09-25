import React, { Component } from 'react';
import { Tree, Input, Spin } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const { TreeNode } = Tree;
const { Search } = Input;
let dataList = [];

@connect((state) => {
  return {
    commonLoading: state.common.commonLoading,
    projectTree: state.common.projectTree,
  };
})

/**
 * treeSelect 选择树节点的回调，支持selectkeys参数，为当前选中节点id（最底层树节点） （props）
 */
export default class SearchTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeSelect: props.treeSelect || '',
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/treeSelect',
      payload: undefined,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  // 选中树节点 最底层树节点
  onSelect = (treeData, selectedKeys) => {
    treeData.forEach((item, index) => {
      if (item.id === selectedKeys[0] && !item.hasOwnProperty('children')) {
        this.state.treeSelect(selectedKeys);
      }
      if (item.children) {
        this.onSelect(item.children, selectedKeys);
      }
    });
  }
  // 根据输入框输入内容获取父级节点
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.id === key)) {
          parentKey = node.id;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
  // 把类目树中的name和id重新整合一个数组，便于输入框中的的输入值去遍历类目树中的每个树节点
  generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      dataList.push({ key: node.id, title: node.name });
      if (node.children) {
        this.generateList(node.children, node.key);
      }
    }
  };
  // 树搜索回调
  treeSearch = (value) => {
    dataList = [];
    const { projectTree } = this.props;
    this.generateList(projectTree);
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return this.getParentKey(item.key, projectTree);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }

  //  tree渲染
  renderTreeNodes = (orgTreeData) => {
    const { searchValue } = this.state;
    const resultTreeNodes = orgTreeData.map((nodeItem, index) => {
      const valueIndex = nodeItem.name.indexOf(searchValue);
      const beforeStr = nodeItem.name.substr(0, valueIndex);
      const afterStr = nodeItem.name.substr(valueIndex + searchValue.length);
      const title = valueIndex > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{nodeItem.name}</span>;
      return (
        <TreeNode
          key={nodeItem.id}
          title={title}
          value={nodeItem.id}
        >
          {nodeItem.children ? this.renderTreeNodes(nodeItem.children) : null}
        </TreeNode>
      );
    });
    return resultTreeNodes;
  }

  render() {
    const { commonLoading, projectTree } = this.props;
    return (
      <div className={styles.treeWrapper}>
        <Spin spinning={commonLoading}>
          <div className={styles.searchWrapper}>
            <Search onSearch={this.treeSearch} enterButton />
          </div>
          <Tree
            showLine
            defaultExpandAll
            onCheck={this.onCheck}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onExpand={this.onExpand}
            onSelect={this.onSelect.bind(this, projectTree)}
          >
            {this.renderTreeNodes(projectTree)}
          </Tree>
        </Spin>
      </div>
    );
  }
}
