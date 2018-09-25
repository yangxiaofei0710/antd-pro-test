import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Input, Form, Row, Col, Button, Icon, Upload, DatePicker } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './NotOnline.less';
import CommonSearchForm from './CommonSearchFrom/index';
import CommonTable from '../../../../components/CommonTable';
import AddModal from '../../../../components/CommonAddEditModal';
import BasicConfig from './CommonSearchFrom/BasicConfig';
import SystemConfig from './CommonSearchFrom/SystematicConfig';
import ConfirmMessage from './CommonSearchFrom/ConfirmeMessage';

const FormItem = Form.Item;
const PAGE_SIZE = 20;
const { RangePicker } = DatePicker;

@connect((state) => {
  return {
    addModalStatus: state.physicalmanage.addModalStatus,
    commonlistInfo: state.physicalmanage.commonlistInfo,
    commonSearchForm: state.physicalmanage.commonSearchForm,
    modalStatus: state.physicalmanage.modalStatus,
    commonLoading: state.physicalmanage.commonLoading,
    dataDictionary: state.physicalmanage.dataDictionary,
    modalFormFields: state.physicalmanage.modalFormFields,
  };
})
@Form.create({})

export default class CommonIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickType: this.props.clickType,
      envType: this.props.type,
      columns: this.props.columns,
      btn: this.props.btn,
      title: this.props.title,
      upload: this.props.upload,
      handleSubmit: this.props.handleSubmit,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/fetchCommonList',
      payload: {
        current_page: 1,
        page_size: PAGE_SIZE,
        env: this.state.envType,
      },
    });
    dispatch({
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
        svroff: {
          value: undefined,
        },
      },
    });
    dispatch({ // 加载数据字典
      type: 'physicalmanage/fetchDataDictionary',
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }


  // 分页
  paginationChange = (page) => {
    const { dispatch, commonSearchForm } = this.props;
    const svrfirstuseTime = commonSearchForm.svrfirstuse.value; // 购入时间
    const svrstopTime = commonSearchForm.svrstop.value; // 维保到期时间
    const svroffTime = commonSearchForm.svroff.value; // 报废时间
    dispatch({
      type: 'physicalmanage/fetchCommonList',
      payload: {
        current_page: page.current,
        page_size: PAGE_SIZE,
        env: this.state.envType,
        search_text: commonSearchForm.search_text.value || undefined,
        buytimestart: svrfirstuseTime && svrfirstuseTime.length > 0 ? svrfirstuseTime[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        buytimeend: svrfirstuseTime && svrfirstuseTime.length > 0 ? svrfirstuseTime[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        repairtimestart: svrstopTime && svrstopTime.length > 0 ? svrstopTime[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        repairtimeend: svrstopTime && svrstopTime.length > 0 ? svrstopTime[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        rejecttimestart: svroffTime && svroffTime.length > 0 ? svroffTime[0].format('YYYY-MM-DD') : undefined, // 报废开始时间
        rejecttimeend: svroffTime && svroffTime.length > 0 ? svroffTime[1].format('YYYY-MM-DD') : undefined, // 报废结束时
      },
    });
  }


  // 关闭modal
  closeModal = (fun) => {
    const { dispatch } = this.props;
    dispatch({ // 控制modal显示隐藏
      type: 'physicalmanage/changeModalStatus',
      payload: false,
      callback: fun,
    });
    dispatch({
      type: 'physicalmanage/saveClickType',
      payload: undefined,
    });
    dispatch({
      type: 'physicalmanage/initialCommonFormFields',
    });
  }

  handleSubmit = (fun) => {
    this.state.handleSubmit(fun);
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };
    const { getFieldDecorator } = this.props.form;
    const {
      commonlistInfo,
      modalStatus,
      commonLoading,
      modalFormFields,
    } = this.props;

    return (
      <PageHeaderLayout>
        <div>
          <h2>{this.state.title}</h2>
          <div className={styles.wrapper}>
            <CommonSearchForm
              serviceENV={this.state.envType}
            />
          </div>
          <div className={styles.btnWrapper}>
            <p className={styles.leftBtn}>{`共搜索到 ${commonlistInfo.pagination.total || 0} 条数据`}</p>
            {this.state.btn}
          </div>
          {/* <UploadModal /> */}
          {this.state.upload}
          <CommonTable
            columns={this.state.columns}
            tableData={commonlistInfo.list}
            pagination={commonlistInfo.pagination}
            loading={commonlistInfo.isLoading}
            onChange={this.paginationChange}
          />
          <AddModal
            visibal={modalStatus}
            clickType={this.state.clickType}
            loading={commonLoading}
            handleCancel={this.closeModal} // 关闭modal
            handleSubmit={this.handleSubmit}
            BasicPage={BasicConfig}
            SystemPage={SystemConfig}
            ConfirmPage={ConfirmMessage}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
