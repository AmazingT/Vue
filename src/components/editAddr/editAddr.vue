<template>
	<div class="addAddr" v-show="newAddr">
		<!-- 返回 -->
		<back :back="newAddr" :top-title="topTitle" @goBack="_back"></back>

		<div class="addAddr-wrapper">
			<div class="addAddr-content">
				<ul>
					<li class="list">
						<div class="addAddr-left">联系人</div>
						<div class="addAddr-right connect">
							<div class="name">
								<input v-model="addr.name" type="text" placeholder="收货人姓名" />
							</div>
							<div class="select">
								<div class="sex" @click="select(1)">
									<span :class="{'active':selectSex===1}" class="iconfont icon-gou"></span>
									<span class="text">先生</span>
								</div>
								<div class="sex" @click="select(2)">
									<span :class="{'active':selectSex===2}" class="iconfont icon-gou"></span>
									<span class="text">女士</span>
								</div>
							</div>
						</div>
					</li>
					<li class="list">
						<div class="addAddr-left">联系电话</div>
						<div class="addAddr-right">
							<input v-model="addr.phone" type="text" placeholder="收货人电话" />
						</div>
					</li>
					<li class="list">
						<div class="addAddr-left">送货地址</div>
						<div class="addAddr-right">
							<input v-model="addr.address" type="text" placeholder="详细地址" />
						</div>
					</li>
				</ul>
        
        <!-- 删除 -->
        <div @click="del" class="del">删除</div>
				<!-- 确定 -->
				<div @click="check" class="confirm">确定</div>
			</div>
		</div>

		<!-- 提示信息 -->
		<transition name="fade">
			<div class="tips" v-show="tipShow">
				<div class="content">{{message}}</div>
				<div @click="_confirm" class="ok">确定</div>
			</div>
		</transition>

    <!-- 删除提示信息 -->
    <transition name="fa">
      <div class="delete" v-show="cancleBox">
        <div class="del-top">
          <div class="title">删除地址</div>
          <div class="con">确定删除该收获地址吗？</div>
        </div>
        <div class="del-bottom">
          <div @click="cancle" class="cancle">取消</div>
          <div @click="yes" class="yes">确定</div>
        </div>
      </div>
    </transition>

		<transition name="fade">
			<div class="mask" v-show="cancleBox"></div>
		</transition>
	</div>
</template>

<script>
  import back from '../back/back';

  const TITLE = '修改地址';

  export default {
  	props: ['addrInfo', 'index'],
  	data() {
  	  return {
  	  	newAddr: false,
  	  	selectSex: null,
  	  	topTitle: TITLE,
  	  	addr: {
          id: '',
          name: '',
          sex: '',
          phone: '',
          address: ''
        },
  	  	item: 0,
  	  	tipShow: false,
	  	  message: '',
        cancleBox: false
  	  };
  	},
    methods: {
      show() {
      	this.newAddr = true;
      	this.addr = [];
      },
      checkName(str) {
        let len = str.length;
        if (+len > 4) {
          return false;
        }
        return true;
      },
      checkPhone(str) {
        let reg = /^1\d{10}$/;
        if (reg.test(str)) {
          return true;
        } else {
          return false;
        }
      },
      // 删除地址
      del() {
        this.cancleBox = true;
      },
      // 取消删除
      cancle() {
        this.cancleBox = false;
      },
      // 确定删除
      yes() {
        // 发送删除的地址信息(数组下标)到后台
        this.$http.post('/store/address/insertUserAddress?action=delete',
        {
          id: this.addr.id
        },
        {
          "X-Requested-With": "XMLHttpRequest"
        },
        {
          emulateJSON: true
        }).then((res) => {
          // 可以返回删除后的地址信息
          this.$emit('deleteAddr');
          this.cancleBox = false;
          this.newAddr = false;
        });
      },
      check() { // 填写信息的校验
      	if (this.addr.name === '' || this.addr.name === void(0)) {
      	  this.message = '请填写联系人！';
      	  this.tipShow = true;
      	  return;
      	} else {
      	  if (!this.checkName(this.addr.name)) {
      	    this.message = '姓名格式有误！';
      	    this.tipShow = true;
      	    return;
      	  }
      	}

      	if (this.selectSex === null) {
      	  this.message = '请选择性别！';
      	  this.tipShow = true;
      	  return;
      	} else {
          this.addr.sex = this.selectSex;
        }

      	if (this.addr.phone === '' || this.addr.phone === void(0)) {
      	  this.message = '请填写联系电话！';
      	  this.tipShow = true;
      	  return;
      	} else {
      	  if (!this.checkPhone(this.addr.phone)) {
            this.message = '电话格式有误！';
            this.tipShow = true;
            return;
      	  }
      	}
      	if (this.addr.address === '' || this.addr.address === void(0)) {
      	  this.message = '请填写送货地址！';
      	  this.tipShow = true;
      	  return;
      	}

      	// 用户修改地址通过ajax发送到后台
      	this.$http.post('/store/address/insertUserAddress?action=update', 
        {
          id: this.addr.id,
      	  name: this.addr.name,
      	  sex: this.addr.sex,
      	  phone: this.addr.phone,
      	  address: this.addr.address
      	},
        {
          "X-Requested-With": "XMLHttpRequest"
        },
        {
          emulateJSON: true
        }).then((res) => {
      	  // success callback
          // 可以返回修改后的地址信息

      	  this.newAddr = false;
      	}, () => {
      	  // error callback
      	  console.log('失败回调！');
      	});
      },
      _confirm() {
	  	  this.tipShow = false;
	  },
      select(n) {
      	this.selectSex = n;
      },
      _back(bool) {
        this.newAddr = bool
      },
      _showAddr(index, sex, id) {
      	this.item = index;
        this.addr = this.addrInfo[this.item];
        this.addr.id = id;
        this.selectSex = sex;
        this.newAddr = true;
      }
    },
    components: {
      back
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'editAddr.styl';
</style>