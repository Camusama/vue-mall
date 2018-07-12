var express = require('express');
var router = express.Router();
var mongoose =require('mongoose')
var Goods = require ('../models/goods')
/* 连接mongodb. */
mongoose.connect('mongodb://39.108.180.157:27017/db_demo');

mongoose.connection.on('connected',function () {
  console.log('mongodb success')
});
mongoose.connection.on('error',function () {
  console.log('mongodb error')
});
mongoose.connection.on('disconnected',function () {
  console.log('mongodb disconnected')
});
//后端排序,req.param为url里的值
router.get('/', function(req,res,next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let priceChecked =req.param("priceChecked")
  let sort = req.param("sort");
  let skip = (page-1)*pageSize;
  let priceGt ='',priceLte=''
  let params = {};

  if(priceChecked !="all"){
    switch (priceChecked){
      case '0':priceGt=0;priceLte=500;break;
      case '1':priceGt=500;priceLte=1000;break;
      case '2':priceGt=1000;priceLte=2000;break;
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice' : sort});
  //url里如果没有sort值上面调用会报错
  goodsModel.exec(function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
});

// 加入购物车,此处二级路由/goods/addCart
router.post("/addCart",function (req,res,next) {
  var userId = '100000077',productId = req.body.productId
  var User =require('../models/users')

  User.findOne({userId:userId},function (err,userDoc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      console.log("userDoc:"+userDoc);
      if(userDoc){
        let goodsItem =''
        //如果商品已存在购物车，则加一
        userDoc.cartList.forEach(function (item) {
          if(item.productId == productId){
            goodsItem = item;
            item.productNum ++;
          }
        });
        if(goodsItem){
          userDoc.save(function (err2,doc2) {
            if(err2){
              res.json({
                status:"1",
                msg:err2.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'suc'
              })
            }
          })
        }else{
          // 如果商品一个都不在购物车，则创建
          Goods.findOne({productId:productId},function (err1,doc) {
            if(err1) {
              res.json({
                status: '1',
                msg: err1.message
              })
            }else{
              if(doc){
                doc.productNum =1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2,doc2) {
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})
module.exports = router;
