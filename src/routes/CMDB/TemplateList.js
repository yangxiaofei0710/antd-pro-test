import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Form, Row, Col, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { objKeyWrapper } from '../../utils/utils';
import styles from './TemplateList.less';
import CommonTable from '../../components/CommonTable';
import Edit from './TemplateListModal/edit';

const FormItem = Form.Item;
const PAGE_SIZE = 20;
@connect((state) => {
  return {
    searchFormFields: state.TemplateList.searchFormFields,
    listInfo: state.TemplateList.listInfo,
    operateAuthor: state.TemplateList.operateAuthor,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'TemplateList/searchFormFieldChange',
      payload: fields,
    });
  },
})
export default class TemplateList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'TemplateList/fetchListData',
      payload: {
        current_page: 1,
        page_size: PAGE_SIZE,
      },
    });
  }
  handleReset = () => {

  }
  // 分页查询
  paginationChange = (page) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'TemplateList/fetchListData',
          payload: {
            current_page: page.current,
            page_size: PAGE_SIZE,
          },
        });
      }
    });
  }
  // 搜索按钮查询
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'TemplateList/fetchListData',
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
      type: 'TemplateList/searchFormFieldChange',
      payload: {
        search_key: {
          value: undefined,
        },
      },
    });
  }

  handleEdit = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TemplateList/changeModalStatus',
      payload: {
        bol: true,
        id: item.dic_id,
      },
    });
    dispatch({
      type: 'TemplateList/saveDicContentObj',
      payload: item.dic_content,
      dicName: item.dic_name,
    });
  }

  render() {
    const { listInfo, operateAuthor } = this.props;
    // console.log('operateAuthor-模板字段', operateAuthor);
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '字段名称',
      dataIndex: 'dic_name',
      key: 'dic_name',
    }, {
      title: '字段内容',
      dataIndex: 'dic_content',
      key: 'dic_content',
      render: (text, record) => {
        return (
          <span>
            {record.dic_content.join(' , ')}
          </span>
        );
      },
    }, {
      title: '操作',
      // dataIndex: 'content',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            {
              operateAuthor.change_datadicname ?
                <a onClick={this.handleEdit.bind(this, record)}>编辑</a> : ''
            }
          </span>
        );
      },
    }];

    return (
      <PageHeaderLayout>
        <div>
          <h2>模板字段管理</h2>
          <div className={styles.wrapper}>
            <Form >
              <FormItem
                {...formItemLayout}
                label="搜索"
                className={styles.labelStyle}
              >
                {getFieldDecorator('search_key')(
                  <Input placeholder="请输入" />
                    )}
              </FormItem>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
              <Button className={styles.btn} onClick={this.handleReset}>清除</Button>
            </Form>
          </div>
          <div className={styles.btnWrapper}>
            <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total} 条数据`}</p>
          </div>
          <CommonTable
            columns={columns}
            tableData={listInfo.list}
            pagination={listInfo.pagination}
            loading={listInfo.isLoading}
            onChange={this.paginationChange}
          />
          <Edit />
        </div>
      </PageHeaderLayout>
    );
  }
}
