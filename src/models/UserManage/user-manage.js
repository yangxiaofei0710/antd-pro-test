import React, { PureComponent } from 'react';
import { message } from 'antd';
import { loadCategoryTree } from '../../services/api';
import { queryUsers, userDataSourceSync, userControl } from '../../services/user-manage-api';
import { objKeyWrapper } from '../../utils/utils';

const getValuesFromFields = (obj) => {
  return obj.value;
};
const putValuesToFields = (obj) => {
  return {
    value: obj,
  };
};

const PAGE_SIZE = 20;
export default {
  namespace: 'user-manage',
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
      department_id: {
        value: undefined,
      },
      username: {
        value: undefined,
      },
    },
    syncing: false, // 是否正在同步数据源，点击同步按钮后的操作
    orgTreeData: [], // 组织树数据
    operateAuthor: {}, // 操作权限
  },

  effects: {
    *fetchList({ payload }, { call, put, select }) {
      const state = yield select(store => store['user-manage']);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      // console.log('fetchList', state);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(queryUsers, {
        ...searchFormValues,
        ...payload,
      });
      // console.log('res:', res);
      if (res.code === 200) {
        yield put({
          type: 'saveList',
          payload: res.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 数据源同步
    *sync({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSyncing',
        payload: true,
      });
      const res = yield call(userDataSourceSync, payload);
      if (res.code === 200) {
        yield put({
          type: 'changeSyncing',
          payload: false,
        });
        message.success(res.msg);

        const state = yield select(store => store['user-manage']);
        const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
        // 同步后重新查询列表
        yield put({
          type: 'fetchList',
          payload: {
            ...searchFormValues,
            page: state.listInfo.pagination.current,
            page_size: state.listInfo.pagination.pageSize,
          },
        });
      }
    },
    *userControl({ payload }, { call, put, select }) {
      const res = yield call(userControl, payload);
      if (res.code === 200) {
        const state = yield select(store => store['user-manage']);
        const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
        message.success(res.msg);
        // 重新查询列表
        yield put({
          type: 'fetchList',
          payload: {
            ...searchFormValues,
            page: state.listInfo.current,
            page_size: state.listInfo.pageSize,
          },
        });
      }
    },
    *fetchOrgTreeData({ payload }, { call, put, select }) {
      const res = yield call(loadCategoryTree, payload);
      if (res.code === 200) {
        yield put({
          type: 'saveOrgTreeData',
          payload: res.data,
        });
      }
    },
  },
  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        listInfo: {
          ...state.listInfo,
          ...{
            list: payload.msgdata,
          },
          ...{
            pagination: {
              current: payload.current_page,
              total: payload.total,
              pageSize: payload.page_size,
            },
          },
        },
        operateAuthor: payload.permissions, // 操作权限
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        listInfo: {
          ...state.listInfo,
          ...{
            isLoading: payload,
          },
        },
      };
    },
    changeSyncing(state, { payload }) {
      return {
        ...state,
        syncing: payload,
      };
    },
    formFieldChange(state, { payload }) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...payload,
        },
      };
    },
    saveOrgTreeData(state, { payload }) {
      return {
        ...state,
        orgTreeData: payload,
      };
    },
  },
};
