// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// 引入element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './test-global.css'
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
import slider from './components/input/slider.vue';
import line_gt from './components/elementUi/line_gt.vue';
import line_gt_2 from './components/elementUi/line_gt_2.vue';
// import ParentView from './components/elementUi/01/ParentView.vue';
// import TrajectoryLineGt from './components/elementUi/01/TrajectoryLineGt.vue';
// 甘特图和折线图组合
import ParentView from './components/elementUi/01/ParentView.vue';
// 柱状图
import BarChart from './components/elementUi/01/BarChart.vue';
// 两个div，默认显示第一个div，点击按钮后，将第二个div覆盖住第一个div
import TwoDiv from './components/elementUi/01/TwoDiv.vue';
// 学习element ui的官网
import OfficalWebSiteLearn from './components/elementUi/00-official-website/OfficalWebSiteLearn.vue';
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { OfficalWebSiteLearn },
  template: '<OfficalWebSiteLearn/>'
})
