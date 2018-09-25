import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './ConfirmeMessage.less';

@connect((state) => {
  return {
    dataDictionary: state.physicalmanage.dataDictionary,
    commonFormFields: state.physicalmanage.commonFormFields,
  };
})

export default class ConfirmeMessage extends Component {
   // 获取基础信息
   getMessageInfo = (type, dicType, data, formData) => {
     let message = null;
     if (Object.keys(data).length > 0) {
       data[dicType].forEach((element, index) => {
         if (element.value == formData[type].value) {
           message = element.title;
         }
       });
     }
     return message;
   }
   render() {
     const { dataDictionary, commonFormFields } = this.props;
     //  console.log('commonFormFields ok', commonFormFields);
     return (
       <div>
         <h3>基本配置</h3>
         <div className={styles.messageWrap}>
           <ul className={styles.messageUl}>
             <li className={styles.messageLi}>
               <span>主机IP:&nbsp;&nbsp;</span>
               <span>{commonFormFields.serverip.value}</span>
             </li>
             <li className={styles.messageLi}>
               <span>系统版本:&nbsp;&nbsp;</span>
               <span>{this.getMessageInfo('os_id', 'ostypelist', dataDictionary, commonFormFields)}</span>
             </li>
             <li className={styles.messageLi}>
               <span>主机型号:&nbsp;&nbsp;</span>
               <span>{this.getMessageInfo('servervendortype_id', 'servertypelist', dataDictionary, commonFormFields)}</span>
             </li>
           </ul>
           <ul className={styles.messageUl}>
             <li className={styles.messageLi}>
               <span>管理IP:&nbsp;&nbsp;</span>
               <span>{commonFormFields.manageip.value}</span>
             </li>
             <li className={styles.messageLi}>
               <span>购入时间:&nbsp;&nbsp;</span>
               <span>{commonFormFields.buytime.value}</span>
             </li>
             <li className={styles.messageLi}>
               <span>机房号:&nbsp;&nbsp;</span>
               <span>{this.getMessageInfo('idc_id', 'idclist', dataDictionary, commonFormFields)}</span>
             </li>
           </ul>
           <ul className={styles.messageUl}>
             <li className={styles.messageLi}>
               <span>序列号:&nbsp;&nbsp;</span>
               <span>{commonFormFields.serversn.value}</span>
             </li>
             <li className={styles.messageLi}>
               <span>维保到期时间:&nbsp;&nbsp;</span>
               <span>{commonFormFields.repairtime.value}</span>
             </li>
             <li className={styles.messageLi}>
               <span>机柜号:&nbsp;&nbsp;</span>
               <span>{this.getMessageInfo('rack_id', 'racklist', dataDictionary, commonFormFields)}</span>
             </li>
           </ul>
         </div>
         <h3>系统配置</h3>
         <div className={styles.messageWrap}>
           <ul className={styles.messageUl}>
             <li className={styles.messageLi}>
               <span>登录名:&nbsp;&nbsp;</span>
               <span>{commonFormFields.loginuser.value}</span>
             </li>
           </ul>
           <ul className={styles.messageUl}>
             <li className={styles.messageLi}>
               <span>主机名:&nbsp;&nbsp;</span>
               <span>{commonFormFields.servername.value}</span>
             </li>
           </ul>
           <ul className={styles.messageUl}>
             <li className={styles.messageLi}>
               <span>描述:&nbsp;&nbsp;</span>
               <span>{commonFormFields.description.value}</span>
             </li>
           </ul>
         </div>
       </div>
     );
   }
}
