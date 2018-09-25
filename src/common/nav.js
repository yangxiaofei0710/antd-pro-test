import React from 'react';
import dynamic from 'dva/dynamic';
import { Link, Route, Redirect, Switch } from 'dva/router';
// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['CommonModal/login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        // name: '异常', // 不显示在左侧导航
        path: 'exception',
        icon: 'warning',
        children: [
          {
            name: '403',
            path: '403',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
          },
          {
            name: '404',
            path: '404',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
          {
            name: '500',
            path: '500',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
          },
        ],
      },
      // 业务代码*********************************************************************************************
      {
        name: '资源中心',
        path: 'resource-center',
        children: [
          {
            name: '公有云管理',
            optcode: 'view_server',
            path: 'public-cloud',
            children: [
              {
                name: '公有云管理',
                path: 'cloud-manage',
                component: dynamicWrapper(app, ['ServiceCloudManage/service-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/ResourceManage/ServiceManage')),
              },
            ],
          }, {
            name: '环境类型管理',
            path: 'envtype-manage',
            icon: 'exception',
            children: [
              {
                name: '环境类型',
                optcode: 'view_envtype',
                path: 'env-type',
                component: dynamicWrapper(app, ['EnvTypeManage/environment-type'], () => import('../routes/EnvironmentScript/EnvironmentType')),
              }, {
                name: '中间件列表',
                optcode: 'view_middlewares',
                path: 'express-list',
                component: dynamicWrapper(app, ['EnvTypeManage/express-list', 'CommonModal/common'], () => import('../routes/EnvironmentScript/ExpressList')),
              },
            ],
          }, {
            name: '业务资源管理',
            path: 'business-manage',
            children: [
              {
                name: '项目列表',
                optcode: 'view_projectrecord',
                path: 'project-list',
                component: dynamicWrapper(app,
                  [
                    'BusinessManage/ProjectList/project-list',
                    'checked-tree',
                    'BusinessManage/ProjectList/project-info',
                    'BusinessManage/ProjectList/project-add',
                  ],
                  () => import('../routes/ProjectManage/ProjectList')),
              }, {
                name: '公共服务列表',
                path: 'base-list',
                component: dynamicWrapper(app, ['BusinessManage/ServiceList/service-list'], () => import('../routes/ProjectManage/BaseList')),
              }, {
                name: '服务列表',
                optcode: 'view_moduletrecord',
                path: '/project-list/service-list',
                hidden: true,
                component: dynamicWrapper(app,
                  [
                    'BusinessManage/ServiceList/service-list',
                    'BusinessManage/ServiceList/service-info',
                    'BusinessManage/ServiceList/service-add',
                    'BusinessManage/ProjectList/project-list',
                  ],
                  () => import('../routes/ProjectManage/ServiceList')
                ),
              },
            ],
          }, {
            name: 'k8s资源管理',
            path: 'k8s-manage',
            children: [
              {
                name: '资源对象管理',
                optcode: 'view_configfile',
                path: 'sourceobj-manage',
                component: dynamicWrapper(app, ['k8sResourceManage/config-manage', 'CommonModal/common'], () => import('../routes/CMDB/ConfigManage/ConfigManage')),
              }, {
                name: '变更记录',
                optcode: 'view_configfile',
                path: 'change-record',
                component: dynamicWrapper(app, ['k8sResourceManage/config-manage', 'CommonModal/common'], () => import('../routes/CMDB/ConfigManage/ChangeRecord')),
              }, {
                name: '编辑',
                optcode: 'view_configfile',
                path: '/sourceobj-manage/edit',
                hidden: true,
                component: dynamicWrapper(app, ['k8sResourceManage/config-manage', 'CommonModal/common'], () => import('../routes/CMDB/ConfigManage/EditConfigManage')),
              }, {
                name: '资源对象模板',
                optcode: 'view_templatesfield',
                path: 'config-template',
                component: dynamicWrapper(app, ['k8sResourceManage/config-manage', 'CommonModal/common'], () => import('../routes/CMDB/ConfigManage/ConfigTemplate')),
              },
            ],
          },
        ],
      },
      {
        name: '发布管理',
        path: 'release-manage',
        children: [
          {
            name: '生产环境-发布',
            optcode: 'view_projectrelease',
            path: 'pro-release',
            component: dynamicWrapper(app, ['ReleaseManage/release', 'CommonModal/common', 'BusinessManage/ProjectList/project-list'], () => import('../routes/ReleaseVersion/ProRelease')),
          },
          {
            name: '预发环境-发布',
            optcode: 'view_projectrelease',
            path: 'pre-release',
            component: dynamicWrapper(app, ['ReleaseManage/release', 'CommonModal/common', 'BusinessManage/ProjectList/project-list'], () => import('../routes/ReleaseVersion/PreRelease')),
          },
          {
            name: '测试环境-发布',
            optcode: 'view_projectrelease',
            path: 'test-release',
            component: dynamicWrapper(app, ['ReleaseManage/release', 'CommonModal/common', 'BusinessManage/ProjectList/project-list'], () => import('../routes/ReleaseVersion/TestRelease')),
          },
          {
            name: '发布操作',
            hidden: true,
            optcode: 'view_projectrelease',
            path: 'operate-release',
            component: dynamicWrapper(app, ['ReleaseManage/release'], () => import('../routes/ReleaseVersion/OperateRelease/OperateRelease')),
          },
          {
            name: '版本管理',
            optcode: 'view_projectversion',
            path: 'version-manage',
            component: dynamicWrapper(app, ['ReleaseManage/version-manage', 'CommonModal/common'], () => import('../routes/ReleaseVersion/VersionManage')),
          },
          {
            name: '操作管理',
            optcode: 'view_projectversion',
            path: 'operate-manage',
            component: dynamicWrapper(app, ['ReleaseManage/operate-manage', 'CommonModal/common'], () => import('../routes/ReleaseVersion/OperateManage')),
          },
          {
            name: '操作管理详情页',
            optcode: 'view_projectversion',
            path: '/operate-manage/operate-info',
            hidden: true,
            component: dynamicWrapper(app, ['ReleaseManage/operate-manage', 'k8sResourceManage/config-manage', 'CommonModal/common'], () => import('../routes/ReleaseVersion/OperateInfo/OperateInfo')),
          },
        ],
      },
      {
        name: '用户管理',
        path: 'user-manage',
        children: [
          {
            name: '用户管理',
            optcode: 'view_user',
            path: 'userlist',
            component: dynamicWrapper(app, ['UserManage/user-manage'], () => import('../routes/UserManage/UserList')),
          },
          {
            name: '角色管理',
            optcode: 'view_role',
            path: 'rolelist',
            component: dynamicWrapper(app, ['UserManage/role-manage'], () => import('../routes/UserManage/RoleList')),
          },
        ],
      },
      {
        name: 'CMDB',
        path: 'cmdb',
        children: [
          {
            name: '设备管理',
            optcode: 'view_devicemanager',
            path: 'equipment-manage',
            children: [
              {
                name: '服务器管理',
                optcode: 'view_servermanager',
                path: 'service-manage',
                children: [
                  {
                    name: '物理机管理',
                    optcode: 'view_asset',
                    path: 'physical-manage',
                    children: [
                      {
                        name: '总物理服务器列表',
                        path: 'all-physical',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/physical-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/PhysicalManage/AllPhysical')),
                      },
                      {
                        name: '未上线的物理服务器',
                        path: 'not-online',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/physical-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/PhysicalManage/NotOnline')),
                      },
                      {
                        name: '物理机资源池列表',
                        path: 'physical',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/physical-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/PhysicalManage/Physical')),
                      },
                      {
                        name: '生产物理机服务器列表',
                        path: 'pro-physical',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/physical-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/PhysicalManage/ProPhysical')),
                      },
                      {
                        name: '预发物理机服务器列表',
                        path: 'pre-physical',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/physical-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/PhysicalManage/PrePhysical')),
                      },
                      {
                        name: '测试物理机服务器列表',
                        path: 'test-physical',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/physical-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/PhysicalManage/TestPhysical')),
                      },
                      {
                        name: '开发物理机服务器列表',
                        path: 'dev-physical',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/physical-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/PhysicalManage/DevPhysical')),
                      },
                      {
                        name: '下线物理服务器',
                        path: 'offline-physical',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/physical-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/PhysicalManage/OfflinePhysical')),
                      },
                      {
                        name: '报修物理机服务器列表',
                        path: 'rep-physical',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/physical-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/PhysicalManage/RepPhysical')),
                      },
                      {
                        name: '报废物理机服务器列表',
                        path: 'scr-physical',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/physical-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/PhysicalManage/ScrPhysical')),
                      },
                    ],
                  },
                  {
                    name: '虚拟机管理',
                    optcode: 'view_virtualmodel',
                    path: 'virtual-manage',
                    children: [
                      {
                        name: '总虚拟服务器列表',
                        path: 'all-virtual',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/virtual-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/VirtualManage/AllVirtual')),
                      },
                      {
                        name: '资源池虚拟服务器',
                        path: 'virtual',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/virtual-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/VirtualManage/Virtual')),
                      },
                      {
                        name: '生产虚拟服务器',
                        path: 'pro-virtual',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/virtual-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/VirtualManage/ProVirtual')),
                      },
                      {
                        name: '预发虚拟服务器',
                        path: 'pre-virtual',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/virtual-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/VirtualManage/PreVirtual')),
                      },
                      {
                        name: '测试虚拟服务器',
                        path: 'test-virtual',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/virtual-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/VirtualManage/TestVirtual')),
                      },
                      {
                        name: '开发虚拟服务器',
                        path: 'dev-virtual',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/virtual-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/VirtualManage/DevVirtual')),
                      },
                      {
                        name: '下线虚拟服务器',
                        path: 'offline-virtual',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/virtual-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/VirtualManage/OfflineVirtual')),
                      },
                      {
                        name: '销毁虚拟服务器',
                        path: 'reject-virtual',
                        component: dynamicWrapper(app, ['CMDB/ServiceManages/virtual-manage', 'CommonModal/formTemplate'], () => import('../routes/CMDB/ServiceManages/VirtualManage/RejectVirtual')),
                      },
                    ],
                  },

                ],
              },
            ],
          },
        ],
      },
      {
        name: '模板字段',
        optcode: 'view_datadicname',
        path: 'template-list',
        component: dynamicWrapper(app, ['TemplateManage/template-list'], () => import('../routes/CMDB/TemplateList')),
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        // name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['CommonModal/login'], () => import('../routes/User/Login')),
          },
          // {
          //   name: '注册',
          //   path: 'register',
          //   component: dynamicWrapper(app, ['register'],
          // () => import('../routes/User/Register')),
          // },
          // {
          //   name: '注册结果',
          //   path: 'register-result',
          //   component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
          // },
        ],
      },
    ],
  },
  // {
  //   component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
  //   layout: 'BlankLayout',
  //   children: {
  //     name: '使用文档',
  //     path: 'http://pro.ant.design/docs/getting-started',
  //     target: '_blank',
  //     icon: 'book',
  //   },
  // },
];
