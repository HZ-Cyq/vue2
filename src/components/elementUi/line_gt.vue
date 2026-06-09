<template>
    <div class="chart-container">
      <!-- 上方：进攻弹时间-高度折线图 -->
      <div ref="lineChartRef" class="chart-box"></div>
      
      <!-- 下方：拦截阵地甘特图 -->
      <div ref="ganttChartRef" class="chart-box"></div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    name: 'MissileInterceptChart',
    props: {
      chartData: {
        type: Object,
        default: () => ({
          "data": [
            {
              "sampleIndex": 1,
              "sample_base_info": "",
              "traj": [
                ["traj_id", "time", "altitude"],
                ["TSPI_MISSILE_10001", 1.0, 5.0],
                ["TSPI_MISSILE_10001", 700.0, 6.0],
                ["TSPI_MISSILE_10001", 1200.0, 15.0]
              ],
              "ljzd": {
                "GPI_LAUNCHER_1": {
                  "min_launch_time": 200, "max_launch_time": 300,
                  "min_intercept_time": 400, "max_intercept_time": 500,
                  "min_xj": 5, "max_xj": 6,
                  "min_intercept_height": 7, "max_intercept_height": 8
                },
                "GPI_LAUNCHER_2": {
                  "min_launch_time": 200, "max_launch_time": 300,
                  "min_intercept_time": 500, "max_intercept_time": 600,
                  "min_xj": 5, "max_xj": 6,
                  "min_intercept_height": 7, "max_intercept_height": 8
                }
              }
            }
          ]
        })
      }
    },
    data() {
      return {
        lineChart: null,
        ganttChart: null
      };
    },
    mounted() {
      this.initCharts();
      // 监听窗口大小变化，自适应图表
      window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
      // 销毁图表实例，防止内存泄漏
      if (this.lineChart) this.lineChart.dispose();
      if (this.ganttChart) this.ganttChart.dispose();
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      handleResize() {
        if (this.lineChart) this.lineChart.resize();
        if (this.ganttChart) this.ganttChart.resize();
      },
      initCharts() {
        if (!this.chartData || !this.chartData.data || !this.chartData.data.length) return;
        const data = this.chartData.data[0];
  
        // 1. 处理折线图数据 (去掉表头)
        const lineData = data.traj.slice(1).map(item => [item[1], item[2]]); 
        
        // 2. 处理甘特图数据
        const ganttCategories = Object.keys(data.ljzd);
        const ganttSeriesData = [];
        
        ganttCategories.forEach((name, index) => {
          const info = data.ljzd[name];
          // 块1: 发射时间窗口
          ganttSeriesData.push({
            name: '发射窗口',
            value: [index, info.min_launch_time, info.max_launch_time, '发射窗口'],
            itemStyle: { color: '#5470c6' }
          });
          // 块2: 拦截时间窗口
          ganttSeriesData.push({
            name: '拦截窗口',
            value: [index, info.min_intercept_time, info.max_intercept_time, '拦截窗口'],
            itemStyle: { color: '#91cc75' }
          });
        });
  
        // 计算全局时间范围，确保两个图表X轴绝对一致
        const allTimes = [
          ...lineData.map(d => d[0]),
          ...ganttSeriesData.map(d => d[1]),
          ...ganttSeriesData.map(d => d[2])
        ];
        const minTime = Math.min(...allTimes);
        const maxTime = Math.max(...allTimes);
  
        // 3. 配置上方折线图
        this.lineChart = echarts.init(this.$refs.lineChartRef);
        this.lineChart.setOption({
          title: { text: '进攻弹轨迹 (时间-高度)', left: 'center' },
          tooltip: { trigger: 'axis' },
          grid: { left: '10%', right: '5%', bottom: '15%' }, // 底部留空给 dataZoom
          xAxis: { 
            type: 'value', 
            name: '时间 (s)',
            min: minTime, 
            max: maxTime 
          },
          yAxis: { type: 'value', name: '高度' },
          dataZoom: [
            {
              type: 'slider',
              xAxisIndex: 0,
              bottom: 10,
              height: 20,
              startValue: minTime,
              endValue: maxTime,
              filterMode: 'none' // 关键：不过滤数据，只缩放视图
            },
            { type: 'inside', xAxisIndex: 0 } // 支持鼠标滚轮缩放
          ],
          series: [{
            type: 'line',
            data: lineData,
            smooth: true,
            markPoint: { data: [{ type: 'max', name: '最高点' }] }
          }]
        });
  
        // 4. 配置下方甘特图
        this.ganttChart = echarts.init(this.$refs.ganttChartRef);
        this.ganttChart.setOption({
          title: { text: '拦截阵地时间窗口', left: 'center' },
          tooltip: {
            formatter: (params) => {
              const d = params.value;
              return `${ganttCategories[d[0]]}<br/>${d[3]}: ${d[1]}s - ${d[2]}s`;
            }
          },
          grid: { left: '10%', right: '5%', bottom: '15%' },
          xAxis: { 
            type: 'value', 
            name: '时间 (s)',
            min: minTime, 
            max: maxTime 
          },
          yAxis: { 
            type: 'category', 
            data: ganttCategories,
            inverse: true // 让第一个阵地在最上面
          },
          dataZoom: [
            {
              type: 'slider',
              xAxisIndex: 0,
              bottom: 10,
              height: 20,
              startValue: minTime,
              endValue: maxTime,
              filterMode: 'none'
            },
            { type: 'inside', xAxisIndex: 0 }
          ],
          series: [{
            type: 'custom',
            renderItem: (params, api) => {
              const categoryIndex = api.value(0);
              const start = api.coord([api.value(1), categoryIndex]);
              const end = api.coord([api.value(2), categoryIndex]);
              const height = api.size([0, 1])[1] * 0.5; // 块的高度
  
              return {
                type: 'rect',
                shape: {
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                },
                style: api.style()
              };
            },
            encode: { x: [1, 2], y: 0 },
            data: ganttSeriesData
          }]
        });
  
        // 5. 核心：联动两个图表的 dataZoom
        echarts.connect([this.lineChart, this.ganttChart]);
      }
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .chart-box {
    width: 100%;
    height: 350px;
    border: 1px solid #eee;
    border-radius: 8px;
  }
  </style>