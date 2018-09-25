import React, { PureComponent } from 'react';
import { message } from 'antd';
import { loadCategoryTree } from '../../services/api';
import { queryRoles, addRole, editRole, deleteRole, queryRoleDetail, queryAuthories, authrizeForRole, queryUsersByRole, userForRole, saveAuthories } from '../../services/user-manage-api';
import { objKeyWrapper } from '../../utils/utils';
import LocalStorage from '../../utils/storage';

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
  namespace: 'role-manage',
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
      role_name: {
        value: undefined,
      },
    },
    orgTreeData: [], // 组织树数据
    // authoriesTreeData: [], // 授权
    authoriesTreeData: {
      treeData: [], // 授权类目树
      selectKeys: [], // 已授权项
    },
    authorLoading: false, // 授权loading
    modalLoading: false, // 角色分配给人员的提交接口的loading效果
    operatorLoading: false, // 操作栏的loading, 主要用于删除操作
    currentRoleId: 1, // 当前选中的role
    currentSelectedIds: [], // 当前role的selectedIds
    roleInfo: { // 角色详情
      detailFormFields: {
        role_name: {
          value: undefined,
        },
        desc: {
          value: undefined,
        },
      },
      isLoading: false,
    },
    operateAuthor: {}, // 操作权限
  },

  effects: {
    *fetchList({ payload }, { call, put, select }) {
      const state = yield select(store => store['role-manage']);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      // console.log('fetchList', state);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(queryRoles, {
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
    *fetchOrgTreeData({ payload }, { call, put, select }) {
      const res = yield call(loadCategoryTree, payload);
      if (res.code === 200) {
        yield put({
          type: 'saveOrgTreeData',
          payload: res.data,
        });
      }
    },
    *fetchUsersByRole({ payload }, { call, put, select }) {
      yield put({
        type: 'changeModalLoading',
        payload: true,
      });
      const res = yield call(queryUsersByRole, payload);
      if (res.code === 200) {
        const result = {
          currentRoleId: payload.role_id,
          currentSelectedIds: res.data.user_ids.map((item) => {
            return item.user_id;
          }),
        };
        yield put({
          type: 'changeModalLoading',
          payload: false,
        });
        yield put({
          type: 'currentRoleChange',
          payload: result,
        });
      }
    },
    *fetchRoleDetail({ payload }, { call, put, select }) {
      yield put({
        type: 'changeRoleInfoLoading',
        payload: true,
      });
      const res = yield call(queryRoleDetail, payload);
      if (res.code === 200) {
        yield put({
          type: 'roleDetailFieldsChange',
          payload: objKeyWrapper(res.data, putValuesToFields),
        });
        yield put({
          type: 'changeRoleInfoLoading',
          payload: false,
        });
      }
    },
    // 获取角色授权类目树
    *fetchAuthories({ payload }, { call, put }) {
      yield put({
        type: 'changeAuthorLoading',
        payload: true,
      });
      const response = yield call(queryAuthories, payload);
      if (response.code == 200) {
        yield put({
          type: 'saveAuthoriesTreeData',
          payload: response,
        });
      }
      yield put({
        type: 'changeAuthorLoading',
        payload: false,
      });
    },

    // 角色授权保存
    *saveAuthories({ payload }, { call, put, select }) {
      const state = yield select(store => store['role-manage']);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      yield put({
        type: 'changeAuthorLoading',
        payload: true,
      });
      const response = yield call(saveAuthories, {
        ...payload,
        role_id: state.currentRoleId,
      });
      if (response.code == 200) {
        message.success('授权成功');
        LocalStorage.set('OptCodes', response.data); // 页面权限
        yield put({
          type: 'fetchList',
          payload: {
            ...searchFormValues,
            page: state.listInfo.current,
            page_size: state.listInfo.pageSize,
          },
        });
      }
      yield put({
        type: 'changeAuthorLoading',
        payload: false,
      });
    },

    *roleUpdate({ payload }, { call, put, select }) {
      const { type } = payload;
      const state = yield select(store => store['role-manage']);
      let res = null;
      const params = objKeyWrapper(state.roleInfo.detailFormFields, getValuesFromFields);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      yield put({
        type: 'changeRoleInfoLoading',
        payload: true,
      });
      if (type === 'add') {
        res = yield call(addRole, params);
      } else {
        res = yield call(editRole, {
          ...params,
          role_id: state.currentRoleId,
        });
      }
      if (res.code === 200) {
        yield put({
          type: 'fetchList',
          payload: {
            ...searchFormValues,
            page: state.listInfo.current,
            page_size: state.listInfo.pageSize,
          },
        });
        yield put({
          type: 'changeRoleInfoLoading',
          payload: false,
        });
      }
    },
    *userForRole({ payload }, { call, put, select }) {
      yield put({
        type: 'changeModalLoading',
        payload: true,
      });
      const res = yield call(userForRole, payload);
      if (res.code === 200) {
        yield put({
          type: 'changeModalLoading',
          payload: false,
        });
      }
    },
    *deleteRole({ payload }, { call, put, select }) {
      yield put({
        type: 'changeOperatorLoading',
        payload: true,
      });
      const state = yield select(store => store['role-manage']);
      const res = yield call(deleteRole, payload);
      if (res.code === 200) {
        message.success('删除成功！');
        yield put({
          type: 'changeOperatorLoading',
          payload: false,
        });
        const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
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
    changeModalLoading(state, { payload }) {
      return {
        ...state,
        modalLoading: payload,
      };
    },
    changeOperatorLoading(state, { payload }) {
      return {
        ...state,
        operatorLoading: payload,
      };
    },
    changeRoleInfoLoading(state, { payload }) {
      return {
        ...state,
        roleInfo: {
          ...state.roleInfo,
          ...{
            isLoading: payload,
          },
        },
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
    // 保存授权类目树
    saveAuthoriesTreeData(state, { payload }) {
      return {
        ...state,
        ...{
          authoriesTreeData: {
            ...state.authoriesTreeData,
            treeData: payload.data, // 授权类目树
            selectKeys: payload.permission_list, // 已授权项
          },
        },
        // authoriesTreeData: payload,
      };
    },
    // 授权更改已选择key
    changeSelectKeys(state, { payload }) {
      return {
        ...state,
        ...{
          authoriesTreeData: {
            ...state.authoriesTreeData,
            selectKeys: payload, // 已授权项
          },
        },
        // authoriesTreeData: payload,
      };
    },
    // 更改授权modal loading
    changeAuthorLoading(state, { payload }) {
      return {
        ...state,
        authorLoading: payload,
      };
    },
    currentRoleChange(state, { payload }) {
      return {
        ...state,
        ...{
          currentRoleId: payload.currentRoleId,
          currentSelectedIds: payload.currentSelectedIds,
        },
      };
    },
    roleDetailFieldsChange(state, { payload }) {
      return {
        ...state,
        roleInfo: {
          ...state.roleInfo,
          ...{
            detailFormFields: {
              ...state.roleInfo.detailFormFields,
              ...payload,
            },
          },
        },
      };
    },
    changeCurrentRoleId(state, { payload }) {
      return {
        ...state,
        currentRoleId: payload,
      };
    },
  },
};
