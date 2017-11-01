<template>
	<!-- 
	  商品评价组件;商品评价页(ratings)和商品详情页(food)的评价组件结构一致
	  内容不一样;详情页作为其父组件可以通过传递值给评价组件来改变评价组件的默认内容
	 -->
	<div class="ratingselect">

		<!-- 评价类型 -->
		<div class="rating-type">
			<span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span>
			</span>
			<span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span>
			</span>
			<span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span>
			</span>
		</div>

		<!-- 只看有内容 -->
		<div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
			<span class="iconfont icon-gou"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>	
</template>

<script>
  const POSITIVE = 0; // 满意评价
  const NEGATIVE = 1; // 不满意评价
  const ALL = 2; // 所有评价

  export default {
    // 组件内(子组件)不能修改由外层(父组件)传来的数据;不能修改props内部的数据
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    // 组件内(子组件)不能修改由外层(父组件)传来的数据;不能修改props内部的数据
    data() {
      return {
        st: this.selectType,
        oc: this.onlyContent
      };
    },
    computed: {
      // 过滤所有评价,得到positive的评价
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      // 过滤所有评价,得到negative的评价
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      // 组件内(子组件)不能修改由外层(父组件)传来的数据;不能修改props内部的数据
      select(type, event) {
        if (!event._constructed) {
          return;
        }
        this.st = type;
        this.$emit('ratingType', this.st);
      },
      toggleContent(event) {
        if (!event._constructed) {
          return;
        }
        this.oc = !this.oc;
        this.$emit('toggleContent', this.oc);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'ratingselect.styl';
</style>



















