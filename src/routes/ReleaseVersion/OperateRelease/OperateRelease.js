import React, { Component, version } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { routerRedux } from 'dva/router';
import { Collapse, Checkbox, Input, Button, Spin, Message, Row, Col } from 'antd';
import { connect } from 'dva';
// import classNames from 'classnames';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ReleaseCard from './ReleaseCard';
import styles from './OperateRelease.less';


const { Panel } = Collapse;
// let parentInfo = {};
@connect((state) => {
  return {
    projectList: state.release.projectList,
    checkNodeIds: state.release.checkNodeIds,
    cards: state.release.cards, // 发布进度列表
    versionList: state.release.versionList, // 版本列表
    configlist: state.release.configlist, // 配置文件列表
    releaseVersion: state.release.releaseVersion, // 当前要发布的版本号信息
    envname: state.release.envname, // 当前环境id
    projectId: state.release.projectId, // 当前项目id
    projectName: state.release.projectName, // 当前项目name
    versionInfo: state.release.versionInfo, // 当前项目的版本号
    commonLoading: state.release.commonLoading,
  };
})

@DragDropContext(HTML5Backend)
export default class OperateRelease extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { dispatch, projectId, envname } = this.props;
    dispatch({
      type: 'release/saveVersionList',
      payload: [],
    });
    dispatch({
      type: 'release/saveConfiglist',
      payload: [],
    });
    if (!projectId) {
      dispatch(routerRedux.push(`/release-manage/${this.props.envname}-release`));
    } else {
      dispatch({
        type: 'release/fetchProjectList',
        payload: {
          project_id: projectId,
          env: envname,
        },
      });
    }
  }

  // 保存版本号
  onChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'release/saveVersion',
      payload: e.target.value,
    });
  }

  moveCard = (dragIndex, hoverIndex) => {
    // console.log('moveCard', dragIndex, hoverIndex);
    const { dispatch, cards } = this.props;
    const [...newCards] = cards;
    const dragCard = newCards[dragIndex];
    newCards.splice(dragIndex, 1);
    newCards.splice(hoverIndex, 0, dragCard);
    // console.log('拖拽', cards);
    dispatch({
      type: 'release/saveCards',
      payload: newCards,
    });
  }

  // 当前选中li背景色置为灰色
  changeCurrentDomColor = (domlist, index) => {
    for (let i = 0; i < domlist.length; i++) {
      domlist[i].style.background = '#fff';
    }
    domlist[index].style.background = 'rgba(217, 217, 217, 0.5)';
  }

  // 点击项目，加载当前项目下的配置文件
  clickProject = (item, index, type) => {
    const privatelist = document.querySelectorAll('#private>li');
    const publiclist = document.querySelectorAll('#public>li');
    for (let i = 0; i < privatelist.length; i++) {
      privatelist[i].style.background = '#fff';
    }
    for (let i = 0; i < publiclist.length; i++) {
      publiclist[i].style.background = '#fff';
    }
    this.changeCurrentDomColor(document.querySelectorAll(`#${type}>li`), index);
    const { dispatch } = this.props;
    dispatch({
      type: 'release/saveVersionList',
      payload: item,
    });
    dispatch({
      type: 'release/saveConfiglist',
      payload: [],
    });
  }

  // 点击版本号，加载当前版本号下的配置文件
  clickVersion = (item, index) => {
    this.changeCurrentDomColor(document.querySelectorAll('#version>li'), index);
    const { dispatch } = this.props;
    dispatch({
      type: 'release/saveConfiglist',
      payload: item,
    });
  }

  // 是否选中配置文件
  handleChecked =async (item, e) => {
    const { configlist } = this.props;
    // 获取点击配置文件所在索引值
    const index = configlist.findIndex((data) => { return data.id == item.id; });
    configlist[index].checked = e.target.checked;
    const { dispatch, checkNodeIds } = this.props;
    if (e.target.checked) { // 根据当前配置文件选中状态，改变selectids，配置文件列表checked受控于checkNodeIds
      checkNodeIds.push(item.id);
    } else { // checked 为false，删除对应id
      checkNodeIds.splice(checkNodeIds.indexOf(item.id), 1);
    }
    await dispatch({
      type: 'release/saveCheckNodeIds',
      payload: checkNodeIds,
    });
    dispatch({
      type: 'release/getCards',
    });
    dispatch({
      type: 'release/saveConfiglist',
      payload: configlist,
    });
  }

  // 取消发布进度列表中元素，相对应父级dom元素背景色高亮
  /**
   * grandpaIndex 父级的父级dom元素所在下标
   * parentIndex 父级dom元素所在下标
   */
  changeParentNodeColor = (grandpaIndex, parentIndex) => {
    // console.log(grandpaIndex, parentIndex);
    const privatelist = document.querySelectorAll('#private>li');
    const publiclist = document.querySelectorAll('#public>li');
    const grandpaList = [...privatelist, ...publiclist];
    for (let i = 0; i < grandpaList.length; i++) {
      grandpaList[i].style.background = '#fff';
    }
    this.changeCurrentDomColor(grandpaList, grandpaIndex);
    this.changeCurrentDomColor(document.querySelectorAll('#version>li'), parentIndex);
  }

  // 过滤cards中未选择的treeNode
  filterTreeSelect = (tree, checkNodeIds) => {
    const newTree = tree;
    newTree.forEach((item) => {
      if (item.children) {
        const children = item.children.filter((data) => { return checkNodeIds.indexOf(data.id) > -1; });
        item.children = children;
      }
    });
    return newTree;
  }

  // 确定发布
  handleSubmit = () => {
    const { dispatch, cards, releaseVersion, envname, projectId, checkNodeIds } = this.props;
    // console.log(cards, releaseVersion, envname, projectId);
    // 过滤cards中未选择的treeNode
    this.filterTreeSelect(cards, checkNodeIds);
    if (!releaseVersion) {
      Message.error('请填写版本号');
      return;
    } if (cards.length == 0) {
      Message.error('请选择要发布的配置文件');
    } else {
      dispatch({
        type: 'release/submitRelease',
        payload: {
          moduleversion: this.filterTreeSelect(cards, checkNodeIds),
          version: releaseVersion,
          env: envname,
          project_id: projectId,
        },
      });
    }
  }

  // 取消发布
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'release/saveVersionList',
      payload: [],
    });
    dispatch({
      type: 'release/saveConfiglist',
      payload: [],
    });
    dispatch(routerRedux.push(`/release-manage/${this.props.envname}-release`));
  }

  render() {
    const { projectList, checkNodeIds, cards, versionList, configlist, releaseVersion, commonLoading } = this.props;
    // console.log('checkNodeIds', checkNodeIds);
    const releaseTitle = {
      pro: '生产环境',
      pre: '预发环境',
      test: '测试环境',
    };
    return (
      <PageHeaderLayout>
        <div className={styles.wrapper}>
          <h2>发布-{this.props.projectName}-{releaseTitle[`${this.props.envname}`]}</h2>
          <Spin spinning={commonLoading}>
            <Row>
              <Col xl={6} lg={24}>
                <div className={styles.cardWrapper}>
                  <h3>服务</h3>
                  <ul className={styles.serviceUl} id="private">
                    {
                      projectList.private.map((item, index) => {
                        return (
                          <li
                            className={styles.serviceLi}
                            key={item.id}
                            onClick={this.clickProject.bind(this, item.children, index, 'private')}
                          >
                            <p className={styles.serviceLabel}>{item.name}</p>
                            <span>技术栈：{item.module_tech}</span>
                          </li>
                        );
                      })
                    }
                  </ul>
                  <Collapse defaultActiveKey={['1']} >
                    <Panel header="公共服务" key="1">
                      <ul className={styles.serviceUl} id="public">
                        {
                    projectList.public.map((item, index) => {
                      return (
                        <li
                          className={styles.serviceLi}
                          key={item.id}
                          onClick={this.clickProject.bind(this, item.children, index, 'public')}
                        >
                          <p className={styles.serviceLabel}>{item.name}</p>
                          <span>技术栈：{item.module_tech}</span>
                        </li>
                      );
                    })
                  }
                      </ul>
                    </Panel>
                  </Collapse>
                </div>
              </Col>
              <Col xl={6} lg={24}>
                <div className={styles.cardWrapper}>
                  <h3>版本</h3>
                  <ul className={styles.serviceUl} id="version">
                    {
                      versionList.map((item, index) => {
                        return (
                          <li
                            className={styles.serviceLi}
                            key={item.id}
                            onClick={this.clickVersion.bind(this, item.children, index)}
                          >
                            <p className={styles.serviceLabel}>{item.name}</p>
                            <span>更新时间：{item.updatetime}</span>
                          </li>
                        );
                      })
                    }
                  </ul>
                </div>
              </Col>
              <Col xl={6} lg={24}>
                <div className={styles.cardWrapper}>
                  <h3>配置文件</h3>
                  <ul className={styles.serviceUl}>
                    {
                      configlist.map((item, index) => {
                        return (
                          <li
                            className={styles.serviceLi}
                            key={item.id}
                          >
                            <Checkbox
                              checked={checkNodeIds.indexOf(item.id) > -1}
                              onChange={this.handleChecked.bind(this, item)}
                              className={styles.checkBoxWrp}
                            >
                              {item.name}
                            </Checkbox>
                          </li>
                        );
                      })
                    }
                  </ul>
                </div>
              </Col>
              <Col xl={6} lg={24}>
                <div className={styles.cardWrapper}>
                  <h3>发布进度</h3>
                  <ul className={styles.serviceUl}>
                    {
                      cards.map((card, i) => (
                        <ReleaseCard
                          key={card.id}
                          index={i}
                          id={card.id}
                          text={card.fullName}
                          childNode={card.children.filter((item) => { return item.checked; })}
                          parentNode={card}
                          moveCard={this.moveCard}
                          changeParentNodeColor={this.changeParentNodeColor}
                        />
                      ))
                    }
                  </ul>
                  <div>
                    <Input addonBefore="版本号:" onChange={this.onChange} />
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: '10px' }}
                        onClick={this.handleSubmit}
                      >
                      确定发布
                      </Button>
                      <Button onClick={this.handleCancel}>取消</Button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Spin>
        </div>
      </PageHeaderLayout>
    );
  }
}
