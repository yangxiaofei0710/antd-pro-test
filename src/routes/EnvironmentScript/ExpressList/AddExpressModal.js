import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Select, Spin } from 'antd';
import { connect } from 'dva';
import { objKeyWrapper } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

@connect((state) => {
  // console.log('state', state.loading.effects['expressList/fetchList']);
  return {
    addModalStatus: state.expressList.addModalStatus, // modal显示隐藏
    addFormFields: state.expressList.addFormFields, // modal中的form表单受控值
    envTypeList: state.expressList.envTypeList, // 类型
    commonLoading: state.expressList.commonLoading, // loading
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.addFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'expressList/addFormFieldsChange',
      payload: fields,
    });
  },
})

export default class AddExpress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: this.props.currentId,
      clickType: this.props.clickType,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'expressList/changeAddModalStatus',
      payload: false,
    });
    dispatch({
      type: 'expressList/initAddFormFields',
    });
  }

  // select过滤
  optionFilter = (inputValue, option) => {
    return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  }

  // 确定新增
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'expressList/addMiddlewares',
          payload: {
            middleware_id: this.state.currentId,
            comment: values.comment,
          },
          clickType: this.state.clickType,
        });
      }
    });
  }
  // 渲染option
  renderOptionNodes = (item) => {
    if (item && item.length > 0) {
      const optionNodes = item.map((nodeItem, index) => {
        return (
          <Option key={nodeItem.env_id}>{nodeItem.env_name}</Option>
        );
      });
      return optionNodes;
    }
  }

  render() {
    const { addModalStatus, addFormFields, envTypeList, commonLoading } = this.props;
    const { clickType, currentId } = this.state;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    const config = {
      rules: [{ required: true, message: '请完善信息后提交' }],
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={clickType == 'add' ? '新增' : '修改'}
        visible={addModalStatus}
        onCancel={this.handleCancel}
        onOk={this.handleSubmit}
        width="800px"
      >
        <Spin spinning={commonLoading}>
          <Form>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="中间件名称"
                >
                  {getFieldDecorator('middleware_name', config)(
                    <Input disabled={clickType == 'edit'} />
               )}
                </FormItem>
              </Col>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="类型"
                >
                  {getFieldDecorator('type_id', config)(
                    <Select
                      placeholder="请选择"
                      showSearch
                      optionFilterProp="children"
                      filterOption={this.optionFilter}
                      disabled={clickType == 'edit'}
                    >
                      {this.renderOptionNodes(envTypeList)}
                    </Select>
               )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="备注"
                >
                  {getFieldDecorator('comment', config)(
                    <Input />
               )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>

    );
  }
}
