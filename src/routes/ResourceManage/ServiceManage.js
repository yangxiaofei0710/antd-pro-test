import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, Table, Modal, Spin, Message } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ServiceManage.less';
// import AddModal from './serviceManage/AddModal';
import AddModal from '../../components/CommonAddEditModal';
import ServiceInfo from './serviceManage/ServiceInfo';
import { objKeyWrapper, getObjKey, deleteArrItem } from '../../utils/utils';
import BasicConfig from './serviceManage/BasicConfig';
import SystemConfig from './serviceManage/SystemConfig';
import ConfirmMessage from './serviceManage/ConfirmeMessage';

const FormItem = Form.Item;
const { confirm } = Modal;
const PAGE_SIZE = 20;
@connect((state) => {
  return {
    modalStatus: state.serviceManage.modalStatus,
    searchFormFields: state.serviceManage.searchFormFields,
    listInfo: state.serviceManage.listInfo,
    releaseModal: state.serviceManage.releaseModal,
    releaseServiceId: state.serviceManage.releaseServiceId,
    loading: state.serviceManage.loading,
    addFormFields: state.serviceManage.addFormFields, // addmodal 弹框表格受控
    checkedPassword: state.serviceManage.checkedPassword, // 密码是否通过校验标识
    checkedHostName: state.serviceManage.checkedHostName, // 机名是否通过校验标识
    checkedComment: state.serviceManage.checkedComment, // 备注是否通过校验标识
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'serviceManage/formFieldChange',
      payload: fields,
    });
  },
})
export default class ServiceManage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clickType: '',
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceManage/fetchList',
      payload: {
        current_page: 1,
        page_size: PAGE_SIZE,
      },
    });
    // const { dispatch } = this.props;
    dispatch({
      type: 'serviceManage/fetchDataDictionary',
    });
    dispatch({
      type: 'serviceManage/fetchVpc',
    });
  }
  // 搜索
  handleSearch = (e, page) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'serviceManage/fetchList',
          payload: {
            current_page: 1,
            page_size: PAGE_SIZE,
          },
        });
      }
    });
  }
  handleAdd = () => {
    const { dispatch } = this.props;
    this.setState({
      clickType: 'add',
    });
    dispatch({
      type: 'serviceManage/changeStatus',
      payload: true,
    });
  }
  // 清除重置
  handleReset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceManage/formFieldChange',
      payload: {
        search_text: {
          value: undefined,
        },
      },
    });
  }
  // 分页查询
  paginationChange = (page) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'serviceManage/fetchList',
          payload: {
            current_page: page.current,
            page_size: PAGE_SIZE,
          },
        });
      }
    });
  }
  // 点击查看详情
  showSeriveInfo = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceManage/changeInfoStatus',
      payload: true,
      currentId: item.id,
    });
  }
  // 停用启用
  controlService = (item) => {
    let status = null;
    if (item.status == '启动中' || item.status == '运行中') {
      status = '停用';
    } else {
      status = '启动';
    }
    confirm({
      title: `你确定要${status}此服务?`,
      onOk: () => {
        const { dispatch } = this.props;
        if (item.status == '运行中' || item.status == '启动中') { // 停止服务器
          dispatch({
            type: 'serviceManage/stopService',
            payload: {
              id: item.id,
            },
          });
        } else { // 启动服务器
          dispatch({
            type: 'serviceManage/recoverService',
            payload: {
              id: item.id,
            },
          });
        }
      },
    });
  }

  // 释放服务
  releaseService = (item, bol) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceManage/releaseService',
      payload: {
        id: item,
        backups: bol,
      },
    });
  }

  // 显示释放服务器modal
  showReleaseService = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceManage/saveReleaseServiceId',
      payload: {
        id: item.id,
      },
      bol: true,
    });
  }

  // 关闭释放服务器modal
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceManage/saveReleaseServiceId',
      payload: {
        id: null,
      },
      bol: false,
    });
  }

  // 关闭modal
  closeModal = (fun) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceManage/changeStatus',
      payload: false,
      callback: fun,
    });
  }
  // modal 确定新增
  handleSubmit = (item, fun) => {
    let arrOut = [];
    const loginpassword = item.loginpassword.value;
    const confirmpassword = item.confirmpassword.value;

    arrOut = getObjKey(item);
    if (item.useoutip.value === false) { // 如果不使用私网，不考虑带宽的值
      arrOut = deleteArrItem(arrOut, 'networkband');
      arrOut = deleteArrItem(arrOut, 'bandtype');
    }
    if (arrOut.length > 0) { // arrOut 数组长度大于0 表单没有填写完整
      Message.error('请校验数据是否填写完整');
    } else if (loginpassword !== confirmpassword) { // 两次密码输入不一致
      Message.error('请校验输入密码是否一致');
    } else if (!this.props.checkedPassword) {
      Message.error('输入密码格式不正确');
    } else if (!this.props.checkedHostName) {
      Message.error('输入主机名格式不正确');
    } else if (!this.props.checkedComment) {
      Message.error('输入备注格式不正确');
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: 'serviceManage/addService',
        callback: fun, // 新增成功后，关闭modal， 走马灯显示第一页
      });
    }
  }


  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const { getFieldDecorator } = this.props.form;
    const { modalStatus, listInfo, releaseModal,
      releaseServiceId, loading, addFormFields } = this.props;
    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '主机名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '公网IP地址',
      dataIndex: 'outterip',
      key: 'outterip',
    }, {
      title: '内网IP地址',
      dataIndex: 'innerip',
      key: 'innerip',
    }, {
      title: '配置',
      dataIndex: 'config',
      key: 'config',
    }, {
      title: '用途',
      dataIndex: 'usage',
      key: 'usage',
    }, {
      title: '环境',
      dataIndex: 'env',
      key: 'env',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            <a
              onClick={this.showSeriveInfo.bind(this, record)}
              className={styles.operation}
            >
              查看
            </a>
            <a
              onClick={record.status == '运行中' || record.status == '已停止' ? this.controlService.bind(this, record) : () => {}}
              className={record.status == '运行中' || record.status == '已停止' ? styles.operation : styles.disOperation}
            >
              {record.status == '启动中' || record.status == '运行中' ? '停止' : '运行'}
            </a>
            <a
              onClick={record.status == '运行中' ? () => { console.log('运行中不能释放'); } : this.showReleaseService.bind(this, record)}
              className={record.status == '运行中' ? styles.disOperation : styles.operation}
            >
              释放
            </a>
          </span>
        );
      },
    }];

    return (
      <PageHeaderLayout>
        <div>
          <h2>服务器资源</h2>
          <div className={styles.wrapper}>
            <Form
              onSubmit={this.handleSearch}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col xl={8} lg={24}>
                  <FormItem
                    {...formItemLayout}
                    label="搜索"
                    className={styles.labelStyle}
                  >
                    {getFieldDecorator('search_text')(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24} >
                  <Button type="primary" htmlType="submit" >搜索</Button>
                  <Button className={styles.btn} onClick={this.handleReset}>清除</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.btnWrapper}>
            <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total} 条数据`}</p>
            <Button className={styles.rightBtn} type="primary" onClick={this.handleAdd}>新增</Button>
          </div>
          <Table
            loading={listInfo.isLoading}
            columns={columns}
            dataSource={listInfo.list}
            // pagination={listInfo.pagination}
            pagination={{
              total: listInfo.pagination.total,
              pageSize: listInfo.pagination.pageSize,
              current: listInfo.pagination.current_page,
            }}
            onChange={this.paginationChange}
          />
          <AddModal
            visibal={modalStatus} // 控制显示modal
            clickType={this.state.clickType}
            loading={loading}
            handleCancel={this.closeModal} // 关闭modal
            handleSubmit={this.handleSubmit.bind(this, addFormFields)}
            BasicPage={BasicConfig}
            SystemPage={SystemConfig}
            ConfirmPage={ConfirmMessage}
          />
          <ServiceInfo />
          <Modal
            visible={releaseModal}
            footer={false}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Spin spinning={loading}>
              <p>该操作为释放资源，是否同时执行快照备份</p>
              <div className={styles.footerBtn}>
                <Button type="primary" onClick={this.releaseService.bind(this, releaseServiceId, true)}>是</Button>
                <Button onClick={this.releaseService.bind(this, releaseServiceId, false)}>否</Button>
                <Button onClick={this.handleCancel}>取消</Button>
              </div>
            </Spin>

          </Modal>
        </div>
      </PageHeaderLayout>
    );
  }
}
