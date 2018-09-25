import React, { Component } from 'react';
import { Modal, Form, Spin, Select } from 'antd';
import { connect } from 'dva';
import { objKeyWrapper } from '../../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
@connect((state) => {
  return {
    rollbackModal: state.release.rollbackModal,
    rollbackList: state.release.rollbackList,
    commonLoading: state.release.commonLoading,
    rollbackFormFields: state.release.rollbackFormFields,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.rollbackFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'release/rollbackFormFieldChange',
      payload: fields,
    });
  },
})

export default class RollbackModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectInfo: this.props.projectInfo,
    };
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'release/rollbackFormFieldChange',
      payload: {
        id: { // 回滚列表
          value: undefined,
        },
      },
    });
    dispatch({
      type: 'release/changeRollbackModal',
      payload: false,
    });
  }
  // 确定提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'release/handleRollBack',
        });
      }
    });
  }
  // 渲染option
   renderOptionNodes = (item) => {
     if (item && item.length > 0) {
       const optionNodes = item.map((nodeItem, index) => {
         return (
           <Option key={nodeItem.id} value={nodeItem.id}>{nodeItem.version}</Option>
         );
       });
       return optionNodes;
     }
   }

   render() {
     const { rollbackModal, commonLoading, rollbackList, rollbackFormFields } = this.props;
     //  console.log('commonLoading', commonLoading);
     const { getFieldDecorator } = this.props.form;
     const formItemLayout = {
       labelCol: { span: 6 },
       wrapperCol: { span: 18 },
     };
     return (
       <Modal
         title="回滚"
         visible={rollbackModal}
         onCancel={this.handleCancel}
         onOk={this.handleSubmit}
       >
         <Spin spinning={commonLoading}>
           <div>
             <Form>
               <FormItem
                 label="选择项目"
                 {...formItemLayout}
               >
                 {getFieldDecorator('project_name')(
                   <span>{this.state.projectInfo ? this.state.projectInfo.name : ''}</span>
                  )}
               </FormItem>
               <FormItem
                 label="选择版本"
                 {...formItemLayout}
               >
                 {getFieldDecorator('id')(
                   <Select
                     placeholder="请选择"
                   >
                     {this.renderOptionNodes(rollbackList)}
                   </Select>
                  )}
               </FormItem>
             </Form>
           </div>
         </Spin>

       </Modal>
     );
   }
}
