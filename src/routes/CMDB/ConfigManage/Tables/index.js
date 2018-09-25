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
    envname: state.configManage.envname,
  };
})
export default class EnvTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  switchEnv = (key) => {
    // console.log('key', key);
    const { dispatch, selectKey } = this.props;
    dispatch({
      type: 'configManage/changeEnvId',
      payload: key,
    });
    if (!selectKey) {
      message.warning('请选择服务');
    } else {
      dispatch({
        type: 'common/fetchList',
        payload: {
          id: selectKey,
          current_page: 1,
          page_size: PAGE_SIZE,
          envname: key,
        },
        url: 'fetchConfigList',
      });
    }
  }
  render() {
    const { envname } = this.props;
    return (
      <div className={styles.wrapper}>
        <Tabs activeKey={envname} onChange={this.switchEnv}>
          <TabPane tab="生产环境" key="生产环境">
            <Tables />
          </TabPane>
          <TabPane tab="预发环境" key="预发环境">
            <Tables />
          </TabPane>
          <TabPane tab="测试环境" key="测试环境">
            <Tables />
          </TabPane>
          <TabPane tab="开发环境" key="开发环境">
            <Tables />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

