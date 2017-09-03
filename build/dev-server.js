/**
 * Created by dave 2017/09/03
 * 开发环境webpack配置合并
 */
require('./check-versions')();

const config = require('../config');
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn'); // 用于打开浏览器
const path = require('path');
const express = require('express'); // node 框架
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware'); // 服务代理
const webpackConfig = (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'production')
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// 默认端口
const port = process.env.PORT || config.dev.port;

// 默认打开的浏览器
const autoOpenBrowser = !!config.dev.autoOpenBrowser;

// 定义HTTP代理到您的自定义API后端
const proxyTable = config.dev.proxyTable;

// 实例化
const app = express();
const compiler = webpack(webpackConfig);

// 定义middleware
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath, // 输出路径
  quiet: true
});

// 定义热加载相关配置
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
});

// 监听缓存模板实现 变更热加载
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  })
});

// 代理API
Object.keys(proxyTable).forEach(function (context) {
  const options = proxyTable[context];
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
});

// 处理HTML5历史API的回退
app.use(require('connect-history-api-fallback')());

// webpack输出
app.use(devMiddleware);

// 热重载
// 编译错误显示
app.use(hotMiddleware);

// 静态资源地址
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

const uri = 'http://localhost:' + port;

var _resolve;
const readyPromise = new Promise(resolve => {
  _resolve = resolve
});

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n');
  // 测试时不需要打开浏览器
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
});

// 监听端口
const server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
};
