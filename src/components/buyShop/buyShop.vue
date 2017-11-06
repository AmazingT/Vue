<template>
	<div class="shop-detial">
		<div class="store-name">
			<img src="static/img/logo.png" width="25" height="25" />
			<span class="text">榕会通</span>
		</div>

		<div class="store-goods">
			<ul>
				<li v-for="store in orders" class="price-content">
					<span class="name">{{store.name}}</span>
					<div class="price-count">
						<span class="count">×{{store.count}}</span>
						<span class="price">￥{{store.price}}</span>
					</div>
				</li>
			</ul>
		</div>

		<div class="delivery">
			<span class="delivery-price">配送费</span>
			<span class="price">￥4</span>
		</div>
	</div>
</template>

<script>
  export default {
  	props: {
  	  orders: {
  	  	type: Array,
        default() {
  	  	  return [];
        }
  	  }
  	}
  };	
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'buyShop.styl';
</style>