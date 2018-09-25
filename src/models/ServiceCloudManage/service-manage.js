import { Message } from 'antd';
import {
  queryServiceList,
  basicdict,
  getVpc,
  getServiceInfo,
  stopService,
  recover,
  release,
  addService,
} from '../../services/service-manage-api';
import { objKeyWrapper } from '../../utils/utils';

const getValuesFromFields = (obj) => {
  return obj.value;
};
const integratedData = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((item, index) => {
    if (obj[item] !== undefined) {
      newObj[item] = obj[item];
    }
  });
  return newObj;
};

const PAGE_SIZE = 20;
export default {
  namespace: 'serviceManage',

  state: {
    searchFormFields: {
      role_name: {
        value: undefined,
      },
    },
    listInfo: {
      list: [],
      pagination: {
        current_page: 1,
        pageSize: PAGE_SIZE,
        total: 0,
      },
      isLoading: false,
    },
    loading: false,
    modalStatus: false, // 新增modal
    infoModalStatus: false, // 查新详情modal
    serviceInfo: {}, // 服务器详情
    pageSwitchIndex: 0,
    dataDictionary: [],
    selectedRowKeys: [0], // 套餐默认选择项
    addFormFields: { // 新增服务器
      charging: { // 计费方式
        value: undefined,
      },
      cycle: { // 购买周期
        value: undefined,
      },
      zone: { // 地区
        value: undefined,
      },
      config: { // 套餐 默认为A套餐
        value: '1',
      },
      image: { // 镜像
        value: undefined,
      },
      vpc_switch: { // vpc 交换机
        value: undefined,
      },
      security: { // 安全组
        value: undefined,
      },
      useoutip: { // 是否使用公网
        value: false,
      },
      bandtype: { // 带宽 按流量计费
        value: undefined,
      },
      networkband: { // 带宽 20Mbps
        value: undefined,
      },
      loginuser: { // 登录名
        value: 'root',
      },
      loginpassword: { // 登陆密码
        value: undefined,
      },
      confirmpassword: { // 校验登陆密码
        value: undefined,
      },
      name: { // 主机名
        value: undefined,
      },
      comment: { // 备注
        value: undefined,
      },
    },
    releaseModal: false, // 释放弹出框控制
    releaseServiceId: null,
    isRequired: false, // 是否使用公网
    operateAuthor: {}, // 操作权限
  },

  effects: {
    // 加载list数据
    *fetchList({ payload }, { call, put, select }) {
      const state = yield select(store => store.serviceManage);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryServiceList, {
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
    // 点击增加 modal显示隐藏
    *changeStatus({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeModalStatus',
        payload,
      });
      if (callback) callback();
      // 关闭modal之后，步骤条当前为0
      yield put({
        type: 'savePageSwitchIndex',
        payload: 0,
      });
      // 重置表单
      yield put({
        type: 'resetFormValue',
      });
      // 重置套餐选择
      yield put({
        type: 'changeSelectedRowKey',
        payload: [0],
      });
    },
    // 下一步，返回修改回调
    *pageSwitch({ payload }, { call, put }) {
      yield put({
        type: 'savePageSwitchIndex',
        payload,
      });
    },
    // 弹出modal， 加载数据字典
    *fetchDataDictionary({ payload }, { call, put }) {
      const response = yield call(basicdict);
      if (response.code == 200) {
        yield put({
          type: 'saveDataDictionary',
          payload: response.data[0],
        });
      }
    },
    // 获取vpc和交换机数据
    *fetchVpc({ paylaod }, { call, put }) {
      const response = yield call(getVpc);
      if (response.code == 200) {
        yield put({
          type: 'saveDataDictionary',
          payload: {
            vpc_switch: response.data,
          },
        });
      }
    },
    // 点击查看 modal显示隐藏
    *changeInfoStatus({ payload, currentId }, { call, put }) {
      yield put({
        type: 'changeInfoModalStatus',
        payload,
      });
      if (payload) {
        yield put({ // 加载服务器详情
          type: 'fetchServiceInfo',
          payload: { id: currentId },
        });
      }
    },
    // 加载服务器详情信息
    *fetchServiceInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeInfoLoading',
        payload: true,
      });
      const response = yield call(getServiceInfo, { ...payload });
      if (response.code == 200) {
        yield put({
          type: 'saveServiceInfo',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeInfoLoading',
        payload: false,
      });
    },
    // 停用服务器
    *stopService({ payload }, { call, put, select }) {
      const state = yield select(store => store.serviceManage);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      const respose = yield call(stopService, { ...payload });
      if (respose.code == 200) {
        Message.success('停用成功');
        yield put({
          type: 'fetchList',
          payload: {
            ...searchFormValues,
            current_page: state.listInfo.pagination.current_page,
            page_size: state.listInfo.pagination.pageSize,
          },
        });
      }
    },

    // 启用服务器
    *recoverService({ payload }, { call, put, select }) {
      const state = yield select(store => store.serviceManage);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      const respose = yield call(recover, { ...payload });
      if (respose.code == 200) {
        Message.success('启用成功');
        yield put({
          type: 'fetchList',
          payload: {
            ...searchFormValues,
            current_page: state.listInfo.pagination.current_page,
            page_size: state.listInfo.pagination.pageSize,
          },
        });
      }
    },

    // 暂存释放服务器id
    *saveReleaseServiceId({ payload, bol }, { call, put, select }) {
      yield put({ // 控制释放服务器modal显示隐藏
        type: 'changeReleaseModal',
        payload: bol,
      });
      yield put({
        type: 'saveRelSerId',
        payload: payload.id,
      });
    },

    // 释放服务器
    *releaseService({ payload }, { call, put, select }) {
      const state = yield select(store => store.serviceManage);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      yield put({
        type: 'changeInfoLoading',
        payload: true,
      });
      const response = yield call(release, { ...payload });
      if (response.code == 200) {
        Message.success('释放成功');
        yield put({
          type: 'fetchList',
          payload: {
            ...searchFormValues,
            current_page: state.listInfo.pagination.current_page,
            page_size: state.listInfo.pagination.pageSize,
          },
        });
        yield put({ // 控制释放服务器modal显示隐藏
          type: 'changeReleaseModal',
          payload: false,
        });
      }
      yield put({
        type: 'changeInfoLoading',
        payload: false,
      });
    },

    // 新增服务器
    *addService({ payload, callback }, { put, call, select }) {
      const state = yield select(store => store.serviceManage);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      const addFormValues = objKeyWrapper(state.addFormFields, getValuesFromFields);
      const sendFormValues = integratedData(addFormValues); // 去除数据中为undefine的对象
      yield put({
        type: 'changeInfoLoading',
        payload: true,
      });
      const response = yield call(addService, {
        ...sendFormValues,
        ...payload,
      });
      if (response.code == 200) {
        Message.success('新增成功');
        yield put({
          type: 'fetchList',
          payload: {
            ...searchFormValues,
            // current_page: state.listInfo.pagination.current_page,
            current_page: 1,
            page_size: state.listInfo.pagination.pageSize,
          },
        });
        yield put({
          type: 'changeStatus',
          payload: false,
          callback,
        });
      }
      yield put({
        type: 'changeInfoLoading',
        payload: false,
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
              current_page: action.payload.current_page,
              total: action.payload.total,
              pageSize: action.payload.page_size,
            },
          },
        },
        operateAuthor: action.payload.permissions, // 操作权限
      };
    },
    changeModalStatus(state, action) {
      return {
        ...state,
        modalStatus: action.payload,
      };
    },
    changeInfoModalStatus(state, action) {
      return {
        ...state,
        infoModalStatus: action.payload,
      };
    },
    // 保存切换当前页下标index
    savePageSwitchIndex(state, action) {
      return {
        ...state,
        pageSwitchIndex: action.payload,
      };
    },
    // 搜索框发生变化改变role_name
    formFieldChange(state, { payload }) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...payload,
        },
      };
    },
    // 新增弹出框form表单发生改变赋值
    addFormFieldChange(state, { payload }) {
      return {
        ...state,
        addFormFields: {
          ...state.addFormFields,
          ...payload,
        },
      };
    },
    // 保存数据字典
    saveDataDictionary(state, action) {
      return {
        ...state,
        dataDictionary: {
          ...state.dataDictionary,
          ...action.payload,
        },
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
    // 选择套餐
    changeSelectedRowKey(state, action) {
      return {
        ...state,
        selectedRowKeys: action.payload,
      };
    },
    // 重置modal新增表单
    resetFormValue(state, action) {
      return {
        ...state,
        addFormFields: { // 新增服务器
          charging: { // 计费方式
            value: undefined,
          },
          cycle: { // 购买周期
            value: undefined,
          },
          zone: { // 地区
            value: undefined,
          },
          config: { // 套餐 默认为A套餐
            value: '1',
          },
          image: { // 镜像
            value: undefined,
          },
          vpc_switch: { // vpc 交换机
            value: undefined,
          },
          security: { // 安全组
            value: undefined,
          },
          bandtype: { // 带宽 按流量计费
            value: undefined,
          },
          useoutip: { // 是否使用公网
            value: false,
          },
          networkband: { // 带宽 20Mbps
            value: undefined,
          },
          loginuser: { // 登录名
            value: 'root',
          },
          loginpassword: { // 登陆密码
            value: undefined,
          },
          confirmpassword: { // 校验登陆密码
            value: undefined,
          },
          name: { // 主机名
            value: undefined,
          },
          comment: { // 备注
            value: undefined,
          },
        },
      };
    },
    // 改变查看详情loading
    changeInfoLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    // 保存服务信息
    saveServiceInfo(state, action) {
      return {
        ...state,
        serviceInfo: action.payload,
      };
    },
    // 控制释放modal显示隐藏
    changeReleaseModal(state, action) {
      return {
        ...state,
        releaseModal: action.payload,
      };
    },
    saveRelSerId(state, action) {
      return {
        ...state,
        releaseServiceId: action.payload,
      };
    },
    // 输入密码通过校验，更改checkedPassword标示，允许执行添加服务器
    // changePassWordStatus(state, action) {
    //   return {
    //     ...state,
    //     [`${action.item}`]: action.payload,
    //   };
    // },

    // 是否使用公网
    saveIsRequired(state, action) {
      // console.log(action);
      return {
        ...state,
        isRequired: action.payload,
      };
    },
  },
};
