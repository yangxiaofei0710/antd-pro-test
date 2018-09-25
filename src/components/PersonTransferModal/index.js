import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Tree, Button, Tag, Spin, Input, Message } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { treeTravel } from '../../utils/utils';

const { TreeNode } = Tree;
const { Search } = Input;
let dataList = [];

export default class CategoryTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: undefined,
      treeData: props.treeData || [],
      selectedIds: props.selectedIds || [],
      limitKeysLength: props.limitKeysLength || false, // 是否需要限制选择的人员的个数
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
    };
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

  onCheck = (checkedKeys, info) => {
    const { checkedNodes } = info;
    this.setState({
      selectedIds: checkedKeys,
    });
  }
  onOk = () => {
    const { selectedIds } = this.state;
    if (this.state.limitKeysLength && selectedIds.length > 30) {
      Message.error('人员选择不多于30人');
    } else if (this.props.onOk) {
      this.props.onOk(selectedIds);
    }
  }
  onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.setState({
      expandedKeys: [],
      searchValue: '',
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
    // console.log('parentKey', parentKey);
    return parentKey;
  };

  // 把类目树中的name和id重新整合一个数组，便于输入框中的的输入值去遍历类目树中的每个树节点
  generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      dataList.push({ key: node.id, title: node.fullName });
      if (node.children) {
        this.generateList(node.children, node.key);
      }
    }
  };

  treeFilter = (treeNode) => {
    if (treeNode.props.title.indexOf(this.state.filterValue) > -1) {
      return true;
    }
  }
  // 树搜索回调
  treeSearch = (value) => {
    dataList = [];
    const { treeData } = this.state;
    this.generateList(this.state.treeData);
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return this.getParentKey(item.key, treeData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      filterValue: value,
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }
  //  tree渲染
  renderTreeNodes = (orgTreeData) => {
    const { searchValue } = this.state;
    const resultTreeNodes = orgTreeData.map((nodeItem, index) => {
      const valueIndex = nodeItem.fullName.indexOf(searchValue);
      const beforeStr = nodeItem.fullName.substr(0, valueIndex);
      const afterStr = nodeItem.fullName.substr(valueIndex + searchValue.length);
      const title = valueIndex > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{nodeItem.fullName}</span>;
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
  // 渲染选中的人员
  renderSelectedItems = () => {
    const { treeData, selectedIds } = this.state;
    const selectedPersons = [];
    const columns = [{
      title: '序号',
      key: 'k',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '姓名',
      dataIndex: 'fullName',
      key: 'fullName',
    }];
    if (selectedIds) {
      // console.log('1111selectedIds', selectedIds);
      treeTravel(treeData, (nodeItem) => {
        // 搜集所有选中的人的节点
        if (selectedIds.map((item) => {
          return `${item}`;
        }).indexOf(`${nodeItem.id}`) > -1 && nodeItem.level == undefined) {
          selectedPersons.push(nodeItem);
        }
      });
    }
    // console.log('selectedPersons', selectedPersons);

    return (
      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: (selectedRowKeys, selectedRows) => {
            // 这里selectedRowKeys是包含父节点的全量数据，需要通过 selectedRows 获得节点数据
            const nodeSelected = selectedRows.map((item) => {
              return item.id;
            });
            this.setState({
              selectedIds: nodeSelected,
            });
          },
        }}
        checkable
        bordered={false}
        dataSource={selectedPersons}
        columns={columns}
        pagination={false}
      />
    );
  }
  render() {
    const { visible, loading } = this.props;
    // console.log('selectedIds:', this.state.selectedIds);
    return (
      <Modal
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
        width={800}
      >
        <Spin spinning={loading}>
          <p>人员选择</p>
          <div className={styles.wrapper}>
            <div className={styles.leftConent}>
              <Search onSearch={this.treeSearch} enterButton />
              <Tree
                checkable
                defaultExpandAll
                checkedKeys={this.state.selectedIds}
                // filterTreeNode={this.treeFilter}
                onCheck={this.onCheck}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onExpand={this.onExpand}
              >
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>
            </div>
            <div className={styles.rightConent} >
              {this.renderSelectedItems()}
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }
}

