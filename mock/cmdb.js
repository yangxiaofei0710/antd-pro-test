export const dictionarys = {
  code: 200,
  msg: '数据字典列表获取成功',
  data: { msgdata: [
    { dic_name: '技术栈', dic_aliasname: 'module_tech', dic_content: ['java', 'python', 'go'] },
    { dic_name: '服务类型', dic_aliasname: 'module_type', dic_content: ['公共服务', '普通服务'] },
    { dic_name: '型号', dic_aliasname: 'servers_model', dic_content: ['型号1', '型号2'] },
    { dic_name: '机房号', dic_aliasname: 'servers_room_number', dic_content: ['机房号1', '机房号2'] },
    { dic_name: '机柜号', dic_aliasname: 'servers_cabinet_number', dic_content: ['机柜号1', '机柜号2'] },
    { dic_name: '系统版本', dic_aliasname: 'servers_system_version', dic_content: ['win7', 'macOs10'] },
    { dic_name: '分配环境', dic_aliasname: 'servers_environ', dic_content: ['开发环境', '测试环境', '预发环境', '正式环境'] },
  ],
  current_page: 1,
  page_size: 20,
  total: 7,
  },
};


export const commonList = {
  msg: 'mock',
  code: 200,
  data: {
    total: 100,
    page_size: 20,
    current_page: 1,
    permissions: {
      add_asset: true,
      assginresource_asset: true,
      assginserver_asset: true,
      change_asset: true,
      init_asset: true,
      offline_asset: true,
      recycle_asset: true,
      repairreject_asset: true,
      upload_asset: true,
      caninit: true,
    },
    msgdata: [
      {
        id: '1',
        servername: '主机名称1',
        rackname: '机柜号1',
        idcname: '机房号1',
        buytime: '2018-01-01',
        repairtime: '2018-12-12',
        serverip: '1.1.1.1',
        switchip: '2.2.2.2',
        manageip: '3.3.3.3',
        status: '未上线',
        runningstatus: '异常',
        serversn: '服务器sn',
        servervendortype: '型号1',
        canreject: 'reject',
        caninit: true,
        rejecttime: '2018-11-11',
      },
      {
        id: '2',
        servername: '主机名称2',
        rackname: '机柜号1',
        idcname: '机房号1',
        buytime: '1900-01-01',
        repairtime: '1990-12-12',
        serverip: '1.1.1.1',
        switchip: '2.2.2.2',
        manageip: '3.3.3.3',
        status: '未上线',
        runningstatus: '异常',
        serversn: '服务器sn',
        servervendortype: '型号1',
        canreject: 'reject',
        caninit: false,
        rejecttime: '1999-11-11',
      },
    ],
  },
};

export const cmdbdetail = {
  code: 200,
  data: {
    id: '1',
    serverip: '1.1.1.1',
    manageip: '3.3.3.3',
    switchip: '2.2.2.2 4.4.4.4',
    os_id: '39',
    osname: 'macOs10',
    buytime: '2018-01-01',
    serversn: 'SN1',
    servervendortype_id: '25',
    servervendortype: '型号1',
    idc_id: '73',
    idcname: '机房号1',
    loginuser: 'root',
    servername: 'mock',
    loginpassword: '123',
    loginpasswordconfirm: '123',
    repairtime: '2018-12-12',
    rack_id: '62',
    rackname: '机柜号1',
    description: 'mock',
    updatetime: '2000-10-10',
    updateuser: '小米姑娘',
    updatestatus: 'mock',
    regress: '回归至',
    env_id: '41',
  },
  msg: 'mock',
};

