import { Message } from 'antd';
import { queryEnvList, queryEnvInfo, addEnv, editEnv, deleteEnv } from '../../services/environment-script';
import { objKeyWrapper } from '../../utils/utils';

const getValuesFromFields = (obj) => {
  return obj.value;
};

const PAGE_SIZE = 20;
export default {
  namespace: 'environmentType',
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
      env_key: {
        value: undefined,
      },
    },
    addEditControl: {
      isShow: false, // 新增/编辑对话框控制
      loading: false, // 新增/编辑对话框loading效果控制
      clickType: undefined, // 判断新增和编辑点击入口
    },
    addEditFormFields: { // 新增/编辑form表单受控
      env_name: {
        value: undefined,
      },
      desc: {
        value: undefined,
      },
      file_id: {
        value: undefined,
      },
    },
    uploadFileList: [], // 上传文件列表
    envModalStatus: { // 详情
      isShow: false,
      loading: false,
      info: {
        name: undefined,
        desc: undefined,
        file_id: undefined,
        file_name: undefined,
        file_url: undefined,
      },
    },
    operateAuthor: {}, // 操作权限
  },
  effects: {
    *fetchList({ payload }, { call, put, select }) {
      const state = yield select(store => store.environmentType);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryEnvList, {
        ...searchFormValues,
        ...payload,
      });
      if (response.code == 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *addEditControl({ payload, envId }, { call, put }) {
      // console.log(payload, envId);
      yield put({
        type: 'changeAddEditControl',
        payload,
      });
      if (payload.clickType == 'edit' && envId) { // 编辑入口加载环境详情
        const response = yield call(queryEnvInfo, { env_id: envId });
        if (response.code == '200') {
          yield put({
            type: 'setAddEditFormFields',
            payload: response.data,
          });
          yield put({
            type: 'saveUploadFileList',
            payload: {
              uid: response.data.file_id,
              name: response.data.file_name,
              status: 'done',
              url: response.data.file_url,
            },
          });
        }
        yield put({
          type: 'changeAddEditControl',
          payload: {
            loading: false,
          },
        });
      } else { // 新增时， 上传列表为空
        yield put({
          type: 'defaultUploadFileList',
        });
      }
    },
    *handleCancelModal({ payload }, { call, put }) {
      yield put({
        type: 'setAddEditFormFields',
        payload: {
          env_name: undefined,
          desc: undefined,
          file_id: undefined,
        },
      });
      yield put({
        type: 'changeAddEditControl',
        payload,
      });
    },
    *EnvInfoModla({ payload }, { call, put }) {
      yield put({
        type: 'changeEnvModalStatus',
        payload: {
          isShow: true,
          loading: true,
        },
      });
      const response = yield call(queryEnvInfo, { env_id: payload });
      if (response.code == 200) {
        yield put({
          type: 'changeEnvModalStatus',
          payload: {
            loading: false,
            info: {
              name: response.data.env_name,
              desc: response.data.desc,
              file_id: response.data.file_id,
              file_name: response.data.file_name,
              file_url: response.data.file_url,
            },
          },
        });
      }
    },
    *deleteEnv({ payload }, { call, put, select }) {
      const state = yield select(store => store.environmentType);
      const response = yield call(deleteEnv, { env_id: payload });
      if (response.code == 200) {
        yield put({
          type: 'fetchList',
          payload: {
            current_page: state.listInfo.pagination.current,
            page_size: PAGE_SIZE,
          },
        });
      }
    },
    *saveAddEditEnv({ payload, clickType }, { call, put, select }) {
      // console.log(clickType, 'clicktype');
      yield put({
        type: 'changeAddEditControl',
        payload: {
          loading: true,
        },
      });
      const state = yield select(store => store.environmentType);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      let response = null;
      if (clickType == 'edit') {
        response = yield call(editEnv, { ...payload });
      } else {
        response = yield call(addEnv, { ...payload });
      }
      if (response.code == 200) {
        Message.success(response.msg);
        yield put({
          type: 'fetchList',
          payload: {
            ...searchFormValues,
            current_page: clickType == 'edit' ? 1 : state.listInfo.pagination.current,
            page_size: state.listInfo.pagination.pageSize,
          },
        });
        yield put({
          type: 'changeAddEditControl',
          payload: {
            isShow: false,
          },
        });
      }
      yield put({
        type: 'changeAddEditControl',
        payload: {
          loading: false,
        },
      });
    },
  },
  reducers: {
    saveList(state, action) {
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
    changeLoading(state, action) {
      return {
        ...state,
        listInfo: {
          ...state.listInfo,
          ...{
            isLoading: action.payload,
          },
        },
      };
    },
    // 搜索框发生变化改变env_key
    formFieldChange(state, { payload }) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...payload,
        },
      };
    },
    // 控制新增/编辑modal显示隐藏
    changeAddEditControl(state, { payload }) {
      return {
        ...state,
        addEditControl: {
          ...state.addEditControl,
          ...payload,
        },
      };
    },
    // 加载环境详情后设置modal中的form表单值
    setAddEditFormFields(state, { payload }) {
      return {
        ...state,
        addEditFormFields: {
          ...state.addEditFormFields,
          env_name: {
            value: payload.env_name,
          },
          desc: {
            value: payload.desc,
          },
          file_id: {
            value: payload.file_id,
          },
        },
      };
    },
    // modal输入框值变化回调
    changeAddEditFormFields(state, { payload }) {
      // console.log('change', payload);
      return {
        ...state,
        addEditFormFields: {
          ...state.addEditFormFields,
          ...payload,
        },
      };
    },
    // 上传文件
    changeUploadFileList(state, action) { // 上传时保存
      // console.log('action', action);
      let status = null;
      let url = null;
      let fileId;
      if (action.payload.response !== undefined) {
        const { code, msg, data } = action.payload.response;
        status = code == 200 ? 'done' : 'error';
        url = data ? data.file_url : null;
        fileId = code == 200 && data ? data.file_id : undefined;
        Message[`${code == 200 ? 'success' : 'error'}`](msg);
      }
      return {
        ...state,
        uploadFileList: [{
          uid: action.payload.uid,
          name: action.payload.name,
          status,
          url,
          fileId,
        }],
      };
    },
    saveUploadFileList(state, action) { // 编辑时保存
      return {
        ...state,
        uploadFileList: [{
          uid: action.payload.uid,
          name: action.payload.name,
          status: action.payload.status,
          url: action.payload.url,
          fileId: action.payload.uid,
        }],
      };
    },
    // 新增时UploadFileList为空
    defaultUploadFileList(state, action) {
      // console.log(action);
      return {
        ...state,
        uploadFileList: [],
      };
    },
    // 详情
    changeEnvModalStatus(state, action) {
      return {
        ...state,
        envModalStatus: {
          ...state.envModalStatus,
          ...action.payload,
        },
      };
    },
  },
};
