import React, { Component } from 'react';
import { Table, Input, Form, Row, Col, Button, Icon, Upload, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './CommonSearch.less';
import { objKeyWrapper } from '../../../../../utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const PAGE_SIZE = 20;

@connect((state) => {
  return {
    commonSearchForm: state.virtualManage.commonSearchForm,
    commonlistInfo: state.virtualManage.commonlistInfo, // 列表详情
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.commonSearchForm, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'virtualManage/commonFormFieldChange',
      payload: fields,
    });
  },
})

export default class CommonSearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceENV: this.props.serviceENV,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }

  // 搜索
  handleSubmitFrom = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { rejecttime } = values;
        dispatch({
          type: 'virtualManage/fetchCommonList',
          payload: {
            // current_page: this.props.commonlistInfo.pagination.current, // 当前页码
            current_page: 1,
            page_size: PAGE_SIZE,
            search_text: values.search_text || undefined,
            env: this.state.serviceENV, // 环境变量
            rejecttimestart: rejecttime && rejecttime.length > 0 ? rejecttime[0].format('YYYY-MM-DD') : undefined, // 销毁开始时间
            rejecttimeend: rejecttime && rejecttime.length > 0 ? rejecttime[1].format('YYYY-MM-DD') : undefined, // 销毁开始时间
          },
        });
      }
    });
  }
  // 清除form
  handleResetFrom = () => {
    this.props.dispatch({
      type: 'virtualManage/commonFormFieldChange',
      payload: {
        search_text: {
          value: undefined,
        },
        rejecttime: { // 销毁时间
          value: undefined,
        },
      },
    });
  }

  render() {
    const { commonSearchForm } = this.props;
    // console.log('commonSearchForm', commonSearchForm);
    const searchLayout = {
      labelCol: {
        xl: { span: 3 },
        lg: { span: 24 },
      },
      wrapperCol: { span: 16 },
    };
    const formItemLayout = {
      labelCol: {
        xl: { span: 5 },
        lg: { span: 24 },
      },
      wrapperCol: { span: 16 },
    };

    const { getFieldDecorator } = this.props.form;
    const dateFormat = 'YYYY-MM-DD';
    return (
      <div className={styles.wrapper}>
        <Form >
          <Row>
            <Col xl={10} lg={24}>
              <FormItem
                {...searchLayout}
                label="搜索"
                className={styles.labelStyle}
              >
                {getFieldDecorator('search_text')(
                  <Input placeholder="请输入" />
                    )}
              </FormItem>
            </Col>
            {
              this.state.serviceENV == 'destory' ?
                <Col xl={10} lg={24}>
                  <FormItem
                    {...formItemLayout}
                    label="销毁时间"
                    className={styles.labelStyle}
                  >
                    {getFieldDecorator('rejecttime')(
                      <RangePicker
                        format={dateFormat}
                        style={{ width: '100%' }}
                      />
                      )}
                  </FormItem>
                </Col> : ''
            }
          </Row>
          <Row>
            <Col span={24} >
              <Button type="primary" htmlType="submit" onClick={this.handleSubmitFrom}>搜索</Button>
              <Button className={styles.btn} onClick={this.handleResetFrom}>清除</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
