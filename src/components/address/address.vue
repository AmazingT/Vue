<template>
	<transition name="move">
		<div class="user-address" v-show="showAddr">
			<!-- 返回 -->
			<back :back="showAddr" :top-title="topTitle" @goBack="_back"></back>

			<div class="address-content">
				<!-- address list -->
				<ul v-show="address.length !== 0">
					<li v-for="(item, $index) in address" class="addrList">
						<div class="select" @click="select($index)">
							<i :class="{'active':activeType===$index}" class="iconfont icon-gou"></i>
						</div>
						<div class="user-right">
							<div class="user-info">
								<span class="name">{{item.name}}</span>
								<span class="sex">{{item.sex | _switch}}</span>
								<span class="tell">{{item.phone}}</span>
							</div>
							
							<div class="addr">{{item.address}}</div>
						</div>

						<div @click="_newAddr($index, item.sex, item.id)" class="edit">
							<i class="iconfonts icon-edit"></i>
						</div>
					</li>
				</ul>

				<!-- no address -->
				<div v-show="address.length === 0" class="no-address">客官您还没有地址，点击底部新增地址！</div>
			</div>

			<!-- add address -->
			<div @click="newAddr" class="add-address">
				<i class="iconfont icon-jia"></i>
				<span class="text">新增地址</span>
			</div>

			<!-- 新增地址 -->
			<addAddr ref="newAddress" @updateAddr="_change" :addr-info="address"></addAddr>
      <!-- 修改地址 -->
      <editAddr ref="editAddress" @deleteAddr="_drop" :addr-info="address"></editAddr>
		</div>
	</transition>
</template>

<script>
  import addAddr from '../addAddr/addAddr';
  import editAddr from '../editAddr/editAddr';
  import back from '../back/back';

  const TITLE = '我的地址';

  export default {
    props: {
      address: {
      	type: Array,
      	default() {
          return [];
        }
      }
    },
    filters: {
      _switch(sex) {
        return sex === 1 ? '先生' : '女士';
      }
    },
    data() {
      return {
        showAddr: false,
        activeType: 0,
        topTitle: TITLE
      };
    },
    methods: {
      show() {
        this.showAddr = true;
      },
      _drop() {
        this.$emit('delete');
      },
      newAddr() {
      	this.$refs.newAddress.show();
      },
      _newAddr(index, sex, id) {
        this.$refs.editAddress._showAddr(index, sex, id);
      },
      select(index) {
      	this.activeType = index;
      	this.$emit('selectAddr', this.address[index]);
      },
      _back(bool) {
        this.showAddr = bool
      },
      _change() {
        this.$emit('update');
      }
    },
    components: {
      addAddr,
      back,
      editAddr
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'address.styl';
</style>













