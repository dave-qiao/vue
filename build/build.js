/**
 * 正式环境打包node脚本
 * created by dave 2017/09/03
 *
 */
require('./check-versions')();
process.env.NODE_ENV = 'production';

const ora = require('ora');      // 终端进度转轮
const rm = require('rimraf');    // node unix命令 等同于rm -rf
const path = require('path');    // node path模块 解析路径
const chalk = require('chalk');  // 改变命令行中字体颜色
const webpack = require('webpack');  // 打包工具
const config = require('../config'); // 打包工具配置文件
const webpackConfig = require('./webpack.prod.conf');  // 打包工具生产环境配置文件

const spinner = ora('building for production...'); // 进度提示文字
spinner.start();

// 旧版本静态文件的清除
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err;
  webpack(webpackConfig, function (err, stats) {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
});
