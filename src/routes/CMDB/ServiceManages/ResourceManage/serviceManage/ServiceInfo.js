import React, { Component } from 'react';
import { Modal, Spin } from 'antd';
import { connect } from 'dva';
import styles from './ServiceInfo.less';

@connect((state) => {
  return {
    infoModalStatus: state.serviceManage.infoModalStatus,
    loading: state.serviceManage.loading,
    serviceInfo: state.serviceManage.serviceInfo,
  };
})

export default class ServiceInfo extends Component {
  // 取消关闭modal
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceManage/changeInfoStatus',
      payload: false,
    });
  }

  render() {
    const { infoModalStatus, loading, serviceInfo } = this.props;
    return (
      <div>
        <Modal
          visible={infoModalStatus}
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
          width={800}
        >
          <Spin spinning={loading}>
            <div>
              <h3>服务器详情</h3>
              <div className={styles.infoWrapper}>
                <ul className={styles.infoUl}>
                  <li>
                    <span className={styles.leftStyle}>计费方式：</span>
                    <span className={styles.rightStyle}>
                      {serviceInfo ? serviceInfo.charging : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>套餐：</span>
                    <span className={styles.rightStyle}>
                      {serviceInfo ? serviceInfo.config : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>带宽：</span>
                    <span className={styles.rightStyle}>
                      {serviceInfo ? (serviceInfo.networkband ? serviceInfo.networkband : '0') : '0'}
                      M
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>vpc：</span>
                    <span className={styles.rightStyle}>
                      {serviceInfo ? serviceInfo.vpc : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>安全组：</span>
                    <span className={styles.rightStyle}>
                      {serviceInfo ? serviceInfo.security : ''}
                    </span>
                  </li>
                </ul>

                <ul className={styles.infoUl}>
                  <li>
                    <span className={styles.leftStyle}>计费时长：</span>
                    <span className={styles.rightStyle}>
                      {serviceInfo ? serviceInfo.cycle : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>镜像：</span>
                    <span className={styles.rightStyle}>
                      {serviceInfo ? serviceInfo.image : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>地域：</span>
                    <span className={styles.rightStyle}>
                      {serviceInfo ? serviceInfo.zone : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>交换机：</span>
                    <span className={styles.rightStyle}>
                      {serviceInfo ? serviceInfo.switch : ''}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3>系统配置</h3>
              <div className={styles.infoWrapper}>
                <ul className={styles.infoUl}>
                  <li>
                    <span className={styles.leftStyle}>主机名：</span>
                    <span className={styles.rightStyle}>
                      {serviceInfo ? serviceInfo.name : ''}
                    </span>
                  </li>
                </ul>
                <ul className={styles.infoUl}>
                  <li>
                    <span className={styles.leftStyle}>描述：</span>
                    <span className={styles.rightStyle}>
                      {serviceInfo ? serviceInfo.comment : ''}
                    </span>
                  </li>
                </ul>
              </div>

            </div>
          </Spin>
        </Modal>

      </div>
    );
  }
}
