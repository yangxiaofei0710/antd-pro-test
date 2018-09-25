import { stringify } from 'qs';
import request from '../utils/request';


// 环境类型 *****************************************************
export async function queryEnvList(params) {
  return request('/middlewares/env/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function queryEnvInfo(params) {
  return request('/middlewares/env/info', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 新增
export async function addEnv(params) {
  return request('/middlewares/env/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 编辑
export async function editEnv(params) {
  return request('/middlewares/env/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteEnv(params) {
  return request('/middlewares/env/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 中间件列表 *****************************************************

export async function queryexpressList(params) {
  return request('/middlewares/dep/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 供选择的环境类型列表
export async function selectEnv(params) {
  return request('/middlewares/dep/envs', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 新增
export async function addMiddlewares(params) {
  return request('/middlewares/dep/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 编辑
export async function editMiddlewares(params) {
  return request('/middlewares/dep/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 搜索服务器
export async function fetchService(params) {
  return request('/middlewares/dep/servers', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 环境部署
export async function deployService(params) {
  return request('/middlewares/dep/deploy', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 详情
export async function envInfo(params) {
  return request('/middlewares/dep/info', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 重新部署
export async function redeploy(params) {
  return request('/middlewares/dep/redeploy', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
