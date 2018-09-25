import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CommonSearchForm from '../../../components/CommonSearchForm';
import CommonTable from '../../../components/CommonTable';
import styles from './ConfigTemplate.less';

const PAGE_SIZE = 20;
@connect((state) => {
  return {
    listInfo: state.common.listInfo,
  };
})
export default class ChangeRecord extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/fetchList',
      payload: {
        current_page: 1,
        page_size: PAGE_SIZE,
      },
      url: 'changeRecord',
    });
  }
    paginationChange=(page) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'common/fetchList',
        payload: {
          current_page: page.current,
          page_size: PAGE_SIZE,
        },
        url: 'changeRecord',
      });
    }
    // 搜索
    handleSubmit = (item) => {
      const { dispatch, listInfo } = this.props;
      dispatch({
        type: 'common/fetchList',
        payload: {
          current_page: listInfo.pagination.current,
          page_size: PAGE_SIZE,
        },
        url: 'changeRecord',
      });
    }
    render() {
      const { listInfo } = this.props;
      const columns = [{
        title: '序号',
        key: 'id',
        render: (text, record, index) => {
          return index + 1;
        },
      }, {
        title: '文件名',
        dataIndex: 'logname',
        key: 'logname',
      }, {
        title: '变更操作',
        dataIndex: 'action',
        key: 'action',
      }, {
        title: '更新时间',
        dataIndex: 'starttime',
        key: 'starttime',
      }, {
        title: '更新人',
        dataIndex: 'username',
        key: 'username',
      }];
      return (
        <PageHeaderLayout>
          <div>
            <h2>变更记录</h2>
            <CommonSearchForm
              search={this.handleSubmit}
            />
            <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total || 0} 条数据`}</p>
            <CommonTable
              columns={columns}
              tableData={listInfo.list}
              pagination={listInfo.pagination}
              loading={listInfo.isLoading}
              onChange={this.paginationChange}
            />
          </div>
        </PageHeaderLayout>
      );
    }
}
