import { stringify } from 'qs';
import request from '../utils/request';

// 用户查询接口
export async function queryUsers(params) {
  return request('/account/user/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 用户手动同步数据源的接口
export async function userDataSourceSync() {
  return request('/account/user/sync', {
    method: 'POST',
    body: {
      sync: true,
    },
  });
}

// 用户启用/禁用
export async function userControl(params) {
  return request('/account/user/setstatus', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 角色搜索
export async function queryRoles(params) {
  return request('/account/role/search', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 角色添加
export async function addRole(params) {
  return request('/account/role/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 角色编辑
export async function editRole(params) {
  return request('/account/role/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 角色删除
export async function deleteRole(params) {
  return request('/account/role/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 角色详情
export async function queryRoleDetail(params) {
  return request('/account/role/roleinfo', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 权限tree接口
export async function queryAuthories(params) {
  return request('/role/role/permissionlist', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 给角色配置授权的提交接口
export async function authrizeForRole(params) {
  return request('/account/role/authoredit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 根据角色查询角色对应用户
export async function queryUsersByRole(params) {
  return request('/account/role/userinfos', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 给角色配置用户的提交接口
export async function userForRole(params) {
  return request('/account/role/usersedit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 角色授权配置保存接口
export async function saveAuthories(params) {
  return request('/role/role/permissionedit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
