import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'antd';
import CommonIndex from './CommonIndex';
import styles from './NotOnline.less';
import RegressionModal from './CommonModal/RegressionModal';
import InfoModal from './CommonModal/InfoModal'; // 查看
import ErrorModal from './CommonModal/ErrorModal'; // 异常

const { confirm } = Modal;
@connect((state) => {
  return {
    commonlistInfo: state.physicalmanage.commonlistInfo,
    // modalFormFields: state.physicalmanage.modalFormFields,
    operateAuthor: state.physicalmanage.operateAuthor,
    commonFormFields: state.physicalmanage.commonFormFields,
  };
})

export default class OfflinePhysical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickType: 'edit',
      physcialInfo: '',
    };
  }
  // 编辑
  edit = (item) => {
    this.setState({
      clickType: 'edit',
    });
    const { dispatch } = this.props;
    dispatch({ // 控制modal显示隐藏
      type: 'physicalmanage/changeModalStatus',
      payload: true,
    });
    dispatch({
      type: 'physicalmanage/queryPhysicalDetail',
      payload: {
        id: item.id,
      },
    });
  }
  // 回归
  regression = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/saveCommonModalStatus',
      payload: true,
    });
    dispatch({
      type: 'physicalmanage/queryPhysicalDetail',
      payload: {
        id: item.id,
      },
    });
  }
  // 报废/报修
  operation(item) {
    confirm({
      title: '您确定要报废此物理机',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'physicalmanage/isRepair',
          payload: {
            id: item.id,
            status: 'reject',
          },
          env: 'repair',
        });
      },
    });
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
  // 操作编辑按钮提交
  handleSubmitFrom = (item, fun) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/handleUpdate',
      payload: {
        id: item.id.value,
        serversn: item.serversn.value,
        servervendortype_id: item.servervendortype_id.value,
        manageip: item.manageip.value,
        serverip: item.serverip.value,
        switchip: item.switchip.value,
        os_id: item.os_id.value,
        loginpassword: item.loginpassword.value,
        loginpasswordconfirm: item.loginpasswordconfirm.value,
        servername: item.servername.value,
        description: item.description.value,
        idc_id: item.idc_id.value,
        repairtime: item.repairtime.value,
        rack_id: item.rack_id.value,
        loginuser: item.loginuser.value,
        buytime: item.buytime.value,
      },
      url: 'physicalEdit',
      env: 'repair',
      callback: fun,
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
    const { commonlistInfo, commonFormFields, operateAuthor } = this.props;
    // console.log('operateAuthor-报修', operateAuthor);
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
      render: (text, record, index) => {
        return (
          <span>
            <a style={{ marginRight: '5px' }} onClick={this.showInfo.bind(this, record)}>查看</a>
            {
              operateAuthor.recycle_asset ?
                <a style={{ marginRight: '5px' }} onClick={this.regression.bind(this, record)}>回归</a> : ''
            }
            {
              operateAuthor.repairreject_asset ?
                <a
                  onClick={
                    record.canreject == 'reject' ?
                    this.operation.bind(this, record) : () => {}
                }
                  className={record.canreject == 'reject' ? styles.operation : styles.disOperation}
                >
                  报废
                </a> : ''
            }
            {
               operateAuthor.change_asset ?
                 <a onClick={this.edit.bind(this, record)}>编辑</a> : ''
            }
          </span>
        );
      },
    }];
    return (
      <div>
        <CommonIndex
          type="repair" // 当前列表类型
          columns={columns} // table 列
          clickType={this.state.clickType} // 点击类型 （编辑/增加/分配）
          title="报修物理机服务器"
          handleSubmit={this.handleSubmitFrom.bind(this, commonFormFields)}
        />
        <RegressionModal />
        <InfoModal title={this.state.physcialInfo} />
        <ErrorModal />
      </div>
    );
  }
}
