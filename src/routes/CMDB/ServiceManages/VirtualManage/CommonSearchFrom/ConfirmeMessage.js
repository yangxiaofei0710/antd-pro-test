import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './ConfirmeMessage.less';

@connect((state) => {
  return {
    dataDictionary: state.virtualManage.dataDictionary, // 数据字典
    commonFormFields: state.virtualManage.commonFormFields, // form
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

  // 获取配置套餐信息
  getConfigMessage = (type) => {
    let configMessage = null;
    switch (type) {
      case '1':
        configMessage = '2核4G内存50G硬盘';
        break;
      case '2':
        configMessage = '4核8G内存100G硬盘';
        break;
      case '3':
        configMessage = '2核8G内存100G硬盘';
        break;
      case '4':
        configMessage = '4核16G内存100G硬盘';
        break;
      default:
        break;
    }
    return configMessage;
  }
  render() {
    const { dataDictionary, commonFormFields } = this.props;
    // console.log('handlesure commonFormFields', commonFormFields);
    // 虚拟机sn == 物理机sn+虚拟机ip
    const physicalSn = commonFormFields.physical.value[0] ? commonFormFields.physical.value[0].split('/') : ''; // 物理机sn
    const virtualIp = commonFormFields.serverip.value ? commonFormFields.serverip.value.split('.').join('') : ''; // 虚拟机ip
    return (
      <div>
        <h3>基本配置</h3>
        <div className={styles.messageWrap}>
          <ul className={styles.messageUl}>
            <li className={styles.messageLi}>
              <span className={styles.leftStyle} style={{ width: '30%' }}>主机IP:&nbsp;&nbsp;</span>
              <span className={styles.rightStyle} style={{ width: '70%' }}>{commonFormFields.serverip.value}</span>
            </li>
            <li className={styles.messageLi}>
              <span className={styles.leftStyle} style={{ width: '30%' }}>套餐:&nbsp;&nbsp;</span>
              <span className={styles.rightStyle} style={{ width: '70%' }}>
                {this.getConfigMessage(commonFormFields.config.value)}
              </span>
            </li>
          </ul>
          <ul className={styles.messageUl}>
            <li className={styles.messageLi}>
              <span className={styles.leftStyle} style={{ width: '30%' }}>系统:&nbsp;&nbsp;</span>
              <span className={styles.rightStyle} style={{ width: '70%' }}>
                {this.getMessageInfo('os_id', 'ostypelist', dataDictionary, commonFormFields)}
              </span>
            </li>
          </ul>
          <ul className={styles.messageUl}>
            <li className={styles.messageLi}>
              <span className={styles.leftStyle}>服务器SN:&nbsp;&nbsp;</span>
              <span className={styles.rightStyle}>
                {physicalSn[physicalSn.length - 1] + virtualIp}
              </span>
            </li>
          </ul>
        </div>
        <h3>系统配置</h3>
        <div className={styles.messageWrap}>
          <ul className={styles.messageUl}>
            <li className={styles.messageLi}>
              <span className={styles.leftStyle}>登录名:&nbsp;&nbsp;</span>
              <span className={styles.rightStyle}>{commonFormFields.loginuser.value}</span>
            </li>
            <li className={styles.messageLi}>
              <span className={styles.leftStyle}>归属物理机:&nbsp;&nbsp;</span>
              <span className={styles.rightStyle}>{commonFormFields.physical.value[0]}</span>
            </li>
          </ul>
          <ul className={styles.messageUl}>
            <li className={styles.messageLi}>
              <span className={styles.leftStyle}>主机名:&nbsp;&nbsp;</span>
              <span className={styles.rightStyle}>{commonFormFields.servername.value}</span>
            </li>
          </ul>
          <ul className={styles.messageUl}>
            <li className={styles.messageLi}>
              <span className={styles.leftStyle}>描述:&nbsp;&nbsp;</span>
              <span className={styles.rightStyle}>{commonFormFields.description.value}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