export const getDic = {
  code: 200,
  msg: '数据字典查询成功',
  data: {
    servertypelist: [{ title: '型号1', value: 25 }, { title: '型号2', value: 26 }, { title: 'R730', value: 30 }],
    idclist: [{ title: '机房号1', value: 73 }, { title: '机房号2', value: 74 }, { title: '1', value: 75 }],
    racklist: [{ title: '机柜号1', value: 62 }, { title: '机柜号2', value: 63 }, { title: '2', value: 64 }],
    ostypelist: [{ title: 'win7', value: 38 }, { title: 'macOs10', value: 39 }],
    envlist: [{ title: '开发环境', value: 40 }, { title: '测试环境', value: 41 }, { title: '预发环境', value: 42 }, { title: '正式环境', value: 43 }],
    config_dict_list:
    [{
      id: '1',
      cpu: '2',
      memory: '4G',
      disk: '200G',
      name: '2核4G内存200G硬盘',
      flavor: 'A套餐',
    }, {
      id: '2',
      cpu: '8',
      memory: '16G',
      disk: '500G',
      name: '8核16G内存500G硬盘',
      flavor: 'B套餐',
    }],
  },
};

export const physcialedit = {
  code: 200,
  data: 'mock',
  msg: '请求成功',
};

export const physcialException = {
  code: 200,
  data: {
    exceptiontime: '2000-01-01',
    exceptioncontent: 'mock',
  },
  msg: 'mock',
};


/**
 * 虚拟机管理******************************************************************
 */
export const virtualList = {
  code: 200,
  msg: 'mock',
  data: {
    current_page: 1,
    page_size: 20,
    total: 100,
    msgdata: [{
      id: '1',
      servername: '虚拟机名称111',
      serverip: '1.1.1.1',
      status: '资源池',
      config: {
        id: '1',
        cpu: '2',
        memory: '4G',
        disk: '200G',
        name: '2核4G内存200G硬盘',
        flavor: 'A套餐',
      },
      runningstatus: '异常',
      serversn: '虚拟机sn',
      hostip: '0.0.0.0',
      rejecttime: '2000-01-01',
      canreject: true, // true销毁  false不能销毁
      offlinetime: '2111-01-01', // 下线时间
      belongs: '虚拟机',
    }, {
      id: '2',
      servername: '虚拟机名称222',
      serverip: '2.2.2.2',
      status: '生产环境',
      config: {
        id: '2',
        cpu: '8',
        memory: '16G',
        disk: '500G',
        name: '8核16G内存500G硬盘',
        flavor: 'B套餐',
      },
      runningstatus: '正常',
      serversn: '虚拟机sn',
      hostip: '0.0.0.0',
      rejecttime: '2000-01-01',
      canreject: false, // true销毁  false不能销毁
      offlinetime: '2111-01-01', // 下线时间
      belongs: '公有云',
    }],
    permissions: {},
  },
};

export const virtualDetail = {
  code: 200,
  data: {
    id: '1',
    serverip: '1.1.1.1',
    os_id: '39',
    osname: 'macOs10',
    serversn: 'SSSSNNNNNN',
    loginuser: 'root',
    servername: 'test123-pro',
    config: {
      id: '2',
      cpu: '8',
      memory: '16G',
      disk: '500G',
      name: '8核16G内存500G硬盘',
      flavor: 'B套餐',
    },
    description: 'mock',
    updatetime: '2000-01-01',
    updateuser: '小小',
    updatestatus: 'mock',
    loginpassword: 'qqq111```',
    loginpasswordconfirm: 'qqq111```',
    regress: '上次状态',
    hostinfo: {
      hostname: '物理机',
      hostsn: 'PHYSICALSN',
      hostid: '100',
      buytime: '2000-12-12',
      repairtime: '2001-12-12',
      hostip: '10.10.10.10',
      idc_id: '73',
      idcname: '机房号1',
      rack_id: '62',
      rackname: '机柜号1',
    },
  },
  msg: 'mock',
};

