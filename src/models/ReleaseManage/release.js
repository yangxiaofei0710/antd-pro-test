import _ from 'lodash';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  fetchProjectList,
  submitRelease,
  reboot, // 重启
  fetchRollbackList, // 获取回滚版本列表
  rollback, // 回滚
} from '../../services/release';
import { getParentInfo, treeFilter, sortArray, objKeyWrapper } from '../../utils/utils';


const getValuesFromFields = (obj) => {
  return obj.value;
};
const PAGE_SIZE = 20;
export default {
  namespace: 'release',

  state: {
    projectList: {
      private: [],
      public: [],
    },
    checkNodeIds: [],
    cards: [], // 发布进度列表
    versionList: [], // 版本列表
    configlist: [], // 配置文件列表
    releaseVersion: undefined, // 确定发布版本号信息
    envname: 'pro', // 当前环境id
    projectId: undefined, // 当前项目id
    projectName: undefined, // 当前项目name
    commonLoading: false,
    rebootLoading: false,
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
    },
    rollbackModal: false, // 回滚modal
    rollbackList: [],
    rollbackFormFields: {
      id: { // 回滚列表
        value: undefined,
      },
    },
  },

  effects: {
    // 获取项目列表
    *fetchProjectList({ payload }, { call, put }) {
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      });
      const treeSelect = [];
      const response = yield call(fetchProjectList, { ...payload });
      if (response.code == 200) {
        const privateTree = getParentInfo(response.data.msgdata.private, response.data.checkNodeIds);
        const publicTree = getParentInfo(response.data.msgdata.public, response.data.checkNodeIds);
        // 暂存服务类目树
        yield put({
          type: 'saveProjectList',
          payload: {
            private: privateTree,
            public: publicTree,
          },
        });
        // 暂存已选择节点ID
        yield put({
          type: 'saveCheckNodeIds',
          payload: response.data.checkNodeIds,
        });
        // 暂存已选择节点的 服务/版本/配置文件 信息，用户渲染右侧发布进度
        const newTreeArr = _.cloneDeep([...privateTree, ...publicTree]);
        const treeFilterNode = treeFilter(response.data.checkNodeIds, newTreeArr, treeSelect);
        yield put({
          type: 'saveCards',
          payload: treeFilterNode,
        });
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      });
    },
    *getCards({ payload }, { call, put, select }) {
      const treeSelect = [];
      const state = yield select(store => store.release);
      const { checkNodeIds, projectList, cards } = state;
      const treeData = _.cloneDeep([...projectList.private, ...projectList.public]);
      const treeFilterNode = treeFilter(checkNodeIds, treeData, treeSelect);
      // console.log('treeFilterNode', treeFilterNode, cards);
      sortArray(treeFilterNode, cards); // 根据排序过后的cards数组中的顺序排序
      yield put({
        type: 'saveCards',
        payload: treeFilterNode,
      });
    },
    // 提交发布
    *submitRelease({ payload }, { call, put }) {
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      });
      const response = yield call(submitRelease, { ...payload });
      if (response.code == 200) {
        message.success('发布成功');
        yield put({
          type: 'versionManage/saveReleaseInfo',
          payload: {
            // selectKey: payload.project_id, // 当前已发布的项目id
            envname: payload.env, // 当前发布的环境
          },
        });
        yield put(routerRedux.push('/release-manage/version-manage'));
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      });
    },
    // 重启
    *reboot({ payload }, { call, put, select }) {
      yield put({
        type: 'changeRebootLoading',
        payload: true,
      });
      const response = yield call(reboot, { ...payload });
      if (response.code == 200) {
        message.success('重启成功');
        const state = yield select(store => store.release);
        const commonState = yield select(store => store.common);
        const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
        const { createTime } = searchFormValues;
        yield put({
          type: 'common/fetchList',
          payload: {
            env: state.envname,
            current_page: commonState.listInfo.pagination.current,
            page_size: PAGE_SIZE,
            starttime: createTime && createTime.length > 0 ? createTime[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
            endtime: createTime && createTime.length > 0 ? createTime[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
            ...searchFormValues,
          },
          url: 'fetchReleaseList',
        });
      }
      yield put({
        type: 'changeRebootLoading',
        payload: false,
      });
    },
    // 获取回滚列表
    *fetchRollbackList({ payload }, { call, put }) {
      const response = yield call(fetchRollbackList, { ...payload });
      yield put({
        type: 'changeRollbackModal',
        payload: true,
      });
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      });
      if (response.code == 200) {
        yield put({
          type: 'saveRollbackList',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeCommonLoading',
        payload: false,
      });
    },

    // 确定回滚
    *handleRollBack({ payload }, { call, put, select }) {
      yield put({
        type: 'changeCommonLoading',
        payload: true,
      });
      const releaseState = yield select(store => store.release);
      const commonState = yield select(store => store.common);
      const rollbackFormFields = objKeyWrapper(releaseState.rollbackFormFields, getValuesFromFields);
      const response = yield call(rollback, { ...rollbackFormFields });
      if (response.code == 200) {
        message.success('回滚成功');
        const searchFormValues = objKeyWrapper(releaseState.searchFormFields, getValuesFromFields);
        const { createTime } = searchFormValues;
        yield put({
          type: 'common/fetchList',
          payload: {
            env: releaseState.envname,
            current_page: commonState.listInfo.pagination.current,
            page_size: PAGE_SIZE,
            starttime: createTime && createTime.length > 0 ? createTime[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
            endtime: createTime && createTime.length > 0 ? createTime[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
            ...searchFormValues,
          },
          url: 'fetchReleaseList',
        });
        yield put({
          type: 'changeRollbackModal',
          payload: false,
        });
        yield put({
          type: 'rollbackFormFieldChange',
          payload: {
            id: { // 回滚列表
              value: undefined,
            },
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
    saveProjectList(state, { payload }) {
      return {
        ...state,
        projectList: {
          ...state.projectList,
          private: payload.private,
          public: payload.public,
        },
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
    // 保存当前已选择的配置文件的id
    saveCheckNodeIds(state, { payload }) {
      return {
        ...state,
        checkNodeIds: payload,
      };
    },
    // 保存版本列表数据
    saveVersionList(state, { payload }) {
      return {
        ...state,
        versionList: [...payload],
      };
    },
    // 保存配置文件列表
    saveConfiglist(state, { payload }) {
      return {
        ...state,
        configlist: [...payload],
      };
    },
    // 保存当前发布进度列表数据
    saveCards(state, { payload }) {
      return {
        ...state,
        cards: [...payload],
      };
    },
    saveVersion(state, { payload }) {
      return {
        ...state,
        releaseVersion: payload,
      };
    },
    // 当前环境信息
    changeEnv(state, { payload }) {
      return {
        ...state,
        envname: payload,
      };
    },
    changeProjectId(state, { payload }) {
      return {
        ...state,
        projectId: payload,
      };
    },
    changeProjectName(state, { payload }) {
      return {
        ...state,
        projectName: payload,
      };
    },
    changeCommonLoading(state, action) {
      return {
        ...state,
        commonLoading: action.payload,
      };
    },
    changeRebootLoading(state, action) {
      return {
        ...state,
        rebootLoading: action.payload,
      };
    },
    // 回滚弹框显示隐藏
    changeRollbackModal(state, action) {
      return {
        ...state,
        rollbackModal: action.payload,
      };
    },
    // 保存回滚版本列表
    saveRollbackList(state, action) {
      return {
        ...state,
        rollbackList: action.payload,
      };
    },
    // 回滚列表表单发生改变
    rollbackFormFieldChange(state, action) {
      return {
        ...state,
        rollbackFormFields: {
          ...state.rollbackFormFields,
          ...action.payload,
        },
      };
    },
  },
};
