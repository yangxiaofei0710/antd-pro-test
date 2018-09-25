import request from '../utils/request';

export async function fakeAccountLogin(params) {
  return request('/account/user/login', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function fakeAccountLogout(params) {
  return request('/account/user/logout', {
    method: 'POST',
  });
}
