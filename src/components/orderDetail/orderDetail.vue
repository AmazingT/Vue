<template>
	<transition name="move">
		<div v-show="orderDetailShow" class="orderDetail">
			<!-- 返回 -->
			<back :top-title="topTitle" :back="orderDetailShow" @goBack="_back"></back>
			<div class="orderDetail-content" ref="orderDetail">
        <div class="scroll-wrapper">

          <!-- 订单组件 -->
          <!-- <buy-shop :orders="orders"></buy-shop> -->
          
        </div>
			</div>
		</div>
	</transition>
</template>

<script>
  import back from '../back/back';
  import buyShop from '../buyShop/buyShop';
  import BScroll from 'better-scroll';

  const TITLE = '订单记录';

  export default {
  	props: {
      orders: {
      	type: Array,
      	default() {
      	  return [];
      	}
      }
  	},
  	data() {
      return {
        orderDetailShow: false,
        topTitle: TITLE
      };
  	},
  	methods: {
  	  show() {
  	  	this.orderDetailShow = true;
        this._initScroll();
  	  },
      _back(bool) {
      	this.orderDetailShow = bool;
      },
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.orderDetail, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
  	},
  	components: {
  	  back,
  	  buyShop
  	}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'orderDetail.styl';
</style>







