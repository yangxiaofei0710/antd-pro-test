import { Message } from 'antd';
import {
  fetchVirtualList, // 列表
  fetchDictionary, // 数据字典
  virtualDetail, // 详情
  fetchPhysical, // 物理机模糊查询
  allotVirtual, // 分配服务器
  offlineVirtual, // 下线
  regressVirtual, // 重新上线
  addVirtual, // 新增
  editVirtual, // 编辑
  rejectVirtual, // 销毁
  virtualException, // 异常
} from '../../../services/cmdb-device-manage-api';
import { objKeyWrapper } from '../../../utils/utils';
import LocalStorage from '../../../utils/storage';

const getValuesFromFields = (obj) => {
  return obj.value;
};
const PAGE_SIZE = 20;

export default {
  namespace: 'virtualManage',

  state: {
    commonSearchForm: { // 搜索框
      search_text: {
        value: undefined,
      },
      rejecttime: { // 销毁时间
        value: undefined,
      },
    },
    commonlistInfo: { // 数据列表
      list: [],
      pagination: {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
      },
      isLoading: false,
    },
    modalStatus: false, // 新增/编辑 modal显示隐藏
    commonModalStatus: false, // 分配服务器modal
    infoModalStatus: false, // 查看详情modal显示隐藏
    regressModalStatus: false, // 重新上线至
    commonLoading: false,
    dataDictionary: {}, // 数据字典
    selectedRowKeys: [0], // 套餐默认选择项
    relevancePhysical: [], // 关联物理机信息 用于渲染select的option
    relevancePhysicalId: undefined, // 关联物理机id
    fetchingLoading: false, // 搜索物理机loading
    virtualInfo: {}, // 查看虚拟机详情
    errorModalStatus: { // 异常modal控制
      show: false,
      loading: false,
    },
    errorInfo: { // 异常内容
      exceptiontime: '', // 异常时间
      exceptioncontent: '', // 异常内容
    },
    commonFormFields: {
      id: { // 当前虚拟机id
        value: undefined,
      },
      config: { // 套餐 默认为A套餐
        value: '1',
      },
      serverip: { // 主机ip
        value: undefined,
      },
      os_id: { // 系统版本id
        value: undefined,
      },
      loginuser: { // 登录名
        value: 'root',
      },
      servername: { // 主机名
        value: undefined,
      },
      loginpassword: {// 登陆密码
        value: undefined,
      },
      loginpasswordconfirm: { // 确认密码
        value: undefined,
      },
      description: { // 描述
        value: undefined,
      },
      serversn: { // 虚拟机sn
        value: undefined,
      },
      configName: { // 配置名称
        value: undefined,
      },
      physical: { // 关联物理机信息
        value: [],
      },
      // physicalSn: { // 关联物理机sn
      //   value: undefined,
      // },
      regress: { // 重新上线至
        value: undefined,
      },
    },

    operateAuthor: {}, // 操作权限
  },

  effects: {
    *fetchCommonList({ payload }, { call, put, select }) {
      yield put({
        type: 'changeCommonTableLoading',
        payload: true,
      });
      const response = yield call(fetchVirtualList, { ...payload });
      if (response.code == 200) {
        yield put({
          type: 'saveCommonTableList',
          payload: response.data,
        });
      }

      yield put({
        type: 'changeCommonTableLoading',
        payload: false,
      });
    },

    // 加载数据字典
    *fetchDataDictionary({ payload }, { call, put }) {
      const response = yield call(fetchDictionary);
      if (response.code == 200) {
        yield put({
          type: 'saveDataDictionary',
          payload: response.data,
        });
      }
    },

    // 点击 分配至资源池/编辑 显示modal
    *changeModalStatus({ payload, callback }, { call, put }) {
      yield put({
        type: 'saveModalStatus',
        payload,
      });
      if (callback) callback();
    },

    // 加载虚拟机detail信息
    *queryPhysicalDetail({ payload }, { call, put, select }) {
      let selectKey = '';
      yield put({
        type: 'saveCommonLoading',
        payload: true,
      });
      const response = yield call(virtualDetail, { ...payload });
      if (response.code == 200) {
        yield put({
          type: 'saveCommonFormFields',
          payload: response.data,
        });
        switch (response.data.config.id) {
          case '1':
            selectKey = [0];
            break;
          case '2':
            selectKey = [1];
            break;
          case '3':
            selectKey = [2];
            break;
          case '4':
            selectKey = [3];
            break;
          default:
            break;
        }
        yield put({ // 暂存当前套餐
          type: 'changeSelectedRowKey',
          payload: selectKey,
        });
        yield put({ // 暂存当前挂载物理机的id
          type: 'changeRelevancePhysicalId',
          payload: response.data.hostinfo.hostid,
        });
      }
      yield put({
        type: 'saveCommonLoading',
        payload: false,
      });
    },

    // 新增/编辑时输入物理机信息，模糊查新物理机信息
    *fetchPhysical({ payload }, { call, put, select }) {
      yield put({
        type: 'changeFetchingLoading',
        payload: true,
      });
      const response = yield call(fetchPhysical, { ...payload });
      if (response.code == 200) {
        const newArr = response.data.msgdata.map(item => ({
          text: `${item.serverip}/${item.servername}/${item.serversn}`,
          value: `${item.serverip}/${item.servername}/${item.serversn}`,
          id: item.id,
        }));
        yield put({
          type: 'changeRelevancePhysical',
          payload: newArr,
        });
      }
      yield put({
        type: 'changeFetchingLoading',
        payload: false,
      });
    },

    //  资源池虚拟服务器 => 分配服务器 / 下线虚拟服务器 => 重新上线至 / 下线
    *operateService({ payload, env, url }, { call, put, select }) {
      const req = {
        allotVirtual, // 分配服务器
        offlineVirtual, // 下线
        regressVirtual, // 重新上线
        rejectVirtual, // 销毁
      };
      const msg = {
        allotVirtual: '分配成功', // 分配服务器
        offlineVirtual: '下线成功', // 下线
        regressVirtual: '重新上线成功', // 重新上线
        rejectVirtual: '销毁成功', // 销毁
      };
      const state = yield select(store => store.virtualManage);
      const commonSearchForm = objKeyWrapper(state.commonSearchForm, getValuesFromFields);
      yield put({
        type: 'saveCommonLoading',
        payload: true,
      });
      const response = yield call(req[`${url}`], { ...payload });
      if (response.code == 200) {
        Message.success(msg[`${url}`]);
        yield put({
          type: 'fetchCommonList',
          payload: {
            ...commonSearchForm,
            current_page: state.commonlistInfo.pagination.current,
            page_size: state.commonlistInfo.pagination.pageSize,
            env,
          },
        });
        yield put({
          type: 'saveCommonModalStatus',
          payload: false,
        });
        yield put({
          type: 'saveRegressModalStatus',
          payload: false,
        });
        yield put({
          type: 'initialCommonFormFields',
        });
      }
      yield put({
        type: 'saveCommonLoading',
        payload: false,
      });
    },

    // 虚拟机确定新增/编辑
    *addEditSubmit({ payload, clickType, callback, env }, { call, put, select }) {
      const state = yield select(store => store.virtualManage);
      const commonSearchForm = objKeyWrapper(state.commonSearchForm, getValuesFromFields);
      let response = '';
      let msg = '';
      yield put({
        type: 'saveCommonLoading',
        payload: true,
      });
      if (clickType == 'add') { // 新增
        response = yield call(addVirtual, { ...payload });
        msg = '新增成功';
      } else { // 编辑
        response = yield call(editVirtual, { ...payload });
        msg = '编辑成功';
      }
      if (response.code == 200) {
        Message.success(msg);
        yield put({
          type: 'fetchCommonList',
          payload: {
            ...commonSearchForm,
            current_page: clickType == 'add' ? 1 : state.commonlistInfo.pagination.current,
            page_size: state.commonlistInfo.pagination.pageSize,
            env,
          },
        });
        yield put({ // 控制modal显示隐藏
          type: 'changeModalStatus',
          payload: false,
          callback: callback || undefined,
        });
        yield put({
          type: 'initialCommonFormFields',
        });
      }
      yield put({
        type: 'saveCommonLoading',
        payload: false,
      });
    },

    // 异常内容
    *changeErrorInfo({ payload }, { call, put }) {
      yield put({
        type: 'saveErrorModalStatus',
        payload: {
          show: true,
          loading: true,
        },
      });
      const response = yield call(virtualException, { ...payload });
      if (response.code == 200) {
        yield put({
          type: 'saveErrorInfo',
          payload: response.data,
        });
      }
      yield put({
        type: 'saveErrorModalStatus',
        payload: {
          show: true,
          loading: false,
        },
      });
    },

    // 查看详情
    *showInfoModal({ payload }, { call, put }) {
      yield put({
        type: 'saveCommonLoading',
        payload: true,
      });
      const response = yield call(virtualDetail, { ...payload });
      if (response.code == 200) {
        yield put({
          type: 'saveVirtualInfo',
          payload: response.data,
        });
      }
      yield put({
        type: 'saveCommonLoading',
        payload: false,
      });
    },
  },

  reducers: {
    commonFormFieldChange(state, action) {
      return {
        ...state,
        commonSearchForm: {
          ...state.commonSearchForm,
          ...action.payload,
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
    // 保存列表数据
    saveCommonTableList(state, action) {
      return {
        ...state,
        commonlistInfo: {
          ...state.commonlistInfo,
          ...{
            list: action.payload.msgdata,
          },
          ...{
            pagination: {
              current: action.payload.current_page,
              pageSize: action.payload.page_size,
              total: action.payload.total,
            },
          },
        },
        operateAuthor: action.payload.permissions, // 操作权限
      };
    },
    // 更改列表table loading效果
    changeCommonTableLoading(state, action) {
      return {
        ...state,
        commonlistInfo: {
          ...state.commonlistInfo,
          ...{
            isLoading: action.payload,
          },
        },
      };
    },
    // 新增/编辑modal控制隐藏
    saveModalStatus(state, action) {
      return {
        ...state,
        modalStatus: action.payload,
      };
    },
    // 新增/编辑弹出框form表单发生改变赋值
    modalFormFieldChange(state, { payload }) {
      return {
        ...state,
        commonFormFields: {
          ...state.commonFormFields,
          ...payload,
        },
      };
    },
    // 初始化表单数据
    initialCommonFormFields(state, action) {
      return {
        ...state,
        commonFormFields: {
          id: { // 当前虚拟机id
            value: undefined,
          },
          config: { // 套餐 默认为A套餐
            value: '1',
          },
          serverip: { // 主机ip
            value: undefined,
          },
          os_id: { // 系统版本id
            value: undefined,
          },
          loginuser: { // 登录名
            value: 'root',
          },
          servername: { // 主机名
            value: undefined,
          },
          loginpassword: {// 登陆密码
            value: undefined,
          },
          loginpasswordconfirm: { // 确认密码
            value: undefined,
          },
          description: { // 描述
            value: undefined,
          },
          serversn: { // 虚拟机sn
            value: undefined,
          },
          configName: { // 配置名称
            value: undefined,
          },
          physical: { // 关联物理机信息
            value: [],
          },
          // physicalSn: { // 关联物理机id
          //   value: undefined,
          // },
          regress: { // 重新上线至
            value: undefined,
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

    // 控制modal loading效果
    saveCommonLoading(state, action) {
      return {
        ...state,
        commonLoading: action.payload,
      };
    },

    // 在调用后端detail接口成功后， 保存当前物理机detail信息
    saveCommonFormFields(state, { payload }) {
      let newObj = {};
      const physicalInfo = { // 关联物理机信息
        physical: {
          value: [`${payload.hostinfo.hostip}/${payload.hostinfo.hostname}/${payload.hostinfo.hostsn}`],
        },
        // physicalSn: {
        //   value: payload.hostinfo.hostsn,
        // },
      };
      Object.keys(payload).forEach((item, index) => {
        if (state.commonFormFields.hasOwnProperty(item)) {
          newObj = {
            [`${item}`]: {
              value: payload[`${item}`],
            },
          };
          if (item == 'config') { // 配置套餐信息
            newObj = {
              config: { // 当前选择配置套餐id
                value: payload[`${item}`].id,
              },
              configName: { // 配置套餐名称
                value: payload[`${item}`].name,
              },
            };
          }
          Object.assign(state.commonFormFields, newObj, physicalInfo);
        }
      });
      return {
        ...state,
        commonFormFields: {
          ...state.commonFormFields,
        },
      };
    },
    // 保存当前common  modal控制状态
    saveCommonModalStatus(state, action) {
      return {
        ...state,
        commonModalStatus: action.payload,
      };
    },

    // 更改关联物理机信息 搜索物理机select的otioin
    changeRelevancePhysical(state, action) {
      return {
        ...state,
        relevancePhysical: action.payload,
      };
    },
    // 更改关联物理机信息id
    changeRelevancePhysicalId(state, action) {
      return {
        ...state,
        relevancePhysicalId: action.payload,
      };
    },
    changeFetchingLoading(state, action) {
      return {
        ...state,
        fetchingLoading: action.payload,
      };
    },
    // 保存异常modal信息
    saveErrorInfo(state, action) {
      return {
        ...state,
        errorInfo: {
          ...state.errorInfo,
          ...{
            exceptiontime: action.payload.exceptiontime, // 异常时间
            exceptioncontent: action.payload.exceptioncontent, // 异常内容
          },
        },
      };
    },
    // 保存异常modal 控制visibel
    saveErrorModalStatus(state, action) {
      return {
        ...state,
        errorModalStatus: action.payload,
      };
    },

    // 查看详情
    saveInfoModalStatus(state, action) {
      return {
        ...state,
        infoModalStatus: action.payload,
      };
    },
    // 保存详情
    saveVirtualInfo(state, action) {
      return {
        ...state,
        virtualInfo: action.payload,
      };
    },
    saveRegressModalStatus(state, action) {
      return {
        ...state,
        regressModalStatus: action.payload,
      };
    },
  },
};
