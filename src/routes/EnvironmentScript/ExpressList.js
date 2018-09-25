import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, Table } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './EnvironmentType.less';
import { objKeyWrapper } from '../../utils/utils';
import AddExpressModal from './ExpressList/AddExpressModal';
import DeployEnvModal from './ExpressList/DeployEnvModal';
import ExpressInfo from './ExpressList/ExpressInfo';

const FormItem = Form.Item;
const PAGE_SIZE = 20;
@connect((state) => {
  return {
    listInfo: state.expressList.listInfo,
    searchFormFields: state.expressList.searchFormFields,
    operateAuthor: state.expressList.operateAuthor,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'expressList/searchFormFieldsChange',
      payload: fields,
    });
  },
})

export default class ExpressList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clickType: null,
      currentId: null,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'expressList/fetchList',
      payload: {
        current_page: 1,
        page_size: PAGE_SIZE,
      },
    });
    // 查询环境类型选择
    dispatch({
      type: 'expressList/fetchEnvList',
    });
  }
  // 分页
  handleChange = (page) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'expressList/fetchList',
          payload: {
            current_page: page.current,
            page_size: PAGE_SIZE,
          },
        });
      }
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'expressList/fetchList',
          payload: {
            page: 1,
            page_size: PAGE_SIZE,
          },
        });
      }
    });
  }
  // 环境部署
  deployEnv = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'expressList/changeDeployModalStatus',
      payload: true,
    });
    dispatch({
      type: 'expressList/deployEnvFromFieldsChange',
      payload: {
        middleware_name: { // 中间件名称
          value: item.middleware_name || undefined,
        },
        type_name: { // 中间件类型
          value: item.type_name || undefined,
        },
        middleware_id: {// 中间件id
          value: item.middleware_id || undefined,
        },
      },
    });
  }

  initSearchFrom = () => {
    this.props.dispatch({
      type: 'expressList/searchFormFieldsChange',
      payload: {
        search_text: {
          value: undefined,
        },
      },
    });
  }

  // 新增
  addExpress = (item, type) => {
    this.setState({
      clickType: type,
      currentId: item ? item.middleware_id : undefined,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'expressList/changeAddModalStatus',
      payload: true,
    });
    if (type == 'edit') {
      dispatch({
        type: 'expressList/addFormFieldsChange',
        payload: {
          middleware_name: { // 中间件名称
            value: item.middleware_name,
          },
          type_id: { // 类型id
            value: item.type_name,
          },
          comment: { // 备注
            value: item.comment,
          },
        },
      });
    }
  }

  // 显示详细信息
  showEnvInfo = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'expressList/changeInfoModalStatus',
      payload: true,
    });
    dispatch({
      type: 'expressList/fetchEnvInfo',
      payload: {
        middleware_id: item.middleware_id,
        env: 'dev',
        current_page: 1,
        page_size: 10,
      },
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 16 },
    };
    const { getFieldDecorator } = this.props.form;
    const { listInfo, searchFormFields, operateAuthor } = this.props;
    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '中间件名称',
      dataIndex: 'middleware_name',
      key: 'middleware_name',
    }, {
      title: '类型',
      dataIndex: 'type_name',
      key: 'type_name',
    }, {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            {operateAuthor.change_middlewares ? <a style={{ marginRight: '5px' }} onClick={this.addExpress.bind(this, record, 'edit')}>修改</a> : ''}
            {operateAuthor.deploy_middlewares ? <a style={{ marginRight: '5px' }} onClick={this.deployEnv.bind(this, record)}>环境部署</a> : ''}
            <a onClick={this.showEnvInfo.bind(this, record)}>查看详情</a>
          </span>
        );
      },
    }];

    return (
      <PageHeaderLayout>
        <div>
          <h2>中间件列表</h2>
          <div className={styles.wrapper}>
            <Form>
              <FormItem
                {...formItemLayout}
                label="搜索"
                className={styles.labelStyle}
              >
                {getFieldDecorator('search_text')(
                  <Input placeholder="请输入" />
                    )}
              </FormItem>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
              <Button className={styles.btn} onClick={this.initSearchFrom}>清除</Button>
            </Form>
          </div>
          <div className={styles.btnWrapper}>
            <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total} 条数据`}</p>
            {
              operateAuthor.add_middlewares ?
                <Button className={styles.rightBtn} type="primary" onClick={this.addExpress.bind(this, undefined, 'add')}>新增</Button>
              :
                ''
            }
          </div>
          <Table
            pagination={listInfo.pagination}
            columns={columns}
            dataSource={listInfo.list}
            onChange={this.handleChange}
            loading={listInfo.isLoading}
          />
          <AddExpressModal
            clickType={this.state.clickType}
            currentId={this.state.currentId}
          />
          <DeployEnvModal />
          <ExpressInfo />
        </div>
      </PageHeaderLayout>
    );
  }
}
