import React, { Component } from 'react';
import { Form, Select, Row, Col, Input, DatePicker, Modal, Spin } from 'antd';
import { connect } from 'dva';
import { fromFilesWrapper } from '../../../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
@connect((state) => {
  return {
    commonModalStatus: state.physicalmanage.commonModalStatus,
    dataDictionary: state.physicalmanage.dataDictionary,
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
      type: 'physicalmanage/initialModalFormField',
    });
  }
  // 回归
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
          },
          url: 'physicalRegress',
          env: 'repair',
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
     const { commonModalStatus, dataDictionary, modalFormFields, commonLoading } = this.props;
     //  console.log('adddddd', modalFormFields);
     const formItemLayout = {
       labelCol: { span: 8 },
       wrapperCol: { span: 16 },
     };
     const { getFieldDecorator } = this.props.form;
     return (
       <div>
         <Modal
           title="回归"
           visible={commonModalStatus}
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
                     {getFieldDecorator('serversn')(
                       <Input disabled />
               )}
                   </FormItem>
                 </Col>
                 <Col xl={12} lg={24}>
                   <FormItem
                     {...formItemLayout}
                     label="型号"
                   >
                     {getFieldDecorator('servervendortype_id')(
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
                     {getFieldDecorator('buytime')(
                       <DatePicker disabled style={{ width: '100%' }} />
               )}
                   </FormItem>
                 </Col>
                 <Col xl={12} lg={24}>
                   <FormItem
                     {...formItemLayout}
                     label="维保到期时间"
                   >
                     {getFieldDecorator('repairtime')(
                       <DatePicker disabled style={{ width: '100%' }} />
               )}
                   </FormItem>
                 </Col>
               </Row>
               <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                 <Col xl={12} lg={24}>
                   <FormItem
                     {...formItemLayout}
                     label="回归至"
                   >
                     {getFieldDecorator('regress')(
                       <Input disabled />
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
