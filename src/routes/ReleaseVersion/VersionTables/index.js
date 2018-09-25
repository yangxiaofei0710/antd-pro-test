import React, { Component } from 'react';
import { Tabs, message } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import Tables from './Table';

const { TabPane } = Tabs;
const PAGE_SIZE = 20;

@connect((state) => {
  return {
    selectKey: state.common.selectKey,
    envname: state.versionManage.envname,
  };
})
export default class EnvTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  switchEnv = (key) => {
    const { dispatch, selectKey } = this.props;
    dispatch({
      type: 'versionManage/changeEnv',
      payload: key,
    });
    if (!selectKey) {
      message.warning('请选择项目');
    } else {
      dispatch({
        type: 'common/fetchList',
        payload: {
          project_id: selectKey,
          current_page: 1,
          page_size: PAGE_SIZE,
          env: key,
        },
        url: 'fetchVersionList',
      });
    }
  }
  render() {
    const { envname } = this.props;
    return (
      <div className={styles.wrapper}>
        <Tabs activeKey={envname} onChange={this.switchEnv}>
          <TabPane tab="生产环境" key="pro">
            <Tables />
          </TabPane>
          <TabPane tab="预发环境" key="pre">
            <Tables />
          </TabPane>
          <TabPane tab="测试环境" key="test">
            <Tables />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

