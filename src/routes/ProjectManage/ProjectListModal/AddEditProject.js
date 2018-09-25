import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Button, Messsage, Spin, TreeSelect, Radio, Select } from 'antd';
import { connect } from 'dva';
import styles from './AddEditProject.less';
import { objKeyWrapper, newSubArr } from '../../../utils/utils';
import PersonTransferModal from '../../../components/PersonTransferModal';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const RadioGroup = Radio.Group;
const { Option } = Select;

@connect((state) => {
  return {
    searchFormFields: state.projectAdd.searchFormFields,
    organizeTree: state.projectList.organizeTree,
    personOrganizeTree: state.projectList.personOrganizeTree,
    // projectDataInfo: state.projectInfo.projectDataInfo,
    isLoading: state.projectInfo.isLoading,
    modalShowBol: state.projectList.modalShowBol,
    gitList: state.projectAdd.gitList, // 关联git组
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'projectAdd/formFieldChange',
      payload: fields,
    });
  },
})


export default class AddEditProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // visibal: this.props.visibal,
      type: this.props.type,
      editData: this.props.editData,
      showCategoryTree: false,
      currentSelectedIds: [],
      currentSelectedType: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectAdd/fetchGitList',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visibal !== this.props.visibal) {
      this.setState({
        // visibal: nextProps.visibal,
      });
    }
    if (nextProps.type !== this.props.type) {
      this.setState({
        type: nextProps.type,
      });
    }
    if (nextProps.editData !== this.props.editData) {
      this.setState({
        editData: nextProps.editData,
      }, () => {
        if (this.state.type == 'edit' || nextProps.type == 'edit') {
          const { dispatch } = this.props;
          dispatch({
            type: 'projectInfo/fetchData',
            payload: { id: nextProps.editData.id || undefined },
          });
        }
      });
    }
  }
  onManageModalOk = async (selectedIds) => {
    await this.props.dispatch({
      type: 'projectAdd/changeSelectPer',
      payload: {
        user_ids: selectedIds,
        selectType: this.state.currentSelectedType,
      },
    });
    this.setState({
      showCategoryTree: false,
    });
  }
  onManageModalCancal = () => {
    this.setState({
      showCategoryTree: false,
    });
  }

  // 取消
  handleCancel() {
    // this.props.handleCancel('addEdit');
    this.props.dispatch({
      type: 'projectList/changeModalBol',
      payload: false,
    });
    if (this.state.type == 'edit') {
      return;
    }
    this.props.dispatch({
      type: 'projectAdd/resetFiledsValue',
      payload: {
        searchFormFields: {
          project_name: {// 项目名称
            value: undefined,
          },
          department_id: {// 所属部门
            value: undefined,
          },
          supervisor_id: {// 负责人
            value: undefined,
          },
          product_manager_id: {// 产品经理
            value: undefined,
          },
          ops_user_id: {// 运维人员
            value: undefined,
          },
          develop_user_id: {// 技术开发
            value: undefined,
          },
          test_user_id: {// 测试人员
            value: undefined,
          },
          other_user_id: {// 其他人员
            value: undefined,
          },
          desc: {// 描述
            value: undefined,
          },
          git_name: { // 关联git组
            value: undefined,
          },
          iscreate: { // 是否关联git组
            value: false,
          },
        },
      },
    });
  }
  // 新增/编辑表单提交
  handleSubmit(e) {
    e.persist();
    e.preventDefault();
    const { editData, type } = this.state;
    const { id } = editData;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'projectAdd/projectAdd',
          payload: {
            id: type && type == 'edit' ? id : '',
            type: this.state.type,
          },
          values,
        });
      }
    });
  }


  // 控制显示组织类目树
  showTree = (bol, item, type) => {
    if (!this.controlBtn && this.controlBtn !== undefined) {
      return;
    }
    this.setState({
      showCategoryTree: true,
      currentSelectedIds: item,
      currentSelectedType: type,
    });
    this.select.blur();
    this.controlBtn = true;
  }
  // 失去焦点改变状态
  changeBtnStatus() {
    this.controlBtn = true;
  }

  // 删除输入框已选择的人员
  deleteChecked(e) {
    this.controlBtn = false;
    this.select.blur();
  }
  disabledCheck=() => {
    console.log('编辑模式下不允许修改人员');
  }

  // 判断类目树是否是最底层的人员选择
  checkPerson = (id, tree, callback) => {
    tree.forEach((item, index) => {
      if (item.id === id && item.level) {
        callback('请选择负责人');
      }
      if (item.children) {
        this.checkPerson(id, item.children, callback);
      }
    });
  }

  // 校验负责人formItem的值是否是人员id
  validateToSup =(rule, value, callback) => {
    if (value) {
      this.checkPerson(value, this.props.personOrganizeTree, callback);
    }
    callback();
  }
  // 部门和负责人热搜
  orgTreeFilter = (inputValue, treeNode) => {
    if (treeNode.props.title.indexOf(inputValue) > -1) {
      return true;
    }
  }

  // 选中git的回调
  selectGit = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectAdd/formFieldChange',
      payload: {
        project_name: {
          value,
        },
      },
    });
  }

  // 渲染部门选择类型树
  renderTreeNodes = (treeData) => {
    const resultTreeNodes = treeData.map((nodeItem, index) => {
      return (
        <TreeNode
          key={nodeItem.id}
          title={nodeItem.fullName}
          value={nodeItem.id}
        >
          {nodeItem.children ? this.renderTreeNodes(nodeItem.children) : null}
        </TreeNode>
      );
    });
    return resultTreeNodes;
  }
  renderOptions = (treeData) => {
    const resultTreeNodes = treeData.map((nodeItem, index) => {
      return (
        <Option
          key={nodeItem.git_id}
          value={nodeItem.git_name}
        >
          {nodeItem.git_name}
        </Option>
      );
    });
    return resultTreeNodes;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const textAreaLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const {
      categoryTreeData,
      // projectDataInfo,
      isLoading,
      organizeTree,
      searchFormFields,
      personOrganizeTree,
      modalShowBol,
      gitList } = this.props;
    const { currentSelectedIds, type } = this.state;
    const formLabel = {
      // supervisor_id: '负责人',
      product_manager_id: '产品经理',
      ops_user_id: '运维人员',
      develop_user_id: '技术开发',
      test_user_id: '测试人员',
      other_user_id: '其他人员',
    };
    const formNodes = [];
    Object.keys(formLabel).forEach((key, index) => {
      formNodes.push(
        <FormItem
          {...formItemLayout}
          label={formLabel[key]}
        >
          {getFieldDecorator(key, {
            rules: [{
              required: key !== 'other_user_id', message: `请选择${formLabel[key]}`,
            }],
          })(
            <TreeSelect
              ref={(c) => { this.select = c; }}
              disabled={type == 'edit'}
              dropdownStyle={{ visibility: 'hidden' }}
              treeCheckable
              onClick={type == 'edit' ? this.disabledCheck : this.showTree.bind(this,
              true,
              searchFormFields[key] ? searchFormFields[key].value : '',
              key)}
              onBlur={::this.changeBtnStatus}
              onDeselect={::this.deleteChecked}
              placeholder="请选择"
            >
              {this.renderTreeNodes(personOrganizeTree)}
            </TreeSelect>
        )}
        </FormItem>);
    });

    return (
      <div>
        <Modal
          title={type === 'edit' ? '编辑项目' : '新增项目'}
          visible={modalShowBol}
          onCancel={::this.handleCancel}
          width="800px"
          footer={null}
          className={styles.wrapper}
        >
          <Spin spinning={isLoading}>
            <Form onSubmit={::this.handleSubmit}>
              <Row gutter={24}>
                <Col span={12} >
                  <FormItem
                    label="项目名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator(
                    'project_name', {
                      rules: [{
                        required: true, message: '请输入项目名称',
                      }, {
                        max: 30, message: '输入超过30个字符限制',
                      }, {
                        pattern: /[A-Za-z]$/g, message: '项目名称为英文',
                      }],
                    })(
                      <Input placeholder="请输入" disabled={type == 'edit' || !searchFormFields.iscreate.value} />
                  )}
                  </FormItem>
                </Col>
                <Col span={12} >
                  <FormItem
                    label="所属部门"
                    {...formItemLayout}
                  >
                    {getFieldDecorator(
                    'department_id', {
                      rules: [{
                        required: true, message: '请选择所属部门',
                      }],
                    }
                  )(
                    <TreeSelect
                      disabled={type == 'edit'}
                      placeholder="请选择"
                      showSearch
                      allowClear
                      filterTreeNode={this.orgTreeFilter}
                    >
                      {this.renderTreeNodes(organizeTree)}
                    </TreeSelect>
                  )}
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12} >
                  <FormItem
                    label="负责人"
                    {...formItemLayout}
                  >
                    {getFieldDecorator(
                    'supervisor_id', {
                      rules: [{
                        required: true, message: '请选择负责人',
                      }, {
                        validator: this.validateToSup,
                      }],
                    }
                  )(
                    <TreeSelect
                      disabled={type == 'edit'}
                      placeholder="请选择"
                      showSearch
                      allowClear
                      filterTreeNode={this.orgTreeFilter}
                    >
                      {this.renderTreeNodes(personOrganizeTree)}
                    </TreeSelect>
                  )}
                  </FormItem>
                </Col>

                <Col span={12} >
                  {formNodes[0]}
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12} >
                  {formNodes[1]}
                </Col>

                <Col span={12} >
                  {formNodes[2]}
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12} >
                  {formNodes[3]}
                </Col>

                <Col span={12} >
                  {formNodes[4]}
                </Col>
              </Row>
              {
                type !== 'edit' ?
                  <Row gutter={24}>
                    <Col span={12} >
                      <FormItem
                        {...formItemLayout}
                        label="git组"
                      >
                        {getFieldDecorator('iscreate', {
                          rules: [{
                            required: true, message: '请选择git组是否关联',
                          }],
                        })(
                          <RadioGroup disabled={type == 'edit'}>
                            <Radio value>新建</Radio>
                            <Radio value={false}>关联所有</Radio>
                          </RadioGroup>
                    )}
                      </FormItem>
                    </Col>
                    {
                      !searchFormFields.iscreate.value ?
                        <Col span={12} >
                          <FormItem
                            label="选择git组"
                            {...formItemLayout}
                          >
                            {getFieldDecorator(
                              'git_name', {
                                  rules: [{
                                    required: true, message: '请选择git组',
                                  }],
                                }
                              )(
                                <Select
                                  disabled={type == 'edit'}
                                  placeholder="请选择"
                                  showSearch
                                  optionFilterProp="children"
                                  onSelect={this.selectGit}
                                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                  {this.renderOptions(gitList)}
                                </Select>
                            )}
                          </FormItem>
                        </Col>
                      :
                        ''
                    }
                  </Row>
                  :
                    ''
                }
              <Row>
                <Col>
                  <FormItem
                    label="描述"
                    {...textAreaLayout}
                  >
                    {getFieldDecorator('desc', {
                      initialValue: searchFormFields ? searchFormFields.desc : '',
                      rules: [{
                        required: true, message: '请输入描述',
                      }],
                    },
                  )(
                    <TextArea rows={4} />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <div className={styles.btnWrapper}>
                <Button type="primary" onClick={::this.handleSubmit} >确定{type == 'edit' ? '编辑' : '新增'}</Button>
                <span style={{ display: 'inline-block', width: '20px' }} />
                <Button onClick={::this.handleCancel}>取消</Button>
              </div>
            </Form>
          </Spin>

          <PersonTransferModal
            visible={this.state.showCategoryTree}
            loading={false}
            treeData={personOrganizeTree}
            selectedIds={currentSelectedIds}
            onOk={this.onManageModalOk}
            onCancel={this.onManageModalCancal}
            limitKeysLength
          />

        </Modal>
      </div>
    );
  }
}
