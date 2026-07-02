<template>
  <div class="missile-visualization">
    <div class="chart-container">
      <div class="chart-title">
        进攻弹轨迹（时间-高度） 样本{{ firstItem.sampleIndex }}（{{ firstItem.trajectory_name }}） 拦截阵地时序 - 样本{{ firstItem.sampleIndex }}
      </div>
      <div ref="trajChartRef" class="chart"></div>
    </div>

    <div class="checkbox-group">
      <label v-for="(item, index) in ljdetails" :key="index" class="checkbox-item">
        <input type="checkbox" :checked="selectedIndexes.includes(index)" @change="toggleIndex(index)" />
        {{ item.sampleIndex }} - {{ item.trajectory_name }}
      </label>
    </div>

    <div v-for="(item, index) in visibleData" :key="index" class="chart-container">
      <div class="chart-title">阵地 {{ item.sampleIndex }} - {{ item.trajectory_name }}</div>
      <div :ref="el => setGanttRef(el, index)" class="chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'PositionLineGt',
  props: {
    ljdetails: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      trajChart: null,
      ganttCharts: [],
      ganttRefs: [],
      timeRange: { min: 0, max: 800 },
      selectedIndexes: [],
      isSyncing: false
    };
  },
  computed: {
    firstItem() {
      return this.ljdetails && this.ljdetails.length > 0 ? this.ljdetails[0] : {};
    },
    visibleData() {
      return this.selectedIndexes.map(i => this.ljdetails[i]);
    }
  },
  mounted() {
    if (this.ljdetails && this.ljdetails.length > 0) {
      this.selectedIndexes = this.ljdetails.map((_, index) => index);
      this.$nextTick(() => {
        this.initAndRender();
      });
    }
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.trajChart) this.trajChart.dispose();
    this.ganttCharts.forEach(chart => chart && chart.dispose());
  },
  methods: {
    initAndRender() {
      if (!this.trajChart) {
        this.initCharts();
      }
      if (this.ljdetails && this.ljdetails.length > 0) {
        this.calculateTimeRange();
        this.renderCharts();
      }
    },

    setGanttRef(el, index) {
      if (el) {
        this.ganttRefs[index] = el;
      }
    },

    initCharts() {
      if (this.$refs.trajChartRef) {
        this.trajChart = echarts.init(this.$refs.trajChartRef);
      }
      this.ganttCharts = [];
      this.ganttRefs = [];
    },

    handleResize() {
      if (this.trajChart) this.trajChart.resize();
      this.ganttCharts.forEach(chart => chart && chart.resize());
    },

    toggleIndex(index) {
      const idx = this.selectedIndexes.indexOf(index);
      if (idx > -1) {
        this.selectedIndexes.splice(idx, 1);
      } else {
        this.selectedIndexes.push(index);
      }
    },

    calculateTimeRange() {
      if (!this.ljdetails || this.ljdetails.length === 0) return;
      const sample = this.ljdetails[0];
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
      if (!this.ljdetails || this.ljdetails.length === 0) return { min: 0, max: 100 };
      const sample = this.ljdetails[0];
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
      this.renderAllGanttCharts();
      this.bindTrajDataZoomEvent();
      this.bindMousewheelEvents();
    },

    bindTrajDataZoomEvent() {
      if (!this.trajChart) return;
      this.trajChart.off('datazoom');
      this.trajChart.on('datazoom', params => {
        if (this.isSyncing) return;
        this.isSyncing = true;
        const batch = params.batch && params.batch[0];
        const start = batch ? batch.start : params.start;
        const end = batch ? batch.end : params.end;
        if (start !== undefined && end !== undefined) {
          this.ganttCharts.forEach(chart => {
            chart.dispatchAction({
              type: 'dataZoom',
              dataZoomIndex: 0,
              start: start,
              end: end
            });
          });
        }
        this.$nextTick(() => {
          this.isSyncing = false;
        });
      });
    },

    bindMousewheelEvents() {
      this.$nextTick(() => {
        const trajDom = this.$refs.trajChartRef;
        if (trajDom) {
          trajDom.addEventListener('mousewheel', e => {
            e.stopPropagation();
          });
        }
        this.ganttRefs.forEach(dom => {
          if (dom) {
            dom.addEventListener('mousewheel', e => {
              e.stopPropagation();
            });
          }
        });
      });
    },

    renderTrajChart() {
      if (!this.ljdetails || this.ljdetails.length === 0) return;
      const sample = this.ljdetails[0];
      if (!sample || !sample.traj || !this.trajChart) return;
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
          axisLine: {
            lineStyle: { color: "#aaa" }
          },
          axisLabel: {
            color: "#fff"
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '高度(m)',
          nameLocation: 'center',
          nameGap: 40,
          min: altitudeRange.min,
          max: altitudeRange.max,
          axisLine: {
            show: true,
            lineStyle: { color: "#aaa" }
          },
          axisLabel: {
            color: "#fff"
          },
          splitLine: {
            lineStyle: { type: 'dashed' }
          }
        },
        dataZoom: [{
          type: 'inside',
          xAxisIndex: 0,
          throttle: 50
        }],
        series: [{
          type: 'line',
          data: times.map((t, i) => [t, altitudes[i]]),
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: '#ff6b6b',
            width: 3
          },
          itemStyle: {
            color: '#ff6b6b'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(255,107,107,0.3)'
            }, {
              offset: 1,
              color: 'rgba(255,107,107,0.05)'
            }])
          }
        }]
      };
      this.trajChart.setOption(option);
    },

    renderAllGanttCharts() {
      this.ganttCharts.forEach(chart => chart && chart.dispose());
      this.ganttCharts = [];
      this.$nextTick(() => {
        this.visibleData.forEach((item, index) => {
          const dom = this.ganttRefs[index];
          if (!dom) return;
          const chart = echarts.init(dom);
          this.ganttCharts.push(chart);
          this.renderSingleGanttChart(chart, item);

          chart.on('datazoom', params => {
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
              this.ganttCharts.forEach(otherChart => {
                if (otherChart !== chart) {
                  otherChart.dispatchAction({
                    type: 'dataZoom',
                    dataZoomIndex: 0,
                    start: start,
                    end: end
                  });
                }
              });
            }
            this.$nextTick(() => {
              this.isSyncing = false;
            });
          });
        });
      });
    },

    renderSingleGanttChart(chart, sample) {
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
          itemStyle: { color: 'rgba(230, 126, 34, 0.5)' }
        });

        launchItems.push({
          name: name,
          value: [index + 0.3, launcher.min_launch_time, launcher.max_launch_time],
          itemStyle: { color: 'rgba(46, 204, 113, 0.5)' }
        });
      });

      const option = {
        color: ['rgba(46, 204, 113, 0.5)', 'rgba(230, 126, 34, 0.5)'],
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
          textStyle: { color: "#fff" },
          itemWidth: 20,
          itemHeight: 10
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
          axisLine: {
            lineStyle: { color: "#00aaff" }
          },
          axisLabel: {
            color: "#fff"
          },
          splitLine: {
            show: true,
            lineStyle: { type: 'dashed', opacity: 0.3 }
          }
        },
        yAxis: {
          type: 'category',
          data: categories,
          inverse: true,
          splitLine: {
            lineStyle: { type: 'dashed', color: "#fff" }
          },
          axisLine: {
            show: true,
            lineStyle: { color: "#aaa" }
          },
          axisLabel: {
            color: "#fff",
            fontSize: 10
          },
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
        series: [{
          name: '发射时间',
          type: 'custom',
          color: 'rgba(46, 204, 113, 0.5)',
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
              styleEmphasis: {
                shadowBlur: 10,
                shadowColor: 'white'
              }
            };
          },
          encode: {
            x: [1, 2],
            y: 0
          },
          data: launchItems
        }, {
          name: '拦截时间',
          type: 'custom',
          color: 'rgba(230, 126, 34, 0.5)',
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
              styleEmphasis: {
                shadowBlur: 10,
                shadowColor: 'white'
              }
            };
          },
          encode: {
            x: [1, 2],
            y: 0
          },
          data: interceptItems
        }]
      };
      chart.setOption(option);
    }
  },
  watch: {
    ljdetails: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.selectedIndexes = newVal.map((_, index) => index);
          this.$nextTick(() => {
            this.initAndRender();
          });
        }
      },
      immediate: false
    },
    selectedIndexes() {
      this.renderAllGanttCharts();
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

.checkbox-group {
  display: flex;
  gap: 20px;
  padding: 10px 15px;
  border-radius: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: white;
}

.checkbox-item input {
  cursor: pointer;
  width: 16px;
  height: 16px;
}
</style>