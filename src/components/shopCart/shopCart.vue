<template>
  <div class="shopCart">
  	<div class="content">
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
  		<div class="content-right">
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
  </div>
</template>

<script>
  export default {
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
        dropBalls: [] // 下落的小球
      };
    },
    computed: {
      totalPrice() { // 总价
        let total = 0;
        [].slice.call(this.selectFoods).forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() { // 选择商品总数
        let count = 0;
        [].slice.call(this.selectFoods).forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      }
    },
    methods: {
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
      }
    },
    filters: {
      priceFormat: function(value) {
        if (!value) return '';
        return '￥' + value;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "shopCart.styl";
</style>