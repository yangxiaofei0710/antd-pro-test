import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'antd';
import CommonIndex from '../CommonIndex';
import styles from '../NotOnline.less';
import InfoModal from '../CommonModal/InfoModal'; // 查看
import ErrorModal from '../CommonModal/ErrorModal'; // 异常
import InitialModal from '../CommonModal/InitialModal'; // 初始化
import AllotServiceModal from '../CommonModal/AllotServiceModal'; // 分配服务器

const { confirm } = Modal;
@connect((state) => {
  return {
    commonlistInfo: state.physicalmanage.commonlistInfo,
    operateAuthor: state.physicalmanage.operateAuthor,
    commonFormFields: state.physicalmanage.commonFormFields,
  };
})

export default class CommonEnv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickType: 'edit',
      physcialInfo: '',
      env: this.props.env,
      title: this.props.title,
      btnType: this.props.btnType,
    };
  }
  componentWillReceiveProps(nextProps, props) {
    if (nextProps.env !== props.env) {
      this.setState({
        env: nextProps.env,
      });
    }
    if (nextProps.title !== props.title) {
      this.setState({
        title: nextProps.title,
      });
    }
    if (nextProps.btnType !== props.btnType) {
      this.setState({
        btnType: nextProps.btnType,
      });
    }
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

  // 分配至服务器
  allotService = (item) => {
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

  // 下线
  offLine(item) {
    confirm({
      title: '您确定要下线此物理机',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'physicalmanage/offLine',
          payload: {
            id: item.id,
          },
          env: this.state.env,
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
  // 报废/报修
  operation(item) {
    confirm({
      title: `您确定要${item.canreject == 'repair' ? '报修' : '报废'}此物理机`,
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'physicalmanage/isRepair',
          payload: {
            id: item.id,
            status: item.canreject,
          },
          env: this.state.env,
        });
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
      env: this.state.env,
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

  // 初始化
  initial = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/changeInitModalStatus',
      payload: true,
    });
    dispatch({
      type: 'physicalmanage/queryPhysicalDetail',
      payload: {
        id: item.id,
      },
    });
  }

  render() {
    const { btnType } = this.state; // 根据不同列表类型，控制显示不同的操作按钮
    const { commonlistInfo, commonFormFields, operateAuthor } = this.props;
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
            {btnType.info ? <a style={{ marginRight: '5px' }} onClick={this.showInfo.bind(this, record)}>查看</a> : ''}
            {operateAuthor.offline_asset && btnType.offline ? <a style={{ marginRight: '5px' }} onClick={this.offLine.bind(this, record)}>下线</a> : ''}
            {operateAuthor.assginserver_asset && btnType.allot ? <a style={{ marginRight: '5px' }} onClick={this.allotService.bind(this, record)}>分配服务器</a> : '' }
            {
              operateAuthor.repairreject_asset && btnType.rejectRepair ?
                <a style={{ marginRight: '5px' }} onClick={this.operation.bind(this, record)}>
                  {record.canreject == 'repair' ? '报修' : '报废'}
                </a> : ''
            }
            {operateAuthor.init_asset && btnType.init ?
              <a
                onClick={
                    record.caninit ?
                    this.initial.bind(this, record) : () => {}
                  }
                className={record.caninit ? styles.operation : styles.disOperation}
              >
                初始化
              </a> : ''}
            {operateAuthor.change_asset && btnType.edit ? <a onClick={this.edit.bind(this, record)}>编辑</a> : ''}
          </span>
        );
      },
    }];
    return (
      <div>
        <CommonIndex
          type={this.state.env} // 当前列表类型
          columns={columns} // table 列
          clickType={this.state.clickType} // 点击类型 （编辑/增加/分配）
          title={this.state.title}
          handleSubmit={this.handleSubmitFrom.bind(this, commonFormFields)}
        />
        <InfoModal title={this.state.physcialInfo} />
        <ErrorModal />
        <InitialModal />
        <AllotServiceModal />
      </div>
    );
  }
}
