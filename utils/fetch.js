/**
 * 异步请求封装
 * 所有api注册后使用（/api/index.js），一般不允许直接使用
 */
import wxp from './wxp.js'
import appConfig from '../config.js';
// const sysInfo = wx.getSystemInfoSync();

// 请求数据类型 default / json / form-data
const REQUEST_HEADERS = {
  'default': {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  'json': {
    'Content-Type': 'application/json'
  },
  'form-data': {
    'Content-Type': 'multipart/form-data'
  },
}

const ERRORS = {
  '404': '请求接口地址不存在',
  '401': '登录失效，请重新登录',
  '403': '暂无权限调用，请联系管理员',
  '503': '网络较慢，请稍候再试',
}

function changeLoading(loading, state, tip) {
  const isBool = typeof loading === 'boolean';
  const isFunc = typeof loading === 'function';

  if (isBool && loading === true) {
    state ? wx.showLoading({
      title: tip,
      mask: true
    }) : wx.hideLoading()
  } else if (isFunc) {
    loading(state);
  }
}

function transfromToRequest(methodUrl, servicePrefix) {
  let [method, url] = methodUrl.split(' ');
  method = method.toUpperCase()

  /**
   * data: 请求数据对象
   * config:
   *  config.loading 是否显示加载Loading
   *  config.tip Loading提示文字
   *  config.onLoadingChange 自定义更新Loading函数
   *  config.stopPullRefresh 请求结束后是否停止下拉刷新
   *  config.catchError 是否自动捕获异常
   *  config.dataType 请求类型
   */
  return (data = {}, config = {}) => {
    let {
      loading,
      stopPullRefresh = false,
      catchError = true,
      tip = '加载中...',
      dataType = 'default',
    } = config;
    const {
      authInfo,
      service,
      token
    } = wx.$local;

    if (url.indexOf('http') === -1) url = wx.$local.service + servicePrefix + url;

    // 只在测试环境打印日志
    if (service.indexOf('dev') !== -1) {
      console.log(method, url)
      console.log('request:data', data);
    }

    // 避免传递 undefined 与 null
    Object.keys(data).forEach(v => {
      if (data[v] === undefined || data[v] === 'undefined' || data[v] === null) data[v] = '';
    })

    // 设置header
    const header = REQUEST_HEADERS[dataType];
    // 添加 token
    if (token) header.token = token;

    // 显示loading
    changeLoading(loading, true, tip);

    // 请求
    return wxp.request({
      url,
      data,
      method,
      header,
    }).then(res => {
      changeLoading(loading, false, tip);
      stopPullRefresh && wx.stopPullDownRefresh()

      const data = res.data;
      const code = data.status;
      
      if (code == 1) return data.data;

      // 登录失效
      const currPage = getCurrentPages().pop();
      const isIndexPage = currPage.route === 'pages/index/index';

      if ((data.code == 301 || data.code == 302) && !isIndexPage) {
        wx.$local.resetAuthInfo();
        const next = currPage.route.replace('pages', '');
        const options = currPage.options;
        wx.$util.redirectTo('/index/index', {
          next,
          from: 'auth',
          isNeedLogin: 1,
          ...options,
        });
      }


      const msg = data.message;
      throw {
        message: msg,
        type: 'server',
        code
      }
    }).catch(err => {
      changeLoading(loading, false);
      stopPullRefresh && wx.stopPullDownRefresh()

      if (catchError) {
        // 异常处理
        if (err && err.type === 'server') {
          wx.showToast({
            title: err.message || '服务器繁忙，请稍候再试',
            icon: 'none'
          })
        } else {
          const statusCode = err && err.statusCode || '';
          wx.showModal({
            title: '警告',
            content: ERRORS[statusCode] || ('网络较慢，请稍候再试' + statusCode),
            confirmText: '我知道了',
            showCancel: false
          })
        }
        return Promise.stop();
      } else {
        throw err;
      }
    })
  }
}


const createAsyncRequest = (apiConfig, servicePrefix = '') => {
  Object.keys(apiConfig).forEach(v => {
    const methodUrl = apiConfig[v];
    apiConfig[v] = transfromToRequest(methodUrl, servicePrefix);
  });
  return apiConfig;
}

export default createAsyncRequest;