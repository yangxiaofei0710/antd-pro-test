import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Select, Row, Col, Input, DatePicker } from 'antd';
import { fromFilesWrapper, formatDateTime, checkedIP, checkedSwitchIP } from '../../../../../utils/utils';
import withRef from '../../../../../utils/hoc';
import { checkedServiceSn } from '../CommonModal/checkRules';

const FormItem = Form.Item;
const { Option } = Select;
// const dateFormat = 'YYYY-MM-DD';

@connect((state) => {
  return {
    dataDictionary: state.physicalmanage.dataDictionary,
    // modalFormFields: state.physicalmanage.modalFormFields,
    clickType: state.physicalmanage.clickType,
    commonFormFields: state.physicalmanage.commonFormFields,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return fromFilesWrapper(props.commonFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    const newFields = formatDateTime(fields, ['buytime', 'repairtime']);
    props.dispatch({
      type: 'physicalmanage/modalFormFieldChange',
      payload: newFields,
    });
  },
})

// @withRef // 高阶组件
export default class BasicConfig extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'formTemplate/saveFormTemplate',
      payload: {
        type: 'basicConfigForm',
        form: this.props.form,
      },
    });
  }

  // 渲染option
  renderOptionNodes = (item) => {
    if (item && item.length > 0) {
      const optionNodes = item.map((nodeItem, index) => {
        return (
          <Option key={nodeItem.value}>{nodeItem.title}</Option>
        );
      });
      return optionNodes;
    }
  }

  render() {
    const { dataDictionary, modalFormFields, clickType, commonFormFields } = this.props;
    // console.log('clickType', clickType);
    // console.log('commonFormFields', commonFormFields);
    const dateFormat = 'YYYY-MM-DD';
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    const { getFieldDecorator } = this.props.form;
    const config = {
      rules: [{ required: true, message: '请完善信息后提交' }],
    };
    return (
      <div>
        <Form >
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={12} lg={24}>
              <FormItem
                {...formItemLayout}
                label="服务器SN"
              >
                {getFieldDecorator('serversn', {
                  rules: [{
                    required: true, message: '请完善信息后提交',
                  }, {
                    validator: checkedServiceSn,
                  }],
                })(
                  <Input
                    disabled={clickType == 'allot'}
                  />
               )}
              </FormItem>
            </Col>
            <Col xl={12} lg={24}>
              <FormItem
                {...formItemLayout}
                label="主机型号"
              >
                {getFieldDecorator('servervendortype_id', config)(
                  <Select
                    placeholder="请选择"
                    disabled={clickType == 'allot'}
                  >
                    {this.renderOptionNodes(dataDictionary.servertypelist)}
                  </Select>
               )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={12} lg={24}>
              <FormItem
                {...formItemLayout}
                label="购入时间"
              >
                {getFieldDecorator('buytime', config)(
                  <DatePicker
                    disabled
                    style={{ width: '100%' }}
                    format={dateFormat}
                  />
               )}
              </FormItem>
            </Col>
            <Col xl={12} lg={24}>
              <FormItem
                {...formItemLayout}
                label="维保到期时间"
              >
                {getFieldDecorator('repairtime', config)(
                  <DatePicker
                    disabled={clickType == 'allot'}
                    style={{ width: '100%' }}
                    format={dateFormat}
                  />
               )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={12} lg={24}>
              <FormItem
                {...formItemLayout}
                label="机房号"
              >
                {getFieldDecorator('idc_id', config)(
                  <Select
                    placeholder="请选择"
                    disabled={clickType == 'allot'}
                  >
                    {this.renderOptionNodes(dataDictionary.idclist)}
                  </Select>
               )}
              </FormItem>
            </Col>
            <Col xl={12} lg={24}>
              <FormItem
                {...formItemLayout}
                label="机柜号"
              >
                {getFieldDecorator('rack_id', config)(
                  <Select
                    placeholder="请选择"
                  >
                    {this.renderOptionNodes(dataDictionary.racklist)}
                  </Select>
               )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={12} lg={24}>
              <FormItem
                {...formItemLayout}
                label="管理IP"
              >
                {getFieldDecorator('manageip', {
                  rules: [{
                    required: true, message: '请完善信息后提交',
                  }, {
                    validator: checkedIP,
                  }],
                  validateFirst: true,
                })(
                  <Input />
               )}
              </FormItem>
            </Col>
            <Col xl={12} lg={24}>
              <FormItem
                {...formItemLayout}
                label="主机IP"
              >
                {getFieldDecorator('serverip', {
                  rules: [{
                    required: true, message: '请完善信息后提交',
                  }, {
                    validator: checkedIP,
                  }],
                  validateFirst: true,
                })(
                  <Input />
               )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={12} lg={24}>
              <FormItem
                {...formItemLayout}
                label="接入交换机IP"
              >
                {getFieldDecorator('switchip', {
                  rules: [{
                    required: true, message: '请完善信息后提交',
                  }, {
                    validator: checkedSwitchIP,
                  }],
                  validateFirst: true,
                })(
                  <Input />
               )}
              </FormItem>
            </Col>
            <Col xl={12} lg={24}>
              <FormItem
                {...formItemLayout}
                label="系统版本"
              >
                {getFieldDecorator('os_id', config)(
                  <Select
                    placeholder="请选择"
                  >
                    {this.renderOptionNodes(dataDictionary.ostypelist)}
                  </Select>
               )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
