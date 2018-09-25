import React, { Component } from 'react';
import { Modal, Spin } from 'antd';
import { connect } from 'dva';

@connect((state) => {
  return {
    errorModalStatus: state.virtualManage.errorModalStatus,
    errorInfo: state.virtualManage.errorInfo,
  };
})

export default class ErrorModal extends Component {
    hiddenErr = (item) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'virtualManage/saveErrorModalStatus',
        payload: {
          show: false,
          loading: false,
        },
      });
      dispatch({
        type: 'virtualManage/saveErrorInfo',
        payload: {
          exceptiontime: '', // 异常时间
          exceptioncontent: '', // 异常内容
        },
      });
    }
    render() {
      const { errorModalStatus, errorInfo } = this.props;
      return (
        <Modal
          title="异常信息"
          visible={errorModalStatus.show}
          onCancel={this.hiddenErr}
          onOk={this.hiddenErr}
        >
          <Spin spinning={errorModalStatus.loading}>
            <div style={{ textAlign: 'center' }}>
              <p>异常信息: {`${errorInfo.exceptioncontent}`}</p>
              <p>异常时间: {`${errorInfo.exceptiontime}`}</p>
            </div>
          </Spin>
        </Modal>
      );
    }
}
