import React, { Component } from 'react';
import { Modal, Tree, Spin, Input } from 'antd';
import { connect } from 'dva';
import styles from './AuthorizeModal.less';

const { TreeNode } = Tree;
const { Search } = Input;

@connect((state) => {
  return {
    authoriesTreeData: state['role-manage'].authoriesTreeData,
    authorLoading: state['role-manage'].authorLoading,
  };
})
export default class AuthorizeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: undefined,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    });
  }

  onOk = () => {
    if (this.props.onOk) {
      this.props.onOk(this.props.authoriesTreeData.selectKeys);
    }
  }
  onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
  onCheck = (checkedKeys, info) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role-manage/changeSelectKeys',
      payload: checkedKeys,
    });
  }
  getClassifyTree = (item, key) => {
    let currentTreeNode = '';
    item.forEach((element) => {
      if (element.hasOwnProperty(key)) {
        currentTreeNode = element[`${key}`];
      }
    });
    return currentTreeNode;
  }
  treeFilter = (treeNode) => {
    if (treeNode.props.title.indexOf(this.state.filterValue) > -1) {
      return true;
    }
  }
  treeSearch = (value) => {
    this.setState({
      filterValue: value,
    });
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            title={item.title}
            key={item.key}
            value={item.key}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.title}
          key={item.key}
          value={item.key}
        />
      );
    });
  }


  render() {
    const { visible, authoriesTreeData, authorLoading } = this.props;
    const authoriesTreeNode = authoriesTreeData.treeData;
    const authoriesSelectKeys = authoriesTreeData.selectKeys;
    const treeData = [{
      title: '项目管理',
      key: 'projectrecord',
      children: this.getClassifyTree(authoriesTreeNode, 'projectrecord'),
    }, {
      title: '服务列表',
      key: 'modulerecord',
      children: this.getClassifyTree(authoriesTreeNode, 'modulerecord'),
    }, {
      title: '用户管理',
      key: 'user',
      children: this.getClassifyTree(authoriesTreeNode, 'user'),
    }, {
      title: '角色管理',
      key: 'role',
      children: this.getClassifyTree(authoriesTreeNode, 'role'),
    }, {
      title: '环境类型',
      key: 'envtype',
      children: this.getClassifyTree(authoriesTreeNode, 'envtype'),
    }, {
      title: '中间件列表',
      key: 'middlewares',
      children: this.getClassifyTree(authoriesTreeNode, 'middlewares'),
    }, {
      title: '物理机管理',
      key: 'asset',
      children: this.getClassifyTree(authoriesTreeNode, 'asset'),
    }, {
      title: '虚拟机管理',
      key: 'virtualmodel',
      children: this.getClassifyTree(authoriesTreeNode, 'virtualmodel'),
    }, {
      title: '模板字段',
      key: 'datadicname',
      children: this.getClassifyTree(authoriesTreeNode, 'datadicname'),
    }, {
      title: '公有云',
      key: 'server',
      children: this.getClassifyTree(authoriesTreeNode, 'server'),
    }, {
      title: '资源对象管理',
      key: 'configfile',
      children: this.getClassifyTree(authoriesTreeNode, 'configfile'),
    }, {
      title: '资源对象配置模板',
      key: 'templatesfield',
      children: this.getClassifyTree(authoriesTreeNode, 'templatesfield'),
    }, {
      title: '发布环境',
      key: 'projectrelease',
      children: this.getClassifyTree(authoriesTreeNode, 'projectrelease'),
    }, {
      title: '版本管理',
      key: 'projectversion',
      children: this.getClassifyTree(authoriesTreeNode, 'projectversion'),
    }];
    return (
      <Modal
        title="角色授权"
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Spin spinning={authorLoading}>
          {/* <Search onSearch={this.treeSearch} /> */}
          <Tree
            checkable
            // defaultExpandAll
            checkedKeys={authoriesSelectKeys}
            // filterTreeNode={this.treeFilter}
            onCheck={this.onCheck}
            className={styles.tree}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        </Spin>
      </Modal>

    );
  }
}
