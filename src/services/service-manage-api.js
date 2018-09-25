import { stringify } from 'qs';
import request from '../utils/request';

// 用户查询接口
export async function queryServiceList(params) {
  return request('/server/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 数据字典
export async function basicdict(params) {
  return request('/server/basicdict', {
    method: 'GET',
  });
}

// vpc 交换机
export async function getVpc(params) {
  return request('/server/vpc', {
    method: 'GET',
  });
}

// service 详情
export async function getServiceInfo(params) {
  return request('/server/detail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 停用服务
export async function stopService(params) {
  return request('/server/stop', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 启用服务
export async function recover(params) {
  return request('/server/recover', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 释放服务
export async function release(params) {
  return request('/server/release', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 新增服务器
export async function addService(params) {
  return request('/server/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
