import React, { Component } from 'react';
import { Modal, Spin } from 'antd';
import { connect } from 'dva';


@connect((state) => {
  return {
    envModalStatus: state.environmentType.envModalStatus,
  };
})
export default class EnvInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      envName: this.props.envName,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'environmentType/changeEnvModalStatus',
      payload: {
        isShow: false,
        loading: false,
        info: {
          name: undefined,
          desc: undefined,
          file_id: undefined,
          file_name: undefined,
          file_url: undefined,
        },
      },
    });
  }
  // 下载导出
  downLoad = () => {
    const url = `http://${document.domain}/api/middlewares/env/download?file_id=${this.props.envModalStatus.info.file_id}`;
    // const url = `http://10.0.34.48/api/middlewares/env/download?file_id=${this.props.envModalStatus.info.file_id}`;
    window.open(url);
  }
  render() {
    const { envModalStatus } = this.props;
    return (
      <Modal
        title={this.state.envName}
        visible={envModalStatus.isShow}
        onCancel={this.handleCancel}
        onOk={this.handleCancel}
      >
        <Spin spinning={envModalStatus.loading}>
          <div style={{ textAlign: 'center' }}>
            <p>
              <span style={{ display: 'inline-block', width: '50%', textAlign: 'right' }}>类型名称：</span>
              <span style={{ display: 'inline-block', width: '50%', textAlign: 'left' }}>{envModalStatus.info.name}</span>
            </p>
            <p>
              <span style={{ display: 'inline-block', width: '50%', textAlign: 'right' }}>备注：</span>
              <span style={{ display: 'inline-block', width: '50%', textAlign: 'left' }}>{envModalStatus.info.desc}</span>
            </p>
            <p>
              <span style={{ display: 'inline-block', width: '50%', textAlign: 'right' }}>上传：</span>
              <a style={{ display: 'inline-block', width: '50%', textAlign: 'left' }} onClick={this.downLoad}>{envModalStatus.info.file_name}</a>
            </p>
          </div>

        </Spin>
      </Modal>
    );
  }
}
