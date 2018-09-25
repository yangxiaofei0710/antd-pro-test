import React, { Component } from 'react';
import { Table } from 'antd';
/** 公共table所需参数
 * columns 表格列
 * tableData 表格渲染数据
 * loading 加载loading控制
 * pagination 分页信息
 * onChange 分页查询回调
 */
export default class CommonTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.props.columns, // 列
      tableData: this.props.tableData, // 渲染数据
      loading: this.props.loading, // loading 效果
      pagination: this.props.pagination, // 分页信息
      onChange: this.props.onChange, // 分页查询回调
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }
  onChange = (page) => {
    this.props.onChange(page);
  }
  render() {
    const { loading, columns, tableData, pagination, onChange } = this.state;
    return (
      <div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={tableData}
          pagination={pagination}
          onChange={onChange}
        />
      </div>
    );
  }
}
