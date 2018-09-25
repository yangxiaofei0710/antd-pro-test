import React, { Component } from 'react';
import { Modal, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './ProjectName.less';

@connect((state) => {
  return {
    projectModalDataInfo: state.projectInfo.projectModalDataInfo,
    isLoading: state.projectInfo.isLoading,
    projectId: state.projectList.projectId,
  };
})

export default class ProjectName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibal: this.props.visibal,
      id: this.props.id,
      projectInfoName: this.props.projectInfoName,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visibal !== this.props.visibal) {
      this.setState({
        visibal: nextProps.visibal,
      });
    }
    if (nextProps.projectInfoName !== this.props.projectInfoName) {
      this.setState({
        projectInfoName: nextProps.projectInfoName,
      });
    }
    if (nextProps.id !== this.props.id) {
      this.setState({
        id: nextProps.id,
      }, () => {
        this.props.dispatch({
          type: 'projectInfo/fetchData',
          payload: { id: this.state.id },
        });
      });
    }
  }

  handleOk() {
    this.props.handleCancel('projectInfo');
  }

  handleCancel() {
    this.props.handleCancel('projectInfo');
  }

  // router to service
  toServicePage = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'projectList/saveProjectInfo',
      payload: {
        projectId: this.state.id,
        projectName: this.state.projectInfoName,
      },
    });
    dispatch(routerRedux.push('/resource-center/business-manage/project-list/service-list'));
  }

  render() {
    const { projectModalDataInfo, isLoading } = this.props;
    const basicInfo = projectModalDataInfo.basic_info;
    const moduleInfo = projectModalDataInfo.module_info ? projectModalDataInfo.module_info.slice(0, 3) : [];
    return (
      <div>
        <Modal
          title={this.state.projectInfoName}
          visible={this.state.visibal}
          okText="确定"
          cancelText="取消"
          onOk={::this.handleOk}
          onCancel={::this.handleCancel}
        >
          <Spin spinning={isLoading}>
            <div className={styles.content}>
              <h3>基础信息</h3>
              <div className={styles.listWrapper}>
                <ul className={styles.listContent}>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>项目名称：</span>
                    <span className={styles.rightStyle}>
                      {basicInfo ? basicInfo.project_name : ''}
                    </span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>所属部门：</span>
                    <span className={styles.rightStyle}>
                      {basicInfo ? basicInfo.department_name : ''}
                    </span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>产品经理：</span>
                    <span className={styles.rightStyle}>
                      {basicInfo ? basicInfo.product_manager_name.join(',') : ''}
                    </span>
                  </li>
                  <li className={styles.listLi} >
                    <span className={styles.leftStyle}>运维：</span>
                    <span className={styles.rightStyle}>
                      {basicInfo ? basicInfo.ops_user_name.join(',') : ''}
                    </span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>测试人员：</span>
                    <span className={styles.rightStyle}>
                      {basicInfo ? basicInfo.test_user_name.join(',') : ''}
                    </span>
                  </li>
                </ul>
              </div>
              <div className={styles.rightWrapper}>
                <ul className={styles.listContent}>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>所属集团：</span>
                    <span className={styles.rightStyle}>
                      {basicInfo ? basicInfo.organizational_name : ''}
                    </span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>负责人：</span>
                    <span className={styles.rightStyle}>
                      {basicInfo ? basicInfo.supervisor_name : ''}
                    </span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>技术开发：</span>
                    <span className={styles.rightStyle}>
                      {basicInfo ? basicInfo.develop_user_name.join(',') : ''}
                    </span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>其他人员：</span>
                    <span className={styles.rightStyle}>
                      {basicInfo ? basicInfo.other_user_name.join(',') : ''}
                    </span>
                  </li>
                  <li className={styles.listLi}>
                    <span className={styles.leftStyle}>描述：</span>
                    <span className={styles.rightStyle}>
                      {basicInfo ? basicInfo.desc : ''}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <h3>服务信息</h3>
            <div className={styles.listWrapper}>
              <ul className={styles.listContent}>
                {
                  moduleInfo.map((item, index) => {
                    return (
                      <li className={styles.listLi} key={`${index}-0`}>
                        <span className={styles.leftStyle}>服务：</span>
                        <span className={styles.rightStyle}>
                          {item.module_name}
                        </span>
                      </li>
                    );
                  })
                }
              </ul>
            </div>
            <div className={styles.rightWrapper}>
              <ul className={styles.listContent}>
                {
                  moduleInfo.map((item, index) => {
                    return (
                      <li className={styles.listLi} key={`${index}-0`} style={{ visibility: 'hidden' }}>
                        <span className={styles.leftStyle}>版本号：</span>
                        <span className={styles.rightStyle}>
                          {item.module_version}
                        </span>
                      </li>
                    );
                  })
                }
                <li style={{ textAlign: 'right' }}>
                  <a onClick={this.toServicePage}>查看更多</a>
                </li>
              </ul>
            </div>

            <h3>版本信息</h3>
            <div className={styles.listWrapper}>
              <ul className={styles.listContent}>
                <li className={styles.listLi}>
                  <span className={styles.leftStyle}>版本编号：</span>
                  <span className={styles.rightStyle}>
                    {projectModalDataInfo.version_info ? projectModalDataInfo.version_info[0].version_num : ''}
                  </span>
                </li>
              </ul>
            </div>
            <div className={styles.rightWrapper}>
              <ul className={styles.listContent}>
                <li className={styles.listLi}>
                  <span className={styles.leftStyle}>上线时间：</span>
                  <span className={styles.rightStyle}>
                    {projectModalDataInfo.version_info ? projectModalDataInfo.version_info[0].online_time : ''}
                  </span>
                </li>
                <li style={{ textAlign: 'right' }}>
                  <a>查看更多</a>
                </li>
              </ul>
            </div>
          </Spin>
        </Modal>
      </div>
    );
  }
}
