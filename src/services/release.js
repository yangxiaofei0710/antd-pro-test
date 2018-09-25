import request from '../utils/request';

// 获取项目服务版本信息列表
export async function fetchProjectList(params) {
  return request('/release/project/module/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 发布列表
export async function fetchReleaseList(params) {
  return request('/release/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 确定发布
export async function submitRelease(params) {
  return request('/release/release', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 重启
export async function reboot(params) {
  return request('/release/reboot', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 回滚版本列表
export async function fetchRollbackList(params) {
  return request('/release/rollbackversionlist', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 确定回滚
export async function rollback(params) {
  return request('/release/rollback', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 版本管理 *******************************************************************************************

export async function fetchReleaseTree(params) {
  return request('/release/projectname/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 查询版本列表
export async function fetchVersionList(params) {
  return request('/release/version/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 标注成功
export async function handleSuccess(params) {
  return request('/release/marksuccess', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


// 操作管理 ********************************************************************************************

// 查询操作列表
export async function fetchOperateList(params) {
  return request('/release/version/operates', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 操作详情
export async function fetchOperateInfo(params) {
  return request('/release/version/operateinfo', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

