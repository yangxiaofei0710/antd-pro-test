import React, { Component } from 'react';
import { Tabs, Message } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import EnvTable from './ReleaseTable/index';
import { objKeyWrapper } from '../../utils/utils';

const { TabPane } = Tabs;
const PAGE_SIZE = 20;
const getValuesFromFields = (obj) => {
  return obj.value;
};

@connect((state) => {
  return {
    searchFormFields: state.release.searchFormFields,
  };
})
export default class Release extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { dispatch, searchFormFields } = this.props;
    const commonFormFields = objKeyWrapper(searchFormFields, getValuesFromFields);
    const { createTime } = commonFormFields;
    dispatch({
      type: 'common/initListInfo',
    });
    dispatch({
      type: 'release/changeEnv',
      payload: 'pre',
    });
    dispatch({
      type: 'common/fetchList',
      payload: {
        env: 'pre',
        current_page: 1,
        page_size: PAGE_SIZE,
        starttime: createTime && createTime.length > 0 ? createTime[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        endtime: createTime && createTime.length > 0 ? createTime[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        ...commonFormFields,
      },
      url: 'fetchReleaseList',
    });
  }
  render() {
    return (
      <PageHeaderLayout>
        <div>
          <EnvTable title="预发环境-发布" />
        </div>
      </PageHeaderLayout>

    );
  }
}
