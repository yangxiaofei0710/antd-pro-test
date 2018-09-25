import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, Table, Modal } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './EnvironmentType.less';
import { objKeyWrapper } from '../../utils/utils';
import AddEditModal from './EnvironmentType/AddEditModal';
import EnvInfo from './EnvironmentType/EnvInfo';

const FormItem = Form.Item;
const PAGE_SIZE = 20;
const { confirm } = Modal;
@connect((state) => {
  return {
    listInfo: state.environmentType.listInfo,
    searchFormFields: state.environmentType.searchFormFields,
    operateAuthor: state.environmentType.operateAuthor,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'environmentType/formFieldChange',
      payload: fields,
    });
  },
})
export default class EnvironmentType extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentId: undefined,
      envName: undefined,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'environmentType/fetchList',
      payload: {
        current_page: 1,
        page_size: PAGE_SIZE,
      },
    });
  }
  // 分页查询
  paginationChange = (page) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'environmentType/fetchList',
          payload: {
            current_page: page.current,
            page_size: PAGE_SIZE,
          },
        });
      }
    });
  }
  // 搜索
  handleSearch = (e, page) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'environmentType/fetchList',
          payload: {
            current_page: 1,
            page_size: PAGE_SIZE,
          },
        });
      }
    });
  }
  // 清除重置
  handleReset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'environmentType/formFieldChange',
      payload: {
        env_key: {
          value: undefined,
        },
      },
    });
  }
  // 新增/编辑
  addEdit = (clickType, currentId) => {
    // console.log(currentId);
    this.setState({
      currentId,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'environmentType/addEditControl',
      payload: {
        clickType,
        loading: clickType != 'add',
        isShow: true,
      },
      envId: currentId,
    });
  }
  // 删除
  handleDelete = (id) => {
    // console.log('id', id);
    confirm({
      title: '您确定要删除',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'environmentType/deleteEnv',
          payload: id,
        });
      },
    });
  }

  // 查看详情
  showInfo(currentId, currentName) {
    // console.log(this);
    this.setState({
      envName: currentName,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'environmentType/EnvInfoModla',
      payload: currentId,
    });
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 16 },
    };
    const { getFieldDecorator } = this.props.form;
    const { listInfo, operateAuthor } = this.props;
    // console.log(listInfo);
    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '类型名称',
      dataIndex: 'env_name',
      key: 'env_name',
    }, {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            <a style={{ marginRight: '5px' }} onClick={this.showInfo.bind(this, record.env_id, record.env_name)}>查看</a>
            {operateAuthor.change_envtype ? <a style={{ marginRight: '5px' }} onClick={this.addEdit.bind(this, 'edit', record.env_id)}>编辑</a> : ''}
            {operateAuthor.delete_envtype ? <a onClick={this.handleDelete.bind(this, record.env_id)}>删除</a> : ''}
          </span>
        );
      },
    }];
    return (
      <PageHeaderLayout>
        <div>
          <h2>环境类型</h2>
          <div className={styles.wrapper}>
            <Form onSubmit={this.handleSearch}>
              <FormItem
                {...formItemLayout}
                label="搜索"
                className={styles.labelStyle}
              >
                {getFieldDecorator('env_key')(
                  <Input placeholder="请输入" />
                    )}
              </FormItem>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button className={styles.btn} onClick={this.handleReset}>清除</Button>
            </Form>
          </div>
          <div className={styles.btnWrapper}>
            <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total} 条数据`}</p>
            {operateAuthor.add_envtype ? <Button className={styles.rightBtn} type="primary" onClick={this.addEdit.bind(this, 'add')}>新增</Button> : ''}
          </div>
          <Table
            loading={listInfo.isLoading}
            columns={columns}
            dataSource={listInfo.list}
            pagination={listInfo.pagination}
            onChange={this.paginationChange}
          />
          <AddEditModal currentId={this.state.currentId} />
          <EnvInfo envName={this.state.envName} />
        </div>
      </PageHeaderLayout>
    );
  }
}
