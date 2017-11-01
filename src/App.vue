<template>
  <div>
    <!-- header area -->
    <v-header :seller="seller"></v-header>
    <!-- tab area -->
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>

      <div class="tab-item">
        <router-link to="/userinfo">我的</router-link>
      </div>
    </div>
    <!-- content area -->
    <div class="content">
      <!-- 缓存组件(vue生命周期不会被重新加载) -->
      <keep-alive>
        <router-view :seller="seller"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import header from './components/header/header';
  import {urlParse} from './common/js/util';
  
  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParm = urlParse();
            // console.log(queryParm);
            return queryParm.id;
          })()
        }
      };
    },
    mounted() {
      this.getSeller();
    },
    methods: {
      getSeller() {
        this.$http.get('/store/seller/getSellerInfo?id=' + this.seller.id).then((response) => {
          response = response.body;
          this.seller = Object.assign({}, this.seller, response.seller);
        });
      }
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/mixin.styl";
  @import "common/stylus/font.styl";
  @import "common/stylus/fonts.styl";

  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    /*border: 1px solid rgba(7,17,27,0.1);*/
    border-1px(rgba(7, 17, 27, 0.1));
  }

  .tab .tab-item {
    flex: 1;
    text-align: center;
  }

  .tab .tab-item a {
    display: block;
    font-size: 14px;
    color: rgb(77, 85, 93);
  }

  .tab .tab-item .active {
    color: rgb(240, 20, 20);
  }
</style>
