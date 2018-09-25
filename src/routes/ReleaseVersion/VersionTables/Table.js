import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Message } from 'antd';
import { routerRedux } from 'dva/router';
import CommonSearchForm from '../../../components/CommonSearchForm';
import styles from './index.less';

const PAGE_SIZE = 20;
@connect((state) => {
  return {
    listInfo: state.common.listInfo,
    operateAuthor: state.common.operateAuthor,
    selectKey: state.common.selectKey,
    envname: state.versionManage.envname,
  };
})

export default class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // 分页
  paginationChange = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/fetchList',
      payload: {
        project_id: this.props.selectKey,
        current_page: page.current,
        page_size: PAGE_SIZE,
        env: this.props.envname,
      },
      url: 'fetchVersionList',
    });
  }

  handleSubmit = (item) => {
    const { dispatch, selectKey } = this.props;
    if (!selectKey) {
      Message.error('请选择项目');
    } else {
      dispatch({
        type: 'common/fetchList',
        payload: {
          project_id: this.props.selectKey,
          current_page: 1,
          page_size: PAGE_SIZE,
          env: this.props.envname,
        },
        url: 'fetchVersionList',
      });
    }
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
      title: '版本编号',
      dataIndex: 'version',
      key: 'version',
    }, {
      title: '发布时间',
      dataIndex: 'releasetime',
      key: 'releasetime',
    }, {
      title: '发布人',
      dataIndex: 'releaseuser',
      key: 'releaseuser',
    }];
    return (
      <div>
        <CommonSearchForm
          search={this.handleSubmit}
        />
        <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total} 条数据`}</p>
        <Table
          columns={columns}
          dataSource={listInfo.list}
          pagination={listInfo.pagination}
          loading={listInfo.isLoading}
          onChange={this.paginationChange}
        />
      </div>
    );
  }
}
