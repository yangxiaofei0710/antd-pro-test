import React, { Component } from 'react';
import CommonEnv from './CommonEnvTalbe/CommonEnv';

export default class DevPhysical extends Component {
  render() {
    const showBtnType = {
      info: true, // 详情
      edit: true, // 编辑
      allot: false, // 分配服务器
      rejectRepair: true, // 报废/保修
      offline: true, // 下线
      init: false, // 初始化
    };
    return (
      <div>
        <CommonEnv
          env="dev"
          title="开发物理机服务器"
          btnType={showBtnType}
        />
      </div>
    );
  }
}
