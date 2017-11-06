<template>
	<transition name="move">
		<!-- 订单组件 -->
		<div v-show="showOrders" class="orders">
			<!-- 返回 -->
			<back :top-title="topTitle" :back="showOrders" @goBack="_back"></back>

			<div class="orders-content" ref="goodsList">
				<div class="content">
					<!-- 收货地址 -->
					<div class="address-wrapper">
						<div class="addr-icon">
							<i class="iconfonts icon-location"></i>
						</div>

						<div class="user-right">
							<div v-if="showUser">
								<div class="user-info">
									<span class="name">{{addr.name}}</span>
									<span class="sex">{{addr.sex | _switch}}</span>
									<span class="tell">{{addr.phone}}</span>
								</div>
							
								<div class="addr">{{addr.address}}</div>
							</div>

							<!-- no address -->
							<div v-if="!showUser" class="no-address">请选择一个收获地址!</div>
						</div>

						<div class="go">
							<i @click="_selectAddr" class="iconfont icon-zuoyoujiantou"></i>
						</div>
					</div>

					<!-- 送达时间 -->
					<div class="delivery-time">
						<div class="delivery-content">
							<i class="iconfonts icon-time" style="color: #0089dc"></i>
							<span class="arrive">送达时间</span>
							<span class="time">预计:  20分钟</span>
						</div>
					</div>

					<!-- 支付方式 -->
					<div class="pay-way" @click.stop.prevent="payWay">
						<div class="pay-content">
							<span class="text">支付方式</span>
							<span class="online">在线支付</span>
						</div>
					</div>

					<!-- 所购商品详情组件 -->
					<buy-shop :orders="orders"></buy-shop>
		
				</div>
			</div>
			
			<!-- 地址信息 -->
			<div v-if="showUser" class="address-info">
				<span class="address">{{addr.address}}</span>
			</div>

			<!-- 提交订单 -->
			<div class="submit-orders">
				<div class="content">
					<div class="content-left">
						<div class="pay">待支付￥{{totalPrice}}</div>
						<div class="reduce">已优惠￥0</div>
					</div>

					<div @click="submitOrder" class="content-right">
						<div class="submit">去支付</div>
					</div>
				</div>
			</div>

			<!-- 地址组件 -->
			<user-address @update="_getUserAddress" @delete="_getUserAddress" @selectAddr="_drop" :address="address" ref="userAddr"></user-address>
		</div>
	</transition>
</template>

