import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Modal } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CommonSearchForm from '../../../components/CommonSearchForm';
import styles from './ConfigTemplate.less';
import AddEditModal from './ConfigTemplate/AddEditModal';

const PAGE_SIZE = 20;
const { confirm } = Modal;
@connect((state) => {
  return {
    listInfo: state.common.listInfo,
    operateAuthor: state.common.operateAuthor,
  };
})

export default class ConfigTemplate extends Component {
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
      type: 'common/initListInfo',
    });
    dispatch({
      type: 'common/formFieldChange',
      payload: {
        search_text: {
          value: undefined,
        },
      },
    });
    dispatch({
      type: 'common/fetchList',
      payload: {
        current_page: 1,
        page_size: PAGE_SIZE,
      },
      url: 'fetchTemplateList',
    });
  }
  // 分页
  paginationChange = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/fetchList',
      payload: {
        current_page: page.current,
        page_size: PAGE_SIZE,
      },
      url: 'fetchTemplateList',
    });
  }
  // 搜索
  handleSubmit = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/fetchList',
      payload: {
        current_page: 1,
        page_size: PAGE_SIZE,
      },
      url: 'fetchTemplateList',
    });
  }
  addEdit = (type, item) => {
    this.setState({
      clickType: type,
      currentId: item,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'common/changeCommonModalStauts',
      payload: true,
    });
    if (type == 'edit') {
      dispatch({
        type: 'configManage/templateInfo',
        payload: { id: item },
      });
    }
  }
  handleDelete = (id) => {
    const { dispatch } = this.props;
    confirm({
      title: '你确定要删除',
      onOk() {
        dispatch({
          type: 'configManage/deleteTemplate',
          payload: {
            id,
          },
        });
      },
      onCancel() {},
    });
  }
  render() {
    const { listInfo, operateAuthor } = this.props;
    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '模板名称',
      dataIndex: 'templatename',
      key: 'templatename',
    }, {
      title: '更新时间',
      dataIndex: 'updatetime',
      key: 'updatetime',
    }, {
      title: '更新人',
      dataIndex: 'updateuser',
      key: 'updateuser',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            {operateAuthor.change_templatesfield ? <a style={{ marginRight: '5px' }} onClick={this.addEdit.bind(this, 'edit', record.id)}>编辑</a> : ''}
            {operateAuthor.delete_templatesfield ? <a onClick={this.handleDelete.bind(this, record.id)}>删除</a> : ''}
          </span>
        );
      },
    }];
    return (
      <PageHeaderLayout>
        <div>
          <h2>配置模板</h2>
          <CommonSearchForm
            search={this.handleSubmit}
          />
          <div className={styles.btnWrapper}>
            <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total || 0} 条数据`}</p>
            {
              operateAuthor.add_templatesfield ?
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.rightBtn}
                  onClick={this.addEdit.bind(this, 'add', undefined)}
                >
                  新增
                </Button>
              :
              ''
            }
          </div>
          <Table
            columns={columns}
            dataSource={listInfo.list}
            pagination={listInfo.pagination}
            loading={listInfo.isLoading}
            onChange={this.paginationChange}
          />
          <AddEditModal
            clickType={this.state.clickType}
            currentId={this.state.currentId}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
