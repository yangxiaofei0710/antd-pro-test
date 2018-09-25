import { Message } from 'antd';
import { addProject, editProject, loadCategoryTree, fetchGitList } from '../../../services/api';
import { objKeyWrapper } from '../../../utils/utils';


const PAGE_SIZE = 20;
const getValuesFromFields = (obj) => {
  return obj.value;
};

export default {
  namespace: 'projectAdd',
  state: {
    searchFormFields: {
      project_name: {// 项目名称
        value: undefined,
      },
      department_id: {// 所属部门
        value: undefined,
      },
      supervisor_id: {// 负责人
        value: undefined,
      },
      product_manager_id: {// 产品经理
        value: undefined,
      },
      ops_user_id: {// 运维人员
        value: undefined,
      },
      develop_user_id: {// 技术开发
        value: undefined,
      },
      test_user_id: {// 测试人员
        value: undefined,
      },
      other_user_id: {// 其他人员
        value: undefined,
      },
      desc: {// 描述
        value: undefined,
      },
      git_name: { // 关联git组
        value: undefined,
      },
      iscreate: { // 是否关联git组
        value: true,
      },
    },
    organizeTree: [],
    gitList: [],
  },

  effects: {
    *projectAdd({ payload }, { call, put, select }) {
      const state = yield select(store => store.projectAdd);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      const listState = yield select(store => store.projectList);
      const listSearchFormValues = objKeyWrapper(listState.searchFormFields, getValuesFromFields);
      yield put({
        type: 'projectInfo/changeLoading',
        payload: true,
      });

      let response = null;
      if (payload.type == 'edit') {
        response = yield call(editProject, {
          ...searchFormValues,
          id: payload.id,
        });
      } else {
        response = yield call(addProject, {
          ...searchFormValues,
          // organizational_id: '1',
        });
      }
      if (response.code === 200) {
        Message.success('保存成功');
        // 增加编辑之后重新查询table表格数据， 并且初始化搜索条件
        yield put({
          type: 'projectList/reste',
          payload: {
            serviceName: {
              value: undefined,
            },
            createTime: {
              value: undefined,
            },
          },
        });
        // 更新列表
        yield put({
          type: 'projectList/fetch',
          payload: {
            ...listSearchFormValues,
            page: payload.type == 'edit' ? listState.listInfo.pagination.current : 1,
            page_size: listState.listInfo.pagination.pageSize,
          },
        });
        // 关闭modal对话框
        yield put({
          type: 'projectList/changeModalBol',
          payload: false,
        });
      }
      yield put({
        type: 'projectInfo/changeLoading',
        payload: false,
      });
    },
    // 点击取消按钮重置表单
    *resetFiledsValue({ payload }, { put }) {
      yield put({
        type: 'projectInfo/reste',
      });
      yield put({
        type: 'reset',
        payload,
      });
    },
    *fetchGitList({ payload }, { call, put }) {
      const response = yield call(fetchGitList);
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
    setFormValue(state, action) {
      return {
        ...state,
        searchFormFields: {
          // ...state.searchFormFields,
          ...{ project_name: {
            value: action.payload.project_name,
          },
          },
          ...{ department_id: {
            value: action.payload.department_id,
          },
          },
          ...{ supervisor_id: {
            value: action.payload.supervisor_id,
          },
          },
          ...{ product_manager_id: {
            value: action.payload.product_manager_id,
          },
          },
          ...{ ops_user_id: {
            value: action.payload.ops_user_id,
          },
          },
          ...{ develop_user_id: {
            value: action.payload.develop_user_id,
          },
          },
          ...{ test_user_id: {
            value: action.payload.test_user_id,
          },
          },
          ...{ other_user_id: {
            value: action.payload.other_user_id,
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
        },
      };
    },
    changeSelectPer(state, { payload }) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...{
            [`${payload.selectType}`]: {
              value: payload.user_ids,
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
    saveGitList(state, action) {
      return {
        ...state,
        gitList: action.payload,
      };
    },
  },
};
