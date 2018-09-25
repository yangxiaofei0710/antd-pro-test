import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './ConfirmeMessage.less';

@connect((state) => {
  return {
    dataDictionary: state.serviceManage.dataDictionary,
    addFormFields: state.serviceManage.addFormFields,
  };
})

export default class ConfirmMessage extends Component {
    // 获取基础信息
    getMessage = (type, data, formData) => {
      let message = null;
      data[type].forEach((element, index) => {
        if (element.id == formData[type].value) {
          message = element.name;
        }
      });
      return message;
    }
    // 获取交换机
    getVpcSwitchMessage = (type, data, formData) => {
      let message = null;
      let vpcName = null;
      let switchName = null;
      if (formData[type].value) {
        data[type].forEach((element, index) => {
          if (element.value == (formData[type].value)[0]) {
            vpcName = element.label;
          }
          element.children.forEach((item, i) => {
            if (item.value == (formData[type].value)[1]) {
              switchName = item.label;
            }
          });
        });
        message = `${vpcName}/${switchName}`;
      }
      return message;
    }
    // 获取配置套餐信息
    getConfigMessage = (type) => {
      let configMessage = null;
      switch (type) {
        case '1':
          configMessage = '2核4G内存200G硬盘';
          break;
        case '2':
          configMessage = '4核8G内存200G硬盘';
          break;
        case '3':
          configMessage = '2核16G内存200G硬盘';
          break;
        default:
          break;
      }
      return configMessage;
    }
    render() {
      const { dataDictionary, addFormFields } = this.props;
      // console.log('addFormFields ', addFormFields);
      return (
        <div>
          <h3>基本配置</h3>
          <div className={styles.infoWrapper}>
            <ul className={styles.infoUl} style={{ width: '40%' }}>
              <li>
                <span className={styles.leftStyle}>计费方式：</span>
                <span className={styles.rightStyle}>{this.getMessage('charging', dataDictionary, addFormFields)}</span>
              </li>
              <li>
                <span className={styles.leftStyle}>套餐：</span>
                <span className={styles.rightStyle}>
                  {this.getConfigMessage(addFormFields.config.value)}
                </span>
              </li>
              <li>

                <span className={styles.leftStyle}>带宽：</span>
                <span className={styles.rightStyle}>
                  {addFormFields.bandtype.value ? this.getMessage('bandtype', dataDictionary, addFormFields) : ''}
                  {addFormFields.networkband.value ? addFormFields.networkband.value : ''}
                  Mbps
                </span>
              </li>
            </ul>
            <ul className={styles.infoUl} style={{ width: '60%' }}>
              <li>
                <span className={styles.leftStyle}>计费时长：</span>
                <span className={styles.rightStyle}>
                  {this.getMessage('cycle', dataDictionary, addFormFields)}
                </span>
              </li>
              <li>
                <span className={styles.leftStyle}>镜像：</span>
                <span className={styles.rightStyle}>
                  {this.getMessage('image', dataDictionary, addFormFields)}
                </span>
              </li>
              <li>
                <span className={styles.leftStyle}>vpc 交换机：</span>
                <span className={styles.rightStyle}>
                  {this.getVpcSwitchMessage('vpc_switch', dataDictionary, addFormFields)}
                </span>
              </li>
            </ul>
            <ul className={styles.infoUl} style={{ width: '40%' }}>
              <li>
                <span className={styles.leftStyle}>地域：</span>
                <span className={styles.rightStyle}>
                  {this.getMessage('zone', dataDictionary, addFormFields)}
                </span>
              </li>
              <li>
                <span className={styles.leftStyle}>安全组：</span>
                <span className={styles.rightStyle}>
                  {this.getMessage('security', dataDictionary, addFormFields)}
                </span>
              </li>
              <li />
            </ul>
          </div>

          <h3>系统配置</h3>
          <div className={styles.infoWrapper}>
            <ul className={styles.infoUl} style={{ width: '40%' }}>
              <li>
                <span className={styles.leftStyle}>登录名：</span>
                <span className={styles.rightStyle}>root</span>
              </li>
            </ul>
            <ul className={styles.infoUl} style={{ width: '60%' }}>
              <li>
                <span className={styles.leftStyle}>主机名：</span>
                <span className={styles.rightStyle}>{addFormFields.name.value}</span>
              </li>
            </ul>
            <ul className={styles.infoUl} style={{ width: '40%' }}>
              <li>
                <span className={styles.leftStyle}>描述：</span>
                <span className={styles.rightStyle}>{addFormFields.comment.value}</span>
              </li>
            </ul>
          </div>

        </div>
      );
    }
}
