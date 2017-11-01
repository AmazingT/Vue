<template>
	<div class="head">
		<div @click.stop.prevent="goBack" class="back">
			<i class="iconfont icon-zuoyoujiantou"></i>
		</div>

		<div class="title">{{topTitle}}</div>
	</div>
</template>

<script>
  export default {
  	props: {
      back: Boolean,
      topTitle: String
  	},
  	methods: {
      goBack() {
        // this.back = false;
        this.$emit('goBack', false);
      }
  	}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus"> 
  @import 'back.styl';
</style>