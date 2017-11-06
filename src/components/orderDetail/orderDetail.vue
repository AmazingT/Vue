<template>
	<transition name="move">
		<div v-show="orderShow" class="orderDetail">
			<!-- 返回 -->
			<back :top-title="topTitle" :back="orderShow" @goBack="_back"></back>
			<div class="orderDetail-content" ref="orderDetail">
        <div class="scroll-wrapper">
          
          <!-- 配送信息 -->
          <div class="delivery-wrapper">
            <div class="title">配送信息</div>
            <ul class="list">
              <li>配送地址：{{ordersList.deliveryadd}}</li>
              <li>配送人：{{ordersList.deliveryname}}</li>
              <li>配送电话：{{ordersList.deliveryphone}}</li>
            </ul>
          </div>

          <split></split>

          <!-- 订单信息 -->
          <div class="order-info">
            <div class="title">订单信息</div>
            <ul class="list">
              <li>订单号：{{ordersList.ordercode}}</li>
              <li>下单时间：{{ordersList.createtime}}</li>
              <li>支付方式：在线支付</li>
            </ul>
          </div>

           <!-- 联系商家 -->
          <div class="tell">
            <a href="13116314575">联系商家</a>
          </div>
        </div>
			</div>
		</div>
	</transition>
</template>

<script>
  import back from '../back/back';
  import buyShop from '../buyShop/buyShop';
  import split from '../split/split';
  import BScroll from 'better-scroll';

  const TITLE = '订单详情';

  export default {
  	data() {
      return {
        orderShow: false,
        topTitle: TITLE,
        ordersList: []
      };
  	},
  	methods: {
  	  show(ordersList) {
        this.ordersList = ordersList;
  	  	this.orderShow = true;
        this._initScroll();
  	  },
      _back(bool) {
      	this.orderShow = bool;
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
  	  buyShop,
      split
  	}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'orderDetail.styl';
</style>







