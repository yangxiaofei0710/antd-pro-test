import React, { Component } from 'react';
import { Button, Form, Input, Row, Col } from 'antd';
import { connect } from 'dva';
import { objKeyWrapper } from '../../../../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect((state) => {
  return {
    addFormFields: state.serviceManage.addFormFields,
    checkedPassword: state.serviceManage.checkedPassword,
    checkedHostName: state.serviceManage.checkedHostName,
    checkedComment: state.serviceManage.checkedComment,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.addFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'serviceManage/addFormFieldChange',
      payload: fields,
    });
  },
})

export default class SystemConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'formTemplate/saveFormTemplate',
      payload: {
        type: 'systemConfigForm',
        form: this.props.form,
      },
    });
  }

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('loginpassword')) {
      callback('密码输入不一致，请校验您输入的密码！');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    const regUpper = /[A-Z]{1,}/g.test(value);
    const regLower = /[a-z]{1,}/g.test(value);
    const regNum = /\d{1,}/.test(value);
    const regChar = /[()`~!@#$%^&*-+=|{}[\]:;‘<>,.?/]{1,}/g.test(value);
    const reg = /[0-9a-zA-Z()`~!@#$%^&*-+=|{}[\]:;‘<>,.?/]{8,30}/g.test(value);
    const { dispatch } = this.props;
    if (!value) {
      return callback('必填项');
    }
    if (reg && value.length < 30) {
      if ((regUpper && regLower && regNum) ||
          (regUpper && regLower && regChar) ||
          (regUpper && regNum && regChar) ||
          (regLower && regNum && regChar)
      ) { //  1.大写 小写 数字 || 2.大写 小写 特殊字符 || 3.大写 数字 特殊字符 || 4.小写 数字 特殊字符
        console.log('好厉害的密码');
      } else {
        callback('8-30个字符，且同时包含三项（大写字母，小写字母，数字或特殊符号)');
      }
    } else {
      callback('8-30个字符，且同时包含三项（大写字母，小写字母，数字或特殊符号)');
    }

    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmpassword'], { force: true });
    }
    callback();
  }

  // 校验主机名
  validateHostName = (rule, value, callback) => {
    const regName = /^[a-zA-Z]{1,}\d{1,}-(pro|pre|test)$/g.test(value);
    if (!regName) {
      callback('格式：项目[n]-环境 注释：项目名：jcy、mall等；n：主机顺序号；环境：pro、pre、test');
    }
    callback();
  }

  // 校验备注
  validateComment = (rule, value, callback) => {
    const regComment = /^(http:\/\/|https:\/\/?)/g.test(value);
    if (!value) {
      return callback('必填项');
    }
    if (regComment || value.length > 256 || value.length < 2) {
      callback('长度为2-256个字符，不能以http://或https://开头');
    }
    callback();
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24}>
              <FormItem
                {...formItemLayout}
                label="登录名"
              >
                {getFieldDecorator('loginuser')(
                  <Input disabled />
               )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24}>
              <FormItem
                {...formItemLayout}
                label="登陆密码"
              >
                {getFieldDecorator('loginpassword', {
                 rules: [{
                  required: true, message: '请输入登陆密码',
                }, {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input type="password" placeholder="请输入" />
               )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24}>
              <FormItem
                {...formItemLayout}
                label="确认密码"
              >
                {getFieldDecorator('confirmpassword', {
                  rules: [{
                    required: true, message: '请确认登陆密码',
                  }, {
                    validator: this.compareToFirstPassword,
                  }],
              })(
                <Input
                  type="password"
                  onBlur={this.handleConfirmBlur}
                  placeholder="请输入"
                />
               )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24}>
              <FormItem
                {...formItemLayout}
                label="主机名"
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true, message: '请输入主机名',
                  }, {
                    validator: this.validateHostName,
                  }],
                })(
                  <Input placeholder="请输入" />
               )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24}>
              <FormItem
                {...formItemLayout}
                label="备注"
              >
                {getFieldDecorator('comment', {
                  rules: [{
                    required: true, message: '请输入备注',
                  }, {
                    validator: this.validateComment,
                  }],
                })(
                  <TextArea rows={4} />
               )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
