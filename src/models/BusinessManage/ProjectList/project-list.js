import { Message } from 'antd';
import { fetchData, addProject, editProject, projectInfo, loadCategoryTree } from '../../../services/api';
import { objKeyWrapper } from '../../../utils/utils';

const PAGE_SIZE = 20;
const getValuesFromFields = (obj) => {
  return obj.value;
};

export default {
  namespace: 'projectList',

  state: {
    listInfo: {
      list: [],
      pagination: {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
      },
      loading: false,
    },
    msg: '',
    visibal: false,
    showProjectInfo: false,
    projectInfoData: [], // 项目名称详情

    categoryTree: [],
    searchFormFields: {
      project_name: {
        value: undefined,
      },
      createTime: {
        value: undefined,
      },
      department_id: {
        value: undefined,
      },
      // organizational_id: {
      //   value: undefined,
      // },
    },
    projectDataInfo: [],
    organizeTree: [], // 部门类目树
    personOrganizeTree: [], // 加载到人的类目树
    currProjectInfo: {
      projectId: undefined, // 当前项目ID
      projectName: undefined, // 当前项目名称
    },
    modalShowBol: false,
    operateAuthor: {}, // 操作权限
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const state = yield select(store => store.projectList);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(fetchData, {
        ...searchFormValues,
        ...payload,
      });
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 点击项目详情显示对话框
    *showProjectInfoModal({ payload }, { call, put }) {
      const response = yield call(projectInfo, payload);
      yield put({
        type: 'changeProjectInfoModal',
        payload: true,
        projectInfo: response.data, // 项目名称详情
      });
    },
    // 关闭对话框
    *closeProjectInfoModal(payload, { call, put }) {
      yield put({
        type: 'changeProjectInfoModal',
        payload: false,
        projectInfo: '', // 项目名称详情
      });
    },
    // 请求类目树
    *loadCategoryTree(payload, { call, put }) {
      const response = yield call(loadCategoryTree, payload);
      yield put({
        type: 'loadCategoryTreeData',
        payload: response.data,
      });
    },
    // 加载部门类目树 和 加载到人的类目树
    *fetchOrganizeTree({ payload }, { call, put }) {
      const { loadType, withPerson } = payload;
      let response = null;
      if (loadType == 'department') {
        response = yield call(loadCategoryTree, { withPerson });
        if (response.code === 200) {
          yield put({
            type: 'saveOrganizeTree',
            payload: response.data,
          });
        }
      } else {
        response = yield call(loadCategoryTree, { withPerson });
        if (response.code === 200) {
          yield put({
            type: 'savePersonOrganizeTree',
            payload: response.data,
          });
        }
      }
    },
    // 保存当前项目id
    *saveProjectInfo({ payload }, { put }) {
      // yield put(routerRedux.push('/project/service-list'));
      yield put({
        type: 'saveCurrProjectInfo',
        payload,
      });
    },
  },

  reducers: {
    save(state, action) {
      // console.log('action', action);
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
    addResult(state, action) {
      return {
        ...state,
        msg: action.payload,
      };
    },
    // changeAddEditModal(state, { payload }) {
    //   return {
    //     ...state,
    //     visibal: payload,
    //   };
    // },
    changeProjectInfoModal(state, { payload, projectInfoData }) {
      return {
        ...state,
        showProjectInfo: payload,
        projectInfoData,
      };
    },
    loadCategoryTreeData(state, { payload }) {
      return {
        ...state,
        categoryTree: payload,
      };
    },
    // 搜索表单发生改变
    formFieldChange(state, action) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...action.payload,
        },
      };
    },
    // 重置表单
    reste(state, action) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...action.payload,
        },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        listInfo: {
          ...state.listInfo,
          ...{
            loading: action.payload,
          },
        },
      };
    },
    // 保存部门类目树
    saveOrganizeTree(state, action) {
      return {
        ...state,
        organizeTree: action.payload,
      };
    },
    // 保存包含人员的类目树
    savePersonOrganizeTree(state, action) {
      return {
        ...state,
        personOrganizeTree: action.payload,
      };
    },
    // 保存当前项目id
    saveCurrProjectInfo(state, { payload }) {
      return {
        ...state,
        // projectId: payload,
        currProjectInfo: {
          ...state.currProjectInfo,
          projectId: payload.projectId, // 当前项目ID
          projectName: payload.projectName, // 当前项目名称
        },
      };
    },
    // 更改新增和更新modal控制值
    changeModalBol(state, { payload }) {
      return {
        ...state,
        modalShowBol: payload,
      };
    },
  },
};
