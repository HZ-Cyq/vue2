<template>
    <div style="padding: 20px;">
      <el-table
        :data="dataList"
        :row-key="row => row.logicId"
        style="width: 100%;"
        border
      >
        <!-- ID列 -->
        <el-table-column prop="logicId" label="ID" width="100" align="center" />
  
        <!-- 当前版本列 -->
        <el-table-column label="版本号" align="center">
          <template #default="{ row, $index }">
            <el-select
              v-model="row.version"
              placeholder="请选择版本"
              @change="val => onVersionChange(val, row, $index)"
              style="width: 100%;"
            >
              <el-option
                v-for="model in row.versions"
                :key="model"
                :label="model"
                :value="model"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
  
      <h3 style="margin-top: 20px;">调试输出：</h3>
      <pre>{{ dataList }}</pre>
    </div>
  </template>
  
  <script>
  // 按需引入 Element UI 组件（你也可以全局引入）
  import { Table, TableColumn, Select, Option } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  
  export default {
    name: 'VersionTable',
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-select': Select,
      'el-option': Option
    },
    data() {
      return {
        dataList: [
          {
            logicId: '1',
            version: '3',
            versions: ['3', '4', '5']
          },
          {
            logicId: '2',
            version: '4',
            versions: ['4', '5', '6']
          }
        ]
      };
    },
    methods: {
      onVersionChange(val, row, index) {
        console.log(`第 ${index + 1} 行（ID: ${row.logicId}）选中的版本是：`, val);
        // 你可以在这里做进一步处理，比如更新后端、计算等
      }
    }
  };
  </script>
  