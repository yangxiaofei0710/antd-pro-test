import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal, Table, Input, Form, Row, Col, Button, DatePicker, Pagination, TreeSelect } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './UserList.less';
import utilStyles from '../../utils/utils.less';
import { objKeyWrapper } from '../../utils/utils';

const { TreeNode } = TreeSelect;
const { confirm } = Modal;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const PAGE_SIZE = 20;
@connect((state) => {
  return {
    listInfo: state['user-manage'].listInfo,
    searchFormFields: state['user-manage'].searchFormFields,
    syncing: state['user-manage'].syncing,
    orgTreeData: state['user-manage'].orgTreeData,
    operateAuthor: state['user-manage'].operateAuthor,
  };
})
@Form.create({
  mapPropsToFields(props) {
    // console.log('mapPropsToFields', props);
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    // console.log('onFieldsChange', fields);
    props.dispatch({
      type: 'user-manage/formFieldChange',
      payload: fields,
    });
  },
})
export default class UserList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user-manage/fetchOrgTreeData',
      payload: {
        withPerson: false,
      },
    });
    dispatch({
      type: 'user-manage/fetchList',
      payload: {
        page: 1,
        page_size: PAGE_SIZE,
      },
    });
  }

  // 分页加载数据
  paginationChange = (pagination) => {
    this.props.dispatch({
      type: 'user-manage/fetchList',
      payload: {
        page: pagination.current,
        page_size: pagination.pageSize,
      },
    });
  }

  // 表单搜索提交
  handleSearch = (e, page) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'user-manage/fetchList',
          payload: {
            page: 1,
            page_size: PAGE_SIZE,
          },
        });
      }
    });
  }
  // 用户控制
  userControl(record) {
    confirm({
      title: `你确定要${record.status ? '禁用' : '启用'} 此用户? `,
      onOk: () => {
        this.props.dispatch({
          type: 'user-manage/userControl',
          payload: {
            user_id: record.user_id,
            status: !record.status,
          },
        });
      },
    });
  }
  // 重置
  handleReset = () => {
    this.props.dispatch({
      type: 'user-manage/formFieldChange',
      payload: {
        department_id: {
          value: undefined,
        },
        username: {
          value: undefined,
        },
      },
    });
  }
  // 数据源同步
  userSync = () => {
    this.props.dispatch({
      type: 'user-manage/sync',
    });
  }

  orgTreeFilter = (inputValue, treeNode) => {
    // console.log('treeNode:', treeNode);
    if (treeNode.props.title.indexOf(inputValue) > -1) {
      return true;
    }
  }
  // 渲染部门组织树
  renderOrgTree = (orgTreeData) => {
    const resultTreeNodes = orgTreeData.map((nodeItem, index) => {
      return (
        <TreeNode
          key={nodeItem.id}
          title={nodeItem.fullName}
          value={nodeItem.id}
        >
          {nodeItem.children ? this.renderOrgTree(nodeItem.children) : null}
        </TreeNode>
      );
    });
    return resultTreeNodes;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { listInfo, syncing, operateAuthor } = this.props;
    // console.log('operateAuthor-用户管理', operateAuthor);
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    const nameLayout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 19,
      },
    };
    const columns = [{
      title: '序号',
      key: 'index',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '姓名',
      dataIndex: 'user_name',
      key: 'user_name',
    }, {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '域账号',
      dataIndex: 'ldap_name',
      key: 'ldap_name',
    }, {
      title: '角色',
      dataIndex: 'role_name',
      key: 'role_name',
      render: (text) => {
        return text.join('/');
      },
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        return text ? '使用中' : '已禁用';
      },
    }, {
      title: '操作',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (text, record) => {
        return (
          <span>
            {
              operateAuthor.enabledisable_user ?
                <a onClick={this.userControl.bind(this, record)}>{record.status ? '禁用' : '启用'}</a> : ''
            }
          </span>
        );
      },
    }];

    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <h2>用户管理</h2>
          <Form
            className={styles.form}
            onSubmit={this.handleSearch}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={8} lg={12}>
                <FormItem
                  {...formItemLayout}
                  label="所属部门"
                  className={styles.labelStyle}
                >
                  {getFieldDecorator('department_id')(
                    <TreeSelect
                      placeholder="请输入"
                      // style={{ width: 200 }}
                      showSearch
                      allowClear
                      filterTreeNode={this.orgTreeFilter}
                    >
                      {this.renderOrgTree(this.props.orgTreeData)}
                    </TreeSelect>
                    )}
                </FormItem>
              </Col>
              <Col xl={8} lg={12}>
                <FormItem
                  {...nameLayout}
                  label="姓名"
                  className={styles.labelStyle}
                >
                  {getFieldDecorator('username')(
                    <Input placeholder="请输入" />
                    )}
                </FormItem>

              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem >
                  <Button type="primary" htmlType="submit" disabled={!!listInfo.isLoading}>搜索</Button>
                  <Button className={styles.btn} onClick={this.handleReset}>清除</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className={styles.btnWrapper}>
            <p className={utilStyles.left}>{`共搜索到 ${listInfo.pagination.total || 0} 条数据`}</p>
            {
              operateAuthor.sync_user ?
                <Button className={utilStyles.right} type="primary" disabled={!!syncing} onClick={this.userSync}>同步数据源</Button> : ''
            }

          </div>
          <Table
            loading={listInfo.isLoading || syncing}
            columns={columns}
            dataSource={listInfo.list}
            onChange={this.paginationChange}
            pagination={listInfo.pagination}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
