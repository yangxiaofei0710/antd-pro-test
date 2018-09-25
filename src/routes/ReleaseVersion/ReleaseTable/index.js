import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Input, Form, Row, Col, Button, DatePicker, Paginatio, TreeSelect, Modal, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import CommonSearchForm from '../../../components/CommonSearchForm';
import styles from './index.less';
import { objKeyWrapper } from '../../../utils/utils';
import RollbackModal from './RollbackModal/index';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;
const PAGE_SIZE = 20;
const { confirm } = Modal;

@connect((state) => {
  return {
    listInfo: state.common.listInfo,
    operateAuthor: state.common.operateAuthor,
    envname: state.release.envname,
    organizeTree: state.projectList.organizeTree,
    searchFormFields: state.release.searchFormFields,
    rebootLoading: state.release.rebootLoading,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, changedFields) {
    props.dispatch({
      type: 'release/formFieldChange',
      payload: changedFields,
    });
  },
})
export default class EnvTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      projectInfo: undefined,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // 加载到部门
    dispatch({
      type: 'projectList/fetchOrganizeTree',
      payload: {
        withPerson: false,
        loadType: 'department',
      },
    });
  }
  // 分页
  paginationChange = (page) => {
    // console.log('page', page, this.props.selectKey);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 格式化搜索框日期
        const rangeTimeValue = values.createTime;
        const { dispatch, envname } = this.props;
        dispatch({
          type: 'common/fetchList',
          payload: {
            env: envname,
            current_page: page.current,
            page_size: PAGE_SIZE,
            project_name: values.project_name,
            department_id: values.department_id,
            starttime: rangeTimeValue && rangeTimeValue.length > 0 ? rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
            endtime: rangeTimeValue && rangeTimeValue.length > 0 ? rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
          },
          url: 'fetchReleaseList',
        });
      }
    });
  }
  // 表单搜索提交
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 格式化搜索框日期
        const rangeTimeValue = values.createTime;
        const { dispatch, envname } = this.props;
        dispatch({
          type: 'common/fetchList',
          payload: {
            env: envname,
            current_page: 1,
            page_size: PAGE_SIZE,
            project_name: values.project_name,
            department_id: values.department_id,
            starttime: rangeTimeValue && rangeTimeValue.length > 0 ? rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
            endtime: rangeTimeValue && rangeTimeValue.length > 0 ? rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
          },
          url: 'fetchReleaseList',
        });
      }
    });
  }
  // 重置搜索表单
  handleReset = () => {
    this.props.dispatch({
      type: 'release/formFieldChange',
      payload: {
        project_name: {
          value: undefined,
        },
        createTime: {
          value: undefined,
        },
        department_id: {
          value: undefined,
        },
      },
    });
  }

  // 部门热搜
  orgTreeFilter = (inputValue, treeNode) => {
    // console.log('treeNode:', treeNode);
    if (treeNode.props.title.indexOf(inputValue) > -1) {
      return true;
    }
  }
  handleRelease = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'release/changeProjectId',
      payload: item.id,
    });
    dispatch({
      type: 'release/changeProjectName',
      payload: item.project_name,
    });
    dispatch(routerRedux.push('/release-manage/operate-release'));
  }
  // 重启
  handleReboot = (item) => {
    const { dispatch, envname } = this.props;
    Modal.confirm({
      title: '你确认要重启吗？',
      onOk: () => {
        dispatch({
          type: 'release/reboot',
          payload: {
            id: item.id,
            env: envname,
          },
        });
      },
      onCancel: () => {},
    });
  }
  // 回滚
  async handleRollback(item) {
    const { dispatch, envname } = this.props;
    await this.setState({
      projectInfo: {
        id: item.id,
        name: item.project_name,
        envname: this.props.envname,
      },
    });
    dispatch({
      type: 'release/fetchRollbackList',
      payload: {
        id: item.id,
        env: envname,
      },
    });
  }
  // 渲染部门选择类型树
  renderTreeNodes = (treeData) => {
    const resultTreeNodes = treeData.map((nodeItem, index) => {
      return (
        <TreeNode
          key={nodeItem.id}
          title={nodeItem.fullName}
          value={nodeItem.id}
        >
          {nodeItem.children ? this.renderTreeNodes(nodeItem.children) : null}
        </TreeNode>
      );
    });
    return resultTreeNodes;
  }

  render() {
    // console.log('listInfo', this.props.listInfo);
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    const { listInfo, organizeTree, searchFormFields, operateAuthor, rebootLoading } = this.props;
    // console.log('searchFormFields', searchFormFields);
    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '项目名称',
      dataIndex: 'project_name',
      key: 'project_name',
    }, {
      title: '所属部门',
      dataIndex: 'departmentname',
      key: 'departmentname',
    }, {
      title: '负责人',
      dataIndex: 'supervisor',
      key: 'supervisor',
    }, {
      title: '产品经理',
      dataIndex: 'projectmanager',
      key: 'projectmanager',
    }, {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
    }, {
      title: '当前版本号',
      dataIndex: 'version',
      key: 'version',
    }, {
      title: '创建时间',
      dataIndex: 'date_joined',
      key: 'date_joined',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            {
              operateAuthor.release_projectrelease ?
                <a
                  onClick={this.handleRelease.bind(this, record)}
                  style={{ marginRight: '10px' }}
                >
                  发布
                </a>
              :
                ''
            }
            <a
              onClick={this.handleReboot.bind(this, record)}
              style={{ marginRight: '10px' }}
            >
              重启
            </a>
            <a onClick={this.handleRollback.bind(this, record)}>回滚</a>
          </span>
        );
      },
    }];
    return (
      <div>
        <Spin
          spinning={rebootLoading}
          tip="重启中..."
        >
          <h2>{this.state.title}</h2>
          <div className={styles.wrapper}>
            <Form
              onSubmit={this.handleSearch}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col xl={8} lg={12}>
                  <FormItem
                    {...formItemLayout}
                    label="项目名称"
                    className={styles.labelStyle}
                  >
                    {getFieldDecorator('project_name')(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col xl={8} lg={12}>
                  <FormItem
                    {...formItemLayout}
                    label="所属部门"
                    className={styles.labelStyle}
                  >
                    {getFieldDecorator('department_id')(
                      // <Input placeholder="请输入" />
                      <TreeSelect
                        placeholder="请选择"
                        showSearch
                        allowClear
                        filterTreeNode={this.orgTreeFilter}
                      >
                        {this.renderTreeNodes(organizeTree)}
                      </TreeSelect>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col xl={8} lg={12}>
                  <FormItem
                    {...formItemLayout}
                    label="创建时间"
                    className={styles.labelStyle}
                  >
                    {getFieldDecorator('createTime')(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24} >
                  <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                  <Button className={styles.btn} onClick={this.handleReset}>清除</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.btnWrapper}>
            <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total} 条数据`}</p>
          </div>
          <Table
            columns={columns}
            dataSource={listInfo.list}
            pagination={listInfo.pagination}
            loading={listInfo.isLoading}
            onChange={this.paginationChange}
          />
          <RollbackModal projectInfo={this.state.projectInfo} />
        </Spin>
      </div>
    );
  }
}

