<template>
	<transition name="move">
		<div v-show="orderDetailShow" class="orderRecord">
			<!-- 返回 -->
			<back :top-title="topTitle" :back="orderDetailShow" @goBack="_back"></back>
			<div class="orderRecord-content" ref="orderRecord">
        <div class="scroll-wrapper">
          <ul v-if="ordersList.length !== 0">
            <li v-for="(list, $index) in ordersList">
              <div class="detail">
                <div class="icon-wrapper">
                  <img src="static/img/logo.png"/>
                </div>

                <div class="seller">
                  <div @click="_orderShow($index)" class="wrapper">
                    <p class="name">榕会通<i class="iconfont icon-zuoyoujiantou"></i></p>
                    <p class="time">{{list.createtime}}</p>
                  </div>
                </div>
              </div>

              <div class="list">
                <ul>
                  <li class="list-li" v-for="orders in list.orderGoods">
                    <span class="orders-name">{{orders.name}}</span>
                    <span class="orders-count">x{{orders.number}}</span>
                    <span class="price">￥{{orders.price}}</span>
                  </li>
                  <li class="deliveryPrice">
                    <span>配送费</span>
                    <span class="price">￥{{list.carriage}}</span>
                  </li>
                </ul>
                <div class="total">
                  <p>总计：￥{{list.totalprice}}</p>
                </div>
              </div>

              <split></split>
            </li>
          </ul>
        </div>
			</div>
      <div v-if="ordersList.length === 0" class="no-orders">暂时没有您的订单记录，快去下单吧！</div>
      <!-- 订单详情组件 -->
      <order-detail ref="ordersDetail"></order-detail>
		</div>
	</transition>
</template>

<script>
  import back from '../back/back';
  import split from '../split/split';
  import BScroll from 'better-scroll';
  import orderDetail from '../orderDetail/orderDetail';

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
        topTitle: TITLE,
        ordersList: [],
        list: []
      };
  	},
    mounted() {
      this._getOrdersList();
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
            this.scroll = new BScroll(this.$refs.orderRecord, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      _getOrdersList() {
        this.$http.get("/store/order/getUserOrder").then((res) => {
          this.ordersList = res.body.orders;
        });
      },
      _orderShow(index) {
        this.list = this.ordersList[index];
        this.$refs.ordersDetail.show(this.list);
      }
  	},
  	components: {
  	  back,
      split,
      orderDetail
  	}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'orderRecord.styl';
</style>







