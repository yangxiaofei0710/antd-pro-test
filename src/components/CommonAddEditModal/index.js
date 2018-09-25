import React, { Component } from 'react';
import { Modal, Carousel, Button, Steps, Form, Input, Row, Col, Message, Spin } from 'antd';
import { connect } from 'dva';

const { Step } = Steps;
const FormItem = Form.Item;

@connect((state) => {
  return {
    formTemplate: state.formTemplate.formTemplate,
  };
})
@Form.create({})
export default class AddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSwitchIndex: 0, // 默认索引
      visibal: this.props.visibal, // 显示隐藏
      clickType: this.props.clickType, // 新增 or 编辑
      loading: this.props.loading, // loading效果控制
      handleCancel: this.props.handleCancel, // 取消回调
      BasicPage: this.props.BasicPage, // 基本配置页面
      SystemPage: this.props.SystemPage, // 系统配置页面
      ConfirmPage: this.props.ConfirmPage, // 确认信息
      handleSubmit: this.props.handleSubmit, // 确定新增/编辑回调
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    });
  }

  // 取消关闭modal
  handleCancel = (fun) => {
    this.props.handleCancel(fun);
  }

  // 切换上一步下一步回调
  handleChange = (index) => {
    this.setState({
      pageSwitchIndex: index,
    });
  }

  // 下一步
  handleNext = (fun) => {
    if (this.state.pageSwitchIndex == 0) {
      this.props.formTemplate.basicConfigForm.validateFields((err, values) => {
        if (!err) {
          console.log('校验成功');
          this.carousel.next();
        }
      });
    } else if (this.state.pageSwitchIndex == 1) {
      this.props.formTemplate.systemConfigForm.validateFields((err, values) => {
        if (!err) {
          console.log('校验成功');
          this.carousel.next();
        }
      });
    } else {
      this.props.handleSubmit(fun);
    }
  }
  // 返回修改
  handlePrev = () => {
    if (this.state.pageSwitchIndex !== 0) {
      this.carousel.prev();
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    const {
      pageSwitchIndex,
      visibal,
      clickType,
      handleCancel,
      BasicPage,
      SystemPage,
      ConfirmPage,
      handleSubmit,
      loading,
    } = this.state;
    const { formTemplate } = this.props;
    // console.log('1111', formTemplate);

    let topTitle = '';
    switch (clickType) {
      case 'add':
        topTitle = '新增';
        break;
      case 'edit':
        topTitle = '编辑';
        break;
      case 'allot':
        topTitle = '分配至资源池';
        break;
      default:
        break;
    }
    return (
      <div>
        <Modal
          visible={visibal}
          footer={false}
          title={topTitle}
          onOk={this.handleCancel.bind(this,
            () => { // 保存成功后，步骤条index为0，并且显示基本配置
                this.carousel.goTo(0);
                this.setState({
                    pageSwitchIndex: 0,
                });
            })}
          onCancel={this.handleCancel.bind(this,
            () => { // 保存成功后，步骤条index为0，并且显示基本配置
                this.carousel.goTo(0);
                this.setState({
                    pageSwitchIndex: 0,
                });
            })}
          width="800px"
        >
          <Spin spinning={loading}>
            <Steps current={pageSwitchIndex}>
              <Step title="基本配置" />
              <Step title="系统配置" />
              <Step title="确认信息" />
            </Steps>
            <Carousel
              ref={(c) => { this.carousel = c; }}
              dots={false}
              afterChange={this.handleChange}
            >
              <div style={{ padding: '20px' }}>
                <BasicPage />
              </div>
              <div style={{ padding: '20px' }}>
                <SystemPage />
              </div>
              <div style={{ padding: '20px' }}>
                <ConfirmPage />
              </div>
            </Carousel>
            <div style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                onClick={this.handleNext.bind(this,
                () => { // 保存成功后，步骤条index为0，并且显示基本配置
                    this.carousel.goTo(0);
                    this.setState({
                        pageSwitchIndex: 0,
                    });
                })}
                style={{ marginRight: '10px' }}
              >
                {pageSwitchIndex === 2 ? `确定${clickType == 'add' ? '新增' : '编辑'}` : '下一步'}
              </Button>
              <Button onClick={this.handlePrev} disabled={pageSwitchIndex == 0}>返回修改</Button>
            </div>
          </Spin>

        </Modal>
      </div>
    );
  }
}
