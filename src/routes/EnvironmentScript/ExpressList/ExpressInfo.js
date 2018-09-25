import React, { Component } from 'react';
import { Modal, Spin, Tabs } from 'antd';
import { connect } from 'dva';
import styles from './ExpressInfo.less';
import EnvTable from './Table';

const { TabPane } = Tabs;

@connect((state) => {
  return {
    infoModalStatus: state.expressList.infoModalStatus,
    commonLoading: state.expressList.commonLoading,
    expressInfo: state.expressList.expressInfo,
  };
})

export default class ExpressInfo extends Component {
    handleCancel = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'expressList/changeInfoModalStatus',
        payload: false,
      });
    }
    downLoad = (id) => {
      const url = `http://${document.domain}/api/middlewares/env/download?file_id=${id}`;
      window.open(url);
    }
    render() {
      const { infoModalStatus, commonLoading, expressInfo } = this.props;
      //   console.log('commonLoading', commonLoading, expressInfo);
      const info = expressInfo.middleware_info || {};
      return (
        <Modal
          visible={infoModalStatus}
          footer={false}
          title="详情"
          onCancel={this.handleCancel}
          width="800px"
        >
          <Spin spinning={commonLoading}>
            <div>
              <h3>中间件信息</h3>
              <div className={styles.messageWrap}>
                <ul className={styles.messageUl}>
                  <li className={styles.messageLi}>
                    <span className={styles.leftStyle}>中间件名称：</span>
                    <span className={styles.rightStyle}>{info ? info.middleware_name : ''}</span>
                  </li>
                  <li className={styles.messageLi}>
                    <span className={styles.leftStyle}>创建时间：</span>
                    <span className={styles.rightStyle}>{info ? info.create_time : ''}</span>
                  </li>
                </ul>
                <ul className={styles.messageUl}>
                  <li className={styles.messageLi}>
                    <span className={styles.leftStyle}>中间件类型：</span>
                    <span className={styles.rightStyle}>{info ? info.type_name : ''}</span>
                  </li>
                  <li className={styles.messageLi}>
                    <span className={styles.leftStyle}>备注：</span>
                    <span className={styles.rightStyle}>{info ? info.comment : ''}</span>
                  </li>
                </ul>
                <ul className={styles.messageUl}>
                  <li className={styles.messageLi}>
                    <span className={styles.leftStyle}>类型脚本：</span>
                    <a
                      className={styles.rightStyle}
                      onClick={this.downLoad.bind(this, info.file_id)}
                    >
                      {info ? info.file_name : ''}
                    </a>
                  </li>
                </ul>
              </div>
              <h3>已部署服务器信息</h3>
              <div className={styles.messageWrap}>
                <Tabs defaultActiveKey="dev">
                  <TabPane tab="开发环境" key="dev">
                    <EnvTable tableData={expressInfo.deploy_dev || null} env="dev" />
                  </TabPane>
                  <TabPane tab="测试环境" key="test">
                    <EnvTable tableData={expressInfo.deploy_test || null} env="test" />
                  </TabPane>
                  <TabPane tab="预发环境" key="pre">
                    <EnvTable tableData={expressInfo.deploy_pre || null} env="pre" />
                  </TabPane>
                  <TabPane tab="正式环境" key="pro">
                    <EnvTable tableData={expressInfo.deploy_online || null} env="pro" />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </Spin>
        </Modal>

      );
    }
}

