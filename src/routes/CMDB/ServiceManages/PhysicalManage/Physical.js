import React, { Component } from 'react';
import CommonEnv from './CommonEnvTalbe/CommonEnv';

export default class Physical extends Component {
  render() {
    const showBtnType = {
      info: true, // 详情
      edit: true, // 编辑
      allot: true, // 分配服务器
      rejectRepair: true, // 报废/保修
      offline: false, // 下线
      init: false, // 初始化
    };
    return (
      <div>
        <CommonEnv
          env="resourcepool"
          title="物理机资源池"
          btnType={showBtnType}
        />
      </div>
    );
  }
}
