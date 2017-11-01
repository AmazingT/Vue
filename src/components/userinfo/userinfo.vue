<template>
	<div class="userinfo">
		<!-- 用户信息 -->
		<div class="user">
			<div class="avatar">
				<img :src="user.headimgurl" alt="avatar" width="60" height="60" />
			</div>
			<div class="user-info">
				<div class="username">
					<i class="iconfonts icon-username"></i>
					{{user.nickname}}
			    </div>
			</div>
		</div>
		<split></split>
		<!-- 地址管理 -->
		<div class="address-manage">
			<div class="address">
				<i class="iconfonts icon-location"></i>
				<span class="text">收货地址</span>
				<i @click="_drops" class="iconfont icon-zuoyoujiantou"></i>
			</div>
			<div class="orders-check">
				<i class="iconfonts icon-flower"></i>
				<span class="text">订单记录</span>
				<i @click="submit" class="iconfont icon-zuoyoujiantou"></i>
			</div>
		</div>
		<split></split>

		<!-- 地址组件 -->
		<user-address @update="_getUserAddress" @delete="_getUserAddress" :address="address" ref="userAddr"></user-address>

		<!-- 订单组件 -->
		<order-detail :orders="orders" ref="orderDetail"></order-detail>
	</div>
</template>

<script>
	import split from '../split/split';
	import userAddress from '../address/address';
	import orderDetail from '../orderDetail/orderDetail';
	export default {
	  props: {
	  	seller: {
	  	  type: Object
	  	}
	  },
	  data() {
	  	return {
	  	  user: {},
	  	  address: []
	  	};
	  },
	  // 获取用户的地址信息
	  created() {
	  	this._getUserInfo();
		this._getUserAddress();
	  },
	  // 父组件设置为缓存,子组件不缓存执行方法
	  activated() {
	  	this._getUserInfo();
        this._getUserAddress();
	  },
	  methods: {
	  	_drops() {
	  	  this.$refs.userAddr.show();
	  	},
	  	submit() {
      	  this.$refs.orderDetail.show();
      	},
      	_getUserAddress() {
           this.$http.get('/store/address/selectUserAddress').then((res) => {
	       this.address = res.body.address;
	  	  });
	    },
	    _getUserInfo() {
	      this.$http.post('/store/user/getUserInfo').then((res) => {
	      	this.user = res.body;
	      	console.log(res.body);
	      	console.log(this.user);
	      });
	    }
	  },
	  components: {
	  	split,
	  	userAddress,
	  	orderDetail
	  }
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'userinfo.styl';
</style>









