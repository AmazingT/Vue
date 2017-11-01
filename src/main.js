// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from './components/goods/goods';
import userinfo from './components/userinfo/userinfo';
import seller from './components/seller/seller';


Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [{
  path: '/',
  redirect: '/goods'
}, {
  path: '/goods',
  component: goods
}, {
  path: '/seller',
  component: seller
  
}, {
  path: '/userinfo',
  component: userinfo
}];

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});