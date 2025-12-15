// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// 引入element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import App from './App.vue'
import MyComponent from './mix/MyComponent.vue'
import HoverTreeMenus from './components/hover_tree_menus/HoverTreeMenus.vue'
import elSelect from './components/elementUi/elSelect.vue'
import elTable from './components/elementUi/elTable.vue'
import elTable2 from './components/elementUi/elTable2.vue'
import simpleForm from './components/elementUi/simpleForm.vue'
import ExampleTable from './components/elementUi/ExampleTable.vue';
import LineManager from './components/elementUi/组合/LineManager.vue';
import PngUploader from './components/dynamicLoadPng/PngUploader.vue';
import ShowImg from './components/dynamicLoadPng/ShowImg.vue';
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { ShowImg },
  template: '<ShowImg/>'
})
