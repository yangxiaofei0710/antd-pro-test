import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Divider, Button, Icon } from 'antd';
import { connect } from 'dva';
import { objKeyWrapper } from '../../../utils/utils';
import styles from './edit.less';

const FormItem = Form.Item;
const uuid = 0;

@connect((state) => {
  return {
    modalDataInfo: state.TemplateList.modalDataInfo,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.modalDataInfo.modalData, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'TemplateList/formFieldChange',
      payload: fields,
    });
  },
})

export default class Edit extends Component {
    // 取消按钮，隐藏modal
    handleCancel=() => {
      const { dispatch } = this.props;
      dispatch({
        type: 'TemplateList/changeModalStatus',
        payload: {
          bol: false,
        },
      });
      dispatch({
        type: 'TemplateList/handleCancel',
      });
    }

    // 增加内容
    add = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'TemplateList/addDeleteContent',
        payload: {
          type: 'add',
        },
      });
    }
    // 删除某条内容
    remove = (k) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'TemplateList/addDeleteContent',
        payload: {
          type: 'remove',
          index: k,
        },
      });
    }

    // 提交已编辑的内容
    handleSubmit = (e, id) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const dicContentArr = [];
          Object.keys(values).forEach((item) => {
            if (item !== 'dic_name') {
              dicContentArr.push(values[item]);
            }
          });
          const { dispatch, modalDataInfo } = this.props;
          dispatch({
            type: 'TemplateList/save',
            payload: {
              dic_name: values.dic_name,
              dic_content: dicContentArr,
              dic_id: modalDataInfo.editId,
            },
          });
          // console.log('Received values of form: ', values);
        }
      });
    }

    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 15 },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 15, offset: 6 },
        },
      };
      const { modalDataInfo } = this.props;
      // console.log('modalDataInfo', modalDataInfo);

      // 根据字段内容arr遍历显示
      const keys = modalDataInfo.modalData.dic_content.value;
      const formItems = keys.map((k, index) => {
        return (
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? '字段内容' : ''}
            required={false}
          >
            {getFieldDecorator(`dic_content${index}`, {
            })(
              <Input style={{ width: '80%', marginRight: 8 }} />
            )}
            {keys.length > 1 ? (
              <Icon
                className={styles.dynamicDeleteButton}
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(index)}
              />
            ) : null}
          </FormItem>
        );
      });
      return (
        <div>
          <Modal
            title="编辑"
            visible={modalDataInfo.modalStatus}
            onCancel={this.handleCancel}
            onOk={this.handleSubmit}
          >
            <Form>
              <FormItem
                {...formItemLayout}
                label="字段名称"
              >
                {getFieldDecorator('dic_name')(
                  <Input disabled style={{ width: '80%', marginRight: 8 }} />
               )}
              </FormItem>
              {formItems}
              <FormItem {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                  <Icon type="plus" /> 增加字段内容
                </Button>
              </FormItem>
            </Form>
          </Modal>
        </div>

      );
    }
}
