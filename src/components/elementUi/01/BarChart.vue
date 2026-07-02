<template>
    <!-- 1. 必须给一个有宽高的容器 -->
     <div class="box">
        <div ref="barChart" style="width: 80%; height: 300px;"></div>
     </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    mounted() {
      // 2. 初始化并配置初始图表
      this.barChart = echarts.init(this.$refs.barChart);
      this.barChart.setOption({
        xAxis: { 
          type: 'category', 
          data: ['周一', '周二', '周三'],
          name: '星期' // X轴说明
        },
        yAxis: { 
          type: 'value',
          name: '销量 (件)' // Y轴说明
        },
        series: [{ 
          type: 'bar', 
          data: [10, 20, 30] 
        }]
      });
  
      // 3. 10秒后切换图表数据
      setTimeout(() => {
        this.barChart.setOption({
          xAxis: { 
            type: 'category', 
            data: ['一月', '二月', '三月'],
            name: '月份' // 切换时更新 X轴说明
          },
          yAxis: { 
            type: 'value',
            name: '销售额 (万元)' // 切换时更新 Y轴说明
          },
          series: [{ 
            type: 'bar', 
            data: [50, 30, 80] 
          }]
        });
      }, 10000); // 10000毫秒 = 10秒
    },
    beforeDestroy() {
      // 4. 组件销毁时清理，防止内存泄漏
      if (this.barChart) {
        this.barChart.dispose();
      }
    }
  };
  </script>
<style scoped>
.box {
    background-color: aqua;
    width: 100%;
    height: 100%;
}
</style>