import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Radio, Spin, Select } from 'antd';
import { connect } from 'dva';
import { objKeyWrapper } from '../../utils/utils';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect((state) => {
  return {
    searchFormFields: state.serviceAdd.searchFormFields,
    dataDictionary: state.serviceAdd.dataDictionary,
    serviceDataInfo: state.serviceInfo.serviceDataInfo,
    isLoading: state.serviceInfo.isLoading,
    currProjectInfo: state.projectList.currProjectInfo,
    showModal: state.serviceAdd.showModal,
    listInfo: state.serviceList.listInfo,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'serviceAdd/formFieldChange',
      payload: fields,
    });
  },
})

export default class AddEditService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // visibal: this.props.visibal,
      type: this.props.type,
      editData: this.props.editData,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceAdd/fetchDataDictionary',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visibal !== this.props.visibal) {
      this.setState({
        // visibal: nextProps.visibal,
      });
    }
    if (nextProps.type !== this.props.type) {
      this.setState({
        type: nextProps.type,
      });
    }
    if (nextProps.editData !== this.props.editData) {
      this.setState({
        editData: nextProps.editData,
      }, () => {
        if (this.state.type == 'edit' || nextProps.type == 'edit') {
          const { dispatch } = this.props;
          dispatch({
            type: 'serviceInfo/fetchData',
            payload: { id: nextProps.editData.id || undefined },
          });
        }
      });
    }
  }

  // 搜索提交
  handleSearch(e) {
    e.preventDefault();
    const { editData, type } = this.state;
    const { id } = editData;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'serviceAdd/serviceAdd',
          payload: {
            id: type && type == 'edit' ? id : '',
            type: this.state.type,
            project_id: this.props.currProjectInfo.projectId,
          },
          values,
        });
      }
    });
  }

  // 取消
  handleCancel() {
    this.props.dispatch({
      type: 'serviceAdd/changeShowModal',
      payload: false,
    });
    // this.props.handleCancel('addEdit');
  }
  // 下拉框回掉
  // handleChange() {
  // }

  // 渲染技术栈树
  renderModuleTech = (treeData) => {
    if (treeData && treeData.module_tech !== undefined) {
      const resultTreeNodes = treeData.module_tech.map((nodeItem, index) => {
        return (
          <Option key={nodeItem.value}>{nodeItem.title}</Option>
          // module_type
        );
      });
      return resultTreeNodes;
    }
  }

  // 渲染模块类型树
  renderModuleType = (treeData) => {
    if (treeData && treeData.module_type !== undefined) {
      const resultTreeNodes = treeData.module_type.map((nodeItem, index) => {
        return (
          <Option key={nodeItem.value}>{nodeItem.title}</Option>
          // module_type
        );
      });
      return resultTreeNodes;
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const textAreaLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const checkboxLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
    };
    const { isLoading, serviceDataInfo, dataDictionary, searchFormFields, showModal } = this.props;
    const { type } = this.state;

    return (
      <div>
        <Modal
          title={type === 'edit' ? '编辑服务' : '新增服务'}
          visible={showModal}
          okText={type == 'edit' ? '确定编辑' : '确定新增'}
          cancelText="取消"
          onOk={::this.handleSearch}
          onCancel={::this.handleCancel}
          width="800px"
        >
          <Spin spinning={isLoading}>
            <Form>
              <Row gutter={24}>
                <Col span={12} >
                  <FormItem
                    label="技术栈"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('module_tech', {
                    // initialValue: serviceDataInfo ? serviceDataInfo.module_name : '',
                    rules: [{
                      required: true, message: '请选择技术栈',
                    }],
                  })(
                    <Select
                      disabled={type == 'edit'}
                    >
                      {this.renderModuleTech(dataDictionary)}
                    </Select>
                  )}
                  </FormItem>
                </Col>
                <Col span={12} >
                  <FormItem
                    label="服务名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('module_name', {
                    // initialValue: serviceDataInfo ? serviceDataInfo.module_name : '',
                    rules: [{
                      required: true, message: '请输入服务名称',
                    }],
                  })(
                    <Input placeholder="请输入" disabled={type == 'edit'} />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12} >
                  <FormItem
                    {...formItemLayout}
                    label="服务路径"
                  >
                    {getFieldDecorator('module_path', {
                    // initialValue: serviceDataInfo ? serviceDataInfo.module_path : '',
                    rules: [{
                      required: true, message: '请输入服务路径',
                    }],
                  })(
                    <Input placeholder="请输入" disabled={type == 'edit'} />
                  )}
                  </FormItem>
                </Col>

                <Col span={12} >
                  <FormItem
                    label="日志路径"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('logs_path', {
                    // initialValue: serviceDataInfo ? serviceDataInfo.logs_path : '',
                    rules: [{
                      required: true, message: '请输入日志路径',
                    }],
                  })(
                    <Input placeholder="请输入" disabled={type == 'edit'} />
                  )}

                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12} >
                  <FormItem
                    {...formItemLayout}
                    label="端口"
                  >
                    {getFieldDecorator('port', {
                    // initialValue: serviceDataInfo ? serviceDataInfo.port : '',
                    rules: [{
                      required: true, message: '请输入端口',
                    }],
                  })(
                    <Input placeholder="请输入" disabled={type == 'edit'} />
                  )}
                  </FormItem>
                </Col>

                <Col span={12} >
                  <FormItem
                    label="模块类型"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('module_type', {
                    // initialValue: serviceDataInfo ? serviceDataInfo.module_type : '',
                    rules: [{
                      required: true, message: '请输入模块类型',
                    }],
                  })(
                    <Select disabled={type == 'edit'} >
                      {this.renderModuleType(dataDictionary)}
                    </Select>
                  )}

                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12} >
                  <FormItem
                    {...checkboxLayout}
                    label="是否为公共服务"
                  >
                    {getFieldDecorator('publicservice', {
                      rules: [{
                      required: true, message: '请选择服务类型',
                    }],
                    })(
                      <RadioGroup disabled={type == 'edit'}>
                        <Radio value>是</Radio>
                        <Radio value={false}>否</Radio>
                      </RadioGroup>
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem
                    label="描述"
                    {...textAreaLayout}
                  >
                    {getFieldDecorator('desc', {
                      // initialValue: serviceDataInfo ? serviceDataInfo.desc : '',
                      rules: [{
                        required: true, message: '请输入描述',
                      }],
                    })(
                      <TextArea rows={4} />
                  )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Spin>

        </Modal>
      </div>
    );
  }
}
