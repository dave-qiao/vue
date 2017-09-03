/**
 * Created by dave 2017/09/03
 * 自动刷新浏览器页面
 *
 */
/* eslint-disable */
require('eventsource-polyfill'); // html5中的新特性往client端推送数据
const hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true'); // webpack热加载中的中间件

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload();
  }
});
