import App from './App'
import Vant from 'vant';
import 'vant/lib/index.css';
import loading from '/components/loading/loading.vue'
import centerLoading from '/components/loading/centerLoading.vue'
import empty from "/components/empty/empty.vue"

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(Vant)
  app.component('Loading', loading)
  app.component('CenterLoading', centerLoading)
  app.component('Empty', empty)
  return {
    app
  }
}
// #endif