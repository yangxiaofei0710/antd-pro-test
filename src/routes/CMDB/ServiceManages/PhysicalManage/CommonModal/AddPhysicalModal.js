import React, { Component } from 'react';
import { Form, Select, Row, Col, Input, DatePicker, Modal, Spin } from 'antd';
import { connect } from 'dva';
// import moment from 'moment';
import { fromFilesWrapper } from '../../../../../utils/utils';
import { checkedServiceSn } from './checkRules';

const FormItem = Form.Item;
const { Option } = Select;
// const dateFormat = 'YYYY-MM-DD';
@connect((state) => {
  return {
    commonModalStatus: state.physicalmanage.commonModalStatus,
    dataDictionary: state.physicalmanage.dataDictionary,
    // modalFormFields: state.physicalmanage.modalFormFields,
    commonLoading: state.physicalmanage.commonLoading,
    commonFormFields: state.physicalmanage.commonFormFields,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return fromFilesWrapper(props.commonFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'physicalmanage/modalFormFieldChange',
      payload: fields,
    });
  },
})

export default class AddPhysicalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 取消按钮
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/saveCommonModalStatus',
      payload: false,
    });
    dispatch({
      type: 'physicalmanage/initialCommonFormFields',
    });
  }
  // 确定新增/编辑
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const currentId = (this.props.type == 'add' ? undefined : this.props.commonFormFields.id.value);
    this.props.form.validateFields((err, values) => {
      const { buytime } = values;
      const { repairtime } = values;
      if (!err) {
        dispatch({
          type: 'physicalmanage/handleAddEdit',
          payload: {
            id: currentId,
            serversn: values.serversn, // 服务器sn
            servervendortype_id: values.servervendortype_id, // 服务器型号
            idc_id: values.idc_id, // 机房号
            buytime: buytime ? buytime.format('YYYY-MM-DD') : undefined,
            repairtime: repairtime ? repairtime.format('YYYY-MM-DD') : undefined,
          },
          env: 'notonline',
          clickType: this.props.type,
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
     const { commonModalStatus, dataDictionary, commonLoading, commonFormFields } = this.props;
     //  console.log('dataDictionary', dataDictionary);
     const formItemLayout = {
       labelCol: { span: 8 },
       wrapperCol: { span: 16 },
     };
     const { getFieldDecorator } = this.props.form;
     const config = {
       rules: [{ required: true, message: '请完善信息后提交' }],
     };
     return (
       <div>
         <Modal
           title={this.props.type == 'add' ? '新增物理机' : '编辑物理机'}
           visible={commonModalStatus}
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
                     label="服务器SN"
                   >
                     {getFieldDecorator('serversn', {
                        rules: [{
                          required: true, message: '请完善信息后提交',
                        }, {
                          validator: checkedServiceSn,
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
                     label="型号"
                   >
                     {getFieldDecorator('servervendortype_id', config)(
                       <Select
                         placeholder="请选择"
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
                     label="机房号"
                   >
                     {getFieldDecorator('idc_id', config)(
                       <Select
                         placeholder="请选择"
                       >
                         {this.renderOptionNodes(dataDictionary.idclist)}
                       </Select>
                      )}
                   </FormItem>
                 </Col>
                 <Col xl={12} lg={24}>
                   <FormItem
                     {...formItemLayout}
                     label="购入时间"
                   >
                     {getFieldDecorator('buytime', config)(
                       <DatePicker style={{ width: '100%' }} />
                    )}
                   </FormItem>
                 </Col>
               </Row>
               <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                 <Col xl={12} lg={24}>
                   <FormItem
                     {...formItemLayout}
                     label="维保到期时间"
                   >
                     {getFieldDecorator('repairtime', config)(
                       <DatePicker style={{ width: '100%' }} />
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
