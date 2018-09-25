const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const Client = require('ssh2-sftp-client');

const buildEnv = process.env.BUILD_ENV;
const devConfig = require('../deployConfig/deploy.dev.config.js');
const testConfig = require('../deployConfig/deploy.test.config.js');
const preConfig = require('../deployConfig/deploy.pre.config.js');

const sftp = new Client();
const klaw = require('klaw');

const localDist = path.join(process.cwd(), './dist');
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
sftp.connect(config)
  .then(() => { // 先删除 原有 dist 目录，要确保服务器上要有dist目录
    return sftp.rmdir(remoteDistDir, true);
  })
  .then(() => { // 在创建 dist 目录
    return sftp.mkdir(remoteDistDir, true);
  })
  .then((data) => { // 上传文件到dist目录
    klaw(localDist)
      .on('data', (item) => {
        if (!item.stats.isDirectory()) { // 非目录，进行文件上传
          const localPath = item.path;
          const distPath = localPath.split('/dist/')[1];
          const remotePath = `${remoteDistDir}${distPath}`;
          if (distPath.split('/').length >= 2) { // 说明有子目录
            const dirPathPre = distPath.split('/').slice(0, distPath.split('/').length - 1).join('/');
            const dirPath = `${remoteDistDir}${dirPathPre}`;
            console.log('创建子目录：', dirPath);
            sftp.mkdir(dirPath).then(() => {
              console.log('上传文件：', localPath);
              sftp.put(localPath, remotePath);
              // sftp.end();
            }).catch((err) => {
              console.log('mkdir error: ', err);
            }); // 递归创建目录
            return;
          }
          console.log(distPath);
          console.log('上传文件：', localPath);
          sftp.put(localPath, remotePath);
        }
      })
      .on('end', () => {
        // sftp.end();
      });
  })
  .catch((err) => {
    console.error('all catch: ', err);
    sftp.end();
  });

