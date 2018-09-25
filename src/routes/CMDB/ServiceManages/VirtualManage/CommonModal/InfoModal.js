import React, { Component } from 'react';
import { Modal, Spin } from 'antd';
import { connect } from 'dva';
import styles from './InfoModal.less';

@connect((state) => {
  return {
    infoModalStatus: state.virtualManage.infoModalStatus,
    commonLoading: state.virtualManage.commonLoading,
    virtualInfo: state.virtualManage.virtualInfo,
  };
})

export default class InfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title || '详细信息',
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }
  // 取消按钮
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'virtualManage/saveInfoModalStatus',
      payload: false,
    });
    dispatch({
      type: 'virtualManage/saveVirtualInfo',
      payload: {},
    });
  }
  render() {
    const { infoModalStatus, virtualInfo, commonLoading } = this.props;
    const { title } = this.state;
    // console.log('virtualInfo', virtualInfo);
    return (
      <Modal
        visible={infoModalStatus}
        title={title}
        onCancel={this.handleCancel}
        onOk={this.handleCancel}
        width="800px"
      >
        <Spin spinning={commonLoading}>
          <h3>基本配置</h3>
          <div className={styles.messageWrap}>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>主机IP：</span>
                <span className={styles.rightStyle}>{virtualInfo.serverip}</span>
              </li>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>配置：</span>
                <span className={styles.rightStyle}>{virtualInfo.config ? virtualInfo.config.name : ''}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>系统版本：</span>
                <span className={styles.rightStyle}>{virtualInfo.osname}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>虚拟机SN：</span>
                <span className={styles.rightStyle}>{virtualInfo.serversn}</span>
              </li>
            </ul>
          </div>
          <h3>系统配置</h3>
          <div className={styles.messageWrap}>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>登录名：</span>
                <span className={styles.rightStyle}>{virtualInfo.loginuser}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>主机名：</span>
                <span className={styles.rightStyle}>{virtualInfo.servername}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>描述：</span>
                <span className={styles.rightStyle}>{virtualInfo.description}</span>
              </li>
            </ul>
          </div>
          <h3>状态变更</h3>
          <div className={styles.messageWrap}>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>上次状态：</span>
                <span className={styles.rightStyle}>{virtualInfo.updatestatus}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>变更人：</span>
                <span className={styles.rightStyle}>{virtualInfo.updateuser}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>变更时间：</span>
                <span className={styles.rightStyle}>{virtualInfo.updatetime}</span>
              </li>
            </ul>
          </div>
          <h3>归属物理机</h3>
          <div className={styles.messageWrap}>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>序列号：</span>
                <span className={styles.rightStyle}>{virtualInfo.hostinfo ? virtualInfo.hostinfo.hostsn : ''}</span>
              </li>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>物理机IP：</span>
                <span className={styles.rightStyle}>{virtualInfo.hostinfo ? virtualInfo.hostinfo.hostip : ''}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>购入时间：</span>
                <span className={styles.rightStyle}>{virtualInfo.hostinfo ? virtualInfo.hostinfo.buytime : ''}</span>
              </li>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>机房号：</span>
                <span className={styles.rightStyle}>{virtualInfo.hostinfo ? virtualInfo.hostinfo.idcname : ''}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>维保到期时间：</span>
                <span className={styles.rightStyle}>{virtualInfo.hostinfo ? virtualInfo.hostinfo.repairtime : ''}</span>
              </li>
            </ul>
          </div>
        </Spin>
      </Modal>
    );
  }
}
