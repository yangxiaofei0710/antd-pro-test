import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Select, Spin, Radio, message } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { objKeyWrapper } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect((state) => {
  return {
    dataDictionary: state.common.dataDictionary, // 数据字典
    deployModalStatus: state.expressList.deployModalStatus, // modal显示隐藏
    deployEnvFromFields: state.expressList.deployEnvFromFields, // modal中的form表单受控值
    commonLoading: state.expressList.commonLoading, // loading
    chanceServiceList: state.expressList.chanceServiceList, // 选择服务器
    fetchingLoading: state.expressList.fetchingLoading, // 搜索服务器等待loading
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.deployEnvFromFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'expressList/deployEnvFromFieldsChange',
      payload: fields,
    });
  },
})

export default class DeployEnvModal extends Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchService = debounce(this.fetchService, 800); // 函数节流
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/fetchDataDictionary',
    });
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'expressList/changeDeployModalStatus',
      payload: false,
    });
    dispatch({
      type: 'expressList/initdeployEnvFromFields',
    });
  }

  // 搜索服务器
  fetchService = (value) => {
    const id = this.props.deployEnvFromFields.environ_id.value;
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'expressList/fetchService',
        payload: {
          server_ip: value,
          envir_id: id,
        },
      });
    } else {
      message.warning('请先选择环境');
    }
  }
  // 选择服务器
  handleChange = () => {
    const { dispatch, chanceServiceList } = this.props;
    dispatch({
      type: 'expressList/changeServiceList',
      payload: [],
    });
    dispatch({
      type: 'expressList/changeFetchingLoading',
      payload: false,
    });
  }

  // 确定环境部署
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'expressList/deployEnv',
        });
      }
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
    const {
      deployModalStatus,
      deployEnvFromFields,
      commonLoading,
      dataDictionary,
      chanceServiceList,
      fetchingLoading,
    } = this.props;
    console.log('chanceServiceList', chanceServiceList);
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
        title="环境部署"
        visible={deployModalStatus}
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
                    <Input disabled />
               )}
                </FormItem>
              </Col>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="类型"
                >
                  {getFieldDecorator('type_name', config)(
                    <Input disabled />
               )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>

              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="环境"
                >
                  {getFieldDecorator('environ_id', config)(
                    <Select
                      placeholder="请选择"
                    >
                      {this.renderOptionNodes(dataDictionary.envlist)}
                    </Select>
               )}
                </FormItem>
              </Col>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="物理机IP"
                >
                  {getFieldDecorator('serverid_list', config)(
                    <Select
                      mode="multiple"
                      placeholder="请选择"
                      notFoundContent={fetchingLoading ? <Spin size="small" /> : null}
                      filterOption={false}
                      onSearch={this.fetchService}
                      onChange={this.handleChange}
                      style={{ width: '100%' }}
                    >
                      {this.renderOptionNodes(chanceServiceList)}
                    </Select>
               )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col xl={12} lg={24}>
                <FormItem
                  {...formItemLayout}
                  label="是否集群"
                >
                  {getFieldDecorator('iscolony', config)(
                    <RadioGroup>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup>
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
