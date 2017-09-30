<template>
  <div class="cartControl">
  	<transition name="move">
  		 <div class="cart-decrease" v-show="food.count>0" @click="descreaseCart">
  		 	<span class="inner iconfont icon-jian"></span>
  		 </div>
  	</transition>

  	<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
  	<div class="cart-add iconfont icon-jia" @click="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          /* 由于Javascript的限制，Vue不能自动检测以下变动的数组。
           * 当你利用索引直接设置一个项时，vue不会为我们自动更新。
           * 当你修改数组的长度时，vue不会为我们自动更新。
          */
          // 避开Vue不能检测属性被添加的限制。新添加的属性
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        // 添加事件,用于小球动画
        this.$emit('cartAdd', event.target);
      },
      descreaseCart() {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "cartControl.styl";
</style>