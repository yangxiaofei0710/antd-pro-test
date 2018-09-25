const client = require('scp2');
const fse = require('fs-extra');
const path = require('path');
const Client = require('ssh2-sftp-client');

const sftp = new Client();
const buildEnv = process.env.BUILD_ENV;
const devConfig = require('../deployConfig/deploy.dev.config.js');
const testConfig = require('../deployConfig/deploy.test.config.js');
const preConfig = require('../deployConfig/deploy.pre.config.js');

const localDist = path.join(process.cwd(), './dist/');
const remoteDistDir = '/home/automp/dist/';
let config = devConfig;

console.log('当前发布环境：', buildEnv);
switch (buildEnv) {
  case 'dev':
    config = devConfig;
    break;
  case 'test':
    config = testConfig;
    break;
  case 'pre':
    config = preConfig;
    break;
  default:
    config = devConfig;
}
const remoteInfo = `${config.username}:${config.password}@${config.host}:${remoteDistDir}`;
console.log('remoteInfo:', remoteInfo);
console.log('开始上传…………');
sftp.connect(config)
  .then(() => { // 先删除 原有 dist 目录，要确保服务器上要有dist目录
    return sftp.rmdir(remoteDistDir, true);
  })
  .then(() => { // 在创建 dist 目录
    return sftp.mkdir(remoteDistDir, true);
  })
  .then(() => {
    sftp.end();
    client.scp(localDist,
      remoteInfo,
      (err) => {
        if (err) {
          console.log('上传失败！', err);
        }
        console.log('上传完成！');
      });
  });