// 模糊查询关联物理机信息
export const fetchPhyscialList = {
  msg: 'mock',
  code: 200,
  data: {
    total: 92,
    page_size: 93,
    current_page: 56,
    permissions: { },
    msgdata: [
      {
        id: '1',
        servername: '物理机1',
        rackname: 'mock',
        idcname: 'mock',
        buytime: 'mock',
        repairtime: 'mock',
        serverip: '1.1.1.1',
        switchip: 'mock',
        manageip: 'mock',
        status: 'mock',
        runningstatus: 'mock',
        serversn: 'mock',
        servervendortype: 'mock',
        canreject: 'mock',
        caninit: 'mock',
        rejecttime: 'mock',
        offlinetime: 'mock',
      }, {
        id: '2',
        servername: '物理机2',
        rackname: 'mock',
        idcname: 'mock',
        buytime: 'mock',
        repairtime: 'mock',
        serverip: '2.2.2.2',
        switchip: 'mock',
        manageip: 'mock',
        status: 'mock',
        runningstatus: 'mock',
        serversn: 'mock',
        servervendortype: 'mock',
        canreject: 'mock',
        caninit: 'mock',
        rejecttime: 'mock',
        offlinetime: 'mock',
      }, {
        id: '3',
        servername: '物理机3',
        rackname: 'mock',
        idcname: 'mock',
        buytime: 'mock',
        repairtime: 'mock',
        serverip: '3.3.3.3',
        switchip: 'mock',
        manageip: 'mock',
        status: 'mock',
        runningstatus: 'mock',
        serversn: 'mock',
        servervendortype: 'mock',
        canreject: 'mock',
        caninit: 'mock',
        rejecttime: 'mock',
        offlinetime: 'mock',
      },
    ],
  },
};

// 资源配置管理 *********************************************************************************8
// 类目树
export const projectTreeList = {
  code: 200,
  msg: 'success',
  data: [
    {
      id: '1-1',
      name: 'project-1',
      children: [
        {
          id: '2-1',
          name: 'module-1',
        },
      ],
    }, {
      id: '1-2',
      name: 'project-2',
      children: [
        {
          id: '2-2',
          name: 'module-2',
        },
      ],
    }, {
      id: '1-3',
      name: 'project-3',
      children: [
        {
          id: '2-3',
          name: 'module-3',
        }, {
          id: '2-4',
          name: 'module-4',
        },
      ],
    }, {
      id: '1-4',
      name: 'project-4',
      children: [],
    },
  ],
};

export const configList = {
  code: 200,
  msg: 'mock',
  data: {
    msgdata: [
      {
        id: '1',
        version: '1.1',
        updatetime: '2010-09-09 10:10:00',
        configfiles: 'mock',
        updateuser: 'mock',
        moduleid: '3',
        modulename: '服务3',
        projectid: '2',
        projectname: '项目2',
      },
    ],
    current_page: 1,
    page_size: 20,
    total: 45,
  },
};

export const configTemplateList = {
  code: 200,
  msg: 'mock',
  data: {
    msgdata: [
      {
        id: '1',
        templatename: 'mock',
        updatetime: 'mock',
        updateuser: 'mock',
      },
    ],
    current_page: 1,
    page_size: 20,
    total: 45,
  },
};
export const configModuleInfo = {
  code: 200,
  msg: 'mock',
  data: [
    {
      id: '111',
      config: 'mock1',
      configid: '1',
      configfile: 'fileName1',
      filecontext: '文件内容1',
    }, {
      id: '222',
      config: 'mock2',
      configid: '2',
      configfile: 'fileName2',
      filecontext: '文件内容2',
    }, {
      id: '333',
      config: 'mock3',
      configid: '3',
      configfile: 'fileName3',
      filecontext: '文件内容3',
    },
  ],
};

export const templatetype = {
  code: 200,
  msg: 'mock',
  data: [
    {
      id: '1',
      name: 'mock1',
    }, {
      id: '2',
      name: 'mock2',
    },
  ],
};

export const configFileType = {
  code: 200,
  msg: 'mock',
  data: [
    {
      id: '1',
      name: 'mock1',
    }, {
      id: '2',
      name: 'mock2',
    },
  ],
};

export const createConfigFile = {
  code: 200,
  msg: 'mock',
  data: {
    configfile: 'new filename',
    filecontext: 'new filecontext',
    configid: '2',
    config: 'mock',
  },
};

export default {
  dictionarys,
  commonList,
  getDic,
  cmdbdetail,
  physcialedit,
  physcialException,
  virtualList,
  virtualDetail,
  fetchPhyscialList,
  projectTreeList,
  configList,
  configTemplateList,
  configModuleInfo,
  templatetype,
  configFileType,
  createConfigFile,
};
