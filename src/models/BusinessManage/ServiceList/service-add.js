import { Message } from 'antd';
import { addService, updateService, fetchDataDictionary, fetchGitList } from '../../../services/service-list-api';
import { objKeyWrapper } from '../../../utils/utils';


const PAGE_SIZE = 20;
const getValuesFromFields = (obj) => {
  return obj.value;
};

export default {
  namespace: 'serviceAdd',
  state: {
    searchFormFields: {
      module_tech: {
        value: undefined,
      },
      module_name: {
        value: undefined,
      },
      module_path: {
        value: undefined,
      },

      logs_path: {
        value: undefined,
      },
      port: {
        value: undefined,
      },
      module_type: {
        value: undefined,
      },
      publicservice: {
        value: undefined,
      },
      desc: {
        value: undefined,
      },
      git_name: { // 关联git组
        value: undefined,
      },
      iscreate: { // 是否关联git组
        value: undefined,
      },
      iscolony: { // 是否集成容器
        value: undefined,
      },
    },
    dataDictionary: {},
    showModal: false, // 控制对话框显示隐藏
    gitList: [],
    gitUrl: undefined,
  },

  effects: {
    *serviceAdd({ payload }, { call, put, select }) {
      const state = yield select(store => store.serviceAdd);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      yield put({
        type: 'serviceInfo/changeLoading',
        payload: true,
      });
      let response = null;
      if (payload.type == 'edit') {
        response = yield call(updateService, {
          // ...searchFormValues,
          desc: searchFormValues.desc,
          id: payload.id,
        });
      } else {
        response = yield call(addService, {
          ...searchFormValues,
          project_id: payload.project_id,
          git_url: state.gitUrl,
        });
      }

      if (response.code === 200) {
        Message.success('保存成功');
        const listState = yield select(store => store.serviceList);
        const listSearchFormValues = objKeyWrapper(listState.searchFormFields, getValuesFromFields);
        yield put({
          type: 'serviceList/loadListData',
          payload: {
            ...listSearchFormValues,
            page: payload.type == 'edit' ? listState.listInfo.pagination.current : 1,
            page_size: listState.listInfo.pagination.pageSize,
            project_id: payload.project_id,
          },
        });
        // 增加编辑之后重新查询table表格数据， 并且初始化搜索条件
        // yield put({
        //   type: 'serviceList/reste',
        //   payload: {
        //     module_name: {
        //       value: undefined,
        //     },
        //     createTime: {
        //       value: undefined,
        //     },
        //   },
        // });
        yield put({
          type: 'changeShowModal',
          payload: false,
        });
      }
      yield put({
        type: 'serviceInfo/changeLoading',
        payload: false,
      });
    },
    *resetFiledsValue({ payload }, { put }) {
      yield put({
        type: 'serviceInfo/reste',
      });
      yield put({
        type: 'reset',
        payload,
      });
    },

    *fetchDataDictionary({ payload }, { call, put }) {
      const response = yield call(fetchDataDictionary);
      if (response.code === 200) {
        yield put({
          type: 'saveDataDictionary',
          payload: response.data,
        });
      }
    },
    *fetchGitList({ payload }, { call, put }) {
      const response = yield call(fetchGitList, { ...payload });
      if (response.code == 200) {
        yield put({
          type: 'saveGitList',
          payload: response.data,
        });
      }
    },
  },
  reducers: {
    formFieldChange(state, action) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...action.payload,
        },
      };
    },
    saveDataDictionary(state, action) {
      return {
        ...state,
        dataDictionary: {
          ...action.payload,
        },
      };
    },
    setFormValue(state, action) {
      return {
        ...state,
        searchFormFields: {
          ...{ module_tech: {
            value: action.payload.module_tech,
          },
          },
          ...{ module_name: {
            value: action.payload.module_name,
          },
          },
          ...{ module_path: {
            value: action.payload.module_path,
          },
          },
          ...{ logs_path: {
            value: action.payload.logs_path,
          },
          },
          ...{ port: {
            value: action.payload.port,
          },
          },
          ...{ module_type: {
            value: action.payload.module_type,
          },
          },
          ...{ publicservice: {
            value: !!action.payload.publicservice,
          },
          },
          ...{ desc: {
            value: action.payload.desc,
          },
          },
          ...{ git_name: {
            value: action.payload.git_name,
          },
          },
          ...{ iscreate: {
            value: action.payload.iscreate,
          },
          },
          ...{ iscolony: {
            value: action.payload.iscolony,
          },
          },
        },
      };
    },
    reset(state, action) {
      return {
        ...state,
        searchFormFields: {
          ...action.payload.searchFormFields,
        },
      };
    },
    changeShowModal(state, action) {
      return {
        ...state,
        showModal: action.payload,
      };
    },
    saveGitList(state, action) {
      return {
        ...state,
        gitList: action.payload,
      };
    },
    saveGitUrl(state, action) {
      return {
        ...state,
        gitUrl: action.payload,
      };
    },
  },
};
