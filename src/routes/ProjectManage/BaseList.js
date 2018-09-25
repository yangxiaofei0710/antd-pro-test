import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Input, Form, Row, Col, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BaseList.less';
import { objKeyWrapper } from '../../utils/utils';

const FormItem = Form.Item;
const PAGE_SIZE = 20;
@connect((state) => {
  return {
    listInfo: state.serviceList.listInfo,
    searchFormFields: state.serviceList.searchFormFields,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'serviceList/formFieldChange',
      payload: fields,
    });
  },
})

export default class BaseList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceList/reste',
      payload: {
        module_name: {
          value: undefined,
        },
      },
    });
    dispatch({
      type: 'serviceList/loadListData',
      payload: {
        page: 1,
        page_size: PAGE_SIZE,
        publicservice: true, // true 请求公共服务
      },
    });
  }

  // 提交搜索表单
  handleSearch(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'serviceList/loadListData',
          payload: {
            page: 1,
            page_size: PAGE_SIZE,
            publicservice: true, // true 请求公共服务
          },
        });
      }
    });
  }


  // 重置搜索表单
  handleReset = () => {
    this.props.dispatch({
      type: 'serviceList/reste',
      payload: {
        module_name: {
          value: undefined,
        },
      },
    });
  }
  // 分页查询
  paginationChange(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceList/loadListData',
      payload: {
        page: page.current,
        page_size: PAGE_SIZE,
        publicservice: true, // true 请求公共服务
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { listInfo } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const columns = [{
      title: '序号',
      key: 'index',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '公共服务名称',
      dataIndex: 'module_name',
      key: 'module_name',
    }, {
      title: '归属的项目',
      dataIndex: 'project_name',
      key: 'project_name',
    }, {
      title: '使用中的项目',
      dataIndex: 'projects',
      key: 'projects',
    }];

    return (
      <PageHeaderLayout>
        <div>
          <h2>公共服务列表</h2>
          <div className={styles.wrapper}>
            <Form
              onSubmit={::this.handleSearch}
            >
              <FormItem
                {...formItemLayout}
                label="基础服务名称"
                className={styles.labelStyle}
              >
                {getFieldDecorator('module_name')(
                  <Input placeholder="请输入" />
                    )}
              </FormItem>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button className={styles.btn} onClick={::this.handleReset}>清除</Button>

            </Form>
          </div>
          <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total || 0} 条数据`}</p>
          <Table
            loading={listInfo.isLoading}
            columns={columns}
            dataSource={listInfo.list}
            onChange={::this.paginationChange}
            pagination={{
            total: listInfo.pagination.total,
            pageSize: listInfo.pagination.pageSize,
            current: listInfo.pagination.current,
          }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
