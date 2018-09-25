export const serviceList = {
  code: 200,
  data: {
    msgdata: [
      {
        id: '1',
        module_name: '阿里云服务器111',
        module_tech: 'java',
        version_num: 'v0.1.0',
        desc: '这是一段描述',
        status: false,
        date_joined: '2018-01-01 00:00:00',
        project_name: '自动化运营',
        projects: '使用中服务列表',
        file_name: '文件1',
        files_dir: 'dirdir111',
      }, {
        id: '2',
        module_name: '阿里云服务器222',
        module_tech: 'java',
        version_num: 'v0.1.0',
        desc: '这是一段描述',
        status: true,
        date_joined: '2018-01-01 00:00:00',
        project_name: '自动化运营',
        projects: '使用中服务列表',
        file_name: '文件2',
        files_dir: 'dirdir222',
      }, {
        id: '3',
        module_name: '阿里云服务器333',
        module_tech: 'java',
        version_num: 'v0.1.0',
        desc: '这是一段描述',
        status: '启用',
        date_joined: '2018-01-01 00:00:00',
        project_name: '自动化运营',
        projects: '使用中服务列表',
        file_name: '文件3',
        files_dir: 'dirdir333',
      }, {
        id: '4',
        module_name: '阿里云服务器444',
        module_tech: 'java',
        version_num: 'v0.1.0',
        desc: '这是一段描述',
        status: true,
        date_joined: '2018-01-01 00:00:00',
        project_name: '自动化运营',
        projects: '使用中服务列表',
        file_name: '文件4',
        files_dir: 'dirdir444',
      }, {
        id: '5',
        module_name: '阿里云服务器555',
        module_tech: 'java',
        version_num: 'v0.1.0',
        desc: '这是一段描述',
        status: true,
        date_joined: '2018-01-01 00:00:00',
        project_name: '自动化运营',
        projects: '使用中服务列表',
        file_name: '文件5',
        files_dir: 'dirdir555',
      }, {
        id: '6',
        module_name: '阿里云服务器666',
        module_tech: 'java',
        version_num: 'v0.1.0',
        desc: '这是一段描述',
        status: false,
        date_joined: '2018-01-01 00:00:00',
        project_name: '自动化运营',
        projects: '使用中服务列表',
        file_name: '文件6',
        files_dir: 'dirdir666',
      },
    ],
    total: 100,
    current_page: 2,
    page_size: 10,
  },
  msg: '用户数据获取成功',
};

export const serviceInfo = {
  code: 200,
  data: {
    id: 'mock',
    module_name: '阿里云服务',
    module_path: '/服务/服务/服务',
    logs_path: '/日志/日志/日志',
    port: '0000',
    module_type: 'c++',
    module_tech: 'javaScript',
    desc: '这是一段描述',
    status: '状态status',
    git_url: 'http://git.ccccc.co',
    version_num: '0.0.0',
    supervisor: '奔波霸',
    publicservice: true,
  },
  msg: '用户数据获取成功',
};

export const serviceAdd = {
  code: 200,
  msg: '新增编辑成功',
};

export const dataDictionary = {
  code: 200,
  data: {
    module_tech: [
      {
        title: 'JavaScript',
        value: 'javaScript',
      },
      {
        title: 'Java',
        value: 'java',
      },
      {
        title: 'Html',
        value: 'html',
      },
    ],
    module_type: [
      {
        title: 'C++',
        value: 'c++',
      },
    ],
  },
  msg: '数据字典获取成功',
};
export const deleteService = {
  code: 200,
  msg: '删除成功',
};

export default {
  serviceList,
  serviceInfo,
  serviceAdd,
  dataDictionary,
  deleteService,
};
