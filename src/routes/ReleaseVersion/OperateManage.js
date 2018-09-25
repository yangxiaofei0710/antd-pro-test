import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './VersionManage.less';
import SearchTree from '../../components/SearchTree';
import EnvTabs from './OperateTables/index';

const PAGE_SIZE = 20;
@connect((state) => {
  return {
    envname: state.operateManage.envname,
    selectKey: state.common.selectKey,
  };
})

export default class OperateManage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // 初始化列表
    dispatch({
      type: 'common/initListInfo',
    });
    // 初始化搜索框
    dispatch({
      type: 'common/formFieldChange',
      payload: {
        search_text: {
          value: undefined,
        },
      },
    });
    // 加载类目树
    dispatch({
      type: 'common/fetchTree',
      url: 'fetchReleaseTree',
    });
    // 默认生产环境
    dispatch({
      type: 'operateManage/changeEnv',
      payload: 'pro',
    });
  }

  // 选择树回调
  treeSelect = (selectedKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/treeSelect',
      payload: selectedKeys[0],
    });
    dispatch({
      type: 'common/fetchList',
      payload: {
        project_id: selectedKeys[0],
        current_page: 1,
        page_size: PAGE_SIZE,
        env: this.props.envname,
      },
      url: 'fetchOperateList',
    });
  }
  render() {
    return (
      <PageHeaderLayout>
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <h2 className={styles.topTitle}>操作管理</h2>
            <SearchTree
              treeSelect={this.treeSelect}
            />
          </div>
          <div className={styles.right}>
            <EnvTabs />
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}
