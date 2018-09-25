import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal, Spin, Table, Input, Form, Row, Col, Button, DatePicker, Pagination, TreeSelect } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import PersonTransferModal from '../../components/PersonTransferModal';
import AddEditModal from './AddEditModal';
import AuthorizeModal from './AuthorizeModal';
import { objKeyWrapper } from '../../utils/utils';
import styles from './RoleList.less';
import utilStyles from '../../utils/utils.less';

const { TreeNode } = TreeSelect;
const { confirm } = Modal;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const PAGE_SIZE = 20;
@connect((state) => {
  return {
    listInfo: state['role-manage'].listInfo,
    roleInfo: state['role-manage'].roleInfo,
    searchFormFields: state['role-manage'].searchFormFields,
    orgTreeData: state['role-manage'].orgTreeData,
    modalLoading: state['role-manage'].modalLoading,
    operatorLoading: state['role-manage'].operatorLoading,
    currentRoleId: state['role-manage'].currentRoleId,
    currentSelectedIds: state['role-manage'].currentSelectedIds,
    operateAuthor: state['role-manage'].operateAuthor,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'role-manage/formFieldChange',
      payload: fields,
    });
  },
})
export default class RoleList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      manageModalVisible: false, // 角色管理的弹窗显示控制
      editModalVisible: false, // 角色编辑和添加的弹窗显示控制
      authorizeModalVisible: false, // 角色授权的弹窗显示控制
      type: 'add', // 新增还是编辑
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role-manage/fetchOrgTreeData',
      payload: {
        withPerson: true,
      },
    });
    dispatch({
      type: 'role-manage/fetchList',
      payload: {
        page: 1,
        page_size: PAGE_SIZE,
      },
    });
  }
  onManageModalOk = async (selectedIds) => {
    await this.props.dispatch({
      type: 'role-manage/userForRole',
      payload: {
        role_id: this.props.currentRoleId,
        user_ids: selectedIds,
      },
    });
    this.setState({
      manageModalVisible: false,
    });
  }
  onManageModalCancal = () => {
    this.setState({
      manageModalVisible: false,
    });
  }
  onEditModalOk = async () => {
    await this.props.dispatch({
      type: 'role-manage/roleUpdate',
      payload: {
        type: this.state.type,
      },
    });
    this.setState({
      editModalVisible: false,
    });
  }

  onEditModalCancal = () => {
    this.setState({
      editModalVisible: false,
    });
  }
  // 确定授权
  onAuthorizeOk = async (item) => {
    await this.props.dispatch({
      type: 'role-manage/saveAuthories',
      payload: {
        permission_ids: item.filter((c) => { return Number(c); }),
      },
    });
    this.setState({
      authorizeModalVisible: false,
    });
  }
  // 取消授权
  onAuthorizeCancal = () => {
    this.setState({
      authorizeModalVisible: false,
    });
  }
  // 重置
  handleReset = () => {
    this.props.dispatch({
      type: 'role-manage/formFieldChange',
      payload: {
        role_name: {
          value: undefined,
        },
      },
    });
  }
  // 分页加载数据
  paginationChange = (pagination) => {
    this.props.dispatch({
      type: 'role-manage/fetchList',
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
          type: 'role-manage/fetchList',
          payload: {
            page: 1,
            page_size: PAGE_SIZE,
          },
        });
      }
    });
  }
  addRole(record) {
    this.props.dispatch({
      type: 'role-manage/roleDetailFieldsChange',
      payload: {
        role_name: {
          value: undefined,
        },
        desc: {
          value: undefined,
        },
      },
    });
    this.setState({
      editModalVisible: true,
      type: 'add',
    });
  }
  editRole(record) {
    const { role_id } = record; // eslint-disable-line
    this.setState({
      editModalVisible: true,
      type: 'edit',
    });
    this.props.dispatch({
      type: 'role-manage/changeCurrentRoleId',
      payload: role_id,
    });
    this.props.dispatch({
      type: 'role-manage/fetchRoleDetail',
      payload: {
        role_id,
      },
    });
  }
  authorRole(record) {
    const { role_id } = record; // eslint-disable-line
    this.setState({
      authorizeModalVisible: true,
    });
    this.props.dispatch({
      type: 'role-manage/changeCurrentRoleId',
      payload: role_id,
    });
    this.props.dispatch({
      type: 'role-manage/fetchAuthories',
      payload: {
        role_id,
      },
    });
  }
  manageRole(record) {
    this.setState({
      manageModalVisible: true,
    });
    const { role_id } = record; // eslint-disable-line
    this.setState({
      manageModalVisible: true,
    });
    this.props.dispatch({
      type: 'role-manage/fetchUsersByRole',
      payload: {
        role_id,
      },
    });
  }
  deleteRole(record) {
    Modal.confirm({
      title: '你确认要删除角色？',
      onOk: () => {
        this.props.dispatch({
          type: 'role-manage/deleteRole',
          payload: {
            role_id: record.role_id,
          },
        });
      },
      onCancel: () => {

      },
    });
  }
  orgTreeFilter = (inputValue, treeNode) => {
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
    const {
      listInfo,
      roleInfo,
      syncing,
      orgTreeData,
      modalLoading,
      currentSelectedIds,
      operateAuthor } = this.props;
    // console.log('operateAuthor-角色管理', operateAuthor);
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    const ButtonItemLayout = {
      wrapperCol: { span: 20, offet: 4 },
    };

    const columns = [{
      title: '序号',
      key: 'index',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
    }, {
      title: '备注',
      dataIndex: 'desc',
      key: 'desc',
    }, {
      title: '操作',
      dataIndex: 'role_id',
      key: 'role_id',
      render: (text, record) => {
        return (
          <Spin spinning={this.props.operatorLoading}>
            {
              operateAuthor.change_role ? <a className={styles.optBtn} onClick={this.editRole.bind(this, record)}>编辑</a> : ''
            }
            {
              operateAuthor.assign_role ? <a className={styles.optBtn} onClick={this.authorRole.bind(this, record)}>授权</a> : ''
            }
            {
              operateAuthor.manage_role ? <a className={styles.optBtn} onClick={this.manageRole.bind(this, record)}>管理</a> : ''
            }
            {
              operateAuthor.delete_role ? <a className={styles.optBtn} onClick={this.deleteRole.bind(this, record)}>删除</a> : ''
            }
          </Spin>
        );
      },
    }];

    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <h2>角色管理</h2>
          <Form
            className={styles.form}
            onSubmit={this.handleSearch}
          >
            <FormItem
              label="角色名称"
              className={styles.labelStyle}
              {...formItemLayout}
            >
              {getFieldDecorator('role_name')(
                <Input placeholder="请输入角色姓名" />
                    )}
            </FormItem>
            <FormItem >
              <Button type="primary" htmlType="submit" disabled={!!listInfo.isLoading}>搜索</Button>
              <Button className={styles.btn} onClick={this.handleReset}>清除</Button>
            </FormItem>
          </Form>
          <div className={styles.btnWrapper}>
            <p className={utilStyles.left}>{`共搜索到 ${listInfo.pagination.total || 0} 条数据`}</p>
            {
              operateAuthor.add_role ?
                <Button className={utilStyles.right} type="primary" onClick={this.addRole.bind(this)}>新增角色</Button> : ''
            }
          </div>
          <Table
            loading={listInfo.isLoading}
            columns={columns}
            dataSource={listInfo.list}
            onChange={this.paginationChange}
            pagination={listInfo.pagination}
          />
          <PersonTransferModal
            loading={modalLoading}
            treeData={orgTreeData}
            selectedIds={currentSelectedIds}
            visible={this.state.manageModalVisible}
            onOk={this.onManageModalOk}
            onCancel={this.onManageModalCancal}
          />
          <AddEditModal
            loading={roleInfo.isLoading}
            type={this.state.type}
            visible={this.state.editModalVisible}
            onOk={this.onEditModalOk}
            onCancel={this.onEditModalCancal}
          />
          <AuthorizeModal
            visible={this.state.authorizeModalVisible}
            onOk={this.onAuthorizeOk}
            onCancel={this.onAuthorizeCancal}
          />
          {/* <Modal
            title="角色授权"
            visible={this.state.authorizeModalVisible}
            onOk={() => {
              this.setState({
                authorizeModalVisible: false,
              });
            }}
            onCancel={() => {
              this.setState({
                authorizeModalVisible: false,
              });
            }}
          >
            <div />
          </Modal> */}
        </div>
      </PageHeaderLayout>
    );
  }
}
