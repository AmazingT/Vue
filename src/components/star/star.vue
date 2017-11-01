<template>
	<div class="star" :class="starType">
		<!-- 4.2分 => 亮4熄1 itmeClasses=['on','on','on','on','off']-->
		<span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"
		track-by="$index"></span>
	</div>
</template>

<script>
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

  export default {
    // 接受父组件header.vue传过来的size和score值
    props: {
      size: {
        type: Number
      },
      score: { // 4.2
        type: Number
      }
    },
    computed: {
      starType() {
        return 'star-' + this.size; // 拼接className
      },
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score * 2) / 2; // 取整和取半
        let hasDecimal = score % 1 !== 0; // 是否是小数
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'star.styl';
</style>