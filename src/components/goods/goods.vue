<template>
    <div class="goods">
		<!-- left menu -->
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<!-- flex布局 -->
				<li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index, $event)">
					<span class="text border-1px">
						<!-- 图标 -->
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]">
						</span>
						{{item.name}}
					</span>
				</li>
			</ul>
		</div>

		<!-- right foods contents -->
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<!-- 每个li对应左侧的每个item -->
				<li v-for="item in goods"  class="food-list food-list-hook">
					<!-- food classify -->
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item border-1px">
							<!-- left food image -->
							<div class="icon">
								<img width="57" height="57" :src="food.icon"/>
							</div>
							<!-- right content -->
							<div class="content">
								<!-- food name -->
								<h2 class="name">{{food.name}}</h2>
								<!-- food description -->
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<!-- price -->
								<div class="price">
									<span class="now">{{food.price | priceFormat}}</span><span class="old">{{food.oldPrice | priceFormat}}</span>
								</div>
								
								<!-- 数量加减组件 -->
								<div class="cartControl-wrapper">
									<!-- v-on:监听子组件的自定义事件="自己的事件处理" -->
									<cartControl @cartAdd="_drop" :food="food"></cartControl>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>

		<!-- bottom shop cart(购物车组件) -->
		<!-- deliveryPrice:配送费; minPrice:起送费 -->
		<shopCart ref="shopCart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopCart>
	</div>
</template>

<script>
  import BScroll from 'better-scroll';
  import shopCart from '../shopCart/shopCart';
  import cartControl from '../cartControl/cartControl';

  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    filters: {
      priceFormat: function(val) {
        if (!val) return '';
        return '￥' + val;
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [], // 存放左侧每个list的高度
        scrollY: 0
      };
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() { // 提取所有被选择的foods
        let foods = [];
         // 在cartControl组件中选择food时,添加了food的count属性
         // 遍历所有的foods,把food.count>0(即选中的food)的存入foods数组
          this.goods.forEach((good) => {
            good.foods.forEach((food) => {
              if (food.count) {
                foods.push(food);
              }
            });
          });
        return foods;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      // ajax获取json数据
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // console.log(this.goods);
          // $nextTick 对未来更新后的视图进行操作(对DOM的一些计算操作)
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      selectMenu(index, event) {
        if (!event._constructed) {
          return;
        }
        // 左侧点击跳到对应的food处
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        // 获取点击item对应的food的DOM元素
        let el = foodList[index];
        // 调用better-scroll的scrollToElement方法
        this.foodScroll.scrollToElement(el, 500);
        // console.log(index);
      },
      _drop(data) {
        /* 调用子组件的drop方法并把cartControl组件的target属性传过去
           组件和自身DOM元素获取用ref="el"
           获得子组件的DOM并调用其drop方法
           在数据经过赋值操作改变值时，DOM并未马上更新。此时获取的是原来的数据。
           体验优化,异步执行下落动画
        */
        this.$nextTick(() => {
          this.$refs.shopCart.drop(data);
        });
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        });
        // 获取scrollTop值即滚动距离
        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
       // console.log(pos.y);
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
       // console.log(height);
          this.listHeight.push(height);
        }
      }
    },
    components: {
      shopCart,
      cartControl
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'goods.styl';
</style>