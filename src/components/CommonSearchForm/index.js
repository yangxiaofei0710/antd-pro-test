import React, { Component } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import { connect } from 'dva';
import { objKeyWrapper } from '../../utils/utils';
import styles from './index.less';

const FormItem = Form.Item;

@connect((state) => {
  return {
    commonFormFields: state.common.commonFormFields,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.commonFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'common/formFieldChange',
      payload: fields,
    });
  },
})

export default class CommonSearchForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) { // 父级组件搜索回调
        this.props.search(this.props.commonFormFields);
      }
    });
  }
  handleClear = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/formFieldChange',
      payload: {
        search_text: {
          value: undefined,
        },
      },
    });
  }
  render() {
    const { commonFormFields } = this.props;
    // console.log('commonFormFields', commonFormFields);
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 16 },
    };

    return (
      <div className={styles.wrapper}>
        <Form>
          <FormItem
            {...formItemLayout}
            label="搜索"
            className={styles.labelStyle}
          >
            {getFieldDecorator('search_text')(
              <Input placeholder="请输入" />
                    )}
          </FormItem>
          <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>搜索</Button>
          <Button className={styles.btn} onClick={this.handleClear}>清除</Button>

        </Form>
      </div>
    );
  }
}
