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
    commonModalStatus: state.virtualManage.commonModalStatus,
    commonLoading: state.virtualManage.commonLoading,
    dataDictionary: state.virtualManage.dataDictionary, // 数据字典
    commonFormFields: state.virtualManage.commonFormFields, // form
  };
})
@Form.create({
  mapPropsToFields(props) {
    return fromFilesWrapper(props.commonFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    // const newFields = formatDateTime(fields, ['buytime', 'repairtime']);
    // props.dispatch({
    //   type: 'physicalmanage/modalFormFieldChange',
    //   payload: newFields,
    // });
  },
})

export default class AddPhysicalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 分配至服务器
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      const currentId = this.props.commonFormFields.id.value;
      if (!err) {
        dispatch({
          type: 'virtualManage/operateService',
          payload: {
            id: currentId,
            env_id: values.env_id,
          },
          env: 'resourcepool',
          url: 'allotVirtual',
        });
      }
    });
  }
  // 取消按钮
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'virtualManage/saveCommonModalStatus',
      payload: false,
    });
    dispatch({
      type: 'virtualManage/initialCommonFormFields',
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
     const { commonModalStatus, commonLoading, dataDictionary } = this.props;
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
           title="分配服务器"
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
                     label="虚拟机SN"
                   >
                     {getFieldDecorator('serversn', config)(
                       <Input disabled />
                     )}
                   </FormItem>
                 </Col>
                 <Col xl={12} lg={24}>
                   <FormItem
                     {...formItemLayout}
                     label="主机名称"
                   >
                     {getFieldDecorator('servername', config)(
                       <Input disabled />
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
                     {getFieldDecorator('serverip', config)(
                       <Input disabled />
                     )}
                   </FormItem>
                 </Col>
                 <Col xl={12} lg={24}>
                   <FormItem
                     {...formItemLayout}
                     label="配置"
                   >
                     {getFieldDecorator('configName', config)(
                       <Input disabled />
                     )}
                   </FormItem>
                 </Col>
               </Row>

               <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                 <Col xl={12} lg={24}>
                   <FormItem
                     {...formItemLayout}
                     label="分配至"
                   >
                     {getFieldDecorator('env_id', config)(
                       <Select
                         placeholder="请选择"
                       >
                         {this.renderOptionNodes(dataDictionary.envlist)}
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
