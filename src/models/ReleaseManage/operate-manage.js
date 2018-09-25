import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { fetchTree, handleSuccess, fetchOperateInfo } from '../../services/release';

const PAGE_SIZE = 20;
export default {
  namespace: 'operateManage',

  state: {
    envname: 'pro', // 当前环境id
    commonLoading: false,
    operateInfo: {
      id: undefined,
      projectInfo: {}, // 应用信息
      personInfo: {}, // 人员信息
      releaseProgress: { // 发布进度
        list: [],
        pagination: {
          current: 1,
          pageSize: PAGE_SIZE,
          total: 0,
        },
        isLoading: false,
      },
    },
  },

  effects: {
    // 标注成功
    *handleSuccess({ payload }, { call, put, select }) {
      const response = yield call(handleSuccess, { ...payload });
      if (response.code == 200) {
        message.success(response.msg);
        const state = yield select(store => store.common);
        const currState = yield select(store => store.operateManage);
        const currListInfo = state.listInfo;
        yield put({
          type: 'common/fetchList',
          payload: {
            current_page: currListInfo.pagination.current,
            page_size: PAGE_SIZE,
            project_id: state.selectKey,
            env: currState.envname,
          },
          url: 'fetchOperateList',
        });
      }
    },
    // 查询操作记录详情
    *fetchOperateInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(fetchOperateInfo, { ...payload });
      if (response.code == 200) {
        yield put({
          type: 'saveOperateInfo',
          payload: response.data,
        });
        yield put(routerRedux.push('/release-manage/operate-manage/operate-info'));
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 同步操作记录列表
    *sync({ payload }, { call, put, select }) {
      const state = yield select(store => store.common);
      const currState = yield select(store => store.operateManage);
      const currListInfo = state.listInfo;
      yield put({
        type: 'common/fetchList',
        payload: {
          current_page: currListInfo.pagination.current,
          page_size: currListInfo.pagination.pageSize,
          project_id: state.selectKey,
          env: currState.envname,
        },
        url: 'fetchOperateList',
      });
    },

  },

  reducers: {
    // 发布成功后，暂存当前已发布的项目ID和环境信息
    saveReleaseInfo(state, { payload }) {
      return {
        ...state,
        ...{
          // selectKey: payload.selectKey,
          envname: payload.envname,
        },
      };
    },
    // loading效果
    changeCommonLoading(state, action) {
      return {
        ...state,
        commonLoading: action.payload,
      };
    },

    // 当前环境信息
    changeEnv(state, { payload }) {
      return {
        ...state,
        envname: payload,
      };
    },
    // 当前操作详情
    saveOperateInfo(state, { payload }) {
      return {
        ...state,
        operateInfo: {
          ...state.operateInfo,
          ...{
            id: payload.id,
          },
          ...{
            projectInfo: payload.project_info,
          },
          ...{
            personInfo: payload.person_info,
          },
          ...{
            releaseProgress: {
              ...{
                list: payload.release_progress.msgdata,
              },
              ...{
                pagination: {
                  current: payload.release_progress.current_page,
                  total: payload.release_progress.total,
                  pageSize: payload.release_progress.page_size,
                },
              },
            },
          },
        },
      };
    },
    // table loading
    changeLoading(state, action) {
      return {
        ...state,
        operateInfo: {
          ...state.operateInfo,
          ...{
            releaseProgress: {
              ...state.operateInfo.releaseProgress,
              ...{
                isLoading: action.payload,
              },
            },
          },
        },
      };
    },
  },
};
