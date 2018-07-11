<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)"
             class="filterby stopPop"
             @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter 响应式显示-->
          <div class="filter stopPop" id="filter"
               :class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a @click="priceChecked='all'"
                   :class="{'cur':priceChecked==='all'}"
                   href="javascript:void(0)">
                  All
                </a>
              </dd>
              <dd v-for="(item,key) in priceFilter">
                <a href="javascript:void(0)"
                   :class="{'cur':priceChecked===key}"
                   @click="setPriceFilter(key)">
                  {{item.startPrice}} - {{item.endPrice}}
                </a>
              </dd>
            </dl>
          </div>
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,key) in goodsList.list">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/' + item.productImage"></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closeFilterPop"></div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  import './../assets/css/login.css'
  import './../assets/css/checkout.css'
  import NavFooter from '@/components/NavFooter'
  import NavHeader from '@/components/NavHeader'
  import NavBread from '@/components/NavBread'
  import axios from 'axios'
  export default {
      name: "GoodsList",
      data(){
        return {
          goodsList:[],
          priceFilter:[
            {
              startPrice:"0.00",
              endPrice:"500.00"
            },{
              startPrice:'500.00',
              endPrice:'1000.00'
            },{
              startPrice:'1000.00',
              endPrice:'2000.00'
            }
          ],
          priceChecked:'all',
          filterBy:false,
          overLayFlag:false
        }
      },
      components:{
        NavFooter,
        NavHeader,
        NavBread
      },
      mounted (){
        this.getGoodsList()
      },
      methods:{
        getGoodsList () {
          axios.get('/goods').then((res) => {
            let response=res.data
            if(response.status=='0'){
              this.goodsList=res.data.result;
            }else{
              this.goodsList=[];
            }

          })
        },
        showFilterPop(){
          this.filterBy=true
          this.overLayFlag=true
        },
        setPriceFilter(index){
          this.priceChecked=index
          this.closeFilterPop()
        },
        closeFilterPop(){
          this.filterBy=false
          this.overLayFlag=false
        }
      }
  }
</script>

