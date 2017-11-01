<template>
  <!-- header area -->
  <div class="header">
    <!-- top header content -->
    <div class="content-wrapper">
      <!-- left avatar(头像) -->
      <div class="avatar">
        <img :src="seller.avatar" alt="" width="64" height="64" />
      </div>
      <!-- right description -->
      <div class="content">
        <!-- title -->
        <div class="trade">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <!-- description -->
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!-- supports(活动) -->
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <!-- supports length(活动数) -->
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon iconfont icon-zuoyoujiantou"></i>
      </div>
    </div>

    <!-- bottom bulletin(公告) content -->
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon iconfont icon-zuoyoujiantou"></i>
    </div>

    <!-- background image -->
    <div class="background">
      <img :src="seller.avatar" alt="" width="100%" height="100%"/>
    </div>

    <!-- detail page(弹出层) -->
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <!-- 星星数(根据size和score决定) 多处使用 封装成组件 -->
            <!-- size和score传递给子组件 -->
            <!-- 为了灵活性不要把样式写在star组件里面,样式的定义可以在外层加上一个
            wrapper来控制组件的样式 -->
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <!-- CSS flex布局 -->
            <div class="lineText">
              <line-text :text="t1"></line-text>
            </div>

            <!-- supports list -->
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item,index) in seller.supports">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>

            <!-- CSS flex布局 -->
            <div class="lineText">
              <line-text :text="t2"></line-text>
            </div>

            <!-- 商家公告 -->
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="iconfont icon-cha"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import star from '../star/star';
  import line from '../line/line';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false,
        t1: '优惠信息',
        t2: '商家公告'
      };
    },
    methods: {
      showDetail() {
        this.detailShow = true;
      },
      hideDetail() {
        this.detailShow = false;
      }
    },
    created() {
      // 公告处根据后台来显示不同的图片
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    // 使用组件之前必须先导入并注册组件
    components: {
      star: star,
      lineText: line
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'header.styl';
</style>
