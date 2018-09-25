export const environmentList = {
  code: 200,
  msg: '请求成功',
  data: {
    msgdata: [
      {
        env_name: '这是环境类型名称',
        desc: '这是描述',
        env_id: '1',
      }, {
        env_name: '这是环境类型名称',
        desc: '这是描述',
        env_id: '2',
      }, {
        env_name: '这是环境类型名称',
        desc: '这是描述',
        env_id: '3',
      }, {
        env_name: '这是环境类型名称',
        desc: '这是描述',
        env_id: '4',
      },
    ],
    total: 87,
    current_page: 1,
    page_size: 20,
  },
};

export const envInfo = {
  code: 200,
  msg: '加载成功',
  data: [
    {
      env_id: '1',
      env_name: '名称',
      desc: '描述',
      file_id: '11iosfasdf12123232',
      file_name: '文件名称',
      file_url: 'http://wwwwwss',
    },
  ],
};

// 中间件列表选择环境类型
export const middlewares = {
  code: 200,
  data: {
    msgdata: [
      {
        middleware_id: '1',
        middleware_name: 'nginx1',
        type_id: '11',
        comment: '备注1',
        type_name: 'NG-0.1',
      }, {
        middleware_id: '2',
        middleware_name: 'nginx2',
        type_id: '22',
        comment: '备注2',
        type_name: 'NG-0.2',
      },
    ],
    total: 100,
    current_page: 1,
    page_size: 20,
  },
  msg: 'mock',
};

export const envs = {
  code: 200,
  msg: 'mock',
  data: {
    msgdata: [
      {
        env_name: 'mock name1',
        desc: 'mock desc1',
        env_id: '1',
        file_id: '11',
      },
      {
        env_name: 'mock name2',
        desc: 'mock desc2',
        env_id: '2',
        file_id: '22',
      },
    ],
  },
};

// 新增成功
export const addStatus = {
  code: 200,
  data: {
    middleware_id: 'mock',
    middleware_name: 'mock',
    type_id: 'mock',
    comment: 'mock',
  },
  msg: 'mock',
};

export const fetchServiceList = {
  code: 200,
  msg: 'mock',
  data: [
    {
      server_id: '1',
      server_ip: '111.111.111.111',
    }, {
      server_id: '2',
      server_ip: '222.222.222.222',
    }, {
      server_id: '3',
      server_ip: '333.333.333.333',
    }, {
      server_id: '4',
      server_ip: '444.444.444.444',
    }, {
      server_id: '5',
      server_ip: '555.555.555.555',
    },
  ],
};


export default {
  environmentList,
  envInfo,
  envs,
  addStatus,
  middlewares,
  fetchServiceList,
};
