import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select, Radio, Table, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { fromFilesWrapper, checkedIP } from '../../../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

@connect((state) => {
  return {
    dataDictionary: state.virtualManage.dataDictionary, // 数据字典
    commonFormFields: state.virtualManage.commonFormFields, // form
    selectedRowKeys: state.virtualManage.selectedRowKeys, // 套餐默认选择项
    relevancePhysical: state.virtualManage.relevancePhysical, // 模糊搜索物理机
    fetchingLoading: state.virtualManage.fetchingLoading,
    relevancePhysicalId: state.virtualManage.relevancePhysicalId, // 关联物理机id
  };
})
@Form.create({
  mapPropsToFields(props) {
    return fromFilesWrapper(props.commonFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    const newfields = fields;
    if (fields.hasOwnProperty('physical')) { // 取关联物理机最后一个
      newfields.physical.value = newfields.physical.value.slice(-1);
    }
    props.dispatch({
      type: 'virtualManage/modalFormFieldChange',
      payload: newfields,
    });
  },
})

export default class BasicConfig extends Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchPhysical = debounce(this.fetchPhysical, 800);
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
      case 3:
        selectKey = '4';
        break;
      default:
        break;
    }
    const { dispatch } = this.props;
    dispatch({ // 暂存当前已选择套餐
      type: 'virtualManage/changeSelectedRowKey',
      payload: selectedRowKeys,
    });
    dispatch({ // 设置当前已选择套餐id
      type: 'virtualManage/modalFormFieldChange',
      payload: {
        config: {
          value: selectKey,
        },
      },
    });
  }

  // 搜索物理机
  fetchPhysical = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'virtualManage/fetchPhysical',
      payload: {
        search_text: value,
      },
    });
  }
  // 选择物理机
  handleChange = (value, option) => {
    // console.log('11', value, option);
    const { dispatch } = this.props;
    dispatch({
      type: 'virtualManage/changeRelevancePhysical',
      payload: [],
    });
    dispatch({ // 暂存当前选择物理机的id
      type: 'virtualManage/changeRelevancePhysicalId',
      payload: option.length > 0 ? option[option.length - 1].key : undefined,
    });
    dispatch({
      type: 'virtualManage/changeFetchingLoading',
      payload: false,
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
      dataDictionary,
      selectedRowKeys,
      commonFormFields,
      relevancePhysical, // 归属物理机
      fetchingLoading,
    } = this.props;
    // console.log('selectedRowKeys', selectedRowKeys);
    const dateFormat = 'YYYY-MM-DD';
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    const formItemConfigLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const { getFieldDecorator } = this.props.form;
    const config = {
      rules: [{ required: true, message: '请完善信息后提交' }],
    };
    const columns = [{
      title: '规格名称',
      dataIndex: 'flavor',
      key: 'flavor',
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
    return (
      <div>
        <Form>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} lg={24}>
              <FormItem
                {...formItemConfigLayout}
                label="配置"
              >
                {getFieldDecorator('config')(
                  <Table
                    columns={columns}
                    rowSelection={rowSelection}
                    dataSource={dataDictionary.configlist}
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
                label="主机IP"
              >
                {getFieldDecorator('serverip', {
                  rules: [{
                    required: true, message: '请完善信息后提交',
                  }, {
                    validator: checkedIP,
                  }],
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
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} lg={24}>
              <FormItem
                {...formItemConfigLayout}
                label="物理机IP"
              >
                {getFieldDecorator('physical', config)(
                  <Select
                    mode="multiple"
                    placeholder="请选择"
                    notFoundContent={fetchingLoading ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={this.fetchPhysical}
                    onChange={this.handleChange}
                    style={{ width: '100%' }}
                  >
                    {relevancePhysical.map(d => (
                      <Option key={d.id} value={d.value}>
                        {d.text}
                      </Option>)
                    )}
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
