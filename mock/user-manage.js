import { getUrlParams } from './utils';

export const list = {
  code: 200,
  msg: '用户数据获取成功',
  data: {
    msgdata: [
      {
        user_id: 1,
        user_name: '周杰伦',
        mobile: '18258677890',
        ldap_name: 'zhoujielun',
        role_name: [
          '产品经理',
          '测试人员',
        ],
        status: true,
      },
      {
        user_id: 1,
        user_name: '周杰伦',
        mobile: '18258677890',
        ldap_name: 'zhoujielun',
        role_name: [
          '产品经理',
          '测试人员',
        ],
        status: false,
      },
    ],
    total: 987,
    current_page: 2,
    page_size: 10,
  },
};
export const sync = {
  code: 200,
  msg: '同步成功',
};
export const userControl = {
  code: 200,
  msg: 'xxx 启用成功',
};
export const roleList = {
  code: 200,
  msg: 'mock',
  data: {
    msgdata: [
      {
        role_id: 88,
        role_name: 'mock',
        desc: 'mock',
      },
    ],
    total: 37,
    current_page: 85,
    page_size: 21,
  },
};
export const roleDetail = {
  code: 200,
  msg: 'mock',
  data: {
    role_id: 'mock',
    role_name: 'mock',
    desc: 'mock',
  },
};
export const usersByRole = {
  code: 200,
  msg: 'mock',
  data: {
    role_id: 'mock',
    role_name: 'mock',
    user_ids: [
      {
        user_id: 18,
        user_name: 'mock',
        ldap_name: 'mock',
      },
    ],
  },
};

export const authTreeInfo = {
  code: 200,
  data: [{
    role: [{
      key: '86',
      title: '增加',
      value: false,
    }, {
      key: '87',
      title: '编辑',
      value: true,
    }, {
      key: '88',
      title: '删除',
      value: true,
    }, {
      key: '89',
      title: '查看',
      value: true,
    }],
  }, {
    permission: [{
      key: '91',
      title: '编辑',
      value: true,
    }, {
      key: '90',
      title: '查看',
      value: true,
    }],
  }, {
    user: [{
      key: '98',
      title: '增加',
      value: true,
    }, {
      key: '99',
      title: '编辑',
      value: true,
    }, {
      key: '100',
      title: '删除',
      value: true,
    }, {
      key: '104',
      title: '禁用',
      value: true,
    }, {
      key: '103',
      title: '启用',
      value: true,
    }, {
      key: '105',
      title: '搜索',
      value: true,
    }, {
      key: '102',
      title: 'sync',
      value: true,
    }, {
      key: '101',
      title: '查看',
      value: true,
    }],
  }, {
    asset: [{
      key: '65',
      title: '增加',
      value: true,
    }, {
      key: '66',
      title: '编辑',
      value: true,
    }, {
      key: '67',
      title: '删除',
      value: true,
    }, {
      key: '118',
      title: '查看',
      value: true,
    }, {
      key: '132',
      title: '增加',
      value: true,
    }, {
      key: '133',
      title: '编辑',
      value: true,
    }, {
      key: '134',
      title: '删除',
      value: true,
    }, {
      key: '135',
      title: '查看',
      value: true,
    }],
  }, {
    modulerecord: [{
      key: '127',
      title: '增加',
      value: true,
    }, {
      key: '128',
      title: '编辑',
      value: true,
    }, {
      key: '129',
      title: '删除',
      value: true,
    }, {
      key: '131',
      title: 'stop',
      value: true,
    }, {
      key: '130',
      title: '查看',
      value: true,
    }],
  }, {
    projectrecord: [{
      key: '122',
      title: '增加',
      value: true,
    }, {
      key: '123',
      title: '编辑',
      value: true,
    }, {
      key: '124',
      title: '删除',
      value: true,
    }, {
      key: '125',
      title: '查看',
      value: true,
    }],
  }, {
    projectmodule: [{
      key: '126',
      title: '查看',
      value: true,
    }],
  }, {
    server: [{
      key: '49',
      title: '增加',
      value: true,
    }, {
      key: '50',
      title: '编辑',
      value: true,
    }, {
      key: '51',
      title: '删除',
      value: true,
    }, {
      key: '54',
      title: '恢复',
      value: true,
    }, {
      key: '53',
      title: 'stop',
      value: true,
    }, {
      key: '52',
      title: '查看',
      value: true,
    }],
  }],
  msg: 'success',
  permission_list: ['86', '91'],
};
export default {
  list,
  sync,
  userControl,
  roleList,
  roleDetail,
  usersByRole,
  authTreeInfo,
};
