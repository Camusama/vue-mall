import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'Vuex'
import {currency} from "./util/currency"
Vue.filter(
  "currency",currency
);

Vue.config.productionTip = false

Vue.use(infiniteScroll)
Vue.use(VueLazyLoad,{
  loading:'/static/loading-svg/loading-bars.svg'
})
Vue.use(Vuex);
const store = new Vuex.Store({
  state:{
    nickName:"",//用户名
    cartCount:0 // 购物车数量
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount;
    }
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components:{
    App
  }
})
