import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import CommonIndex from './CommonIndex';
import styles from './NotOnline.less';
import InfoModal from './CommonModal/InfoModal'; // 查看
import ErrorModal from './CommonModal/ErrorModal'; // 异常

@connect((state) => {
  return {};
})

export default class OfflinePhysical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      physcialInfo: '',
    };
  }
  // 查看
  showInfo = (item) => {
    this.setState({
      physcialInfo: item.servername,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/showInfoModal',
      payload: true,
    });
    dispatch({
      type: 'physicalmanage/queryPhysicalDetail',
      payload: {
        id: item.id,
      },
    });
  }

  // 查看异常信息
  showErr = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/changeErrorInfo',
      payload: {
        id: item.id,
      },
    });
  }

  render() {
    // const { modalStatus, commonLoading } = this.props;
    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '主机名称',
      dataIndex: 'servername',
      key: 'servername',
    }, {
      title: '服务器SN',
      dataIndex: 'serversn',
      key: 'serversn',
    }, {
      title: '主机IP',
      dataIndex: 'serverip',
      key: 'serverip',
    }, {
      title: '管理IP',
      dataIndex: 'manageip',
      key: 'manageip',
    }, {
      title: '接入交换机IP',
      dataIndex: 'switchip',
      key: 'switchip',
    }, {
      title: '型号',
      dataIndex: 'servervendortype',
      key: 'servervendortype',
    }, {
      title: '机柜号',
      dataIndex: 'rackname',
      key: 'rackname',
    }, {
      title: '机房号',
      dataIndex: 'idcname',
      key: 'idcname',
    }, {
      title: '购入时间',
      dataIndex: 'buytime',
      key: 'buytime',
    }, {
      title: '维保到期时间',
      dataIndex: 'repairtime',
      key: 'repairtime',
    }, {
      title: '报废时间',
      dataIndex: 'rejecttime',
      key: 'rejecttime',
    }, {
      title: '状态',
      dataIndex: 'runningstatus',
      key: 'runningstatus',
      render: (text, record) => {
        return (
          <span>
            {record.runningstatus == '正常' ? '正常' : <a onClick={this.showErr.bind(this, record)}>异常</a>}
          </span>
        );
      },
    }, {
      title: '操作',
      key: 'operate',
      render: (text, record) => {
        return (
          <span>
            <a style={{ marginRight: '5px' }} onClick={this.showInfo.bind(this, record)}>查看</a>
          </span>
        );
      },
    }];
    return (
      <div>
        <CommonIndex
          type="reject" // 当前列表类型
          columns={columns} // table 列
          clickType={this.state.clickType} // 点击类型 （编辑/增加/分配）
          title="报废物理机服务器"
        />
        <InfoModal title={this.state.physcialInfo} />
        <ErrorModal />
      </div>
    );
  }
}
