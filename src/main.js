import Vue from 'vue'
import store from './store' //读取记录状态
import axios from 'axios' // axios
import qs from 'qs'
import ElementUI from 'element-ui' //引入element-ui
import 'element-ui/lib/theme-chalk/index.css';
import BootstrapVue from 'bootstrap-vue' //引入bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import echarts from 'echarts'
import { Chart } from '@antv/g2'
import g6 from '@antv/g6'
import VueCookies from 'vue-cookies'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import showdown from 'showdown'
import router from './router'
import App from './App.vue'


Vue.prototype.md2html = (md)=> {
  let converter = new showdown.Converter()
  let text = md.toString()
  let html = converter.makeHtml(text)
  return html
}
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(BootstrapVue)
Vue.use(Antd)
Vue.use(VueCookies)
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
Vue.prototype.$Chart = Chart
Vue.prototype.$g6 = g6
Vue.prototype.HOST = "http://10.176.34.154:8000/api"

// 对axios的处理
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.interceptors.request.use(function(config) {
    if (config.method === "post") {
        config.data = qs.stringify(config.data)
    }
    return config;
}, function(error) {
    return Promise.reject(error);
});
axios.interceptors.response.use(function(response) {
    if (!response.data) {
        return {
            msg: "数据返回不合理"
        }
    }
    return response;
}, function() {});

// 根据路由设置标题
router.beforeEach((to, from, next) => {
    /*路由发生改变修改页面的title */
    if(to.meta.title) {
      document.title = to.meta.title
    }
    next();
})
//路由跳转后，页面回到顶部
router.afterEach(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  })
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')