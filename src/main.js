import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

Vue.config.productionTip = false

Vue.use(infiniteScroll)
Vue.use(VueLazyLoad,{
  loading:'/static/loading-svg/loading-bars.svg'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components:{
    App
  }
})
