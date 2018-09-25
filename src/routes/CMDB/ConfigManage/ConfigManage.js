import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Icon } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './ConfigManage.less';
import SearchTree from '../../../components/SearchTree';
import EnvTabs from './Tables/index';

const PAGE_SIZE = 20;
@connect((state) => {
  return {
    envname: state.configManage.envname,
    loading: state.configManage.loading,
  };
})

export default class ConfigManage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/initListInfo',
    });
    dispatch({
      type: 'common/formFieldChange',
      payload: {
        search_text: {
          value: undefined,
        },
      },
    });
    dispatch({
      type: 'common/fetchTree',
      url: 'fetchConfigTree',
    });
    // 默认生产环境
    dispatch({
      type: 'configManage/changeEnvId',
      payload: '生产环境',
    });
  }
  treeSelect = (selectedKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/fetchList',
      payload: {
        id: selectedKeys[0],
        current_page: 1,
        page_size: PAGE_SIZE,
        envname: this.props.envname,
      },
      url: 'fetchConfigList',
    });
    dispatch({
      type: 'common/treeSelect',
      payload: selectedKeys[0],
    });
  }
  render() {
    const { projectTree, loading } = this.props;
    return (
      <PageHeaderLayout>
        <Spin
          spinning={loading}
          tip="编译中..."
        >
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <h2 className={styles.topTitle}>资源对象管理</h2>
              <SearchTree
                treeSelect={this.treeSelect}
              />
            </div>
            <div className={styles.right}>
              <EnvTabs />
            </div>
          </div>
        </Spin>

      </PageHeaderLayout>
    );
  }
}
