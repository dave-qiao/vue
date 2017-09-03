/**
 * Created by dave 2017/09/03
 * 测试环境 变量
 */
const merge = require('webpack-merge');
const devEnv = require('./dev.env');

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"'
});
