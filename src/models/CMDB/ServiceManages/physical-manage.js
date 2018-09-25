import reqwest from 'reqwest';
import { Message } from 'antd';
import {
  upload,
  fetchCommonFormList,
  fetchDictionary,
  add, // 新增
  downLoad,
  physicaldetail, // 详情
  physicalEdit, // 编辑
  allotPhysical, // 分配资源池
  allotPhysicalService, // 分配服务器
  physicalRepair, // 报废/报修
  physicalOffline, // 下线
  physicalInitial, // 初始化
  physicalRegress, // 回归至
  physicalException, // 异常
} from '../../../services/cmdb-device-manage-api';
import { objKeyWrapper } from '../../../utils/utils';
import LocalStorage from '../../../utils/storage';

const getValuesFromFields = (obj) => {
  return obj.value;
};
const PAGE_SIZE = 20;

export default {
  namespace: 'physicalmanage',

  state: {
    /**
     *  公共数据部分
     */
    commonSearchForm: { // 搜索框
      search_text: {
        value: undefined,
      },
      svrfirstuse: {
        value: undefined,
      },
      svrstop: { // 维保到期时间
        value: undefined,
      },
      svroff: { // 报废时间
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
    clickType: undefined, // 区分 分配至资源池 编辑等操作按钮
    dataDictionary: {}, // 数据字典
    modalStatus: false, // 控制分配之资源池及编辑modal显示隐藏
    commonLoading: false, // 控制分配之资源池及编辑modal loading效果
    InfoModalStatus: false, // 查看详情modal显示隐藏
    commonModalStatus: false, // 新增物理机/分配至服务器 两个modal共用
    initModalStatus: false, // 初始化modal
    errorModalStatus: { // 异常modal控制
      show: false,
      loading: false,
    },
    errorInfo: { // 异常内容
      exceptiontime: '', // 异常时间
      exceptioncontent: '', // 异常内容
    },
    commonFormFields: { // 物理机管理详情数据 **********************************************
      id: { // 服务器id
        value: undefined,
      },
      serverip: { // 服务器ip
        value: undefined,
      },
      manageip: { // 管理ip
        value: undefined,
      },
      switchip: { // 接入交换机ip
        value: undefined,
      },
      os_id: { // 系统版本id
        value: undefined,
      },
      osname: { // 系统版本名称
        value: undefined,
      },
      buytime: { // 购入时间
        value: undefined,
      },
      serversn: { // 服务器SN
        value: undefined,
      },
      servervendortype_id: { // 主机型号id
        value: undefined,
      },
      servervendortype: { // 主机型号
        value: undefined,
      },
      idc_id: { // 机房id
        value: undefined,
      },
      idcname: { // 机房名称
        value: undefined,
      },
      rack_id: { // 机柜id
        value: undefined,
      },
      rackname: { // 机柜号
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
      repairtime: { // 维保到期时间
        value: undefined,
      },
      description: { // 描述
        value: undefined,
      },
      updatetime: { // 变更时间
        value: undefined,
      },
      updateuser: { // 变更人
        value: undefined,
      },
      updatestatus: { // 变更状态
        value: undefined,
      },
      regress: { // 回归至
        value: undefined,
      },
      env_id: { // 分配至
        value: undefined,
      },
    },

    /**
     * 总物理服务器列表
     */


    /**
     * 未上线的物理机
     */
    uploadPhysical: {
      fileList: [], // 暂存导入列表
      uploading: false, // 确定上传按钮loading效果控制
    },

    addModalStatus: false, // 导入modal

    operateAuthor: {}, // 操作权限
  },

  effects: {
    /**
     * 根据搜索条件，搜索list列表
     */
    *fetchCommonList({ payload }, { call, put, select }) {
      // const state = yield select(store => store.physicalmanage);
      // const searchFormValues = objKeyWrapper(state.commonSearchForm, getValuesFromFields);
      yield put({
        type: 'changeCommonTableLoading',
        payload: true,
      });

      const response = yield call(fetchCommonFormList, { ...payload });
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

    // 加载物理机detail信息 ************************************************
    *queryPhysicalDetail({ payload }, { call, put, select }) {
      yield put({
        type: 'saveCommonLoading',
        payload: true,
      });
      const response = yield call(physicaldetail, { ...payload });
      if (response.code == 200) {
        yield put({
          type: 'saveCommonFormFields',
          payload: response.data,
        });
      }
      yield put({
        type: 'saveCommonLoading',
        payload: false,
      });
    },

    // 弹出modal， 加载数据字典
    *fetchDataDictionary({ payload }, { call, put }) {
      const response = yield call(fetchDictionary);
      if (response.code == 200) {
        yield put({
          type: 'saveDataDictionary',
          payload: response.data,
        });
      }
    },

    // 点击分配至资源池显示modal
    *changeModalStatus({ payload, callback }, { call, put }) {
      yield put({
        type: 'saveModalStatus',
        payload,
      });
      if (callback) callback();
    },

    // 查看详情
    *showInfoModal({ payload }, { call, put }) {
      yield put({
        type: 'saveCommonLoading',
        payload: true,
      });
      yield put({
        type: 'saveInfoModalStatus',
        payload,
      });
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
      const response = yield call(physicalException, { ...payload });
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

    /**
     * 未上线的物理服务器
     */

    // 分配至资源池/分配服务器/编辑  *************************************************************************
    *handleUpdate({ payload, url, env, callback }, { call, put, select }) {
      const req = {
        allotPhysical, // 分配资源池（未上线）
        allotPhysicalService, // 分配服务器（物理机列表）
        physicalEdit, // 物理机编辑
        physicalInitial, // 初始化
        physicalRegress, // 回归至
      };
      const state = yield select(store => store.physicalmanage);
      const commonSearchForm = objKeyWrapper(state.commonSearchForm, getValuesFromFields);
      yield put({
        type: 'saveCommonLoading',
        payload: true,
      });
      const response = yield call(req[`${url}`], { ...payload });
      if (response.code == 200) {
        Message.success('操作成功');
        yield put({
          type: 'fetchCommonList',
          payload: {
            ...commonSearchForm,
            current_page: state.commonlistInfo.pagination.current,
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
        yield put({
          type: 'saveCommonModalStatus',
          payload: false,
        });
        yield put({
          type: 'changeInitModalStatus',
          payload: false,
        });
      }
      yield put({
        type: 'saveCommonLoading',
        payload: false,
      });
    },

    // 新增物理机/编辑物理机（未上线的物理机） ************************************************
    *handleAddEdit({ payload, env, clickType }, { call, put, select }) {
      const state = yield select(store => store.physicalmanage);
      const commonSearchForm = objKeyWrapper(state.commonSearchForm, getValuesFromFields);
      yield put({
        type: 'saveCommonLoading',
        payload: true,
      });
      let response;
      if (clickType == 'add') {
        response = yield call(add, { ...payload });
      } else {
        response = yield call(physicalEdit, { ...payload });
      }

      if (response.code == 200) {
        Message.success('新增成功');
        yield put({
          type: 'fetchCommonList',
          payload: {
            ...commonSearchForm,
            current_page: clickType == 'add' ? 1 : state.commonlistInfo.pagination.current,
            page_size: state.commonlistInfo.pagination.pageSize,
            env,
          },
        });
        yield put({
          type: 'initialCommonFormFields',
        });
        yield put({
          type: 'saveCommonModalStatus',
          payload: false,
        });
      }
      yield put({
        type: 'saveCommonLoading',
        payload: false,
      });
    },

    // 点击删除暂存的fileList
    *onRemove({ payload }, { call, put, select }) {
      const { fileList } = yield select(store => store.physicalmanage.uploadPhysical);
      const index = fileList.indexOf(payload);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      yield put({
        type: 'removeFileList',
        payload: newFileList,
      });
    },
    // 上传fileList
    *handleUpload({ payload }, { call, put, select }) {
      const state = yield select(store => store.physicalmanage);
      const commonSearchForm = objKeyWrapper(state.commonSearchForm, getValuesFromFields);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const { fileList } = yield select(store => store.physicalmanage.uploadPhysical);
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('file', file);
      });
      formData.append('file_type', 0);
      const response = yield reqwest({
        url: '/api/cmdb/upload',
        method: 'post',
        processData: false,
        data: formData,
        headers: {
          accessToken: LocalStorage.get('accessToken'),
        },
        success: (res) => {
          if (res.code == 200) {
            Message.success('文件导入成功');
          } else {
            Message.error(res.msg);
          }
        },
        error: () => {},
      });
      if (response.code == 200) {
        yield put({
          type: 'fetchCommonList',
          payload: {
            ...commonSearchForm,
            current_page: 1,
            page_size: state.commonlistInfo.pagination.pageSize,
            env: 'notonline',
          },
        });
      }
      yield put({
        type: 'deleteFiles',
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 点击取消按钮，删除已暂存的文件
    *deleteFiles({ payload }, { put }) {
      yield put({
        type: 'removeFileList',
        payload: [],
      });
      yield put({
        type: 'changeAddModalStatus',
        payload: false,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 报废/报修物理机 ****************************************************************************
    *isRepair({ payload, env }, { call, put, select }) {
      const state = yield select(store => store.physicalmanage);
      const commonSearchForm = objKeyWrapper(state.commonSearchForm, getValuesFromFields);
      const response = yield call(physicalRepair, { ...payload });
      if (response.code == 200) {
        Message.success(`${payload.status == 'repair' ? '报修' : '报废'}成功`);
        yield put({
          type: 'fetchCommonList',
          payload: {
            ...commonSearchForm,
            current_page: state.commonlistInfo.pagination.current,
            page_size: state.commonlistInfo.pagination.pageSize,
            env,
          },
        });
      }
    },
    // 下线物理机 **********************************************************************************
    *offLine({ payload, env }, { call, put, select }) {
      const state = yield select(store => store.physicalmanage);
      const commonSearchForm = objKeyWrapper(state.commonSearchForm, getValuesFromFields);
      const response = yield call(physicalOffline, { ...payload });
      if (response.code == 200) {
        Message.success('下线成功');
        yield put({
          type: 'fetchCommonList',
          payload: {
            ...commonSearchForm,
            current_page: state.commonlistInfo.pagination.current,
            page_size: state.commonlistInfo.pagination.pageSize,
            env,
          },
        });
      }
    },
  },

  reducers: {
    /**
     * common form 公共部分
     */
    commonFormFieldChange(state, action) {
      return {
        ...state,
        commonSearchForm: {
          ...state.commonSearchForm,
          ...action.payload,
        },
      };
    },
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
    // 编辑/分配至资源池modal控制
    saveModalStatus(state, action) {
      return {
        ...state,
        modalStatus: action.payload,
      };
    },

    // 新增物理机modal控制
    saveCommonModalStatus(state, action) {
      return {
        ...state,
        commonModalStatus: action.payload,
      };
    },

    // 控制分配置资源池和编辑modal loading效果
    saveCommonLoading(state, action) {
      return {
        ...state,
        commonLoading: action.payload,
      };
    },

    // 查看详情
    saveInfoModalStatus(state, action) {
      return {
        ...state,
        InfoModalStatus: action.payload,
      };
    },

    // 保存异常modal 控制visibel
    saveErrorModalStatus(state, action) {
      return {
        ...state,
        errorModalStatus: action.payload,
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

    saveClickType(state, action) {
      return {
        ...state,
        clickType: action.payload,
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

    // 在调用后端detail接口成功后， 保存当前物理机detail信息 ************************************************
    saveCommonFormFields(state, { payload }) {
      let newObj = {};
      Object.keys(payload).forEach((item, index) => {
        if (state.commonFormFields.hasOwnProperty(item)) {
          newObj = {
            [`${item}`]: {
              value: payload[`${item}`],
            },
          };
          Object.assign(state.commonFormFields, newObj, { loginuser: { value: 'root' } });
        }
      });
      return {
        ...state,
        commonFormFields: {
          ...state.commonFormFields,
        },
      };
    },

    // 新增弹出框form表单发生改变赋值*****************************************************
    modalFormFieldChange(state, { payload }) {
      return {
        ...state,
        commonFormFields: {
          ...state.commonFormFields,
          ...payload,
        },
      };
    },

    // 初始化物理机管理详情数据**********************************************************
    initialCommonFormFields(state, action) {
      return {
        ...state,
        commonFormFields: {
          id: { // 服务器id
            value: undefined,
          },
          serverip: { // 服务器ip
            value: undefined,
          },
          manageip: { // 管理ip
            value: undefined,
          },
          switchip: { // 接入交换机ip
            value: undefined,
          },
          os_id: { // 系统版本id
            value: undefined,
          },
          osname: { // 系统版本名称
            value: undefined,
          },
          buytime: { // 购入时间
            value: undefined,
          },
          serversn: { // 服务器SN
            value: undefined,
          },
          servervendortype_id: { // 主机型号id
            value: undefined,
          },
          servervendortype: { // 主机型号
            value: undefined,
          },
          idc_id: { // 机房id
            value: undefined,
          },
          idcname: { // 机房名称
            value: undefined,
          },
          rack_id: { // 机柜id
            value: undefined,
          },
          rackname: { // 机柜号
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
          repairtime: { // 维保到期时间
            value: undefined,
          },
          description: { // 描述
            value: undefined,
          },
          updatetime: { // 变更时间
            value: undefined,
          },
          updateuser: { // 变更人
            value: undefined,
          },
          updatestatus: { // 变更状态
            value: undefined,
          },
          regress: { // 回归至
            value: undefined,
          },
          env_id: { // 分配至
            value: undefined,
          },
        },
      };
    },
    /**
     *  非公共部分
     */

    // 删除fileList中的匹配的条目   action.payload 为fileList数组
    removeFileList(state, action) {
      return {
        ...state,
        uploadPhysical: {
          ...state.uploadPhysical,
          fileList: action.payload,
        },
      };
    },

    // 上传列表暂存 []   action.payload 为file文件
    addFileList(state, action) {
      // console.log('action', action);
      const newFileListArr = state.uploadPhysical.fileList;
      // newFileListArr.push(action.payload);
      action.payload.forEach((item) => {
        newFileListArr.push(item);
      });

      return {
        ...state,
        uploadPhysical: {
          ...state.uploadPhysical,
          fileList: newFileListArr.slice(-5),
        },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        uploadPhysical: {
          ...state.uploadPhysical,
          ...{
            uploading: action.payload,
          },
        },
      };
    },

    // 控制导入物理机modal显示隐藏
    changeAddModalStatus(state, action) {
      return {
        ...state,
        addModalStatus: action.payload,
      };
    },
    // 控制初始化modal显示隐藏
    changeInitModalStatus(state, action) {
      return {
        ...state,
        initModalStatus: action.payload,
      };
    },
  },
};
