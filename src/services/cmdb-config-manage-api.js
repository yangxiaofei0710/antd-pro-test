import request from '../utils/request';


// 项目配置管理******************************************************************
// 资源对象项目-服务类目树
export async function fetchConfigTree(params) {
  return request('/configurate/config/resources', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 列表
export async function fetchList(params) {
  return request('/configurate/config/versions', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 服务资源对象版本列表
export async function fetchModuleinfo(params) {
  return request('/configurate/config/moduleinfo', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 配置文件删除
export async function deleteConfigFile(params) {
  return request('/configurate/config/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 配置文件配置模板类型
export async function configFileType(params) {
  return request('/configurate/config/temlist', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 生成配置文件
export async function createConfigFile(params) {
  return request('/configurate/config/context', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 新增 保存配置文件
export async function saveAddConfigFile(params) {
  return request('/configurate/config/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 编辑 保存配置文件
export async function saveEditConfigFile(params) {
  return request('/configurate/config/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 编译
export async function compileVersion(params) {
  return request('/release/compile', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 项目配置模板*********************************************************************
export async function fetchTemplateList(params) {
  return request('/configurate/template/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 配置模板 新增
export async function templateAdd(params) {
  return request('/configurate/template/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 配置模板 编辑
export async function templateEdit(params) {
  return request('/configurate/template/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 配置模板 详情
export async function templateInfo(params) {
  return request('/configurate/template/info', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 配置模板 删除
export async function deleteTemplate(params) {
  return request('/configurate/template/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 配置模板 加载配置类型
export async function templateType(params) {
  return request('/configurate/template/temlist', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 变更记录
export async function changeRecord(params) {
  return request('/configurate/config/logs', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
