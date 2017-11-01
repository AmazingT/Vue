<template>
  <transition name="move">
  	<div v-show="showFlag" class="food" ref="food">
  	  <div class="food-content">

       <!-- top food image -->
       <div class="image-header">
         <img :src="food.image">
         <!-- return -->
         <div class="back" @click="hide">
           <i class="iconfont icon-zuoyoujiantou"></i>
         </div>
       </div>

       <!-- food detail -->
       <div class="content">
         <h1 class="title">{{food.name}}</h1>
         <div class="detail">
           <span class="sell-count">月售{{food.sellCount}}份</span>
           <span class="rating">好评率{{food.rating}}%</span>
         </div>
         <div class="price">
           <span class="now">¥ {{food.price}}</span><span class="old" v-show="food.oldPrice">¥ {{food.oldPrice}}</span>
         </div>
         <!-- add count -->
         <div class="cartcontrol-wrapper">
           <cartControl @cartAdd="emit" :food="food"></cartControl>
         </div>
         <!-- add shopCart -->
         <transition name="fade">
           <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
         </transition>
       </div>

       <!-- split 分隔区块 -->
       <split></split>
        
       <!-- 商品信息栏 -->
       <div class="info" v-show="food.info">
         <h1 class="title">商品介绍</h1>
         <p class="text">{{food.info}}</p>
       </div>

       <split v-show="food.info"></split>
       
       <!-- 评论区 选择 -->
       <div class="rating">
         <h1 class="title">商品评价</h1>
         <ratingselect @ratingType="_select" @toggleContent="_toggle" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" :select-type="selectType"></ratingselect>
       </div>
       
       <!-- 评论区 -->
       <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <!-- v-show执行函数;该函数返回用于过滤不同类型的评论 -->
            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
              <!-- user info -->
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img :src="rating.avatar" class="avatar" width="12" height="12">
              </div>

              <!-- time filter -->
              <div class="time">{{rating.rateTime | dateFormat}}</div>

              <!-- content -->
              <p class="text">
                <span class="iconfont" :class="{'icon-up':rating.rateType===0,'icon-down':rating.rateType===1}"></span>{{rating.text}}
              </p>
            </li>
          </ul>

          <!-- 暂无评价 -->
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          
       </div>
      </div>
  	</div>
  </transition>
</template>
  
  
<script>
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import {dateFormat} from '../../common/js/date.js';
  import cartControl from '../cartControl/cartControl';
  import split from '../split/split';
  import ratingselect from '../ratingselect/ratingselect';

  // const POSITIVE = 0; // 满意评价
  // const NEGATIVE = 1; // 不满意评价
  const ALL = 2; // 所有评价

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    // 组件私有方法命名规范=>_medthodName
    methods: {
      // 商品详情显示页
      show() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = false;// 只看有内容的评价
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      // 商品详情页隐藏
      hide() {
        this.showFlag = false;
      },
      // 加入购物车点击
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('cartAdd', event.target);
        Vue.set(this.food, 'count', 1);
      },
      // cartControl的父组件是food,food的父组件是goods
      // food需要监听cartControl的cartAdd事件,同时goods也要监听food的cartAdd事件
      // 也就是goods监听了cartControl的cartAdd事件
      emit() {
        this.$emit('cartAdd', event.target);
      },
      // 筛选评价
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      // 监听评论选项组件事件的处理事件
      _select(type) {
        this.selectType = type;// 此时DOM未更新
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      // 监听评论选项组件事件的处理事件
      _toggle(onlyContent) {
        this.onlyContent = onlyContent;// 此时DOM未更新
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    filters: {
      dateFormat(time) {
        let date = new Date(time);
        // js模块化编程(日期格式化写成一个模块)
        return dateFormat(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartControl,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'food.styl';
</style>

















