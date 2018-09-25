import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Input, Form, Row, Col, Button, Icon, Upload, DatePicker } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './NotOnline.less';
import CommonSearchForm from './CommonSearchFrom/index';
import CommonTable from '../../../../components/CommonTable';
import ErrorModal from './CommonModal/ErrorModal';

const PAGE_SIZE = 20;

@connect((state) => {
  return {
    commonlistInfo: state.physicalmanage.commonlistInfo,
    commonSearchForm: state.physicalmanage.commonSearchForm,
    operateAuthor: state.physicalmanage.operateAuthor,
  };
})
@Form.create({})

export default class AllPhysical extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/fetchCommonList',
      payload: {
        current_page: 1,
        page_size: PAGE_SIZE,
        env: 'total',
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
        } },
    });
  }
  // form表单发生改变
  formFieldChange = (fields) => {}

  // 搜索提交
  handleSubmit = () => {}

  // 清除重置
  handleReset = () => {}

  // 分页查询
  paginationChange = (page) => {
    const { dispatch, commonSearchForm } = this.props;
    const svrfirstuseTime = commonSearchForm.svrfirstuse.value; // 购入时间
    const svrstopTime = commonSearchForm.svrstop.value; // 维保到期时间
    dispatch({
      type: 'physicalmanage/fetchCommonList',
      payload: {
        current_page: page.current,
        page_size: PAGE_SIZE,
        env: 'total',
        search_text: commonSearchForm.search_text.value || undefined,
        buytimestart: svrfirstuseTime && svrfirstuseTime.length > 0 ? svrfirstuseTime[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        buytimeend: svrfirstuseTime && svrfirstuseTime.length > 0 ? svrfirstuseTime[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        repairtimestart: svrstopTime && svrstopTime.length > 0 ? svrstopTime[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        repairtimeend: svrstopTime && svrstopTime.length > 0 ? svrstopTime[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
      },
    });
  }
  showErr = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'physicalmanage/changeErrorInfo',
      payload: {
        id: item.id,
      },
    });
  }
  // 下载导出
  checkedToken = () => {
    const url = `http://${document.domain}/api/cmdb/datadownload?file_type=0`;
    window.open(url);
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };
    const { getFieldDecorator } = this.props.form;
    const { commonlistInfo, operateAuthor } = this.props;
    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '主机名称',
      dataIndex: 'servername',
      key: 'servername',
    }, {
      title: '服务器SN',
      dataIndex: 'serversn',
      key: 'serversn',
    }, {
      title: '主机IP',
      dataIndex: 'serverip',
      key: 'serverip',
    }, {
      title: '管理IP',
      dataIndex: 'manageip',
      key: 'manageip',
    }, {
      title: '接入交换机IP',
      dataIndex: 'switchip',
      key: 'switchip',
    }, {
      title: '型号',
      dataIndex: 'servervendortype',
      key: 'servervendortype',
    }, {
      title: '机柜号',
      dataIndex: 'rackname',
      key: 'rackname',
    }, {
      title: '机房号',
      dataIndex: 'idcname',
      key: 'idcname',
    }, {
      title: '购入时间',
      dataIndex: 'buytime',
      key: 'buytime',
    }, {
      title: '维保到期时间',
      dataIndex: 'repairtime',
      key: 'repairtime',
    }, {
      title: '状态',
      dataIndex: 'runningstatus',
      key: 'runningstatus',
      render: (text, record) => {
        return (
          <span>
            {record.runningstatus == '正常' ? '正常' : <a onClick={this.showErr.bind(this, record)}>异常</a>}
          </span>
        );
      },
    }, {
      title: '环境',
      dataIndex: 'status',
      key: 'status',
    }];
    return (
      <PageHeaderLayout>
        <div>
          <h2>总物理服务器列表</h2>
          <div className={styles.wrapper} >
            <CommonSearchForm
              serviceENV="total"
            />
          </div>
          <div className={styles.btnWrapper}>
            <p className={styles.leftBtn}>{`共搜索到 ${commonlistInfo.pagination.total || 0} 条数据`}</p>
            <Button className={styles.rightBtn} onClick={this.checkedToken}>导出</Button>
          </div>
          <CommonTable
            columns={columns}
            tableData={commonlistInfo.list}
            pagination={commonlistInfo.pagination}
            loading={commonlistInfo.isLoading}
            onChange={this.paginationChange}
          />
          <ErrorModal />
        </div>
      </PageHeaderLayout>

    );
  }
}
