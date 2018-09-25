import { queryProjectNotice } from '../services/api';

export default {
  namespace: 'project-manager',

  state: {
    list: [],
    listLoading: true,
    detail: {},
    detailLoading: true,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          type: 'list',
          value: true,
        },
      });
      const response = yield call(queryProjectNotice, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: {
          type: 'list',
          value: false,
        },
      });
    },
    *fetchDetail(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          type: 'list',
          value: true,
        },
      });
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: {
          type: 'list',
          value: false,
        },
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        [`${action.payload.type}Loading`]: action.payload.value,
      };
    },
  },
};
