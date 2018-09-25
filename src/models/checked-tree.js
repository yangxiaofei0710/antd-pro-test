import { Message } from 'antd';

export default {
  namespace: 'checkedTree',

  state: {
    checkedTreeNodes: [],
    checkedTreeKeys: [],
  },

  effects: {
    *onCheck(payload, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *setCheckedkeys(payload, { call, put }) {
      yield put({
        type: 'onCheckedKeys',
        payload,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        checkedTreeNodes: action.payload,
      };
    },
    onCheckedKeys(state, action) {
      return {
        ...state,
        checkedTreeNodes: action.payload,
      };
    },
  },
};
