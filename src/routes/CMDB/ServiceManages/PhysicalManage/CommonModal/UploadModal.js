import React, { Component } from 'react';
import { Modal, Upload, Icon, Spin, Button, Message } from 'antd';
import { connect } from 'dva';

const { Dragger } = Upload;

@connect((state) => {
  return {
    uploadPhysical: state.physicalmanage.uploadPhysical,
    addModalStatus: state.physicalmanage.addModalStatus,
  };
})

export default class UploadModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 删除上传文件
  onRemove = (file) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/onRemove',
      payload: file,
    });
  }

  // 上传前钩子
  beforeUpload = (file, fileList) => {
    const fileName = file.name.split('.');
    if (fileName[fileName.length - 1] == 'xlsx') {
      const { dispatch } = this.props;
      dispatch({
        type: 'physicalmanage/addFileList',
        payload: fileList,
      });
    } else {
      Message.error('请上传xlsx文件');
    }
    return false;
  }

  // 确定按钮
  handleOk = () => {
    const { fileList } = this.props.uploadPhysical;
    const newFileNameArr = [];
    fileList.forEach((item) => {
      newFileNameArr.push(item.name);
    });
    for (let i = 0; i < newFileNameArr.length; i++) {
      for (let j = i; j < newFileNameArr.length - i - 1; j++) {
        if (newFileNameArr[i] == newFileNameArr[j + 1]) {
          Message.error('禁止文件名重复');
          return true;
        }
      }
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/handleUpload',
    });
  }

  // 取消按钮
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/deleteFiles',
    });
  }

  // 下载导出
  checkedToken = () => {
    const url = `http://${document.domain}/api/cmdb/download?file_type=0`;
    window.open(url);
  }

  render() {
    const { uploadPhysical, addModalStatus } = this.props;
    const { fileList, uploading } = uploadPhysical;
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      // multiple: true,
      onRemove: this.onRemove,
      beforeUpload: this.beforeUpload,
      fileList: fileList.slice(-5),
    };
    return (
      <div>
        <Modal
          title="导入物理机"
          footer={false}
          visible={addModalStatus}
          onCancel={this.handleCancel}
        >
          <Spin spinning={uploading}>
            <a onClick={this.checkedToken} style={{ paddingBottom: '10px', display: 'inline-block' }}>通用表格下载</a>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
              <p className="ant-upload-hint">支持扩展名：excel 严禁文件名重复</p>
            </Dragger>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button
                type="primary"
                onClick={this.handleOk}
                style={{ marginRight: '10px' }}
                disabled={fileList.length === 0}
              >
                确定
              </Button>
              <Button onClick={this.handleCancel} >取消</Button>
            </div>
          </Spin>
        </Modal>
      </div>
    );
  }
}
