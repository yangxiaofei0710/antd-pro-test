import Rollbar from 'rollbar';

// 用于线上错误记录的，我们不需要，还要花钱注册

// Track error by https://sentry.io/
if (location.host === 'preview.pro.ant.design') {
  Rollbar.init({
    accessToken: '033ca6d7c0eb4cc1831cf470c2649971',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
    },
  });
}
