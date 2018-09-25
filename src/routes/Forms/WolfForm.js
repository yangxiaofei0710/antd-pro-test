import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Row, Col, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(state => ({
  wolfRecordFormInfo: state.wolfRecord.wolfRecordFormInfo,
  userOptions: state.wolfRecord.userOptions,
  roleOptions: state.wolfRecord.roleOptions,
}))
@Form.create()
export default class WolfForm extends PureComponent {
  constructor(props) {
    super(props);

    this.uuid = 0;
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'wolfRecord/fetchUserOptions',
      payload: {
        empName: '',
      },
    });
    this.props.dispatch({
      type: 'wolfRecord/fetchRoleOptions',
      payload: {
        name: '',
      },
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const dateFormat = 'YYYY-MM-DD HH:mm';
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const players = values.players.map((item) => {
          return {
            userId: values[`players-${item}-name`],
            roleId: values[`players-${item}-role`],
          };
        });
        const params = {
          ...values,
          ...{
            startAt: values.playDate[0].format(dateFormat),
            endAt: values.playDate[1].format(dateFormat),
          },
          players,
        };
        console.log(params);
        this.props.dispatch({
          type: 'wolfRecord/submitWolfForm',
          payload: params,
        });
      }
    });
  }
  remove = (k) => {
    const { form } = this.props;
    const players = form.getFieldValue('players');
    if (players.length === 1) {
      return;
    }
    form.setFieldsValue({
      players: players.filter(key => key !== k),
    });
  }

  add = () => {
    this.uuid += 1;
    const { getFieldValue, setFieldsValue } = this.props.form;
    const players = getFieldValue('players');
    const nextPlayers = players.concat(this.uuid);
    setFieldsValue({
      players: nextPlayers,
    });
  }
  render() {
    const { wolfRecordFormInfo, roleOptions, userOptions } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { isLoading } = wolfRecordFormInfo;
    getFieldDecorator('players', { initialValue: [] });
    const players = getFieldValue('players');
    const roles = roleOptions.map((role, index) => {
      return <Option key={index} value={role._id}>{role.name}</Option>;
    });
    const users = userOptions.map((user, index) => {
      return <Option key={index} value={user._id}>{user.empName}</Option>;
    });
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 20 },
      },
    };
    const innerFormItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const formItems = players.map((k, index) => {
      const num = index + 1;
      return (
        <Row>
          <Col span={11}>
            <FormItem
              {...innerFormItemLayout}
              label={`${num}号玩家姓名`}
              key={k}
            >
              {getFieldDecorator(`players-${num}-name`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: '请选择玩家',
              }],
            })(
              <Select placeholder="玩家姓名" style={{ width: '100%', marginRight: 8 }} >
                {users}
              </Select>
            )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem
              {...innerFormItemLayout}
              label={`${num}号玩家角色`}
              key={k}
            >
              {getFieldDecorator(`players-${num}-role`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: '请选择玩家角色',
              }],
            })(
              <Select placeholder="玩家角色" style={{ width: '100%', marginRight: 8 }} >
                {roles}
              </Select>
            )}
            </FormItem>

          </Col>
          <Col span={2}>
            {players.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={players.length === 1}
                onClick={() => this.remove(k)}
              />
              ) : null}
          </Col>
        </Row>

      );
    });

    return (
      <Form
        onSubmit={this.handleSubmit}
        hideRequiredMark
        style={{ marginTop: 8 }}
      >
        <FormItem
          {...formItemLayout}
          label="标题"
        >
          {getFieldDecorator('title', {
            rules: [{
              required: true, message: '请输入标题',
            }],
          })(
            <Input placeholder="给本场狼战起个名字" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="战绩日期"
        >
          {getFieldDecorator('playDate', {
            rules: [{
              required: true, message: '请选择狼战日期',
            }],
          })(
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="地点"
        >
          {getFieldDecorator('playLocation', {
            rules: [{
              required: true, message: '请输入地点',
            }],
          })(
            <Input placeholder="请输入地点" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="玩家"
        >
          {formItems}
        </FormItem>

        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
            <Icon type="plus" /> 添加玩家
          </Button>
        </FormItem>
        <FormItem style={{ marginTop: 32 }}>
          <Button style={{ float: 'right' }} type="primary" htmlType="submit" loading={isLoading}>
                提交
          </Button>
        </FormItem>
      </Form>
    );
  }
}
