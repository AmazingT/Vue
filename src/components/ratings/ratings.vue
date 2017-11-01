<template>
  <div class="ratings" ref="ratings"><!-- 外层滚动容器,高度屏幕高度 -->
  	<div class="ratings-content"><!-- 内层滚动内容,超出外层可以滚动 -->
		<!-- 评分区 -->
		<div class="overview">
			<!-- 左侧综合评分 -->
			<div class="overview-left">
				<h1 class="score">{{seller.score}}</h1>
				<div class="title">综合评分</div>
				<div class="rank">高于周边商家{{seller.rankRate}}%</div>
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
					<star :size="36" :score="seller.foodScore"></star>
					<span class="score">{{seller.foodScore}}</span>
				</div>
				<div class="delivery-wrapper">
					<span class="title">送达时间</span>
					<span class="delivery">{{seller.deliveryTime}}分钟</span>
				</div>
			</div>
		</div>

		<!-- 评论区 分隔 -->
		<split></split>
		
		<!-- 评论区 选项 -->
		<ratingselect @ratingType="_select" @toggleContent="_toggle" :only-content="onlyContent" :ratings="ratings" :select-type="selectType"></ratingselect>

		<!-- 评论区 评论 -->
		<div class="rating-wrapper">
			<ul>
				<li v-show="needShow(rating.rateType, rating.text)" v-for="rating in ratings" class="rating-item">
					<!-- 左侧头像 -->
					<div class="avatar">
						<img width="28" height="28px" :src="rating.avatar" alt="">
					</div>

					<!-- 右侧内容 -->
					<div class="content">
						<!-- 用户名 -->
						<h1 class="name">{{rating.username}}</h1>
						<!-- 星级评分 -->
						<div class="star-wrapper">
							<star :size="24" :score="rating.score"></star>
							<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
						</div>
						<!-- 评论内容 -->
						<p class="text">{{rating.text}}</p>
						<!-- 推荐 -->
						<div class="recommend" v-show="rating.recommend && rating.recommend.length">
							<span class="iconfont icon-up"></span>
							<span class="items" v-for="item in rating.recommend">{{item}}</span>
						</div>
						<!-- 评论时间 -->
						<div class="time">{{rating.rateTime | dateFormat}}</div>
					</div>
				</li>
			</ul>
		</div>

  	</div>
  </div>
</template>

<script>
import star from '../star/star';
import split from '../split/split';
import BScroll from 'better-scroll';
import {dateFormat} from '../../common/js/date.js';
import ratingselect from '../ratingselect/ratingselect';

  // const POSITIVE = 0;
  // const NEGATIVE = 1;
  const ALL = 2;
  const ERR_OK = 0; // 成功

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: false,
        refresh: false
      };
    },
    mounted() {
      // 获取ratings
      this.getRatings();
    },
    filters: {
      dateFormat(time) {
        let date = new Date(time);
        // js模块化编程(日期格式化写成一个模块)
        return dateFormat(date, 'yyyy-MM-dd hh:mm');
      }
    },
    methods: {
      // 获取ratings
      getRatings() {
        this.$http.get('/api/ratings').then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            this.ratings = response.data; // DOM未更新
            this.$nextTick(() => {
              if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.ratings, {
                  click: true
                });
              } else {
                this.scroll.refresh();
              }
            });
          }
        });
      },
      _select(type) {
        this.selectType = type;
        // 获取评价数据后重新计算滚动页的高度即刷新BScroll
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      _toggle(onlyContent) {
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow(type, text) {
        // 只看有内容的评价
        if (this.onlyContent && !text) {
          return false;
        }
        // 点击全部评价
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      }
    },
    components: {
      star,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'ratings.styl';
</style>




















