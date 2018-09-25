import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, message, Button } from 'antd';

import CommonSearchForm from '../../../components/CommonSearchForm';
import styles from './index.less';

const PAGE_SIZE = 20;
@connect((state) => {
  return {
    listInfo: state.common.listInfo,
    operateAuthor: state.common.operateAuthor,
    selectKey: state.common.selectKey,
    envname: state.operateManage.envname,
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
      url: 'fetchOperateList',
    });
  }

  handleSubmit = (item) => {
    const { dispatch, selectKey } = this.props;
    if (!selectKey) {
      message.warning('请选择项目');
    } else {
      dispatch({
        type: 'common/fetchList',
        payload: {
          project_id: this.props.selectKey,
          current_page: 1,
          page_size: PAGE_SIZE,
          env: this.props.envname,
        },
        url: 'fetchOperateList',
      });
    }
  }

  // 部署失败后，标注成功
  handleSuccess = (item) => {
    const { dispatch } = this.props;
    let type;
    switch (item.status) {
      case '发布失败':
        type = 'release';
        break;
      case '重启失败':
        type = 'reboot';
        break;
      case '回滚失败':
        type = 'rollback';
        break;
      default:
        break;
    }
    dispatch({
      type: 'operateManage/handleSuccess',
      payload: {
        release_id: item.id,
        type,
      },
    });
  }

  // 显示详情
  showInfo(item) {
    const { dispatch } = this.props;
    dispatch({
      type: 'operateManage/fetchOperateInfo',
      payload: {
        id: item.id,
        current_page: 1,
        page_size: 10,
      },
    });
  }

  // 同步列表
  sync = () => {
    const { dispatch, selectKey } = this.props;
    if (selectKey) {
      dispatch({
        type: 'operateManage/sync',
      });
    } else {
      message.warning('请选择项目');
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
      title: '操作',
      dataIndex: 'action',
      key: 'action',
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
            <a style={{ marginRight: '10px' }} onClick={this.showInfo.bind(this, record)}>查看详情</a>
            {
              operateAuthor.marksuccess_projectversion && !record.releasestatus ?
                <a onClick={this.handleSuccess.bind(this, record)}>标注成功</a>
              :
                ''
            }
          </span>
        );
      },
    }];
    return (
      <div>
        <CommonSearchForm
          search={this.handleSubmit}
        />
        <div className={styles.btnWrapper}>
          <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total} 条数据`}</p>
          <Button type="primary" htmlType="submit" className={styles.rightBtn} onClick={this.sync}>同步</Button>
        </div>
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
