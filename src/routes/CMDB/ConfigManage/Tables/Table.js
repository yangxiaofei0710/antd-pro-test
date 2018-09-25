import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Message } from 'antd';
import { routerRedux } from 'dva/router';
import CommonSearchForm from '../../../../components/CommonSearchForm';
import styles from './index.less';

const PAGE_SIZE = 20;
@connect((state) => {
  return {
    listInfo: state.common.listInfo,
    operateAuthor: state.common.operateAuthor,
    selectKey: state.common.selectKey,
    envname: state.configManage.envname,
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
        id: this.props.selectKey,
        current_page: page.current,
        page_size: PAGE_SIZE,
        envname: this.props.envname,
      },
      url: 'fetchConfigList',
    });
  }
  handleSubmit = (item) => {
    const { dispatch, selectKey } = this.props;
    if (!selectKey) {
      Message.error('请选择服务');
    } else {
      dispatch({
        type: 'common/fetchList',
        payload: {
          id: selectKey,
          current_page: 1,
          page_size: PAGE_SIZE,
          envname: this.props.envname,
        },
        url: 'fetchConfigList',
      });
    }
  }
  // 编译
  handleCompile(item) {
    const { dispatch, envname } = this.props;
    let env;
    switch (envname) {
      case '生产环境':
        env = 'pro';
        break;
      case '预发环境':
        env = 'pre';
        break;
      case '测试环境':
        env = 'test';
        break;
      case '开发环境':
        env = 'dev';
        break;
      default:
        break;
    }
    dispatch({
      type: 'configManage/compileVersion',
      payload: {
        moduleversion_id: item.id,
        env,
      },
    });
  }
  handleEdit = async (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configManage/saveCurrentModuleInfo',
      payload: {
        versionid: item.id,
        name: item.modulename,
        version: item.version,
        moduleid: item.moduleid, // 服务id
        projectid: item.projectid, // 项目id
      },
    });
    await dispatch({
      type: 'configManage/changeOpeType',
      payload: item.isedit,
    });
    dispatch(routerRedux.push('/resource-center/k8s-manage/sourceobj-manage/edit'));
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
      title: '更新时间',
      dataIndex: 'updatetime',
      key: 'updatetime',
    }, {
      title: '变更人',
      dataIndex: 'updateuser',
      key: 'updateuser',
    }, {
      title: '配置文件',
      // dataIndex: 'configfiles',
      key: 'configfiles',
      render: (text, record) => {
        const fileds = record.configfiles ? record.configfiles.split(',') : [];
        const filed = fileds.map((item, index) => {
          return <span style={{ display: 'block', backgroundColor: 'rgba(232, 232, 232,0.5)', marginBottom: '10px' }}>{item}</span>;
        });
        return filed;
      },
    }, {
      title: '镜像地址',
      dataIndex: 'imageurl',
      key: 'imageurl',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            {
              record.isedit ?
                <a onClick={this.handleEdit.bind(this, record)} style={{ marginRight: '10px' }}>编辑</a>
              :
                <a onClick={this.handleEdit.bind(this, record)} style={{ marginRight: '10px' }}>查看</a>
            }
            {record.iscompile ? <a onClick={this.handleCompile.bind(this, record)} >编译</a> : ''}
          </span>
        );
      },
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
