import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import CommonIndex from './CommonIndex';
import styles from './NotOnline.less';
import UploadModal from './CommonModal/UploadModal';
import AddPhysicalModal from './CommonModal/AddPhysicalModal';


@connect((state) => {
  return {
    commonModalStatus: state.physicalmanage.commonModalStatus,
    // modalFormFields: state.physicalmanage.modalFormFields,
    operateAuthor: state.physicalmanage.operateAuthor,
    commonFormFields: state.physicalmanage.commonFormFields,
  };
})

export default class NotOnline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickType: 'allot',
      addEdit: '',
    };
  }
  // 分配置资源池
  allotResource = (item) => {
    this.setState({
      clickType: 'allot',
    });
    const { dispatch } = this.props;
    dispatch({ // 控制modal显示隐藏
      type: 'physicalmanage/changeModalStatus',
      payload: true,
    });
    dispatch({
      type: 'physicalmanage/saveClickType',
      payload: 'allot',
    });
    dispatch({
      type: 'physicalmanage/queryPhysicalDetail',
      payload: {
        id: item.id,
      },
    });
  }
  // 点击新增物理机
  addPhysical = (item, type) => {
    this.setState({
      addEdit: type,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/saveCommonModalStatus',
      payload: true,
    });
    if (type == 'edit') {
      dispatch({
        type: 'physicalmanage/queryPhysicalDetail',
        payload: {
          id: item.id,
        },
      });
    }
  }

  // 上传
  handleUpload = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/changeAddModalStatus',
      payload: true,
    });
  }

  // 搜索提交form  分配至资源池
  handleSubmitFrom = (item, fun) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/handleUpdate',
      payload: {
        id: item.id.value,
        manageip: item.manageip.value,
        switchip: item.switchip.value,
        rack_id: item.rack_id.value,
        os_id: item.os_id.value,
        serverip: item.serverip.value,
        loginpassword: item.loginpassword.value,
        loginpasswordconfirm: item.loginpasswordconfirm.value,
        servername: item.servername.value,
        description: item.description.value,
        loginuser: item.loginuser.value,
      },
      url: 'allotPhysical',
      env: 'notonline',
      callback: fun,
    });
  }

  render() {
    const { commonFormFields, operateAuthor } = this.props;
    // console.log('operateAuthor-未上线物理机', operateAuthor);
    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '服务器SN',
      dataIndex: 'serversn',
      key: 'serversn',
    }, {
      title: '型号',
      dataIndex: 'servervendortype',
      key: 'servervendortype',
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
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            {
              operateAuthor.change_asset ?
                <a style={{ marginRight: '10px' }} onClick={this.addPhysical.bind(this, record, 'edit')}>编辑</a> : ''
            }
            {
              operateAuthor.assginresource_asset ?
                <a onClick={this.allotResource.bind(this, record)}>分配至资源池</a> : ''
            }
          </span>
        );
      },
    }];
    const operaBtn = (
      <div>
        {
          operateAuthor.add_asset ?
            <Button className={styles.rightBtn} type="primary" onClick={this.addPhysical.bind(this, '', 'add')}>新增物理机</Button> : ''
        }
        {
          operateAuthor.upload_asset ?
            <Button className={styles.rightBtn} style={{ marginRight: '10px' }} onClick={this.handleUpload}>导入</Button> : ''
        }
      </div>
    );

    return (
      <div>
        <CommonIndex
          type="notonline" // 当前列表类型
          columns={columns} // table 列
          clickType={this.state.clickType} // 点击类型 （编辑/增加/分配）
          btn={operaBtn}
          title="未上线的物理服务器"
          handleSubmit={this.handleSubmitFrom.bind(this, commonFormFields)}
        />
        <UploadModal />
        <AddPhysicalModal type={this.state.addEdit} />
      </div>
    );
  }
}
