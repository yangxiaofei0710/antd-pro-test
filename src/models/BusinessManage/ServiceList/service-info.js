import { serviceInfoList } from '../../../services/service-list-api';

export default {
  namespace: 'serviceInfo',
  state: {
    serviceDataInfo: [],
    isLoading: false,
  },

  effects: {
    *fetchData({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(serviceInfoList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
        yield put({
          type: 'serviceAdd/setFormValue',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        serviceDataInfo: { ...action.payload },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
    reste(state, action) {
      return {
        ...state,
        serviceDataInfo: [],
      };
    },
  },
};
