<template>
  <div class="missile-visualization">
    <!-- 上部：进攻弹轨迹折线图 -->
    <div class="chart-container">
      <div class="chart-title">进攻弹轨迹（时间-高度）</div>
      <div ref="trajChartRef" class="chart"></div>
    </div>

    <!-- 下部：拦截阵地甘特图 -->
    <div class="chart-container">
      <div class="chart-title">拦截阵地时序</div>
      <div ref="ganttChartRef" class="chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'MissileVisualization',
  data() {
    return {
      trajChart: null,
      ganttChart: null,
      timeRange: { min: 0, max: 800 },

      // 数据
      data: [
        {
          sampleIndex: 1,
          sample_base_info: '',
          traj: [
            ['traj_id', 'time', 'altitude'],
            ['TSPI_MISSILE_10001', 1.0, 5.0],
            ['TSPI_MISSILE_10001', 100.0, 10.0],
            ['TSPI_MISSILE_10001', 200.0, 15.0],
            ['TSPI_MISSILE_10001', 300.0, 20.0],
            ['TSPI_MISSILE_10001', 400.0, 18.0],
            ['TSPI_MISSILE_10001', 500.0, 25.0],
            ['TSPI_MISSILE_10001', 600.0, 30.0],
            ['TSPI_MISSILE_10001', 700.0, 6.0]
          ],
          ljzd: {
            GPI_LAUNCHER_1: {
              min_launch_time: 200,
              max_launch_time: 300,
              min_intercept_time: 400,
              max_intercept_time: 500,
              min_xj: 5,
              max_xj: 6,
              min_intercept_height: 7,
              max_intercept_height: 8
            },
            GPI_LAUNCHER_2: {
              min_launch_time: 200,
              max_launch_time: 300,
              min_intercept_time: 500,
              max_intercept_time: 600,
              min_xj: 5,
              max_xj: 6,
              min_intercept_height: 7,
              max_intercept_height: 8
            }
          }
        }
      ]
    };
  },
  mounted() {
    this.calculateTimeRange();
    this.initCharts();
    this.renderCharts();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.trajChart) this.trajChart.dispose();
    if (this.ganttChart) this.ganttChart.dispose();
  },
  methods: {
    initCharts() {
      this.trajChart = echarts.init(this.$refs.trajChartRef);
      this.ganttChart = echarts.init(this.$refs.ganttChartRef);
    },

    handleResize() {
      if (this.trajChart) this.trajChart.resize();
      if (this.ganttChart) this.ganttChart.resize();
    },

    calculateTimeRange() {
      const sample = this.data[0];
      if (!sample) return;

      let minTime = Infinity;
      let maxTime = -Infinity;

      // 仅从轨迹数据计算时间范围
      if (sample.traj && sample.traj.length > 1) {
        for (let i = 1; i < sample.traj.length; i++) {
          const time = parseFloat(sample.traj[i][1]);
          if (!isNaN(time)) {
            minTime = Math.min(minTime, time);
            maxTime = Math.max(maxTime, time);
          }
        }
      }

      // 时间轴从0开始，最大值根据进攻弹最大时间
      this.timeRange.min = 0;
      this.timeRange.max = maxTime;
    },

    // 计算高度范围
    calculateAltitudeRange() {
      const sample = this.data[0];
      if (!sample || !sample.traj) return { min: 0, max: 100 };

      let minAlt = Infinity;
      let maxAlt = -Infinity;

      for (let i = 1; i < sample.traj.length; i++) {
        const alt = parseFloat(sample.traj[i][2]);
        if (!isNaN(alt)) {
          minAlt = Math.min(minAlt, alt);
          maxAlt = Math.max(maxAlt, alt);
        }
      }

      return { min: minAlt, max: maxAlt };
    },

    renderCharts() {
      this.renderTrajChart();
      this.renderGanttChart();

      // 添加同步的缩放功能
      const zoomOption = {
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0,
            throttle: 50
          }
        ]
      };

      this.trajChart.setOption(zoomOption);
      this.ganttChart.setOption(zoomOption);

      // 绑定滚轮同步缩放
      this.trajChart.getZr().on('mousewheel', params => {
        this.syncZoom('trajChart', params.wheelDelta);
      });
      this.ganttChart.getZr().on('mousewheel', params => {
        this.syncZoom('ganttChart', params.wheelDelta);
      });
    },

    syncZoom(source, delta) {
      const sourceChart = source === 'trajChart' ? this.trajChart : this.ganttChart;
      const targetChart = source === 'trajChart' ? this.ganttChart : this.trajChart;

      const options = sourceChart.getOption();
      const zoom = options.dataZoom[0];
      if (!zoom) return;

      const percentWidth = targetChart.getWidth();
      const range = zoom.end - zoom.start;
      const deltaPercent = (delta / 500) * range;

      let newStart = zoom.start - deltaPercent;
      let newEnd = zoom.end - deltaPercent;

      // 限制范围
      if (newStart < 0) {
        newStart = 0;
        newEnd = range;
      }
      if (newEnd > 100) {
        newEnd = 100;
        newStart = 100 - range;
      }

      targetChart.dispatchAction({
        type: 'dataZoom',
        xAxisIndex: 0,
        start: newStart,
        end: newEnd
      });
    },

    renderTrajChart() {
      const sample = this.data[0];
      if (!sample || !sample.traj) return;

      const times = [];
      const altitudes = [];
      const altitudeRange = this.calculateAltitudeRange();

      for (let i = 1; i < sample.traj.length; i++) {
        const row = sample.traj[i];
        times.push(parseFloat(row[1]));
        altitudes.push(parseFloat(row[2]));
      }

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            const p = params[0];
            return `时间: ${p.value[0]}<br/>高度: ${p.value[1]}`;
          }
        },
        grid: {
          left: '100',
          right: '30',
          top: '30',
          bottom: '40'
        },
        xAxis: {
          type: 'value',
          name: '时间',
          nameLocation: 'center',
          nameGap: 25,
          min: this.timeRange.min,
          max: this.timeRange.max,
          splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } }
        },
        yAxis: {
          type: 'value',
          name: '高度',
          nameLocation: 'center',
          nameGap: 40,
          min: altitudeRange.min,
          max: altitudeRange.max,
          splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } }
        },
        series: [
          {
            type: 'line',
            data: times.map((t, i) => [t, altitudes[i]]),
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: { color: '#ff6b6b', width: 3 },
            itemStyle: { color: '#ff6b6b' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255,107,107,0.3)' },
                { offset: 1, color: 'rgba(255,107,107,0.05)' }
              ])
            }
          }
        ]
      };

      this.trajChart.setOption(option);
    },

    renderGanttChart() {
      const sample = this.data[0];
      if (!sample || !sample.ljzd) return;

      const launcherNames = Object.keys(sample.ljzd);
      const categories = [];
      const interceptItems = [];
      const launchItems = [];

      launcherNames.forEach((name, index) => {
        const launcher = sample.ljzd[name];

        categories.push(name);

        interceptItems.push({
          name: name,
          value: [index, launcher.min_intercept_time, launcher.max_intercept_time],
          itemStyle: { color: '#4ecdc4' }
        });

        launchItems.push({
          name: name,
          value: [index + 0.3, launcher.min_launch_time, launcher.max_launch_time],
          itemStyle: { color: '#45b7d1' }
        });
      });

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: params => {
            const name = params.name;
            const type = params.seriesName === '拦截时间' ? '拦截' : '发射';
            return `<b>${name}</b><br/>类型: ${type}<br/>开始: ${params.value[1]}<br/>结束: ${params.value[2]}`;
          }
        },
        legend: {
          data: ['拦截时间', '发射时间'],
          right: 20,
          bottom: 10
        },
        grid: {
          left: '100',
          right: '30',
          top: '20',
          bottom: '50'
        },
        xAxis: {
          type: 'value',
          name: '时间',
          nameLocation: 'center',
          nameGap: 25,
          min: this.timeRange.min,
          max: this.timeRange.max,
          splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } }
        },
        yAxis: {
          type: 'category',
          data: categories,
          inverse: true,
          axisLabel: {
            color: '#333',
            fontWeight: 'bold',
            fontSize: 10
          },
          axisLine: { lineStyle: { color: '#ccc' } },
          axisTooltip: {
            trigger: 'item',
            formatter: params => params.name
          }
        },
        series: [
          {
            name: '拦截时间',
            type: 'custom',
            color: '#4ecdc4',
            renderItem: (params, api) => {
              const categoryIndex = api.value(0);
              const start = api.coord([api.value(1), categoryIndex]);
              const end = api.coord([api.value(2), categoryIndex]);
              const height = 16;
              return {
                type: 'rect',
                shape: {
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                },
                style: api.style(),
                styleEmphasis: { shadowBlur: 10, shadowColor: '#333' }
              };
            },
            encode: { x: [1, 2], y: 0 },
            data: interceptItems
          },
          {
            name: '发射时间',
            type: 'custom',
            color: '#45b7d1',
            renderItem: (params, api) => {
              const categoryIndex = api.value(0);
              const start = api.coord([api.value(1), categoryIndex]);
              const end = api.coord([api.value(2), categoryIndex]);
              const height = 16;
              return {
                type: 'rect',
                shape: {
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                },
                style: api.style(),
                styleEmphasis: { shadowBlur: 10, shadowColor: '#333' }
              };
            },
            encode: { x: [1, 2], y: 0 },
            data: launchItems
          }
        ]
      };

      this.ganttChart.setOption(option);
    }
  }
};
</script>

<style scoped>
.missile-visualization {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  padding-left: 5px;
  border-left: 3px solid #4ecdc4;
}

.chart {
  width: 100%;
  height: 200px;
}
</style>
