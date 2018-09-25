import { getUrlParams } from './utils';

export const table = {
  code: 200,
  data: {
    msgdata: [{
      id: 62,
      project_name: 'mock',
      department_id: 96,
      organizational_id: 0,
      service_num: 44,
      leader_id: 54,
      desc: 'mock',
      version_num: 'mock',
      date_joined: 'mock',
    }, {
      id: 63,
      project_name: 'mock',
      department_id: 96,
      organizational_id: 0,
      service_num: 44,
      leader_id: 54,
      desc: 'mock',
      version_num: 'mock',
      date_joined: 'mock',
    }, {
      id: 64,
      project_name: 'mock',
      department_id: 96,
      organizational_id: 0,
      service_num: 44,
      leader_id: 54,
      desc: 'mock',
      version_num: 'mock',
      date_joined: 'mock',
    }, {
      id: 65,
      project_name: 'mock',
      department_id: 96,
      organizational_id: 0,
      service_num: 44,
      leader_id: 54,
      desc: 'mock',
      version_num: 'mock',
      date_joined: 'mock',
    }, {
      id: 66,
      project_name: 'mock',
      department_id: '研发五局',
      organizational_id: '金诚集团',
      service_num: 44,
      leader_id: 'admin',
      desc: '小镇生命周期',
      version_num: 'v1.0.0',
      date_joined: '2018-12-06 00:00:00',
    }],
    total: 100,
    pageSize: 10,
    currentPage: 1,
  },
  msg: 'mock',
};
export const add = {
  code: 200,
  msg: 'success',
};

export const info = {
  code: 200,
  data: {
    basic_info: {
      id: '1111',
      project_name: 'projectNameaaaaaa',
      organizational_name: '这是所属集团',
      organizational_id: '1',
      department_name: '这是所属部门',
      department_id: '16',
      supervisor_name: '张三,李四',
      supervisor_id: [
        '17',
        '18',
      ],
      product_manager_name: [
        '产品111',
        '产品222',
        '产品333',
        '产品444',
        '产品555',
      ],
      product_manager_id: [
        '17',
        '19',
      ],
      develop_user_name: [
        '1技术开发1',
        '2技术开发2',
        '3技术开发3',
        '4技术开发4',
        '5技术开发5',
      ],
      develop_user_id: [
        '17',
        '19',
      ],
      ops_user_name: [
        '1运维',
        '2运维',
        '3运维',
        '4运维',
      ],
      ops_user_id: [
        '17',
        '19',
      ],
      test_user_name: [
        '1测试',
        '2测试',
        '3测试',
        '4测试',
      ],
      test_user_id: [
        '17',
        '19',
      ],
      other_user_name: [
        '1其他',
        '2其他',
        '3其他',
        '4其他',
      ],
      other_user_id: [
        '17',
        '19',
      ],
      desc: '这是一段描述',
    },
    module_info: [
      {
        module_name: '服务xxxxxx',
        module_version: 'v0-1-1',
      },
    ],
    version_info: [
      {
        version_num: '00000001',
        online_time: '2018-01-01 00:00:00',
      },
    ],
  },
  msg: '请求数据成功',
};

export default {
  table,
  add,
  info,
};
