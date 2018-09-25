import { projectInfo } from '../../../services/api';

export default {
  namespace: 'projectInfo',
  state: {
    // projectDataInfo: [],
    projectModalDataInfo: {},
    isLoading: false,
  },

  effects: {
    *fetchData({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(projectInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
        yield put({
          type: 'projectAdd/setFormValue',
          payload: response.data.basic_info,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *checkedPersonSave({ payload }, { call, put }) {
      yield put({
        type: 'checkedPerson',
        payload,
      });
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        // projectDataInfo: { ...action.payload.basic_info },
        projectModalDataInfo: {
          ...state.projectModalDataInfo,
          ...action.payload,
        },
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
        projectDataInfo: [],
      };
    },
  },
};
