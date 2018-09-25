import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Modal, Button, Tag, Spin, Input, Upload, Icon } from 'antd';
import { objKeyWrapper } from '../../../utils/utils';
import LocalStorage from '../../../utils/storage';

const FormItem = Form.Item;
@connect((state) => {
  return {
    addEditControl: state.environmentType.addEditControl,
    addEditFormFields: state.environmentType.addEditFormFields,
    uploadFileList: state.environmentType.uploadFileList,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.addEditFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'environmentType/changeAddEditFormFields',
      payload: fields,
    });
  },
})

export default class AddEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: this.props.currentId,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'environmentType/handleCancelModal',
      payload: {
        clickType: undefined,
        loading: false,
        isShow: false,
      },
    });
  }
  // 上传状态
  handleChange = (info) => {
    const { file, fileList } = info;
    const { dispatch } = this.props;
    if (file.status === 'removed') {
      dispatch({
        type: 'environmentType/defaultUploadFileList',
      });
    } else {
      dispatch({
        type: 'environmentType/changeUploadFileList',
        payload: file,
      });
    }
  }
  // 保存新增
  handleSubmit = (e) => {
    e.preventDefault();
    const { clickType } = this.props.addEditControl;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('values', values);
        const { dispatch } = this.props;
        dispatch({
          type: 'environmentType/saveAddEditEnv',
          payload: {
            env_id: clickType == 'edit' ? this.state.currentId : undefined,
            env_name: values.env_name,
            desc: values.desc,
            file_id: this.props.uploadFileList[0].fileId,
          },
          clickType,
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { addEditControl, uploadFileList } = this.props;
    // console.log('uploadFileList', uploadFileList);
    const props = {
      action: '/api/middlewares/env/upload',
      onChange: this.handleChange,
      fileList: uploadFileList,
      headers: {
        accessToken: LocalStorage.get('accessToken'),
      },
    };
    return (
      <Modal
        title={addEditControl.clickType == 'add' ? '新增' : '编辑'}
        visible={addEditControl.isShow}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
      >
        <Spin spinning={addEditControl.loading}>
          <Form >
            <FormItem
              {...formItemLayout}
              label="类型名称"
            >
              {getFieldDecorator('env_name', {
                rules: [{
                  required: true, message: '请填写类型名称',
                }],
              })(
                <Input placeholder="请输入类型名称" />
                    )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('desc', {
                rules: [{
                  required: true, message: '请填写备注',
                }],
              })(
                <Input placeholder="请输入备注" />
                    )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="上传"
            >
              {getFieldDecorator('file_id', {
                rules: [{
                  required: true, message: '请上传文件',
                }],
              })(
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> 仅能上传.yml文件
                  </Button>
                </Upload>
                    )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
