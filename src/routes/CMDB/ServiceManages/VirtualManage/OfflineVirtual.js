import React, { Component } from 'react';
import CommonEnv from './CommonEnvTalbe/CommonEnv';

export default class OfflineVirtual extends Component {
  render() {
    const showBtnType = {
      add: false, // 新增
      edit: true, // 编辑
      info: true, // 详情
      offline: false, // 下线
      allot: false, // 分配
      destroy: true, // 销毁
      regress: true, // 重新上线
    };
    return (
      <div>
        <CommonEnv
          env="offline"
          title="下线虚拟服务器"
          btnType={showBtnType}
        />
      </div>
    );
  }
}
