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
          <a href="javascript:void(0)" class="price" @click="sortGoods()">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
                <a @click="setPriceFilter('all')"
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
                <li v-for="(item,key) in goodsList">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'/static/' + item.productImage" :key="'/static/' + item.productImage">
                      <!--此处如果不加Key会导致图片无法更新，插件特性-->
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                <img class="loading" src="./../../static/loading-svg/loading-bars.svg" v-if="loading">
              </div>
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
          sortFlag:false,
          page:1,
          pageSize:4,
          //页数，每页显示个数，排序
          busy:true,
          // loadmore插件
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
          overLayFlag:false,
          loading:false
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
        getGoodsList (flag) {
          var param = {
            page:this.page,
            pageSize:this.pageSize,
            sort:this.sortFlag?1:-1,
            priceChecked:this.priceChecked
          };
            // 排序切换传参
          this.loading=true;
          axios.get('/goods',{
            params:param
          }).then((res) => {
            let response=res.data
            this.loading=false;
            if(response.status=='0'){
              if(flag){
                this.goodsList=this.goodsList.concat(res.data.result.list);
                // 当请求是滑动瀑布加载时,concat数组拼接方法
                if(res.data.result.count === 0){
                  this.busy=true;
                  // 当数据已完,停止加载
                }else{
                  this.busy=false;
                }
              }else {
                this.goodsList = res.data.result.list;
                if(res.data.result.count === 0){
                  this.busy=true;
                  // 当数据已完,停止加载
                }else{
                  this.busy=false
                }
              }
            }else{
              this.goodsList=[];
            }

          })
        },
        sortGoods(){
          this.sortFlag=!this.sortFlag;
          this.page=1;
          this.getGoodsList();
        },
        showFilterPop(){
          this.filterBy=true
          this.overLayFlag=true
        },
        setPriceFilter(index){
          this.priceChecked=index
          this.page=1
          this.getGoodsList()
          this.closeFilterPop()
        },
        closeFilterPop(){
          this.filterBy=false
          this.overLayFlag=false
        },
        loadMore(){
          this.busy = true;
          setTimeout(() => {
            this.page++;
            this.getGoodsList(true);
          }, 1000);
          // 性能优化
        },
        addCart(productId){
          axios.post('/goods/addCart',{
            productId:productId
          }).then((res)=>{
            if(res.data.status=="0"){
              alert('加入成功')
            }else{
              alert('msg:'+res.data.msg)
            }
          })
        }
      }
  }
</script>

<style scoped>
  .loading{
    height:100px;
    line-height: 100px;
    text-align: center;
    margin: 0 auto;
  }

</style>
