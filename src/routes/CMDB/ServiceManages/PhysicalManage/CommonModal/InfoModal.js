import React, { Component } from 'react';
import { Modal, Spin } from 'antd';
import { connect } from 'dva';
import styles from './InfoModal.less';

@connect((state) => {
  return {
    InfoModalStatus: state.physicalmanage.InfoModalStatus,
    // modalFormFields: state.physicalmanage.modalFormFields,
    commonLoading: state.physicalmanage.commonLoading,
    commonFormFields: state.physicalmanage.commonFormFields,
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
      type: 'physicalmanage/showInfoModal',
      payload: false,
    });
    dispatch({
      type: 'physicalmanage/initialCommonFormFields',
    });
  }
  render() {
    const { InfoModalStatus, commonFormFields, commonLoading } = this.props;
    const { title } = this.state;

    return (
      <Modal
        visible={InfoModalStatus}
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
                <span className={styles.rightStyle}>{commonFormFields.serverip.value}</span>
              </li>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>系统版本：</span>
                <span className={styles.rightStyle}>{commonFormFields.osname.value}</span>
              </li>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>主机型号：</span>
                <span className={styles.rightStyle}>{commonFormFields.servervendortype.value}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>管理IP：</span>
                <span className={styles.rightStyle}>{commonFormFields.manageip.value}</span>
              </li>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>购入时间：</span>
                <span className={styles.rightStyle}>{commonFormFields.buytime.value}</span>
              </li>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>机房号：</span>
                <span className={styles.rightStyle}>{commonFormFields.idcname.value}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>服务器SN：</span>
                <span className={styles.rightStyle}>{commonFormFields.serversn.value}</span>
              </li>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>维保到期时间：</span>
                <span className={styles.rightStyle}>{commonFormFields.repairtime.value}</span>
              </li>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>机柜号：</span>
                <span className={styles.rightStyle}>{commonFormFields.rackname.value}</span>
              </li>
            </ul>
          </div>
          <h3>系统配置</h3>
          <div className={styles.messageWrap}>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>登录名：</span>
                <span className={styles.rightStyle}>{commonFormFields.loginuser.value}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>主机名：</span>
                <span className={styles.rightStyle}>{commonFormFields.servername.value}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>描述：</span>
                <span className={styles.rightStyle}>{commonFormFields.description.value}</span>
              </li>
            </ul>
          </div>
          <h3>状态变更</h3>
          <div className={styles.messageWrap}>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>上次状态：</span>
                <span className={styles.rightStyle}>{commonFormFields.updatestatus.value}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>变更人：</span>
                <span className={styles.rightStyle}>{commonFormFields.updateuser.value}</span>
              </li>
            </ul>
            <ul className={styles.messageUl}>
              <li className={styles.messageLi}>
                <span className={styles.leftStyle}>变更时间：</span>
                <span className={styles.rightStyle}>{commonFormFields.updatetime.value}</span>
              </li>
            </ul>
          </div>
        </Spin>
      </Modal>
    );
  }
}
