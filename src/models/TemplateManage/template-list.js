import { Message } from 'antd';
import { fetchTemplateList, save } from '../../services/cmdb-device-manage-api';
import { objKeyWrapper } from '../../utils/utils';

const PAGE_SIZE = 20;
const getValuesFromFields = (obj) => {
  return obj.value;
};

export default {
  namespace: 'TemplateList',
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
    searchFormFields: { // 搜索条件
      search_key: {
        value: undefined,
      },
    },
    modalDataInfo: { // modal弹窗所需参数
      modalStatus: false, // 编辑modal
      editId: '',
      modalData: { // 编辑页面数据
        dic_name: {
          value: undefined,
        },
        dic_content: {
          value: [],
        },
      },
    },
    operateAuthor: {}, // 操作权限
  },

  effects: {
    // 初始化服务列表数据
    *fetchListData({ payload }, { call, put, select }) {
      const state = yield select(store => store.TemplateList);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(fetchTemplateList, {
        ...searchFormValues,
        ...payload,
      });
      if (response.code === 200) {
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

    // 保存数据字典中，暂存模版内容
    /**
     *
     * @param {payload} 数据字典内容
     * @param {dicName} 数据字典名称
     */
    *saveDicContentObj({ payload, dicName }, { put, call, select }) {
      let dicContent = yield select(store => store.TemplateList.modalDataInfo.modalData);
      dicContent = {}; // 切换不同字段名称，数据字典内容重新置空，避免上次数据影响本条字段名称中的字段内容对象
      dicContent.dic_name = { value: dicName };
      dicContent.dic_content = { value: payload };
      // 根据dic_content数组的长度，增加`dic_content${index}`对象，对应modal框中的字段内容的 Input 个数
      payload.forEach((item, index) => {
        dicContent[`dic_content${index}`] = { value: item };
      });
      yield put({
        type: 'changeDicContentObj',
        payload: dicContent,
      });
    },

    // 增加，删除字段内容列表
    *addDeleteContent({ payload }, { put, call, select }) {
      const newObj = yield select(store => store.TemplateList.modalDataInfo.modalData);
      const dicContent = JSON.parse(JSON.stringify(newObj));
      const dicName = dicContent.dic_name;
      const dicContentArr = dicContent.dic_content.value;
      if (payload.type == 'add') { // 如果为新增，dic_content数组新增一条数据，记录编辑字段内容 input 个数
        dicContentArr.push(undefined);
      } else { // 如果为删除， 删除本条dic_content数组的数据，同时 input 个数减少
        dicContentArr.splice(payload.index, 1);
      }
      dicContentArr.forEach((item, index) => {
        dicContent[`dic_content${index}`] = { value: item };
      });
      // console.log('dicContent11111111', dicContent);
      yield put({
        type: 'saveFormField',
        payload: dicContent,
      });
    },
    // handleCancel 关闭编辑弹框
    *handleCancel({ payload }, { put, call, select }) {
      const dicContent = yield select(store => store.TemplateList.modalDataInfo.modalData);
      const dicContentArr = dicContent.dic_content.value;
      dicContentArr.forEach((item, index) => {
        if (item == undefined) {
          delete dicContent[`dic_content${index}`];
        }
      });
      dicContent.dic_content.value = dicContentArr.filter((item) => { return item !== undefined; });
      // console.log('dicContent222222', dicContent);
      yield put({
        type: 'resetFormField',
        payload: dicContent,
      });
    },

    // 编辑内容
    *formFieldChange({ payload }, { call, put, select }) {
      const dicIndex = Object.keys(payload)[0].substr(-1, 1); // 编辑内容在dic_content数组中的下表
      const dicContent = yield select(store => store.TemplateList.modalDataInfo.modalData);
      const dicContentArr = dicContent.dic_content.value;
      // 根据下标，替换数据字典中对应的本条数据
      dicContentArr.splice(dicIndex, 1, payload[`dic_content${dicIndex}`].value);
      dicContent[`dic_content${dicIndex}`] = payload[`dic_content${dicIndex}`];
      yield put({
        type: 'saveFormField',
        payload: dicContent,
      });
    },

    // 确定按钮保存
    *save({ payload }, { put, call, select }) {
      const response = yield call(save, { ...payload });
      if (response.code == 200) {
        Message.success(response.msg);
        const listState = yield select(store => store.TemplateList);
        const listSearchFormValues = objKeyWrapper(listState.searchFormFields, getValuesFromFields);
        yield put({
          type: 'fetchListData',
          payload: {
            ...listSearchFormValues,
            page: listState.listInfo.pagination.current,
            page_size: listState.listInfo.pagination.pageSize,
          },
        });
      }
      yield put({
        type: 'changeModalStatus',
        payload: {
          bol: false,
          id: undefined,
        },
      });
    },
  },

  reducers: {
    // 搜索框发生变化改变search_key
    searchFormFieldChange(state, { payload }) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...payload,
        },
      };
    },
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
        operateAuthor: action.payload.permissions, // 操作权限
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

    // 控制modal弹窗显示隐藏
    changeModalStatus(state, action) {
      return {
        ...state,
        modalDataInfo: {
          ...state.modalDataInfo,
          ...{
            modalStatus: action.payload.bol,
          },
          ...{
            editId: action.payload.id,
          },
        },
      };
    },

    // 保存发生改变的数据字典的数据
    changeDicContentObj(state, action) {
      return {
        ...state,
        modalDataInfo: {
          ...{
            modalStatus: state.modalDataInfo.modalStatus,
          },
          ...{
            editId: state.modalDataInfo.editId,
          },
          ...{
            modalData: {
              ...action.payload,
            },
          },
        },
      };
    },
    // 增加 删除 编辑 后保存
    saveFormField(state, action) {
      return {
        ...state,
        modalDataInfo: {
          ...{
            modalStatus: state.modalDataInfo.modalStatus,
          },
          ...{
            editId: state.modalDataInfo.editId,
          },
          ...{
            modalData: {
              ...state.modalDataInfo.modalData,
              ...action.payload,
            },
          },
        },
      };
    },
    resetFormField(state, action) {
      return {
        ...state,
        modalDataInfo: {
          ...state.modalDataInfo,
          modalData: action.payload,
        },
      };
    },
  },
};
