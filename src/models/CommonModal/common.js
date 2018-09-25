import { fetchDictionary } from '../../services/api';
import {
  fetchList, // 配置管理/资源对象管理列表
  fetchTemplateList, // 配置管理/配置模板列表
  fetchConfigTree, // 搜索类目树
  changeRecord, // 变更记录
} from '../../services/cmdb-config-manage-api';
import {
  fetchReleaseList, // 查询发布列表
  fetchVersionList, // 查看版本列表
  fetchReleaseTree,
  fetchOperateList, // 查询操作管理列表
} from '../../services/release'; // 发布列表
import { objKeyWrapper } from '../../utils/utils';

const getValuesFromFields = (obj) => {
  return obj.value;
};

const PAGE_SIZE = 20;
export default {
  namespace: 'common',
  state: {
    dataDictionary: {}, // 数据字典
    commonFormFields: {
      search_text: { // 搜索
        value: undefined,
      },
    },
    listInfo: { // 列表详情
      list: [],
      pagination: {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
      },
      isLoading: false,
    },
    commonModalStauts: false, // modal显示隐藏
    commonLoading: false, // loading效果
    operateAuthor: {}, // 操作权限
    projectTree: [], // 项目管理类目树（包含服务）
    selectKey: undefined, // 选择当前类目树id
  },

  effects: {
    *fetchDataDictionary({ payload }, { call, put }) {
      const response = yield call(fetchDictionary);
      if (response.code == 200) {
        yield put({
          type: 'saveDataDictionary',
          payload: response.data,
        });
      }
    },
    // 搜索列表数据
    *fetchList({ payload, url }, { call, put, select }) {
      const req = {
        fetchConfigList: fetchList, // k8s/资源对象管理列表
        fetchTemplateList, // k8s/配置模板列表
        changeRecord, // k8s/变更记录
        fetchReleaseList, // 发布列表
        fetchVersionList, // 版本详情列表
        fetchOperateList, // 查询操作管理列表
      };
      const state = yield select(store => store.common);
      const commonFormFields = objKeyWrapper(state.commonFormFields, getValuesFromFields);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(req[`${url}`], {
        ...commonFormFields,
        ...payload,
      });
      if (response.code == 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 搜索类目树
    *fetchTree({ payload, url }, { call, put }) {
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      });
      const req = {
        fetchConfigTree,
        fetchReleaseTree,
      };
      const resposne = yield call(req[`${url}`]);
      if (resposne.code == 200) {
        yield put({
          type: 'saveProjectTree',
          payload: resposne.data,
        });
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      });
    },

    // 选择当前类目树，暂存类目树id
    *treeSelect({ payload }, { call, put }) {
      yield put({
        type: 'changeSelectKey',
        payload,
      });
    },

  },

  reducers: {
    // 保存数据字典
    saveDataDictionary(state, action) {
      return {
        ...state,
        dataDictionary: {
          ...state.dataDictionary,
          ...action.payload,
        },
      };
    },
    // 搜索框发生变化
    formFieldChange(state, { payload }) {
      return {
        ...state,
        commonFormFields: {
          ...state.commonFormFields,
          ...payload,
        },
      };
    },

    saveList(state, action) {
      return {
        ...state,
        listInfo: {
          ...state.listInfo,
          ...{
            list: action.payload.msgdata,
          },
          ...{
            pagination: {
              current: action.payload.current_page,
              total: action.payload.total,
              pageSize: action.payload.page_size,
            },
          },
        },
        operateAuthor: action.payload.permissions,
      };
    },
    initListInfo(state, action) {
      return {
        ...state,
        listInfo: {
          list: [],
          pagination: {
            current: 1,
            pageSize: PAGE_SIZE,
            total: 0,
          },
          isLoading: false,
        },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        listInfo: {
          ...state.listInfo,
          ...{
            isLoading: action.payload,
          },
        },
      };
    },

    // 保存项目列表类目树
    saveProjectTree(state, { payload }) {
      return {
        ...state,
        projectTree: payload,
      };
    },

    // 当前选择类目树id
    changeSelectKey(state, { payload }) {
      return {
        ...state,
        selectKey: payload,
      };
    },

    changeCommonModalStauts(state, action) {
      return {
        ...state,
        commonModalStauts: action.payload,
      };
    },
    changeCommonLoading(state, action) {
      return {
        ...state,
        commonLoading: action.payload,
      };
    },
  },
};
