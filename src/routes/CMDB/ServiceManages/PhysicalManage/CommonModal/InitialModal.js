import React, { Component } from 'react';
import { Form, Select, Row, Col, Input, DatePicker, Modal, Spin } from 'antd';
import { connect } from 'dva';
// import moment from 'moment';
import { fromFilesWrapper, formatDateTime } from '../../../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
// const dateFormat = 'YYYY-MM-DD';
@connect((state) => {
  return {
    initModalStatus: state.physicalmanage.initModalStatus,
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
    const newFields = formatDateTime(fields, ['buytime', 'repairtime']);
    props.dispatch({
      type: 'physicalmanage/modalFormFieldChange',
      payload: newFields,
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
      type: 'physicalmanage/changeInitModalStatus',
      payload: false,
    });
    dispatch({
      type: 'physicalmanage/initialCommonFormFields',
    });
  }

  // 初始化
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      const currentId = this.props.commonFormFields.id.value;
      if (!err) {
        dispatch({
          type: 'physicalmanage/handleUpdate',
          payload: {
            id: currentId,
            os_id: values.os_id,
          },
          url: 'physicalInitial',
          env: 'offline',
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
     const { initModalStatus, dataDictionary, modalFormFields, commonLoading } = this.props;
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
           title="初始化"
           visible={initModalStatus}
           onOk={this.handleSubmit}
           onCancel={this.handleCancel}
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
                     {getFieldDecorator('serversn', config)(
                       <Input disabled />
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
                         disabled
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
                       <DatePicker disabled style={{ width: '100%' }} />
               )}
                   </FormItem>
                 </Col>
                 <Col xl={12} lg={24}>
                   <FormItem
                     {...formItemLayout}
                     label="维保到期时间"
                   >
                     {getFieldDecorator('repairtime', config)(
                       <DatePicker disabled style={{ width: '100%' }} />
               )}
                   </FormItem>
                 </Col>
               </Row>
               <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                 <Col xl={12} lg={24}>
                   <FormItem
                     {...formItemLayout}
                     label="选择重装的系统"
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
           </Spin>
         </Modal>
       </div>
     );
   }
}
