import React, { Component } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';

@connect((state) => {
  return {
    expressInfo: state.expressList.expressInfo,
    operateAuthor: state.expressList.operateAuthor,
  };
})

export default class EnvTable extends Component {
  // 重新部署
  reDeploy = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'expressList/redeploy',
      payload: {
        deploy_id: id,
      },
      middlewareId: this.props.expressInfo.middleware_info.middleware_id,
    });
  }
  // 分页
  paginationChange = (page) => {
    const { dispatch, expressInfo, env } = this.props;
    dispatch({
      type: 'expressList/fetchEnvInfo',
      payload: {
        middleware_id: expressInfo.middleware_info.middleware_id,
        env,
        current_page: page.current,
        page_size: 10,
      },
    });
  }
  render() {
    const { tableData, operateAuthor, expressInfo } = this.props;
    // console.log('expressInfo', expressInfo);
    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: 'IP地址',
      dataIndex: 'deploy_ip',
      key: 'deploy_ip',
    }, {
      title: '部署状态',
      dataIndex: 'deploy_status',
      key: 'deploy_status',
    }, {
      title: '部署时间',
      dataIndex: 'deploy_date',
      key: 'deploy_date',
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            {
              operateAuthor.deploy_middlewares && record.deploy_status == '部署失败' ?
                <a onClick={this.reDeploy.bind(this, record.id)}>重新部署</a>
              :
                ''
            }
          </span>
        );
      },
    }];
    return (
      <Table
        dataSource={tableData ? tableData.msgdata : []}
        columns={columns}
        pagination={{
            current: tableData ? tableData.current_page : 1,
            pageSize: tableData ? tableData.page_size : 10,
            total: tableData ? tableData.total : 0,
           }}
        onChange={this.paginationChange}
      />
    );
  }
}
