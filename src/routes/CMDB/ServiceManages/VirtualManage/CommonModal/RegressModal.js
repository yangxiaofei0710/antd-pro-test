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
    regressModalStatus: state.virtualManage.regressModalStatus,
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

export default class RegressModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 重新上线
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
          },
          env: 'offline',
          url: 'regressVirtual',
        });
      }
    });
  }
  // 取消按钮
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'virtualManage/saveRegressModalStatus',
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
     const { regressModalStatus, commonLoading, dataDictionary } = this.props;
     //  console.log('重新上线至', regressModalStatus);
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
           title="重新上线至"
           visible={regressModalStatus}
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
                     label="重新上线至"
                   >
                     {getFieldDecorator('regress', config)(
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
