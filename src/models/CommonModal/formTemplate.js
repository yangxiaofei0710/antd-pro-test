export default {
  namespace: 'formTemplate',

  state: {
    formTemplate: {
      basicConfigForm: undefined, // 暂存基本配置form表单实例
      systemConfigForm: undefined, // 暂存系统配置form表单实例
    },
  },

  effects: {

  },

  reducers: {
    // 保存基本配置/系统配置 form 实例
    saveFormTemplate(state, action) {
      // console.log('action', action);
      return {
        ...state,
        formTemplate: {
          ...state.formTemplate,
          [`${action.payload.type}`]: action.payload.form,
        },
      };
    },
  },
};
