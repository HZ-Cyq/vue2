<template>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" align="center" />
  
        <el-table-column label="想定描述" align="center" width="200">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="JSON.parse(scope.row.data).desc"
              placement="top"
            >
              <div
                style="font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
              >
                {{ JSON.parse(scope.row.data).desc }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ExampleTable',
    data() {
      return {
        tableData: [
          {
            id: 1,
            data: JSON.stringify({ desc: '这是一个非常长的想定描述内容，需要在悬停时才能完整显示' }),
          },
          {
            id: 2,
            data: JSON.stringify({ desc: '简短描述' }),
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  /* 可选的样式增强 */
  .el-tooltip__popper {
    max-width: 400px;
    word-wrap: break-word;
  }
  </style>
  
  entities:[
	{
		id:10001,
		lon: 0,
		lat:1,
		alt:0,
		heading:0
	},
	{
		id:10002,
		lon: 0,
		lat:2,
		alt:0,
		heading:0
	},
	{
		id:10003,
		lon: 0,
		lat:1,
		alt:0,
		heading:0
	}
  ]