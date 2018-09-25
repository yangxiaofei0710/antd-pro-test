import { stringify } from 'qs';
import request from '../utils/request';

// 服务列表lsit查询
export async function fetchServicelist(params) {
  return request('/resources/module/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 服务详情
export async function serviceInfoList(params) {
  return request('/resources/module/info', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 新增服务
export async function addService(params) {
  return request('/resources/module/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新服务
export async function updateService(params) {
  return request('/resources/module/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 数据字典
export async function fetchDataDictionary(params) {
  return request('/account/user/data_dictionary', {
    method: 'GET',
  });
}

// 停用服务
export async function deleteService(params) {
  return request('/resources/module/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 脚手架下载
export async function dowmloadService(params) {
  return request(`/resources/module/file_download/${params.files_dir}/`, {
    method: 'POST',
    body: {
      file_name: params.file_name,
    },
  });
}

// 关联git项目
export async function fetchGitList(params) {
  return request('/resources/module/gitlist', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
