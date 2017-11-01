<template>
  <div class="shopCart">
    <div class="content" @click="toggleList">
      <!-- left flex 自适应 -->
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <span class="iconfont icon-gouwuche" :class="{'highlight':totalCount>0}"></span>
          </div>
          <!-- select food count -->
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <!-- 选择商品的总价 -->
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费{{deliveryPrice | priceFormat}}元</div>
      </div>

      <!-- right(¥20起送) width fixed-->
      <!-- 阻止事件默认事件和冒泡 -->
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>

    <!-- ball animation -->
    <div class="ball-container">
      <!-- 两个方向上的动画,故添加两层div -->
      <!-- 外层.ball控制纵向动画,内层.inner控制横向动画 -->
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div v-show="ball.show" class="ball">
              <!-- 跳动的小球 -->
              <div class="inner inner-hook"></div> 
            </div>
          </transition>
        </div>
    </div>

    <!-- show select foods -->
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li v-for="food in selectFoods" class="food">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>{{food.price*food.count | priceFormat}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartControl @cartAdd="drop" :food="food"></cartControl>
              </div>
            </li>
          </ul>
        </div>
      </div>
  </transition>

    <!-- mask -->
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
  import cartControl from '../cartControl/cartControl';
  // import orders from '../orders/orders';
  import BScroll from 'better-scroll';

  export default {
    // 接收父组件传过来的值
    props: {
      selectFoods: { // 购物车中选择的商品(cartControl组件传递过来)
        type: Array,
        default() {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [], // 下落的小球
        fold: true
      };
    },
    computed: {
      totalPrice() { // 总价
        let total = 0;
        [].slice.call(this.selectFoods).forEach((food) => {
          total += food.price * food.count;
        });
        
        this.$emit('calPrice', total);
        return total;
      },
      totalCount() { // 选择商品总数
        let count = 0;
        [].slice.call(this.selectFoods).forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() { // 结算
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass() { // 满足起送价格后改变样式
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() { // 底部购物车显示隐藏
        if (!this.totalCount) {
          this.fold = true; // 折叠
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      // 获取运动中的小球
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      // 小球动画效果
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            // console.log('x:' + x + ';' + 'y:' + y);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      // 购物车列表显示和隐藏
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      // 清空购物车
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      // 遮罩层点击时折叠
      hideList() {
        this.fold = true;
      },
      // 右侧结算
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        // 调用订单页的show()方法来显示
        this.$emit('showOrders');
      }
    },
    // 价格格式化
    filters: {
      priceFormat: function(value) {
        if (!value) return '';
        return '￥' + value;
      }
    },
    // 组件注册
    components: {
      cartControl
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "shopCart.styl";
</style>