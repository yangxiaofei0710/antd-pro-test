import React, { Component } from 'react';
import { Button, Form, Input, Row, Col, Divider, Table, Select, InputNumber, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import { objKeyWrapper } from '../../../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect((state) => {
  return {
    dataDictionary: state.serviceManage.dataDictionary,
    selectedRowKeys: state.serviceManage.selectedRowKeys,
    addFormFields: state.serviceManage.addFormFields,
    isRequired: state.serviceManage.isRequired,
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

export default class BasicConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // isRequired: false,
    };
  }
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
    // 选择套餐
    onSelectChange=(selectedRowKeys) => {
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      let selectKey = null;
      switch (selectedRowKeys[0]) {
        case 0:
          selectKey = '1';
          break;
        case 1:
          selectKey = '2';
          break;
        case 2:
          selectKey = '3';
          break;
        default:
          break;
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'serviceManage/changeSelectedRowKey',
        payload: selectedRowKeys,
      });
      dispatch({
        type: 'serviceManage/addFormFieldChange',
        payload: {
          config: {
            value: selectKey,
          },
        },
      });
    }
    // 流量输入框
    onInputChange = (value) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'serviceManage/addFormFieldChange',
        payload: {
          networkband: {
            value,
          },
        },
      });
    }
    // 是否使用公网
    onRadioChange = async (e) => {
      const { dispatch } = this.props;
      await dispatch({
        type: 'serviceManage/saveIsRequired',
        payload: e.target.value,
      });

      if (!e.target.value) {
        dispatch({
          type: 'serviceManage/addFormFieldChange',
          payload: {
            bandtype: {
              value: undefined,
            },
            networkband: {
              value: undefined,
            },
          },
        });
      } else {
        this.props.form.validateFields(['bandtype', 'networkband'], { force: true });
      }
    }

    // 渲染option
    renderOptionNodes = (item) => {
      if (item && item.length > 0) {
        const optionNodes = item.map((nodeItem, index) => {
          return (
            <Option key={nodeItem.id}>{nodeItem.name}</Option>
          );
        });
        return optionNodes;
      }
    }


    render() {
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      };
      const formItemConfigLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
      };
      const { getFieldDecorator } = this.props.form;
      const { dataDictionary, addFormFields, selectedRowKeys, isRequired } = this.props;
      // console.log('isRequired', isRequired);
      const columns = [{
        title: '规格名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'CPU',
        dataIndex: 'cpu',
        key: 'cpu',
      }, {
        title: '内存',
        dataIndex: 'memory',
        key: 'memory',
      }, {
        title: '硬盘',
        dataIndex: 'disk',
        key: 'disk',
      }];
      // 套餐
      const rowSelection = {
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        type: 'radio',
        selectedRowKeys,
      };
      // vpc 交换机
      const options = dataDictionary.vpc_switch;

      const config = {
        rules: [{ required: true, message: '请完善信息' }],
      };

      return (
        <div>
          <Form>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="计费方式"
                >
                  {getFieldDecorator('charging', config)(
                    <Select
                      style={{ width: 250 }}
                      placeholder="请选择"
                    >
                      {dataDictionary && dataDictionary.charging ? this.renderOptionNodes(dataDictionary.charging) : ''}
                    </Select>
               )}
                </FormItem>
              </Col>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="购买周期"
                >
                  {getFieldDecorator('cycle', config)(
                    <Select
                      style={{ width: 250 }}
                      placeholder="请选择"
                    >
                      {dataDictionary && dataDictionary.cycle ? this.renderOptionNodes(dataDictionary.cycle) : ''}
                    </Select>
               )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="地区选择"
                >
                  {getFieldDecorator('zone', config)(
                    <Select
                      style={{ width: 250 }}
                      placeholder="请选择"
                    >
                      {dataDictionary && dataDictionary.zone ? this.renderOptionNodes(dataDictionary.zone) : ''}
                    </Select>
              )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={24} lg={24}>
                <FormItem
                  {...formItemConfigLayout}
                  label="配置"
                >
                  {getFieldDecorator('config', config)(
                    <Table
                      columns={columns}
                      rowSelection={rowSelection}
                      dataSource={dataDictionary.config}
                      pagination={false}
                    />
               )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="镜像"
                >
                  {getFieldDecorator('image', config)(
                    <Select
                      style={{ width: 250 }}
                      placeholder="请选择"
                    >
                      {dataDictionary && dataDictionary.image ? this.renderOptionNodes(dataDictionary.image) : ''}
                    </Select>
               )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="vpc 交换机"
                >
                  {getFieldDecorator('vpc_switch', config)(
                    <Cascader options={options} placeholder="请选择" style={{ width: 250 }} />
               )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="安全组"
                >
                  {getFieldDecorator('security', config)(
                    <Select
                      style={{ width: 250 }}
                      placeholder="请选择"
                    >
                      {dataDictionary && dataDictionary.security ? this.renderOptionNodes(dataDictionary.security) : ''}
                    </Select>
               )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="是否使用公网"
                >
                  {getFieldDecorator('useoutip')(
                    <RadioGroup onChange={this.onRadioChange}>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup>
               )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col lg={12}>
                <FormItem
                  {...formItemLayout}
                  label="带宽"
                >
                  {getFieldDecorator('bandtype', {
                    rules: [{ required: isRequired, message: '请完善信息' }],
                  })(
                    <Select
                      style={{ width: 250 }}
                      placeholder="请选择"
                      disabled={!isRequired}
                    >
                      {dataDictionary && dataDictionary.bandtype ? this.renderOptionNodes(dataDictionary.bandtype) : ''}
                    </Select>
               )}
                </FormItem>
              </Col>
              <Col lg={12}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('networkband', {
                    rules: [{ required: isRequired, message: '请完善信息' }],
                  })(
                    <div>
                      <InputNumber
                        min={0}
                        max={1000}
                        step={5}
                        onChange={this.onInputChange}
                        disabled={!isRequired}
                        value={addFormFields.networkband.value}
                      />
                      <span> Mbps</span>
                    </div>
               )}
                </FormItem>
              </Col>
            </Row>
          </Form>


        </div>
      );
    }
}
