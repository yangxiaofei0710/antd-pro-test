import { message } from 'antd';
import _ from 'lodash';
import {
  fetchTree, // 类目树
  fetchModuleinfo, // 资源对象管理详情
  deleteConfigFile, // 资源对象配置模板删除
  configFileType, // 配置文件模板类型列表
  createConfigFile, // 生成配置文件及配置文件名称
  saveAddConfigFile, // 新增 保存配置文件
  saveEditConfigFile, // 修改 保存配置文件
  fetchList, // 列表
  templateAdd, // 配置模板增加
  templateEdit, // 配置模板编辑
  templateInfo, // 配置模板详情
  deleteTemplate, // 配置模板删除
  templateType, // 配置模板类型
  compileVersion, // 编译文件
} from '../../services/cmdb-config-manage-api';
import { objKeyWrapper } from '../../utils/utils';

const getValuesFromFields = (obj) => {
  return obj.value;
};
const PAGE_SIZE = 20;
export default {
  namespace: 'configManage',

  state: {
    envname: '生产环境', // 当前环境id
    templateType: [], // 配置模板类型
    configFileTypeList: [], // 编辑选择配置模板类型select
    currentModuleInfo: {}, // 当前资源对象信息
    editModuleInfo: [], // 资源对象管理详情
    copyEditModuleInfo: [],
    editConfigFormFields: {}, // 编辑修改配置以及配置文件名表单
    loading: false,
    createLoading: false, // 选择配置，创建配置文件内容等待loading
    addEditFormFields: {
      templatename: { // 模板名称
        value: undefined,
      },
      templatetype: { // 模板类型
        value: undefined,
      },
      templatecontent: { // 模板内容
        value: undefined,
      },
    },
    opeType: undefined, // 查看或者编辑
  },

  effects: {

    // 资源对象管理 加载详情
    *fetchModuleinfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(fetchModuleinfo, { ...payload });
      if (response.code == 200) {
        const arr = response.data;
        arr.forEach((item) => {
          item.isShowEditor = false;
        });
        yield put({
          type: 'saveModuleInfo',
          payload: arr,
        });
        yield put({
          type: 'saveCopyEditModuleInfo',
          payload: arr,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 资源对象管理 编辑删除
    *deleteConfigFile({ payload, index }, { call, put, select }) {
      yield put({
        type: 'changeCreateLoading',
        payload: true,
      });
      const response = yield call(deleteConfigFile, { ...payload });
      if (response.code == 200) {
        message.success('删除成功');
        const state = yield select(store => store.configManage);
        const { editModuleInfo } = state;
        const newEditModuleInfo = _.cloneDeep(editModuleInfo);
        newEditModuleInfo.splice(index, 1);
        // console.log(newEditModuleInfo);
        yield put({
          type: 'saveModuleInfo',
          payload: newEditModuleInfo,
        });
      }
      yield put({
        type: 'changeCreateLoading',
        payload: false,
      });
    },

    // 查询选择模板类型
    *fetchConfigFileType({ payload }, { put, call }) {
      const response = yield call(configFileType);
      if (response.code == 200) {
        yield put({
          type: 'saveConfigFileTypeList',
          payload: response.data,
        });
      }
    },

    // 选择配置模板类型，生成配置文件内容和名称
    *createConfigFile({ payload, index }, { call, put, select }) {
      yield put({
        type: 'changeCreateLoading',
        payload: true,
      });
      const state = yield select(store => store.configManage);
      const { editModuleInfo } = state;
      const response = yield call(createConfigFile, { ...payload });
      // console.log('jeikouqing', response);
      if (response.code == 200) {
        // console.log(editModuleInfo);
        const newEditModuleInfo = _.cloneDeep(editModuleInfo);
        newEditModuleInfo[index].config = response.data.config;
        newEditModuleInfo[index].configid = response.data.configid;
        newEditModuleInfo[index].configfile = response.data.configfile;
        newEditModuleInfo[index].filecontext = response.data.filecontext;
        // console.log(editModuleInfo, newEditModuleInfo);
        yield put({
          type: 'saveModuleInfo',
          payload: newEditModuleInfo,
        });
      }
      yield put({
        type: 'changeCreateLoading',
        payload: false,
      });
    },

    // 新增/编辑  点击保存
    *addEditSave({ payload, saveType, index, copyData }, { call, put, select }) {
      const url = {
        add: saveAddConfigFile, // 新增 保存配置文件
        edit: saveEditConfigFile, // 修改 保存配置文件
      };
      const response = yield call(url[saveType], { ...payload });
      if (response.code == 200) {
        message.success(response.msg);
        // 保存成功之后更新copy数据
        const state = yield select(store => store.configManage);
        state.editModuleInfo[index].isShowEditor = false;
        state.editModuleInfo[index].id = response.data.id;
        state.editModuleInfo[index].configfile = response.data.filename;
        state.copyEditModuleInfo.splice(index, 0, state.editModuleInfo[index]);
        yield put({
          type: 'saveModuleInfo',
          payload: state.editModuleInfo,
        });
        yield put({
          type: 'saveCopyEditModuleInfo',
          payload: state.copyEditModuleInfo,
        });
      }
    },

    // 编译
    *compileVersion({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(compileVersion, { ...payload });
      if (response.code == 200) {
        message.success('编译成功');
        const commonState = yield select(store => store.common);
        const configManageState = yield select(store => store.configManage);
        yield put({
          type: 'common/fetchList',
          payload: {
            id: commonState.selectKey,
            envname: configManageState.envname,
            current_page: commonState.listInfo.pagination.current,
            page_size: PAGE_SIZE,
          },
          url: 'fetchConfigList',
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 配置模板 增加/编辑 *******************************************************************
    *addEditTemplate({ payload, clickType }, { call, put, select }) {
      const state = yield select(store => store.configManage);
      const commonSearchForm = objKeyWrapper(state.addEditFormFields, getValuesFromFields);
      let response = null;
      if (clickType == 'add') {
        response = yield call(templateAdd, { ...commonSearchForm, ...payload });
      } else {
        response = yield call(templateEdit, { ...commonSearchForm, ...payload });
      }
      if (response.code == 200) {
        message.success('保存成功');
        const commonState = yield select(store => store.common);
        yield put({
          type: 'common/fetchList',
          url: 'fetchTemplateList',
          payload: {
            current_page: clickType == 'add' ? 1 : commonState.listInfo.pagination.current,
            page_size: PAGE_SIZE,
          },
        });
        yield put({
          type: 'formFieldsChange',
          payload: {
            templatename: { // 模板名称
              value: undefined,
            },
            templatetype: { // 模板类型
              value: undefined,
            },
            templatecontent: { // 模板内容
              value: undefined,
            },
          },
        });
        yield put({
          type: 'common/changeCommonModalStauts',
          payload: false,
        });
      }
    },

    // 加载配置模板类型
    *fetchTemplateType({ payload }, { call, put }) {
      const response = yield call(templateType);
      if (response.code == 200) {
        yield put({
          type: 'saveTemplateType',
          payload: response.data,
        });
      }
    },

    // 配置模板详情
    *templateInfo({ payload }, { call, put }) {
      yield put({
        type: 'common/changeCommonLoading',
        payload: true,
      });
      const response = yield call(templateInfo, { ...payload });
      if (response.code == 200) {
        yield put({
          type: 'formFieldsChange',
          payload: {
            templatename: { // 模板名称
              value: response.data.templatename,
            },
            templatetype: { // 模板类型
              value: response.data.templatetype,
            },
            templatecontent: { // 模板内容
              value: response.data.templatecontent,
            },
          },
        });
      }
      yield put({
        type: 'common/changeCommonLoading',
        payload: false,
      });
    },

    // 配置模板删除
    *deleteTemplate({ payload }, { call, put, select }) {
      const response = yield call(deleteTemplate, { ...payload });
      if (response.code == 200) {
        const commonState = yield select(store => store.common);
        yield put({
          type: 'common/fetchList',
          url: 'fetchTemplateList',
          payload: {
            current_page: commonState.listInfo.pagination.current,
            page_size: PAGE_SIZE,
          },
        });
      }
    },
  },

  reducers: {
    changeLoading(state, { payload }) {
      return {
        ...state,
        ...{
          loading: payload,
        },
      };
    },
    changeCreateLoading(state, { payload }) {
      return {
        ...state,
        ...{
          createLoading: payload,
        },
      };
    },
    // 当前环境信息
    changeEnvId(state, { payload }) {
      return {
        ...state,
        envname: payload,
      };
    },
    saveCurrentModuleInfo(state, { payload }) {
      return {
        ...state,
        currentModuleInfo: payload,
      };
    },
    // 进入编辑，加载资源对象管理详情
    saveModuleInfo(state, { payload }) {
      payload.forEach((item, index) => {
        state.editConfigFormFields[`configid-${index}`] = { value: item.configid };
        state.editConfigFormFields[`configfile-${index}`] = { value: item.configfile };
      });
      return {
        ...state,
        editModuleInfo: [...payload],
        editConfigFormFields: {
          ...state.editConfigFormFields,
        },
      };
    },
    // 暂存编辑信息，取消编辑的时候根据copy数据进行回显
    saveCopyEditModuleInfo(state, { payload }) {
      return {
        ...state,
        copyEditModuleInfo: [...payload],
      };
    },
    editConfigFormFieldsChange(state, { payload }) {
      return {
        ...state,
        editConfigFormFields: {
          ...state.editConfigFormFields,
          ...payload,
        },
      };
    },
    saveConfigFileTypeList(state, { payload }) {
      return {
        ...state,
        configFileTypeList: [...payload],
      };
    },

    // 配置模板 新增/编辑modal form表单
    formFieldsChange(state, { payload }) {
      return {
        ...state,
        addEditFormFields: {
          ...state.addEditFormFields,
          ...payload,
        },
      };
    },
    // 保存配置模板类型
    saveTemplateType(state, { payload }) {
      return {
        ...state,
        templateType: payload,
      };
    },

    changeOpeType(state, { payload }) {
      return {
        ...state,
        opeType: payload,
      };
    },
  },
};
