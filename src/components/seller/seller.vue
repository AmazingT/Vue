<template>
  <div class="seller" ref="seller">
  	<div class="seller-content">
  		<!-- 商家评分 -->
  		<div class="overview">
        <!-- 左侧综合评分 -->
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
        </div>

        <!-- 右侧星级评分 -->
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.goodsScore"></star>
            <span class="score">{{seller.goodsScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
  		<!-- 分隔 -->
  		<split></split>

  		<!-- 公告与活动 -->
      <div class="bulletin">
      	<h1 class="title">公告与活动</h1>
      	<div class="content-wrapper">
      		<p class="content">{{seller.bulletin}}</p>
      	</div>
      	<!-- supports list -->
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="(item,index) in seller.supports">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
      </div>
		
		<split></split>

		<!-- 商家实景 -->
		<div class="pics">
			<h1 class="title">商家实景</h1>
			<div class="pic-wrapper" ref="picWrpper"><!-- 内部图片横向滚动,外层warpper固定宽 -->
				<ul class="pic-list" ref="picList">
					<li class="pic-item" v-for="pic in seller.pics">
						<img :src="pic" width="120" height="90"/>
					</li>
				</ul>
			</div>
		</div>
		
		<split></split>

		<!-- 商家信息 -->
    <div class="info">
      <h1 class="title">商家信息</h1>
      <ul>
        <li class="info-item">{{seller.businessScope}}</li>
        <li class="info-item">{{seller.address}}</li>
        <li class="info-item">营业时间：{{seller.businessHours}}</li>
      </ul>
    </div>

  	</div>
  </div>
</template>

<script>
  import star from '../star/star';
  import split from '../split/split';
  import BScroll from 'better-scroll';
  
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    created() {
      // 公告处根据后台来显示不同的图片
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    watch: {
      'seller'() {
        this._initScroll();
        this._initPics();
      }
    },
    // 如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted
    mounted() {
      this._initScroll();
      this._initPics();
    },
    methods: {
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPics() {
        if (this.seller.pics) {
          // 计算ul的宽度(因为ul的宽度和外层div的宽度相等导致不能滚动)
          let picWidth = 120; // 每张图片宽度
          let margin = 6; // margin值
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrpper, {
                scrollX: true,
                eventPassthrough: 'vertical' // 垂直方向可以滚动
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      },
      // 收藏
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'seller.styl';
</style>








