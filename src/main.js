// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import MyComponent from './mix/MyComponent.vue'
import HoverTreeMenus from './components/hover_tree_menus/HoverTreeMenus.vue'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { HoverTreeMenus },
  template: '<HoverTreeMenus/>'
})
