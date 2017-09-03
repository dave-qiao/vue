/**
 * Created by dave 2017/09/03
 * 测试环境 变量
 */
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
});
