<template>
    <div class="parent-container">
      <TrajectoryLineGt :ljdetails="ljdetails" />
      <PositionLineGt :ljdetails="ljdetails" />
    </div>
  </template>
  
  <script>
  import TrajectoryLineGt from './TrajectoryLineGt.vue';
  import PositionLineGt from './PositionLineGt.vue';
  
  export default {
    name: 'ParentView',
    components: {
      TrajectoryLineGt,
      PositionLineGt
    },
    data() {
      return {
        ljdetails: [
          {
            sampleIndex: 1,
            sample_base_info: '',
            trajectory_name: '弹道aa',
            traj: [
              ['traj_id', 'time', 'altitude'],
              ['TSPI_MISSILE_10001', 1.0, 5.0],
              ['TSPI_MISSILE_10001', 100.0, 10.0],
              ['TSPI_MISSILE_10001', 200.0, 15.0],
              ['TSPI_MISSILE_10001', 300.0, 20.0],
              ['TSPI_MISSILE_10001', 400.0, 18.0],
              ['TSPI_MISSILE_10001', 500.0, 25.0],
              ['TSPI_MISSILE_10001', 600.0, 30.0],
              ['TSPI_MISSILE_10001', 900.0, 6.0]
            ],
            ljzd: {
              GPI_LAUNCHER_1: {
                min_launch_time: 100,
                max_launch_time: 300,
                min_intercept_time: 200,
                max_intercept_time: 650,
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
            trajectory_name: '弹道bb',
            traj: [
              ['traj_id', 'time', 'altitude'],
              ['TSPI_MISSILE_10002', 1.0, 5.0],
              ['TSPI_MISSILE_10002', 100.0, 10.0],
              ['TSPI_MISSILE_10002', 200.0, 15.0],
              ['TSPI_MISSILE_10002', 300.0, 20.0],
              ['TSPI_MISSILE_10002', 400.0, 18.0],
              ['TSPI_MISSILE_10002', 500.0, 25.0],
              ['TSPI_MISSILE_10002', 600.0, 30.0],
              ['TSPI_MISSILE_10002', 900.0, 6.0]
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
          },
          {
            sampleIndex: 4,
            sample_base_info: '',
            trajectory_name: '弹道aa',
            traj: [
              ['traj_id', 'time', 'altitude'],
              ['TSPI_MISSILE_10001', 1.0, 5.0],
              ['TSPI_MISSILE_10001', 100.0, 10.0],
              ['TSPI_MISSILE_10001', 200.0, 15.0],
              ['TSPI_MISSILE_10001', 300.0, 20.0],
              ['TSPI_MISSILE_10001', 400.0, 18.0],
              ['TSPI_MISSILE_10001', 500.0, 25.0],
              ['TSPI_MISSILE_10001', 600.0, 30.0],
              ['TSPI_MISSILE_10001', 1000.0, 6.0]
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
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .parent-container {
    padding: 20px;
  }
  </style>