import React, { Component } from 'react';
import { Card, Table, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './OperateInfo.less';
import history from '../../../utils/history';

const PAGE_SIZE = 10;
@connect((state) => {
  return {
    operateInfo: state.operateManage.operateInfo,
    envname: state.operateManage.envname,
  };
})

export default class OperateInfo extends Component {
  componentWillMount() {
    if (!this.props.operateInfo.id) {
      history.push('/release-manage/operate-manage');
    }
  }
  // 分页
  paginationChange = (page) => {
    const { dispatch, operateInfo } = this.props;
    dispatch({
      type: 'operateManage/fetchOperateInfo',
      payload: {
        id: operateInfo.id,
        current_page: page.current,
        PAGE_SIZE: 10,
      },
    });
  }
  showInfo=(item) => {
    Modal.warning({
      title: '失败原因',
      content: item,
      style: { maxHeight: '500px' },
    });
  }
  render() {
    const { operateInfo, envname } = this.props;
    const { projectInfo, personInfo, releaseProgress } = operateInfo;
    const columns = [{
      title: '服务',
      dataIndex: 'module_name',
      key: 'module_name',
    }, {
      title: '服务属性',
      dataIndex: 'is_public',
      key: 'is_public',
      render: (text, record) => {
        return (
          <span>
            {record.is_public ? '公共服务' : '非公共服务'}
          </span>
        );
      },
    }, {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    }, {
      title: '文件',
      dataIndex: 'file_name',
      key: 'file_name',
    }, {
      title: '进度',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            {!record.flag ? <a onClick={this.showInfo.bind(this, record.reason)}>查看失败原因</a> : ''}
          </span>
        );
      },
    }];
    return (
      <PageHeaderLayout>
        <div className={styles.card}>
          <Card >
            <h2>{`${projectInfo.project_name}-${projectInfo.action}`}</h2>
            <div>
              <ul className={styles.projectInfo}>
                <li className={styles.info}>
                  操作状态：{projectInfo.status}
                </li>
              </ul>
              <ul className={styles.projectInfo}>
                <li className={styles.info}>
                  更新日期：{projectInfo.release_time}
                </li>
                <li className={styles.info}>
                  版本：{projectInfo.version}
                </li>
                <li className={styles.info}>
                  操作人：{projectInfo.release_user}
                </li>
              </ul>
            </div>
          </Card>
          <Card>
            <h2>人员信息</h2>
            <div>
              <ul className={styles.projectInfo}>
                <li className={styles.info}>
                  所属部门：{personInfo.department}
                </li>
                <li className={styles.info}>
                  负责人：{personInfo.supervisor_name}
                </li>
                <li className={styles.info}>
                  技术开发：{personInfo.develop_user_name ? personInfo.develop_user_name.join('/') : ''}
                </li>
              </ul>
              <ul className={styles.projectInfo}>
                <li className={styles.info}>
                  产品经理：{personInfo.product_manager_name ? personInfo.product_manager_name.join('/') : ''}
                </li>
                <li className={styles.info}>
                  运维：{personInfo.ops_user_name ? personInfo.ops_user_name.join('/') : ''}
                </li>
              </ul>
            </div>
          </Card>
          <Card>
            <h2>发布进度</h2>
            <Table
              columns={columns}
              dataSource={releaseProgress.list}
              pagination={releaseProgress.pagination}
              loading={releaseProgress.isLoading}
              onChange={this.paginationChange}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
