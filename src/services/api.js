import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeMobileLogin(params) {
  return request('/api/login/mobile', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
/* 狼人杀系统接口 */

// 获取狼人杀记录
export async function queryWolfRecords(params) {
  return request(`/api/wolfRecord?${stringify(params)}`, {
    method: 'get',
  });
}

// 保存一条新记录
export async function saveWolfRecord(params) {
  return request('/api/wolfRecord', {
    method: 'POST', // TODO:一定要注意大写！！！
    body: params,
  });
}
// 删除一条记录
export async function removeWolfRecord(params) {
  return request('/api/wolfRecord', {
    method: 'delete',
    body: params,
  });
}
// 更新一条记录
export async function updateWolfRecord(params) {
  return request('/api/wolfRecord', {
    method: 'put',
    body: params,
  });
}
// ******************************************************************************************
// 项目所用api

// 项目列表初始数据
export async function fetchData(params) {
  return request('/resources/project/list', {
    method: 'POST',
    body: params,
  });
}
// 增加项目名称
export async function addProject(params) {
  return request('/resources/project/add', {
    method: 'POST',
    body: params,
  });
}
// 编辑项目列表
export async function editProject(params) {
  return request('/resources/project/update', {
    method: 'POST',
    body: params,
  });
}
// 加载项目名称详情
export async function projectInfo(params) {
  return request('/resources/project/info', {
    method: 'POST',
    body: params,
  });
}

// 加载组织架构树
export async function loadCategoryTree(params) {
  return request('/account/user/organizetree', {
    method: 'POST',
    body: params,
  });
}

// 加载数据字典
export async function fetchDictionary(params) {
  return request('/cmdb/basicdic', {
    method: 'GET',
  });
}

// 加载关联git组列表
export async function fetchGitList(params) {
  return request('/resources/project/gitlist', {
    method: 'POST',
  });
}
