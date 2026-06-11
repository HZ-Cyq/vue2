<template>
  <div class="missile-visualization">
    <!-- 下拉框 -->
    <div class="select-group">
      <select v-model="selectedIndex">
        <option v-for="(item, index) in data" :key="index" :value="index">
          样本 {{ item.sampleIndex }}（{{ item.trajectory_name }}）
        </option>
      </select>
    </div>

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
  name: 'TrajectoryLineGt',
  data() {
    return {
      trajChart: null,
      ganttChart: null,
      timeRange: { min: 0, max: 800 },
      isSyncing: false,
      selectedIndex: 0,

      // 数据
      data: [
        {
          sampleIndex: 1,
          sample_base_info: '',
          trajectory_name:"弹道aa",
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
              max_launch_time: 650,
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
        },
        {
          sampleIndex: 3,
          sample_base_info: '',
          trajectory_name:"弹道bb",
          traj: [
            ['traj_id', 'time', 'altitude'],
            ['TSPI_MISSILE_10002', 1.0, 5.0],
            ['TSPI_MISSILE_10002', 100.0, 10.0],
            ['TSPI_MISSILE_10002', 200.0, 15.0],
            ['TSPI_MISSILE_10002', 300.0, 20.0],
            ['TSPI_MISSILE_10002', 400.0, 18.0],
            ['TSPI_MISSILE_10002', 500.0, 25.0],
            ['TSPI_MISSILE_10002', 600.0, 30.0],
            ['TSPI_MISSILE_10002', 800.0, 6.0]
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

  computed: {
    currentData() {
      return this.data[this.selectedIndex] || this.data[0];
    }
  },

  watch: {
    selectedIndex() {
      this.calculateTimeRange();
      this.renderCharts();
    }
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
      const sample = this.currentData;
      if (!sample) return;

      let minTime = Infinity;
      let maxTime = -Infinity;

      if (sample.traj && sample.traj.length > 1) {
        for (let i = 1; i < sample.traj.length; i++) {
          const time = parseFloat(sample.traj[i][1]);
          if (!isNaN(time)) {
            minTime = Math.min(minTime, time);
            maxTime = Math.max(maxTime, time);
          }
        }
      }

      this.timeRange.min = 0;
      this.timeRange.max = maxTime;
    },

    calculateAltitudeRange() {
      const sample = this.currentData;
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

      // 监听ECharts内置的dataZoom事件实现同步
      this.trajChart.on('datazoom', params => {
        if (this.isSyncing) return;
        this.isSyncing = true;
        const batch = params.batch && params.batch[0];
        const start = batch ? batch.start : params.start;
        const end = batch ? batch.end : params.end;
        if (start !== undefined && end !== undefined) {
          this.ganttChart.dispatchAction({
            type: 'dataZoom',
            dataZoomIndex: 0,
            start: start,
            end: end
          });
        }
        this.$nextTick(() => { this.isSyncing = false; });
      });

      this.ganttChart.on('datazoom', params => {
        if (this.isSyncing) return;
        this.isSyncing = true;
        const batch = params.batch && params.batch[0];
        const start = batch ? batch.start : params.start;
        const end = batch ? batch.end : params.end;
        if (start !== undefined && end !== undefined) {
          this.trajChart.dispatchAction({
            type: 'dataZoom',
            dataZoomIndex: 0,
            start: start,
            end: end
          });
        }
        this.$nextTick(() => { this.isSyncing = false; });
      });

      // 阻止原生滚轮事件冒泡
      this.$nextTick(() => {
        const trajDom = this.$refs.trajChartRef;
        const ganttDom = this.$refs.ganttChartRef;
        if (trajDom) {
          trajDom.addEventListener('mousewheel', e => {
            e.stopPropagation();
          });
        }
        if (ganttDom) {
          ganttDom.addEventListener('mousewheel', e => {
            e.stopPropagation();
          });
        }
      });
    },

    renderTrajChart() {
      const sample = this.currentData;
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
          name: '时间(s)',
          nameLocation: 'center',
          nameGap: 25,
          min: this.timeRange.min,
          max: this.timeRange.max,
          axisLine: { lineStyle: { color: "#aaa" } },
          axisLabel: { color: "#fff" },
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          name: '高度(m)',
          nameLocation: 'center',
          nameGap: 40,
          min: altitudeRange.min,
          max: altitudeRange.max,
          axisLine: { show: true, lineStyle: { color: "#aaa" } },
          axisLabel: { color: "#fff" },
          splitLine: { lineStyle: { type: 'dashed' } }
        },
        dataZoom: [{
          type: 'inside',
          xAxisIndex: 0,
          throttle: 50
        }],
        series: [
          {
            type: 'line',
            data: times.map((t, i) => [t, altitudes[i]]),
            smooth: true,
            symbol: 'none',
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
      const sample = this.currentData;
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
            return `<b>${name}</b><br/>类型: ${type}<br/>最早: ${params.value[1]}s<br/>最晚: ${params.value[2]}s`;
          }
        },
        legend: {
          data: ['发射时间', '拦截时间'],
          right: 20,
          top: 5,
          textStyle: { color: "#fff" }
        },
        grid: {
          left: '100',
          right: '30',
          top: '20',
          bottom: '50'
        },
        xAxis: {
          type: 'value',
          name: '时间(s)',
          nameLocation: 'center',
          nameGap: 25,
          min: this.timeRange.min,
          max: this.timeRange.max,
          axisLine: { lineStyle: { color: "#00aaff" } },
          axisLabel: { color: "#fff" },
          splitLine: { show: true, lineStyle: { type: 'dashed', opacity: 0.3 } }
        },
        yAxis: {
          type: 'category',
          data: categories,
          inverse: true,
          splitLine: { lineStyle: { type: 'dashed', color: "#fff" } },
          axisLine: { show: true, lineStyle: { color: "#aaa" } },
          axisLabel: { color: "#fff", fontSize: 10 },
          axisTooltip: {
            trigger: 'item',
            formatter: params => params.name
          }
        },
        dataZoom: [{
          type: 'inside',
          xAxisIndex: 0,
          throttle: 50
        }],
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
                styleEmphasis: { shadowBlur: 10, shadowColor: 'white' }
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
                styleEmphasis: { shadowBlur: 10, shadowColor: 'white' }
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
  gap: 0px;
  padding: 20px;
  color: white;
  /* background-color: rgba(11, 49, 241, 0.783); */
  font-family: 微软雅黑, sans-serif;
  border-radius: 8px;
  height: 600px;
  overflow-y: auto;
}

.chart-container {
  border-radius: 8px;
  padding: 0px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
  padding-left: 5px;
  border-left: 3px solid #4ecdc4;
}

.chart {
  width: 100%;
  height: 150px;
  background-color: transparent;
}

.select-group {
  padding: 10px 0;
}

.select-group select {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  border-radius: 4px;
  font-family: 微软雅黑, sans-serif;
  font-size: 14px;
  cursor: pointer;
}

.select-group select option {
  background-color: rgba(11, 49, 241, 0.9);
  color: white;
}
</style>
