import { Message } from 'antd';
/**
 * 校验服务器sn码
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */

export function checkedServiceSn(rule, value, callback) {
  const regName = /^[A-Z]+[0-9]+|[0-9]+[A-Z]+$/g.test(value);
  const regLower = /[a-z]+/g.test(value);
  if (!regName || regLower) {
    callback('仅限于输入数字和英文，英文限大写');
  }
  callback();
}

