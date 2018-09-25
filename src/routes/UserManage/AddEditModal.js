import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Table, Modal, Tree, Button, Tag, Spin, Input } from 'antd';
import { connect } from 'dva';
import styles from './AddEditModal.less';
import { treeTravel, objKeyWrapper } from '../../utils/utils';

const { TreeNode } = Tree;
const { Search } = Input;
const FormItem = Form.Item;
@connect((state) => {
  return {
    detailFormFields: state['role-manage'].roleInfo.detailFormFields,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.detailFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    console.log(fields);
    props.dispatch({
      type: 'role-manage/roleDetailFieldsChange',
      payload: fields,
    });
  },
})
export default class AddEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    });
  }
  onOk = () => {
    if (this.props.onOk) {
      this.props.onOk();
    }
  }
  onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { type, visible, loading, detailFormFields } = this.props;
    return (
      <Modal
        title={type === 'add' ? '新增角色' : '编辑角色'}
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Spin spinning={loading}>
          <Form
            onSubmit={this.handleSearch}
          >
            <FormItem
              label="角色名称"
            >
              {getFieldDecorator('role_name', {
                initialValue: detailFormFields.role_name.value,
                rules: [
                  { required: true, message: '角色姓名必须填写' },
                ],
              })(
                <Input placeholder="请输入角色姓名" />
                    )}
            </FormItem>
            <FormItem
              label="角色描述"
            >
              {getFieldDecorator('desc', {
               initialValue: detailFormFields.desc.value,
               rules: [
               ],
              })(
                <Input placeholder="请输入角色描述" />
                    )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

