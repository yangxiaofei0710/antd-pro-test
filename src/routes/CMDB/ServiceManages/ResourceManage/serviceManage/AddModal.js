import React, { Component } from 'react';
import { Modal, Carousel, Button, Steps, Form, Input, Row, Col, Message, Spin } from 'antd';
import { connect } from 'dva';
import BasicConfig from './BasicConfig';
import SystemConfig from './SystemConfig';
import ConfirmMessage from './ConfirmeMessage';
import { getObjKey, deleteArrItem } from '../../../utils/utils';


const { Step } = Steps;
const FormItem = Form.Item;

@connect((state) => {
  return {
    modalStatus: state.serviceManage.modalStatus,
    pageSwitchIndex: state.serviceManage.pageSwitchIndex,
    loading: state.serviceManage.loading,
    addFormFields: state.serviceManage.addFormFields,
    checkedPassword: state.serviceManage.checkedPassword,
    checkedHostName: state.serviceManage.checkedHostName,
    checkedComment: state.serviceManage.checkedComment,
  };
})
@Form.create({})
export default class AddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceManage/fetchDataDictionary',
    });
    dispatch({
      type: 'serviceManage/fetchVpc',
    });
  }
  // 取消关闭modal
  handleCancel = () => {
    const { dispatch, pageSwitchIndex } = this.props;
    dispatch({
      type: 'serviceManage/changeStatus',
      payload: false,
      callback: () => { this.carousel.goTo(0); },
    });
  }

  // 切换上一步下一步回调
  handleChange = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceManage/pageSwitch',
      payload: index,
    });
  }

  // 下一步
  handleNext = (item) => {
    let arrOut = [];
    const loginpassword = item.loginpassword.value;
    const confirmpassword = item.confirmpassword.value;
    // console.log('checkedPassword', this.props.checkedPassword, this.props.checkedHostName);
    if (this.props.pageSwitchIndex !== 2) {
      this.carousel.next();
    }

    if (this.props.pageSwitchIndex == 2) { // 确认新增
      arrOut = getObjKey(item);
      if (item.useoutip.value === false) { // 如果不使用私网，不考虑带宽的值
        arrOut = deleteArrItem(arrOut, 'networkband');
        arrOut = deleteArrItem(arrOut, 'bandtype');
      }
      if (arrOut.length > 0) { // arrOut 数组长度大于0 表单没有填写完整
        Message.error('请校验数据是否填写完整');
      } else if (loginpassword !== confirmpassword) { // 两次密码输入不一致
        Message.error('请校验输入密码是否一致');
      } else if (!this.props.checkedPassword) {
        Message.error('输入密码格式不正确');
      } else if (!this.props.checkedHostName) {
        Message.error('输入主机名格式不正确');
      } else if (!this.props.checkedComment) {
        Message.error('输入备注格式不正确');
      } else {
        const { dispatch } = this.props;
        dispatch({
          type: 'serviceManage/addService',
          callback: () => { this.carousel.goTo(0); }, // 新增成功后，关闭modal， 走马灯显示第一页
        });
      }
    }
  }
  // 返回修改
  handlePrev = () => {
    if (this.props.pageSwitchIndex !== 0) {
      this.carousel.prev();
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    const { modalStatus, pageSwitchIndex, loading, addFormFields } = this.props;
    return (
      <div>
        <Modal
          visible={modalStatus}
          footer={false}
          title="新增"
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
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
                <BasicConfig />
              </div>
              <div style={{ padding: '20px' }}>
                <SystemConfig />
              </div>
              <div style={{ padding: '20px' }}>
                <ConfirmMessage />
              </div>
            </Carousel>
            <div style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                onClick={this.handleNext.bind(this, addFormFields)}
                style={{ marginRight: '10px' }}
              >
                {pageSwitchIndex === 2 ? '确定新增' : '下一步'}
              </Button>
              <Button onClick={this.handlePrev} disabled={pageSwitchIndex == 0}>返回修改</Button>
            </div>

          </Spin>

        </Modal>
      </div>
    );
  }
}
