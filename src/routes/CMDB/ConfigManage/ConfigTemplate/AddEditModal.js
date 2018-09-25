import React, { Component } from 'react';
import { Modal, Form, Col, Row, Spin, Input, Select } from 'antd';
import { connect } from 'dva';
import { objKeyWrapper } from '../../../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect((state) => {
  return {
    commonModalStauts: state.common.commonModalStauts,
    commonLoading: state.common.commonLoading,
    addEditFormFields: state.configManage.addEditFormFields,
    templateType: state.configManage.templateType,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.addEditFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'configManage/formFieldsChange',
      payload: fields,
    });
  },
})

export default class AddEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickType: this.props.clickType,
      currentId: this.props.currentId,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'configManage/fetchTemplateType',
    });
  }
  componentWillReceiveProps(nextprops) {
    this.setState({ ...nextprops });
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/changeCommonModalStauts',
      payload: false,
    });
    dispatch({
      type: 'configManage/formFieldsChange',
      payload: {
        templatename: { // 模板名称
          value: undefined,
        },
        templatetype: { // 模板类型
          value: undefined,
        },
        templatecontent: { // 模板内容
          value: undefined,
        },
      },
    });
  }
  handleOk = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { currentId, clickType } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'configManage/addEditTemplate',
          payload: {
            id: currentId,
          },
          clickType,
        });
      }
    });
  }
  // 渲染option
  renderOptionNodes = (item) => {
    if (item && item.length > 0) {
      const optionNodes = item.map((nodeItem, index) => {
        return (
          <Option key={nodeItem.id} value={nodeItem.name}>{nodeItem.name}</Option>
        );
      });
      return optionNodes;
    }
  }
  render() {
    // console.log(this.props.addEditFormFields);
    const { commonModalStauts, commonLoading, templateType } = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    };
    const config = {
      rules: [{ required: true, message: '请完善信息后提交' }],
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        visible={commonModalStauts}
        title={this.state.clickType == 'add' ? '新增' : '编辑'}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Spin spinning={commonLoading}>
          <Form>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={24} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="模版名称"
                >
                  {getFieldDecorator('templatename', config)(
                    <Input />
               )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={24} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="模版类型"
                >
                  {getFieldDecorator('templatetype', config)(
                    <Select
                      placeholder="请选择"
                    >
                      {this.renderOptionNodes(templateType)}
                    </Select>
               )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={24} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="模板内容"
                >
                  {getFieldDecorator('templatecontent', config)(
                    <TextArea autosize={{ minRows: 4, maxRows: 10 }} />
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
