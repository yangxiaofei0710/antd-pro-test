export const tableList = {
  msg: '请求成功',
  code: 200,
  data: {
    msg: [{
      name: 'im37-pro',
      outterip: '47.100.217.90',
      innerip: '172.19.101.124',
      status: '运行中',
      usage: null,
      id: 1,
      env: '正式环境',
      config: '4核8G内存200G硬盘',
    },
    {
      name: 'im38-pro',
      outterip: '47.100.214.173',
      innerip: '172.19.101.125',
      status: '已停止',
      usage: null,
      id: 2,
      env: '正式环境',
      config: '4核8G内存200G硬盘',
    },
    {
      name: 'jumpserver-proxy',
      outterip: '47.100.220.16',
      innerip: '172.19.101.123',
      status: '运行中',
      usage: null,
      id: 3,
      env: '正式环境',
      config: '2核4G内存200G硬盘',
    },
    {
      name: 'marketingcenter02-pro',
      outterip: '47.100.236.199',
      innerip: '172.19.101.122',
      status: '启动中',
      usage: null,
      id: 4,
      env: '正式环境',
      config: '4核8G内存200G硬盘',
    },
    {
      name: 'marketingcenter01-pro',
      outterip: '47.100.237.203',
      innerip: '172.19.101.121',
      status: '运行中',
      usage: null,
      id: 5,
      env: '正式环境',
      config: '4核8G内存200G硬盘',
    },
    {
      name: 'k8s07-pre',
      outterip: '',
      innerip: '172.19.66.60',
      status: '运行中',
      usage: null,
      id: 6,
      env: '正式环境',
      config: '2核4G内存200G硬盘',
    },
    {
      name: 'k8s06-pre',
      outterip: '',
      innerip: '172.19.66.59',
      status: '运行中',
      usage: null,
      id: 7,
      env: '正式环境',
      config: '2核4G内存200G硬盘',
    },
    {
      name: 'k8s05-pre',
      outterip: '47.100.227.83',
      innerip: '172.19.66.56',
      status: '停止中',
      usage: null,
      id: 8,
      env: '正式环境',
      config: '2核4G内存200G硬盘',
    },
    {
      name: 'tvmall02-pro',
      outterip: '47.100.162.161',
      innerip: '172.19.101.118',
      status: '运行中',
      usage: null,
      id: 9,
      env: '正式环境',
      config: '4核8G内存200G硬盘',
    },
    {
      name: 'tvmall04-pro',
      outterip: '47.100.200.200',
      innerip: '172.19.101.120',
      status: '运行中',
      usage: null,
      id: 10,
      env: '正式环境',
      config: '4核8G内存200G硬盘',
    }],
    total: 100,
    page_size: 20,
    current_page: 1,
  },
};
export const basicdict = {
  code: 200,
  msg: 'mock',
  data: [
    {
      bandtype: [ // 带宽
        {
          id: 1,
          name: '按使用流量',
          value: '按使用流量',
        },
      ],
      image: [ // 镜像
        {
          id: 'm-uf6i12dakoemv1jb5olv',
          name: 'jcy镜像-logstash-zabbix-nginx-tomcat',
          value: 'jcy镜像-logstash-zabbix-nginx-tomcat',
          owner: 'self',
        },
        {
          id: 'm-uf68o21m55wtnqlzhzez',
          name: 'jcy镜像-new',
          value: 'jcy镜像-new',
          owner: 'self',
        },
        {
          id: 'm-uf6hqaxf15wqceq550d9',
          name: 'jcy镜像',
          value: 'jcy镜像',
          owner: 'self',
        },
        {
          id: 'm-uf643ve36wax0jp45ws2',
          name: 'shop-test',
          value: 'shop-test',
          owner: 'self',
        },
        {
          id: 'm-uf6h4wencasv7xfzg8m4',
          name: 'jcy-dubbo',
          value: 'jcy-dubbo',
          owner: 'self',
        },
        {
          id: 'm-uf62vkmt32tpngkj7eez',
          name: 'disconf',
          value: 'disconf',
          owner: 'self',
        },
        {
          id: 'm-uf6914nuic4yd6r5924i',
          name: 'jcy-zk',
          value: 'jcy-zk',
          owner: 'self',
        },
        {
          id: 'm-uf6g872luz0n0epasxb4',
          name: 'jcy-pro',
          value: 'jcy-pro',
          owner: 'self',
        },
      ],
      charging: [ // 计费方式
        {
          id: 1,
          name: '包年包月',
          value: '包年包月',
        },
      ],
      zone: [ // 地区
        {
          id: 1,
          name: '华东2',
          value: 'cn-shanghai',
        },
      ],
      cycle: [ // 购买周期
        {
          id: 1,
          name: '1个月',
          value: '1个月',
        },
      ],
      config: [ // 套餐配置
        {
          id: 1,
          name: '2核4G内存200硬盘',
          cpu: 2,
          memory: 4,
          disk: 200,
          flavor: 'ecs.c5.large',
        },
        {
          id: 2,
          name: '4核8G内存200硬盘',
          cpu: 4,
          memory: 8,
          disk: 200,
          flavor: 'ecs.c5.xlarge',
        },
        {
          id: 3,
          name: '2核16G内存200硬盘',
          cpu: 2,
          memory: 16,
          disk: 200,
          flavor: 'ecs.r5.large',
        },
      ],
      security: [ // 安全组
        {
          id: 'sg-uf6bqngpatc0dvyr2lqe',
          name: 'redis',
          vpcid: 'vpc-uf65ldgyqi9vuimxigpem',
          value: 'redis',
        },
        {
          id: 'sg-uf6f3z1ua4xce0y5ig8z',
          name: '只允许公司和云内部',
          vpcid: 'vpc-uf65ldgyqi9vuimxigpem',
          value: '只允许公司和云内部',
        },
        {
          id: 'sg-uf6emywxjdx998itg441',
          name: '允许全部',
          vpcid: 'vpc-uf65ldgyqi9vuimxigpem',
          value: '允许全部',
        },
      ],
    },
  ],
};

