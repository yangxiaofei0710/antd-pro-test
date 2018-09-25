import request from '../utils/request';

/**
 *
 * 搜索common from 查询list列表信息
 */
export async function fetchCommonFormList(params) {
  return request('/cmdb/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 查询数据字典
export async function fetchDictionary(params) {
  return request('/cmdb/basicdic', {
    method: 'GET',
  });
}

// 下载
export async function downLoad(params) {
  return request('/cmdb/datadownload?file_type=0', {
    method: 'GET',
  });
}


/**
 *
 * CMDB-设备管理-服务器管理-物理机管理
 */
export async function upload(params) {
  return request('/servers/upload', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function update(params) {
  return request('/cmdb/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 新增物理机
export async function add(params) {
  return request('/cmdb/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// cmdb 物理机管理 查看物理机详情
export async function physicaldetail(params) {
  return request('/cmdb/detail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// cmdb 物理机管理 未上线物理机 分配至资源池
export async function allotPhysical(params) {
  return request('/cmdb/assiginresourcepool', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// cmdb 物理机管理 未上线物理机 分配至服务器
export async function allotPhysicalService(params) {
  return request('/cmdb/assiginserver', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


// cmdb 物理机管理 列表编辑
export async function physicalEdit(params) {
  return request('/cmdb/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// cmdb 物理机管理 报废/报修
export async function physicalRepair(params) {
  return request('/cmdb/rejectrepair', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// cmdb 物理机管理 下线
export async function physicalOffline(params) {
  return request('/cmdb/offline', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// cmdb 物理机管理 回归至
export async function physicalRegress(params) {
  return request('/cmdb/regress', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// cmdb 物理机管理 初始化
export async function physicalInitial(params) {
  return request('/cmdb/init', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// cmdb 物理机管理 异常
export async function physicalException(params) {
  return request('/cmdb/exception', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 *
 * CMDB-模板字段  ********************************************************************
 */
export async function fetchTemplateList(params) {
  return request('/account/user/dictionarys', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function save(params) {
  return request('/account/user/data_dictionary', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


/**
 * CMDB-虚拟机管理接口 ********************************************************************
 */

// 虚拟机查询列表
export async function fetchVirtualList(params) {
  return request('/cmdb/invent/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 虚拟机 详情
export async function virtualDetail(params) {
  return request('/cmdb/invent/detail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 虚拟机 模糊查询物理机
export async function fetchPhysical(params) {
  return request('/cmdb/invent/physicals', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 虚拟机分配服务器
export async function allotVirtual(params) {
  return request('/cmdb/invent/assiginserver', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 虚拟机 下线
export async function offlineVirtual(params) {
  return request('/cmdb/invent/offline', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 虚拟机 重新上线
export async function regressVirtual(params) {
  return request('/cmdb/invent/regress', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 虚拟机 新增
export async function addVirtual(params) {
  return request('/cmdb/invent/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 虚拟机 编辑
export async function editVirtual(params) {
  return request('/cmdb/invent/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 虚拟机 编辑
export async function rejectVirtual(params) {
  return request('/cmdb/invent/reject', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 虚拟机 异常
export async function virtualException(params) {
  return request('/cmdb/invent/exception', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
