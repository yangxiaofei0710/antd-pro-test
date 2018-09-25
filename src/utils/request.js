import fetch from 'dva/fetch';
import { Modal, notification, Message } from 'antd';
import { routerRedux } from 'dva/router';
import LocalStorage from './storage';
import history from './history';

let BaseUrl = '/api';
if (process.env.NODE_ENV === 'development') {
  BaseUrl = 'http://10.0.34.48/api';
} else if (process.env.NODE_ENV === 'local') {
  BaseUrl = '';
}

let modalCount = 0;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  // Message.error(`请求错误 ${response.status}: ${response.statusText}`);
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
function interceptor(response) {
  let error = null;
  switch (response.code) {
    case 401:
      if (modalCount === 0) {
        modalCount++;
        Modal.warning({
          title: '登录认证失效，请重新登录',
          onOk: () => {
            history.push('/user/login');
            modalCount -= 1;
          },
        });
      }
      break;
    case 403:
      history.push('/exception/403');
      break;
    case 200:
      break;
    default:
      error = new Error(response.msg);
      error.response = response;
      throw error;
  }
  return response;
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const fullUrl = `${BaseUrl}${url}`;
  const defaultOptions = {
    mode: 'cors',
    // credentials: 'include',
  };
  if (process.env.NODE_ENV !== 'development') {
    defaultOptions.credentials = 'include';
  }
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'GET') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      accessToken: LocalStorage.get('accessToken'),
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return fetch(fullUrl, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .then(interceptor)
    .catch((error) => {
      if (error.code) {
        // notification.error({
        //   message: error.name,
        //   description: error.message,
        // });
        Message.error(`${error.name}: ${error.message}`);
      }
      if ('stack' in error && 'message' in error) {
        // notification.error({
        //   message: '请求错误: ',
        //   description: error.message,
        // });
        Message.error(`请求错误: ${error.message}`);
      }
      return error;
    });
}
