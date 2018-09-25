import React, { Component } from 'react';
import { Modal, Spin } from 'antd';
import { connect } from 'dva';
import styles from './ServiceName.less';
@connect((state) => {
  return {
    serviceDataInfo: state.serviceInfo.serviceDataInfo,
    isLoading: state.serviceInfo.isLoading,
  };
})

export default class ServiceName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibal: this.props.visibal,
      id: this.props.id,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visibal !== this.props.visibal) {
      this.setState({
        visibal: nextProps.visibal,
      });
    }
    if (nextProps.id !== this.props.id) {
      this.setState({
        id: nextProps.id,
      }, () => {
        this.props.dispatch({
          type: 'serviceInfo/fetchData',
          payload: { id: this.state.id },
        });
      });
    }
  }

  // handleOk() {
  //   console.log(this);
  // }

  handleCancel() {
    this.props.handleCancel('serviceName');
  }

  render() {
    const { serviceDataInfo, isLoading } = this.props;
    return (
      <div>
        <Modal
          title="服务名称"
          visible={this.state.visibal}
          okText="确定"
          cancelText="取消"
          onOk={::this.handleCancel}
          onCancel={::this.handleCancel}
          destroyOnClose
        >
          <div className={styles.content}>
            <p>基础信息</p>
            <Spin spinning={isLoading}>
              <div className={styles.listWrapper}>
                <ul className={styles.listContent}>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>服务器名称：</span>
                    <span className={styles.rightStyle}>{serviceDataInfo.module_name}</span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>服务路径：</span>
                    <span className={styles.rightStyle}>{serviceDataInfo.module_path}</span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>端口：</span>
                    <span className={styles.rightStyle}>{serviceDataInfo.port}</span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>GIT地址：</span>
                    <span className={styles.rightStyle}>{serviceDataInfo.git_url}</span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>描述：</span>
                    <span className={styles.rightStyle}>{serviceDataInfo.desc}</span>
                  </li>
                </ul>
              </div>
              <div className={styles.rightWrapper}>
                <ul className={styles.listContent}>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>负责人：</span>
                    <span className={styles.rightStyle}>{serviceDataInfo.supervisor}</span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>日志路径：</span>
                    <span className={styles.rightStyle}>{serviceDataInfo.logs_path}</span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>模块类型：</span>
                    <span className={styles.rightStyle}>{serviceDataInfo.module_type}</span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>状态：</span>
                    <span className={styles.rightStyle}>{serviceDataInfo.status ? '启用' : '停用'}</span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>版本号：</span>
                    <span className={styles.rightStyle}>{serviceDataInfo.version_num}</span>
                  </li>
                </ul>
              </div>
            </Spin>

          </div>
        </Modal>
      </div>
    );
  }
}
