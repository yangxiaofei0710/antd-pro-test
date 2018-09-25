import { Router, Route, routerRedux } from 'dva/router';
import { Message } from 'antd';
import { fakeAccountLogin, fakeAccountLogout } from '../../services/login';
import LocalStorage from '../../utils/storage';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    submitting: false,
    currentUser: {
      accessToken: 'xx',
      user_name: 'xx',
      profile_photo: '',
      time_out: 100,
      user_id: 11,
    },
  },

  effects: {
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const res = yield call(fakeAccountLogin, payload);
      if (res.code === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'ok',
          },
        });
        yield put({
          type: 'saveCurrentUser',
          payload: res.data,
        });
        LocalStorage.set('accessToken', res.data.accessToken);
        LocalStorage.set('currentUser', {
          user_id: res.data.user_id,
          user_name: res.data.user_name,
          profile_photo: res.data.profile_photo,
        });
        LocalStorage.set('OptCodes', res.data.permissions); // 页面权限
        if (res.data.permissions.length > 0) {
          yield put(routerRedux.push('/resource-center/public-cloud/cloud-manage'));
        } else {
          Message.error('无权限访问');
        }
      }
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *logout(_, { call, put }) {
      const res = yield call(fakeAccountLogout);
      if (res.code === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
          },
        });
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: payload,
      };
    },
  },
};
