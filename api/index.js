import createApi from '../utils/fetch'
const apis = {
  // 微信登录
  login: 'post /login',
  user: 'post /user',
  userStep: 'post /user-step',
  home: 'get /home',
  classes: 'get /poetry-class',
  classDetail: 'get /class-detail',
  poetryList: 'get /poetry-list',
  poetryDetail: 'get /poetry-detail',
  authorDetail: 'get /poetry-author',
  studyMode: 'get /study-mode',
  studMethod: 'get /study-mothod',
  poetryError: 'get /poetry-error',
  poetryImage: 'get /poetry-img',

  shareAdd: 'get /share-add',
  shareGet: 'get /share-get'
  // 
}
export default createApi(apis, '/api')