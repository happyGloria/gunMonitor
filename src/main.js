import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import $ from 'jquery'
Vue.prototype.$ = $
import '../static/iconfont/iconfont.css'  // 全局引入字体图标

import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
Vue.use(ElementUI);
import './components/icons/index' // icon
import '../static/sass/index.scss' // global css
Vue.config.productionTip = false
// 设置为 false 以阻止 vue 在启动时生成生产提示。
import './components/icons/index.js' // icon







/*
// 设置按需导入
import {
  Alert,
} from 'element-ui'
Vue.use(Alert)
*/

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')