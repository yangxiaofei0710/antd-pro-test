import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import CommonIndex from './CommonIndex';
import styles from './CommonIndex.less';
import InfoModal from './CommonModal/InfoModal';

@connect((state) => {
  return {};
})

export default class RejectVirtual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickType: 'add',
      virtualInfo: '',
    };
  }

  handleSubmitFrom = (item, fun) => {}

  // 查看
 showInfo = (item) => {
   this.setState({
     virtualInfo: item.servername,
   });
   const { dispatch } = this.props;
   dispatch({
     type: 'virtualManage/saveInfoModalStatus',
     payload: true,
   });
   dispatch({
     type: 'virtualManage/showInfoModal',
     payload: {
       id: item.id,
     },
   });
 }

 render() {
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
     title: '虚拟机SN',
     dataIndex: 'serversn',
     key: 'serversn',
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
     title: '宿主机IP',
     dataIndex: 'hostip',
     key: 'hostip',
   }, {
     title: '销毁时间',
     dataIndex: 'rejecttime',
     key: 'rejecttime',
   }, {
     title: '操作',
     key: 'operation',
     render: (text, record) => {
       return (
         <span>
           <a style={{ marginRight: '10px' }} onClick={this.showInfo.bind(this, record)}>详情</a>
         </span>
       );
     },
   }];
   return (
     <div>
       <CommonIndex
         title="销毁虚拟服务器"
         envType="destory"
         columns={columns} // table 列
         clickType={this.state.clickType} // 点击类型 （编辑/增加)
         handleSubmit={this.handleSubmitFrom.bind(this)}
       />
       <InfoModal title={this.state.virtualInfo} />
     </div>
   );
 }
}