export const vpc = {
  code: 200,
  msg: '请求成功',
  data: [
    {
      id: 'vpc-uf65ldgyqi9vuimxigpem',
      label: 'vpc-uf65ldgyqi9vuimxigpem',
      value: 'vpc-uf65ldgyqi9vuimxigpem',
      children: [
        {
          label: 'k8s专用',
          value: 'vsw-uf61sicrv4bjsj4ga9q6j',
        },
        {
          label: '金诚云盘-正式环境',
          value: 'vsw-uf656o5ctiy71utgu6zhn',
        },
        {
          label: '支付-生产环境',
          value: 'vsw-uf616ikve0wf7vb8605jb',
        },
        {
          label: '金诚逸-生产环境',
          value: 'vsw-uf6t47v5ng5ba4kihnbzt',
        },
        {
          label: '默认',
          value: 'vsw-uf6cq9nkrvy6393bofqvw',
        },
        {
          label: '金诚逸-支付-测试预发环境',
          value: 'vsw-uf6o5b7irufku0lstdond',
        },
        {
          label: '电商平台-生产环境',
          value: 'vsw-uf6ef5cotj329jlmm8bmm',
        },
        {
          label: '默认',
          value: 'vsw-uf6b0lh3kchv04p4e8gd0',
        },
      ],
    }, {
      id: '2',
      label: 'Vpc2',
      value: 'vpc2',
      children: [
        {
          label: '交换机2-1',
          value: 'switch2-1',
          id: '2-1',
        },
        {
          label: '交换机2-2',
          value: 'switch2-2',
          id: '2-2',
        },
      ],
    },
  ],
};

// 服务器详情
export const detail = {
  code: 200,
  msg: '获取数据成功',
  data: {
    id: 'mock',
    name: '主机名1',
    outterip: '公网ip',
    innerip: '内网ip',
    status: '状态1',
    usage: '用途1',
    image: '镜像1',
    networkband: '带宽1',
    security: '安全组1',
    comment: '备注1',
    zone: '地区1',
    charging: '计费方式1000033030303030303300',
    cycle: '购买周期',
    config: '配置1',
    env: '环境1',
  },
};

// 停用
export const stop = {
  code: 200,
  msg: '停用成功',
};

// 恢复
export const recover = {
  code: 200,
  msg: '启用成功',
};

// 释放
export const release = {
  code: 200,
  msg: '释放成功',
  data: 'mock',
};

export default {
  tableList,
  basicdict,
  vpc,
  detail,
  stop,
  recover,
  release,
};
