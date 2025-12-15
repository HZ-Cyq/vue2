<template>
  <div style="padding: 20px;">
    <el-table
      :data="dataList"
      :row-key="row => row.logicId"
      style="width: 100%;"
      border
    >
      <!-- ID 列 -->
      <el-table-column prop="logicId" label="ID" align="center" width="100" />

      <!-- 版本选择列 -->
      <el-table-column label="版本号2" align="center">
        <template #default="{ row, $index }">
          <el-select
            v-model="row.version"
            placeholder="请选择版本"
            style="width: 100%;"
            @change="val => onVersionChange(val, row, $index)"
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
import { Table, TableColumn, Select, Option } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 样式导入

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
      dataList: [] // 初始为空
    };
  },
  created() {
    // created 中初始化数据（模拟从后台加载）
    this.dataList = [
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
    ];
  },
  methods: {
    onVersionChange(val, row, index) {
      console.log(`第 ${index + 1} 行（ID: ${row.logicId}）选中的版本是：`, val);
    }
  }
};
</script>
