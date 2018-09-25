import React, { Component } from 'react';
import { Modal, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './ProjectName.less';

@connect((state) => {
  return {
    projectDataInfo: state.projectInfo.projectDataInfo,
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
  toServicePage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectList/saveProjectId',
      payload: {
        projectId: this.state.id,
      },
    });
    dispatch(routerRedux.push('/project/service-list'));
  }

  render() {
    const { projectModalDataInfo, isLoading } = this.props;
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
              <p>基础信息</p>
              <div className={styles.listWrapper}>
                <ul className={styles.listContent}>
                  <li>
                    <span className={styles.leftStyle}>项目名称：</span>
                    <span className={styles.rightStyle}>
                      {projectModalDataInfo.basic_info ? projectModalDataInfo.basic_info.project_name : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>所属部门：</span>
                    <span className={styles.rightStyle}>
                      {projectModalDataInfo.basic_info ? projectModalDataInfo.basic_info.department_name : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>产品经理：</span>
                    <span className={styles.rightStyle}>
                      {projectModalDataInfo.basic_info ? projectModalDataInfo.basic_info.product_manager_name.join(',') : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>运维：</span>
                    <span className={styles.rightStyle}>
                      {projectModalDataInfo.basic_info ? projectModalDataInfo.basic_info.ops_user_name.join(',') : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>测试人员：</span>
                    <span className={styles.rightStyle}>
                      {projectModalDataInfo.basic_info ? projectModalDataInfo.basic_info.test_user_name.join(',') : ''}
                    </span>
                  </li>
                </ul>
              </div>
              <div className={styles.rightWrapper}>
                <ul className={styles.listContent}>
                  <li>
                    <span className={styles.leftStyle}>所属集团：</span>
                    <span className={styles.rightStyle}>
                      {projectModalDataInfo.basic_info ? projectModalDataInfo.basic_info.organizational_name : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>负责人：</span>
                    <span className={styles.rightStyle}>
                      {projectModalDataInfo.basic_info ? projectModalDataInfo.basic_info.supervisor_name : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>技术开发：</span>
                    <span className={styles.rightStyle}>
                      {projectModalDataInfo.basic_info ? projectModalDataInfo.basic_info.develop_user_name.join(',') : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>其他人员：</span>
                    <span className={styles.rightStyle}>
                      {projectModalDataInfo.basic_info ? projectModalDataInfo.basic_info.other_user_name.join(',') : ''}
                    </span>
                  </li>
                  <li>
                    <span className={styles.leftStyle}>描述：</span>
                    <span className={styles.rightStyle}>
                      {projectModalDataInfo.basic_info ? projectModalDataInfo.basic_info.desc : ''}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <p>服务信息</p>
            <div className={styles.listWrapper}>
              <ul className={styles.listContent}>
                <li>
                  <span className={styles.leftStyle}>服务：</span>
                  <span className={styles.rightStyle}>
                    {projectModalDataInfo.length && projectModalDataInfo.module_info.length > 0 ?
                      projectModalDataInfo.module_info[0].module_name : ''}
                  </span>
                </li>
              </ul>
            </div>
            <div className={styles.rightWrapper}>
              <ul className={styles.listContent}>
                <li>
                  <span className={styles.leftStyle}>版本号：</span>
                  <span className={styles.rightStyle}>
                    {projectModalDataInfo.length && projectModalDataInfo.module_info.length > 0
                      ? projectModalDataInfo.module_info[0].module_version : ''}
                  </span>
                </li>
                <li style={{ textAlign: 'right' }}>
                  <a onClick={this.toServicePage}>查看更多</a>
                </li>
              </ul>
            </div>

            <p>版本信息</p>
            <div className={styles.listWrapper}>
              <ul className={styles.listContent}>
                <li>
                  <span className={styles.leftStyle}>版本编号：</span>
                  <span className={styles.rightStyle}>
                    {projectModalDataInfo.version_info ? projectModalDataInfo.version_info[0].version_num : ''}
                  </span>
                </li>
              </ul>
            </div>
            <div className={styles.rightWrapper}>
              <ul className={styles.listContent}>
                <li>
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