<script>
  import BScroll from 'better-scroll';
  import userAddress from '../address/address';
  import back from '../back/back';
  import buyShop from '../buyShop/buyShop';

  const TITLE = '确认订单';

  export default {
	props: {
	  orders: {
	  	type: Array,
	  	default() {
	  	  return [];
	  	}
	  },
	  totalPrice: {
	  	type: Number
	  }
	},
	filters: {
	  _switch(sex) {
        return sex === 1 ? '先生' : '女士';
      }
	},
	data() {
	  return {
	    showOrders: false,
	    scrollY: 0,
	    topTitle: TITLE,
  	  	address: [],
  	  	addr: [],
  	  	arr: [],
  	  	prepay_id: '',
  	  	paySign: '',
  	  	appId: '',
  	  	timeStamp: '',
  	  	nonceStr: '',
  	  	packageStr: '',
  	  	signType: '',
  	  	orderCode: ''
	  };
	},
	// 获取用户的地址信息
	created() {
	  this._getUserAddress();
	},
	activated() {
      this._getUserAddress();
	},
	computed: {
	  showUser() {
	  	// 判断address是不是空数组
	  	if (this.address.length == 0 || this.addr.length == 0) {
	  	  return false;
	  	} else {
	  	  return true;
	  	}
	  },
	  showAddr() {
	  	if (!this.address) {
	  	  return false;
	  	}

	  	if (this.scrollY >= 55) {
	  	  return true;
	  	}
	  	return false;
	  }
	},
	methods: {
	  pay() {
	  	let ua = window.navigator.userAgent.toLowerCase(); 
	    if (ua.match(/MicroMessenger/i) == 'micromessenger') { 
	    	if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent) || /BlackBerry/i.test(navigator.userAgent) || /IEMobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) { 
	    		this.$http.post("/store/wxpay/jspay", 
	    		{
	    		  goodsArray: this.arr,
		      	  address: this.addr, // 用户信息
		      	  totalPrice: this.totalPrice // 总价
	    		},
		        {
		          "X-Requested-With": "XMLHttpRequest"
		        },
		        {
		          emulateJSON: true
		        }).then((res) => {

	    		  if(res.body.resultCode == 'SUCCESS'){
		        		this.appId = res.body.appId;
		        		this.paySign = res.body.paySign;
		        		this.timeStamp = res.body.timeStamp;
		        		this.nonceStr = res.body.nonceStr;
		        		this.packageStr = res.body.packageStr;
		        		this.signType = res.body.signType;
		        		this.orderCode = res.body.orderCode;
		                this.callpay();
		            } else {
		            	alert("统一下单失败");
		            }
	    		});
	    	} else { 
	    		alert("请使用移动端微信打开支付"); 
	    	}
	    } else { 
	       alert("请使用移动端微信打开支付"); 
	    }
	  },
	  onBridgeReady() {
	  	let _this = this;
	  	WeixinJSBridge.invoke('getBrandWCPayRequest', {
                 "appId": this.appId,    				//公众号名称，由商户传入     
                 "timeStamp": this.timeStamp,         //时间戳，自1970年以来的秒数     
                 "nonceStr": this.nonceStr, 			//随机串     
                 "package": this.packageStr,     
                 "signType": this.signType,         //微信签名方式：     
                 "paySign": this.paySign    		//微信签名 
             },function(res){

		       	 if (res.err_msg == "get_brand_wcpay_request:ok" ){
		           window.location.replace("/store/order/success?orderCode=" + _this.orderCode);
		           alert('支付成功');
		         } else if (res.err_msg == "get_brand_wcpay_request:cancel"){
		            alert('支付取消');	     
		            _this.$http.post('/store/order/deleteOrder',
		            	{
		            		orderCode: _this.orderCode
		            	},
				        {
				          "X-Requested-With": "XMLHttpRequest"
				        },
				        {
				          emulateJSON: true
				        });
		         } else if (res.err_msg == "get_brand_wcpay_request:fail" ){
		            alert('支付失败');
		         } //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
	        }
        );
	  },
	  callpay() {
	  	if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            this.onBridgeReady();
        }
	  },
	  _getUserAddress() {
          this.$http.get('/store/address/selectUserAddress').then((res) => {
	      this.address = res.body.address;
	      this.addr = this.address[0];
	  	});
	  },
      show() {
	    this.showOrders = true;
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.goodsList, {
  	        probeType: 2,
  	        click: true
          });

          // 获取scrollTop值即滚动距离
         this.scroll.on('scroll', (pos) => {
           this.scrollY = Math.abs(Math.round(pos.y));
          });
        });
      },
      _selectAddr() {
      	this.$refs.userAddr.show();
      },
      _drop(addr) {
        this.addr = addr;
      },
      _back(bool) {
        this.showOrders = bool;
      },
      payWay() {
      	this.payShow = true;
      },
      // 提交订单信息到后台
      submitOrder() {
      	if (this.address.length == 0 || this.addr.length == 0) {
      	  alert('请填写地址信息！');
      	  return;
      	}

      	this.orders.forEach((o, i) => {
      	  let s = {};
      	  s['id'] = o.id;
      	  s['count'] = o.count;
      	  this.arr[i] = s;
      	});

      	// 支付
      	this.pay();
      }
	},
	components: {
	  userAddress,
	  back,
	  buyShop
	}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import 'orders.styl';
</style>