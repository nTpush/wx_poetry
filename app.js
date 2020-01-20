require('./utils/promise.ext')
require('./utils/system')
import api from './api/index.js';
import util from './utils/util.js';
import local from './utils/local.js'
import config from './config.js'
wx.$local = local; // 本地存储
wx.$api = api; // 接口请求
wx.$util = util; // 工具类
App({
  onLaunch: function () {
    this.setService(config.useDev ? 'dev' : options.query.env);
  },
  // 环境设置
  setService(env) {
    const currEnv = env ? env : (wx.IS_DEV ? 'dev' : 'pro');
    wx.$local.service = config.service[currEnv];
  },
  globalData: {//全局变量
    rightVoice: 'https://img.ok-bug.com/wechat/poetry_other/right.mp3',
    wrongVoice: 'https://img.ok-bug.com/wechat/poetry_other/wrong.mp3',
    path: 'https://ai.ok-bug.com/',
    fds: ['https://img.ok-bug.com/wechat/poetry_other/f1.png', 'https://img.ok-bug.com/wechat/poetry_other/f2.png', 'https://img.ok-bug.com/wechat/poetry_other/f3.png', 'https://img.ok-bug.com/wechat/poetry_other/f4.png', 'https://img.ok-bug.com/wechat/poetry_other/f5.png'],
    teachers: ['https://img.ok-bug.com/wechat/poetry_other/teacher_1.png', 'https://img.ok-bug.com/wechat/poetry_other/teacher_2.png', 'https://img.ok-bug.com/wechat/poetry_other/teacher_3.png']
  }
})