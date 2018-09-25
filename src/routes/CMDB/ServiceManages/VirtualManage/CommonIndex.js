import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import CommonSearchForm from './CommonSearchFrom/CommonSearch';
import styles from './CommonIndex.less';
import CommonTable from '../../../../components/CommonTable';
import AddModal from '../../../../components/CommonAddEditModal'; // 新增/编辑
import BasicConfig from './CommonSearchFrom/BasicConfig';
import SystemConfig from './CommonSearchFrom/SystematicConfig';
import ConfirmeMessage from './CommonSearchFrom/ConfirmeMessage';


const PAGE_SIZE = 20;

@connect((state) => {
  return {
    commonlistInfo: state.virtualManage.commonlistInfo, // 列表详情
    commonSearchForm: state.virtualManage.commonSearchForm, // 搜索条件
    modalStatus: state.virtualManage.modalStatus, // 新增/编辑 modal
    commonLoading: state.virtualManage.commonLoading, // 新增/编辑 modal
  };
})

export default class CommonIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title, // 标题名称
      envType: this.props.envType, // 当前列表
      btn: this.props.btn,
      columns: this.props.columns, // table 列
      clickType: this.props.clickType,
      handleSubmit: this.props.handleSubmit,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'virtualManage/fetchCommonList',
      payload: {
        current_page: 1,
        page_size: PAGE_SIZE,
        env: this.state.envType,
      },
    });
    dispatch({ // 加载数据字典
      type: 'virtualManage/fetchDataDictionary',
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }

  // 分页
  paginationChange = (page) => {
    const { dispatch, commonSearchForm } = this.props;
    const rejecttime = commonSearchForm.rejecttime.value; // 销毁时间
    dispatch({
      type: 'virtualManage/fetchCommonList',
      payload: {
        current_page: page.current,
        page_size: PAGE_SIZE,
        env: this.state.envType,
        search_text: commonSearchForm.search_text.value || undefined,
        rejecttimestart: rejecttime && rejecttime.length > 0 ? rejecttime[0].format('YYYY-MM-DD') : undefined, // 销毁开始时间
        rejecttimeend: rejecttime && rejecttime.length > 0 ? rejecttime[1].format('YYYY-MM-DD') : undefined, // 销毁开始时间
      },
    });
  }

  handleSubmit = (fun) => {
    this.state.handleSubmit(fun);
  }

  closeModal = (fun) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'virtualManage/changeModalStatus',
      payload: false,
      callback: fun,
    });
    dispatch({
      type: 'virtualManage/initialCommonFormFields',
    });
  }

  render() {
    const { commonlistInfo, modalStatus, commonLoading } = this.props;
    // console.log('commonlistInfo', commonlistInfo);
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
          <CommonTable
            columns={this.state.columns} // 列
            tableData={commonlistInfo.list} // 数据
            pagination={commonlistInfo.pagination} // 分页
            loading={commonlistInfo.isLoading} // loading效果
            onChange={this.paginationChange} // 分页回调
          />
          <AddModal
            visibal={modalStatus}
            clickType={this.state.clickType} // 当前点击类型
            loading={commonLoading}
            handleCancel={this.closeModal} // 关闭modal
            handleSubmit={this.handleSubmit}
            BasicPage={BasicConfig}
            SystemPage={SystemConfig}
            ConfirmPage={ConfirmeMessage}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
