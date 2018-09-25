import { Message } from 'antd';
import { fetchTree, handleSuccess } from '../../services/release';

const PAGE_SIZE = 20;
export default {
  namespace: 'versionManage',

  state: {
    envname: 'pro', // 当前环境id
    commonLoading: false,
  },

  effects: {

  },

  reducers: {
    // 发布成功后，暂存当前已发布的项目ID和环境信息
    saveReleaseInfo(state, { payload }) {
      return {
        ...state,
        ...{
          // selectKey: payload.selectKey,
          envname: payload.envname,
        },
      };
    },
    // loading效果
    changeCommonLoading(state, action) {
      return {
        ...state,
        commonLoading: action.payload,
      };
    },

    // 当前环境信息
    changeEnv(state, { payload }) {
      return {
        ...state,
        envname: payload,
      };
    },
  },
};
