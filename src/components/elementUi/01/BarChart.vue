<template>
    <div class="box">
      <div ref="barChart" style="width: 80%; height: 300px;"></div>
      <div class="btn-wrapper">
        <el-button>按钮</el-button>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    mounted() {
      this.barChart = echarts.init(this.$refs.barChart);
      this.barChart.setOption({
        // 1. 提示框配置（鼠标悬停/点击柱子时显示）
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // 鼠标悬停时显示阴影背景
          }
        },
        // 2. X轴配置
        xAxis: { 
          type: 'category', 
          data: ['周一', '周二', '周三'],
          name: '星期',
          axisLabel: {
            color: 'red' // X轴字体变红
          }
        },
        // 3. Y轴配置
        yAxis: { 
          type: 'value',
          name: '销量 (件)',
          axisLabel: {
            color: 'red' // Y轴字体变红
          }
        },
        // 4. 数据系列（已补全 data 数组）
        series: [{ 
          type: 'bar', 
          data: [10, 20, 30] 
        }]
      });
  
      // 5. 10秒后切换图表数据
      setTimeout(() => {
        this.barChart.setOption({
          xAxis: { 
            type: 'category', 
            data: ['一月', '二月', '三月'],
            name: '月份',
            axisLabel: { color: 'red' }
          },
          yAxis: { 
            type: 'value',
            name: '销售额 (万元)',
            axisLabel: { color: 'red' }
          },
          series: [{ 
            type: 'bar', 
            data: [50, 30, 80] // 已补全切换后的数据
          }]
        });
      }, 10000);
    },
    beforeDestroy() {
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .btn-wrapper {
    margin-top: 20px; 
  }
  </style>