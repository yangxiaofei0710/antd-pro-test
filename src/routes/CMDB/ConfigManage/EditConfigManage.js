import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Collapse, Select, Form, Input, Col, Row, Spin } from 'antd';
import _ from 'lodash';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './EditConfigManage.less';
import ControlledEditor from './Editor/Controlled';
import UnControlledEditor from './Editor/UnControlled';
import { objKeyWrapper } from '../../../utils/utils';
import history from '../../../utils/history';

const { Panel } = Collapse;
const { Option } = Select;
const FormItem = Form.Item;
@connect((state) => {
  return {
    operateAuthor: state.common.operateAuthor, // 操作权限
    selectKey: state.common.selectKey,
    envname: state.configManage.envname,
    editModuleInfo: state.configManage.editModuleInfo, // 当前资源下的配置文件
    copyEditModuleInfo: state.configManage.copyEditModuleInfo,
    currentModuleInfo: state.configManage.currentModuleInfo, // 当前服务资源信息（name，versionid, moduleid, porjectid）
    loading: state.configManage.loading,
    createLoading: state.configManage.createLoading, // 选择配置模板，创建配置内容等待loading
    configFileTypeList: state.configManage.configFileTypeList, // 选择配置文件模板类型
    editConfigFormFields: state.configManage.editConfigFormFields,
    opeType: state.configManage.opeType, // 编辑/查看
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.editConfigFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'configManage/editConfigFormFieldsChange',
      payload: fields,
    });
  },
})
export default class EditConfigManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: ['0-1'],
    };
  }
  componentDidMount() {
    const { dispatch, selectKey, envname, currentModuleInfo } = this.props;
    if (!selectKey) {
      dispatch(routerRedux.push('/resource-center/k8s-manage/sourceobj-manage'));
    }
    if (currentModuleInfo.versionid) {
      dispatch({
        type: 'configManage/fetchModuleinfo',
        payload: {
          id: currentModuleInfo.versionid,
          envname,
        },
      });
    }
    dispatch({
      type: 'configManage/fetchConfigFileType',
    });
  }

  // 新增
  handleAdd = () => {
    const obj = {
      config: '',
      configfile: '',
      configid: undefined,
      filecontext: '',
      id: undefined,
      isShowEditor: true,
    };
    const { dispatch, editModuleInfo, copyEditModuleInfo } = this.props;
    editModuleInfo.push(obj);
    copyEditModuleInfo.push(obj);
    dispatch({
      type: 'configManage/saveModuleInfo',
      payload: editModuleInfo,
    });
    dispatch({
      type: 'configManage/saveCopyEditModuleInfo',
      payload: copyEditModuleInfo,
    });
  }

  // 删除
  handleDelete = (id, index) => {
    const { dispatch, editModuleInfo, copyEditModuleInfo } = this.props;
    const newEditModuleInfo = _.cloneDeep(editModuleInfo);
    if (id) {
      dispatch({
        type: 'configManage/deleteConfigFile',
        payload: {
          id,
        },
        index,
      });
    } else {
      newEditModuleInfo.splice(index, 1);
      copyEditModuleInfo.splice(index, 1);
      dispatch({
        type: 'configManage/saveModuleInfo',
        payload: newEditModuleInfo,
      });
      dispatch({
        type: 'configManage/aveCopyEditModuleInfo',
        payload: copyEditModuleInfo,
      });
    }
  }
  // 修改 显示当前配置文件 代码编辑器
  handleEdit = async (index) => {
    const { activeKey } = this.state;
    if (activeKey.indexOf(`${index}-1`) == -1) {
      activeKey.push(`${index}-1`);
      await this.setState({
        activeKey,
      });
    }
    const { dispatch, editModuleInfo, copyEditModuleInfo } = this.props;
    // console.log('editModuleInfo', editModuleInfo, copyEditModuleInfo);
    editModuleInfo[index].isShowEditor = true;
    copyEditModuleInfo[index].isShowEditor = true;
    dispatch({
      type: 'configManage/saveModuleInfo',
      payload: editModuleInfo,
    });
    dispatch({
      type: 'configManage/saveCopyEditModuleInfo',
      payload: copyEditModuleInfo,
    });
  }
  // 取消修改
  handleCancel = (index) => {
    const { dispatch, editModuleInfo, copyEditModuleInfo } = this.props;
    copyEditModuleInfo[index].isShowEditor = false;
    editModuleInfo[index] = copyEditModuleInfo[index];
    dispatch({
      type: 'configManage/saveModuleInfo',
      payload: editModuleInfo,
    });
  }
  // 保存
  handleSave = (index) => {
    const { dispatch, editModuleInfo, copyEditModuleInfo, currentModuleInfo, editConfigFormFields } = this.props;
    let saveType;
    let payload;
    if (!editModuleInfo[index].id) {
      saveType = 'add';
      payload = {
        versionid: currentModuleInfo.versionid,
        version: currentModuleInfo.version,
        configid: editModuleInfo[index].configid,
        filename: editConfigFormFields[`configfile-${index}`].value,
        filecontent: editModuleInfo[index].filecontext,
        envname: this.props.envname,
        moduleid: currentModuleInfo.moduleid,
      };
    } else {
      saveType = 'edit';
      payload = {
        id: editModuleInfo[index].id,
        configid: editModuleInfo[index].configid,
        filename: editConfigFormFields[`configfile-${index}`].value,
        filecontent: editModuleInfo[index].filecontext,
        envname: this.props.envname,
      };
    }
    dispatch({
      type: 'configManage/addEditSave',
      payload,
      saveType,
      index,
    });
  }

  selectChange = (index, value) => {
    const { dispatch, editConfigFormFields, currentModuleInfo, editModuleInfo, envname } = this.props;
    // console.log('editConfigFormFields', value, currentModuleInfo, editModuleInfo);
    dispatch({
      type: 'configManage/createConfigFile',
      payload: {
        configid: value,
        projectid: currentModuleInfo.projectid,
        moduleid: currentModuleInfo.moduleid,
        versionid: currentModuleInfo.versionid,
        version: currentModuleInfo.version,
        envname,
      },
      index,
    });
  }

  // 折叠面板change回调
  handlePanelChange = (key) => {
    // console.log(key);
    this.setState({
      activeKey: key,
    });
  }

  // 渲染option
  renderOptionNodes = (item) => {
    if (item && item.length > 0) {
      const optionNodes = item.map((nodeItem, index) => {
        return (
          <Option key={nodeItem.id} value={nodeItem.id}>{nodeItem.name}</Option>
        );
      });
      return optionNodes;
    }
  }


  render() {
    const {
      selectKey, // 当前服务类目id
      envname, // 环境变量
      currentModuleInfo, // 当前资源对象详情
      editModuleInfo, // 当前资源对象下的编辑脚本列表详情
      copyEditModuleInfo,
      loading,
      configFileTypeList, // 选择配置模板类型
      editConfigFormFields,
      createLoading,
      operateAuthor, // 操作权限
      opeType, // 编辑/查看
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout>
        <Spin spinning={loading}>
          <div>
            <h2>{currentModuleInfo.name}</h2>
            <h4>{`${currentModuleInfo.version}版本`}</h4>

            <div className={styles.btnStyle}>
              {
                operateAuthor.add_configfile && opeType ?
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.confirmBtn}
                    onClick={this.handleAdd}
                  >
                    新增
                  </Button>
                :
                ''
              }

              <Button
                onClick={() => { history.push('/resource-center/k8s-manage/sourceobj-manage'); }}
              >
                返回
              </Button>
            </div>
            <Spin spinning={createLoading}>
              <ul className={styles.wrapperUl}>
                {
                  editModuleInfo.map((item, index) => {
                    return (
                      <li className={styles.collapseLi}>
                        <div className={styles.opeateBtn}>
                          {
                            operateAuthor.delete_configfile && opeType ?
                              <Button
                                style={{ marginRight: '10px' }}
                                onClick={this.handleDelete.bind(this, item.id, index)}
                              >
                                删除
                              </Button>
                            :
                            ''
                          }
                          {
                            operateAuthor.change_configfile && opeType ?
                              <Button onClick={this.handleEdit.bind(this, index)}>修改</Button>
                            :
                            ''
                          }
                        </div>
                        <Collapse
                          activeKey={this.state.activeKey}
                          onChange={this.handlePanelChange}
                        >
                          <Panel
                            header={`配置文件名：${item.configfile}     配置：${item.config}`}
                            key={`${index}-1`}
                          >
                            {
                                item.isShowEditor ?
                                  <div>
                                    <div style={{ width: '100%' }}>
                                      <Form>
                                        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                                          <Col xl={12} lg={24}>
                                            <FormItem
                                              {...formItemLayout}
                                              label="选择配置"
                                            >
                                              {getFieldDecorator(`configid-${index}`)(
                                                <Select
                                                  placeholder="请选择"
                                                  onChange={this.selectChange.bind(this, index)}
                                                >
                                                  {this.renderOptionNodes(configFileTypeList)}
                                                </Select>
                                          )}
                                            </FormItem>
                                          </Col>
                                          <Col xl={12} lg={24}>
                                            <FormItem
                                              {...formItemLayout}
                                              label="配置文件名"
                                            >
                                              {getFieldDecorator(`configfile-${index}`)(
                                                <Input />
                                          )}
                                            </FormItem>
                                          </Col>
                                        </Row>
                                      </Form>
                                    </div>
                                    <div className={styles.saveBtnWrapper}>
                                      <Button style={{ marginRight: '10px' }} onClick={this.handleCancel.bind(this, index)}>取消</Button>
                                      <Button type="primary" htmlType="submit" onClick={this.handleSave.bind(this, index)}>保存</Button>
                                    </div>
                                    <ControlledEditor value={item.filecontext} index={index} />
                                  </div>
                                :
                                  <div>
                                    <UnControlledEditor value={item.filecontext} index={index} />
                                  </div>
                              }
                          </Panel>
                        </Collapse>
                      </li>
                    );
                  })
                }
              </ul>
            </Spin>
          </div>
        </Spin>
      </PageHeaderLayout>

    );
  }
}
