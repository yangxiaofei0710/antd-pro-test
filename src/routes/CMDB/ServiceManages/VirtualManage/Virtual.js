import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './CommonIndex.less';
import CommonEnv from './CommonEnvTalbe/CommonEnv';

export default class Virtual extends Component {
  render() {
    const showBtnType = {
      add: true, // 新增
      edit: true, // 编辑
      info: true, // 详情
      offline: false, // 下线
      allot: true, // 分配
      destroy: false, // 销毁
      regress: false, // 重新上线
    };
    return (
      <div>
        <CommonEnv
          env="resourcepool"
          title="资源池虚拟服务器列表"
          btnType={showBtnType}
        />
      </div>
    );
  }
}
