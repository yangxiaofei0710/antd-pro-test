import React, { Component } from 'react';
import { Button } from 'antd';
import CommonIndex from './CommonIndex';
import styles from './CommonIndex.less';

export default class AllVirtual extends Component {
  // 下载导出
  checkedToken = () => {
    const url = `http://${document.domain}/api/cmdb/datadownload?file_type=1`;
    window.open(url);
  }
  render() {
    const operaBtn = (
      <div>
        <Button className={styles.rightBtn} onClick={this.checkedToken}>导出</Button>
      </div>
    );
    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '主机名称',
      dataIndex: 'servername',
      key: 'servername',
    }, {
      title: '主机IP',
      dataIndex: 'serverip',
      key: 'serverip',
    }, {
      title: '配置',
      key: 'config',
      render: (text, record) => {
        return (
          <span>
            {record.config.name}
          </span>
        );
      },
    }, {
      title: '归属',
      dataIndex: 'belongs',
      key: 'belongs',
      render: (text, record) => {
        return (
          <span>
            {record.belongs == '虚拟机' ? '虚拟机' : '公有云'}
          </span>
        );
      },
    }, {
      title: '环境',
      dataIndex: 'status',
      key: 'status',
    }];
    return (
      <div>
        <CommonIndex
          title="总虚拟服务器列表"
          envType="total"
          btn={operaBtn}
          columns={columns} // table 列
        />
      </div>
    );
  }
}
