import React, { Component } from 'react';
import { Table, Input, Form, Row, Col, Button, Icon, Upload, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';
import { objKeyWrapper } from '../../../../../utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const PAGE_SIZE = 20;

@connect((state) => {
  return {
    commonSearchForm: state.physicalmanage.commonSearchForm,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.commonSearchForm, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'physicalmanage/commonFormFieldChange',
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

  // 搜索提交form
  handleSubmitFrom = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 格式化搜索框日期
        const svrfirstuseTime = values.svrfirstuse;
        const svrstopTime = values.svrstop;
        const svroffTime = values.svroff;
        dispatch({
          type: 'physicalmanage/fetchCommonList',
          payload: {
            current_page: 1,
            page_size: PAGE_SIZE,
            search_text: values.search_text || undefined,
            buytimestart: svrfirstuseTime && svrfirstuseTime.length > 0 ? svrfirstuseTime[0].format('YYYY-MM-DD') : undefined, // 购入开始时间
            buytimeend: svrfirstuseTime && svrfirstuseTime.length > 0 ? svrfirstuseTime[1].format('YYYY-MM-DD') : undefined, // 购入结束时间
            repairtimestart: svrstopTime && svrstopTime.length > 0 ? svrstopTime[0].format('YYYY-MM-DD') : undefined, // 维保开始时间
            repairtimeend: svrstopTime && svrstopTime.length > 0 ? svrstopTime[1].format('YYYY-MM-DD') : undefined, // 维保结束时间
            rejecttimestart: svroffTime && svroffTime.length > 0 ? svroffTime[0].format('YYYY-MM-DD') : undefined, // 报废开始时间
            rejecttimeend: svroffTime && svroffTime.length > 0 ? svroffTime[1].format('YYYY-MM-DD') : undefined, // 报废结束时间
            env: this.state.serviceENV, // 环境变量
          },
        });
      }
    });
  }
  // 清除form
  handleResetFrom = () => {
    this.props.dispatch({
      type: 'physicalmanage/commonFormFieldChange',
      payload: {
        search_text: {
          value: undefined,
        },
        svrfirstuse: {
          value: undefined,
        },
        svrstop: {
          value: undefined,
        },
        svroff: { // 报废时间
          value: undefined,
        },
      },
    });
  }
  render() {
    const searchLayout = {
      labelCol: {
        xl: { span: 3 },
        lg: { span: 24 },
      },
      wrapperCol: { span: 15 },
    };
    const buyTimeLayout = {
      labelCol: {
        xl: { span: 5 },
        lg: { span: 24 },
      },
      wrapperCol: { span: 15 },
    };
    const overTimeLayout = {
      labelCol: {
        xl: { span: 6 },
        lg: { span: 24 },
      },
      wrapperCol: { span: 15 },
    };

    const { getFieldDecorator } = this.props.form;
    const dateFormat = 'YYYY-MM-DD';
    // console.log(this.state.serviceENV);
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
            <Col xl={10} lg={24}>
              <FormItem
                {...buyTimeLayout}
                label="购入时间"
                className={styles.labelStyle}
              >
                {getFieldDecorator('svrfirstuse')(
                  <RangePicker
                    format={dateFormat}
                    style={{ width: '100%' }}
                  />
                    )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col xl={10} lg={24}>
              <FormItem
                {...overTimeLayout}
                label="维保到期时间"
                className={styles.labelStyle}
              >
                {getFieldDecorator('svrstop')(
                  <RangePicker
                    format={dateFormat}
                    style={{ width: '100%' }}
                  />
                    )}
              </FormItem>
            </Col>
            {
              this.state.serviceENV == 'reject' ?
                <Col xl={10} lg={24}>
                  <FormItem
                    {...buyTimeLayout}
                    label="报废时间"
                    className={styles.labelStyle}
                  >
                    {getFieldDecorator('svroff')(
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
