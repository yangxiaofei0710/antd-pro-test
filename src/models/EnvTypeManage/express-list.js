import { Message } from 'antd';
import {
  queryexpressList, // 查询列表
  selectEnv, // 获取中间件类型
  addMiddlewares, // 新增
  editMiddlewares, // 编辑
  fetchService, // 搜索服务器
  deployService, // 环境部署
  envInfo, // 详情
  redeploy, // 重新部署
} from '../../services/environment-script';
import { objKeyWrapper } from '../../utils/utils';

const PAGE_SIZE = 20;
const getValuesFromFields = (obj) => {
  return obj.value;
};
export default {
  namespace: 'expressList',
  state: {
    listInfo: {
      list: [],
      pagination: {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
      },
      isLoading: false,
    },
    searchFormFields: {
      search_text: {
        value: undefined,
      },
    },
    addModalStatus: false, // 新增modal控制显示隐藏
    deployModalStatus: false, // 环境部署modal控制显示隐藏
    infoModalStatus: false, // 详情modal控制显示隐藏
    expressInfo: {}, // 中间件详情
    commonLoading: false, // loading效果
    // 新增中间件
    addFormFields: {
      middleware_name: { // 中间件名称
        value: undefined,
      },
      type_id: { // 类型id
        value: undefined,
      },
      comment: { // 备注
        value: undefined,
      },
    },
    envTypeList: [], // 选择环境类型列表
    // 环境部署modal form表单
    deployEnvFromFields: {
      middleware_name: { // 中间件名称
        value: undefined,
      },
      type_name: { // 中间件类型
        value: undefined,
      },
      serverid_list: { // 服务器id列表
        value: undefined,
      },
      environ_id: { // 环境id
        value: undefined,
      },
      iscolony: { // 是否服务器集群，默认为否
        value: false,
      },
      middleware_id: { // 中间件id
        value: undefined,
      },
    },
    chanceServiceList: [], // 服务器选择
    fetchingLoading: false, // 搜索服务器选择等待loading
    operateAuthor: {}, // 操作权限
  },
  effects: {
    *fetchList({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const state = yield select(store => store.expressList);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      const response = yield call(queryexpressList, { ...searchFormValues, ...payload });
      if (response.code == 200) {
        yield put({
          type: 'saveExpressList',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询环境类型选择类目树
    *fetchEnvList({ payload }, { call, put }) {
      const response = yield call(selectEnv);
      if (response.code == 200) {
        yield put({
          type: 'saveEnvTypeList',
          payload: response.data.msgdata,
        });
      }
    },

    // 新增中间件
    *addMiddlewares({ payload, clickType }, { call, put, select }) {
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      });
      const state = yield select(store => store.expressList);
      const addFormFields = objKeyWrapper(state.addFormFields, getValuesFromFields); // 增加表单
      let response = null;
      if (clickType == 'add') {
        response = yield call(addMiddlewares, { ...addFormFields });
      } else {
        response = yield call(editMiddlewares, { ...payload });
      }
      if (response.code == 200) {
        Message.success('新增成功');
        yield put({
          type: 'changeAddModalStatus',
          payload: false,
        });
        yield put({
          type: 'initAddFormFields',
        });
        yield put({
          type: 'fetchList',
          payload: {
            current_page: 1,
            page_size: PAGE_SIZE,
          },
        });
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      });
    },
    // 搜索物理机
    *fetchService({ payload }, { call, put }) {
      yield put({
        type: 'changeFetchingLoading',
        payload: true,
      });
      const response = yield call(fetchService, { ...payload });
      if (response.code == 200) {
        const newArr = response.data.map(item => ({
          title: `${item.server_ip}/${item.server_id}`,
          value: `${item.server_ip}/${item.server_id}`,
          id: item.server_id,
        }));
        yield put({
          type: 'changeServiceList',
          payload: newArr,
        });
      }
      yield put({
        type: 'changeFetchingLoading',
        payload: false,
      });
    },

    // 环境部署
    *deployEnv({ payload }, { call, put, select }) {
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      });
      const state = yield select(store => store.expressList);
      const deployEnvFromFields = objKeyWrapper(state.deployEnvFromFields, getValuesFromFields);
      const response = yield call(deployService, { ...deployEnvFromFields });
      if (response.code == 200) {
        Message.success('部署成功');
        yield put({
          type: 'changeDeployModalStatus',
          payload: false,
        });
        yield put({
          type: 'initdeployEnvFromFields',
        });
        yield put({
          type: 'fetchList',
          payload: {
            current_page: state.listInfo.pagination.current,
            page_size: PAGE_SIZE,
          },
        });
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      });
    },

    // 查看详情
    *fetchEnvInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      });
      const response = yield call(envInfo, { ...payload });
      if (response.code == 200) {
        yield put({
          type: 'saveExpressInfo',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      });
    },

    // 重新部署
    *redeploy({ payload, middlewareId }, { call, put }) {
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      });
      const response = yield call(redeploy, { ...payload });
      if (response.code == 200) {
        yield put({
          type: 'fetchEnvInfo',
          payload: {
            middleware_id: middlewareId,
          },
        });
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      });
    },
  },
  reducers: {
    saveExpressList(state, action) {
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
    searchFormFieldsChange(state, action) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...action.payload,
        },
      };
    },
    // 新增modal控制显示隐藏
    changeAddModalStatus(state, action) {
      return {
        ...state,
        addModalStatus: action.payload,
      };
    },
    // 环境部署modal控制显示隐藏
    changeDeployModalStatus(state, action) {
      return {
        ...state,
        deployModalStatus: action.payload,
      };
    },
    // 详情modal控制显示隐藏
    changeInfoModalStatus(state, action) {
      return {
        ...state,
        infoModalStatus: action.payload,
      };
    },
    // loading效果
    changeCommonLoading(state, action) {
      return {
        ...state,
        commonLoading: action.payload,
      };
    },
    // 保存环境列表
    saveEnvTypeList(state, action) {
      return {
        ...state,
        envTypeList: action.payload,
      };
    },
    // 新增中间件列表form表单受控
    addFormFieldsChange(state, action) {
      return {
        ...state,
        addFormFields: {
          ...state.addFormFields,
          ...action.payload,
        },
      };
    },
    // 初始化新增中间件列表form表单
    initAddFormFields(state, action) {
      return {
        ...state,
        addFormFields: {
          middleware_name: { // 中间件名称
            value: undefined,
          },
          type_id: { // 类型id
            value: undefined,
          },
          comment: { // 备注
            value: undefined,
          },
        },
      };
    },
    // 初始化部署中间件列表form表单
    initdeployEnvFromFields(state, action) {
      return {
        ...state,
        deployEnvFromFields: {
          middleware_name: { // 中间件名称
            value: undefined,
          },
          type_name: { // 中间件类型
            value: undefined,
          },
          serverid_list: { // 服务器id列表
            value: undefined,
          },
          environ_id: { // 环境id
            value: undefined,
          },
          iscolony: { // 是否服务器集群, 默认为否
            value: false,
          },
          middleware_id: { // 中间件id
            value: undefined,
          },
        },
      };
    },
    // 更改搜索服务器加载loading
    changeFetchingLoading(state, action) {
      return {
        ...state,
        fetchingLoading: action.payload,
      };
    },
    // 根据搜索框中的ip，搜索服务器并暂存搜索服务器列表
    changeServiceList(state, action) {
      return {
        ...state,
        chanceServiceList: [...action.payload],
      };
    },
    // 部署中间件列表form表单受控
    deployEnvFromFieldsChange(state, action) {
      return {
        ...state,
        deployEnvFromFields: {
          ...state.deployEnvFromFields,
          ...action.payload,
        },
      };
    },

    // 保存中间件详情
    saveExpressInfo(state, action) {
      return {
        ...state,
        expressInfo: action.payload,
      };
    },
  },
};

