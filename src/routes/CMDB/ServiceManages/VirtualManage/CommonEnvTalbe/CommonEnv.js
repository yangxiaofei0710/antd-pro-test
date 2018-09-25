import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'antd';
import CommonIndex from '../CommonIndex';
import styles from '../CommonIndex.less';
import ErrorModal from '../CommonModal/ErrorModal';
import InfoModal from '../CommonModal/InfoModal';
import AllotServiceModal from '../CommonModal/AllotServiceModal';
import RegressModal from '../CommonModal/RegressModal';

const { confirm } = Modal;

@connect((state) => {
  return {
    commonFormFields: state.virtualManage.commonFormFields, // 搜索条件
    selectedRowKeys: state.virtualManage.selectedRowKeys, // 套餐默认选择项
    relevancePhysicalId: state.virtualManage.relevancePhysicalId, // 关联物理机id
    operateAuthor: state.virtualManage.operateAuthor, // 操作权限
  };
})
export default class CommonEnv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickType: '',
      virtualInfo: '',
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

    handleSubmitFrom = (fun) => {
      const { selectedRowKeys, commonFormFields, relevancePhysicalId } = this.props;
      const { dispatch } = this.props;
      dispatch({
        type: 'virtualManage/addEditSubmit',
        payload: {
          id: commonFormFields.id.value,
          os_id: commonFormFields.os_id.value,
          serverip: commonFormFields.serverip.value,
          loginpassword: commonFormFields.loginpassword.value,
          loginpasswordconfirm: commonFormFields.loginpasswordconfirm.value,
          servername: commonFormFields.servername.value,
          description: commonFormFields.description.value,
          loginuser: commonFormFields.loginuser.value,
          config_id: commonFormFields.config.value,
          asset_id: relevancePhysicalId,
        },
        clickType: this.state.clickType,
        callback: fun,
        env: this.state.env,
      });
    }

    // 查看
    showInfo = (item) => {
      this.setState({
        virtualInfo: item.servername,
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'virtualManage/saveInfoModalStatus',
        payload: true,
      });
      dispatch({
        type: 'virtualManage/showInfoModal',
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
            type: 'virtualManage/operateService',
            payload: {
              id: item.id,
            },
            env: this.state.env,
            url: 'offlineVirtual',
          });
        },
      });
    }

    // 重新上线
    regressSerivce = (item) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'virtualManage/queryPhysicalDetail',
        payload: {
          id: item.id,
        },
      });
      dispatch({
        type: 'virtualManage/saveRegressModalStatus',
        payload: true,
      });
    }

    // 新增
    addVirtual = (item, type) => {
      this.setState({
        clickType: 'add',
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'virtualManage/changeModalStatus',
        payload: true,
      });
      dispatch({
        type: 'virtualManage/changeSelectedRowKey',
        payload: [0],
      });
    }

    // 编辑
    edit = (item) => {
      this.setState({
        clickType: 'edit',
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'virtualManage/changeModalStatus',
        payload: true,
      });
      dispatch({
        type: 'virtualManage/queryPhysicalDetail',
        payload: {
          id: item.id,
        },
      });
    }

    // 分配服务器
    allotVirtualSerivce = (item) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'virtualManage/queryPhysicalDetail',
        payload: {
          id: item.id,
        },
      });
      dispatch({
        type: 'virtualManage/saveCommonModalStatus',
        payload: true,
      });
    }

    // 查看异常信息
    showErr = (item) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'virtualManage/changeErrorInfo',
        payload: {
          id: item.id,
        },
      });
    }

    // 销毁
    rejectService = (item) => {
      confirm({
        title: '您确定要销毁此物理机',
        onOk: () => {
          const { dispatch } = this.props;
          dispatch({
            type: 'virtualManage/operateService',
            payload: {
              id: item.id,
            },
            env: this.state.env,
            url: 'rejectVirtual',
          });
        },
      });
    }

    render() {
      const { operateAuthor } = this.props;
      // console.log('operateAuthor', operateAuthor);
      const { btnType } = this.state; // 根据不同列表类型，控制显示不同的操作按钮
      const operaBtn = operateAuthor.add_virtualmodel && btnType.add ? (<div><Button type="primary" className={styles.rightBtn} onClick={this.addVirtual}>新增虚拟机</Button></div>) : '';
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
        title: '虚拟机SN',
        dataIndex: 'serversn',
        key: 'serversn',
      }, {
        title: '主机IP',
        dataIndex: 'serverip',
        key: 'serverip',
      }, {
        title: '配置',
        key: 'config',
        render: (text, record) => {
          return (
            <span>
              {record.config.name}
            </span>
          );
        },
      }, {
        title: '宿主机IP',
        dataIndex: 'hostip',
        key: 'hostip',
      }, {
        title: '状态',
        dataIndex: 'runningstatus',
        key: 'runningstatus',
        render: (text, record) => {
          return (
            <span>
              {text == '正常' ? '正常' : <a onClick={this.showErr.bind(this, record)}>异常</a>}
            </span>
          );
        },
      }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => {
          return (
            <span>
              {btnType.info ? <a style={{ marginRight: '10px' }} onClick={this.showInfo.bind(this, record)}>详情</a> : ''}
              {operateAuthor.change_virtualmodel && btnType.edit ? <a style={{ marginRight: '10px' }} onClick={this.edit.bind(this, record)}>编辑</a> : ''}

              {operateAuthor.offline_virtualmodel && btnType.offline ? <a onClick={this.offLine.bind(this, record)}>下线</a> : ''}
              {operateAuthor.assginserver_virtualmodel && btnType.allot ? <a onClick={this.allotVirtualSerivce.bind(this, record)}>分配</a> : ''}
              {operateAuthor.destory_virtualmodel && btnType.destroy ?
                <a
                  onClick={
                    record.canreject ?
                    this.rejectService.bind(this, record) : () => {}
                  }
                  className={record.canreject ? styles.operation : styles.disOperation}
                >
                  销毁
                </a> : ''}
              {operateAuthor.recycle_virtualmodel && btnType.regress ? <a style={{ marginRight: '10px' }} onClick={this.regressSerivce.bind(this, record)}>重新上线</a> : ''}
            </span>
          );
        },
      }];
      return (
        <div>
          <CommonIndex
            title={this.state.title}
            envType={this.state.env}
            columns={columns} // table 列
            btn={operaBtn}
            clickType={this.state.clickType} // 点击类型 （编辑/增加)
            handleSubmit={this.handleSubmitFrom.bind(this)}
          />
          <ErrorModal />
          <InfoModal title={this.state.virtualInfo} />
          <AllotServiceModal />
          <RegressModal />
        </div>
      );
    }
}
