<template>
  <div class="line-editor-popover-container">
    <el-table :data="lines" border style="width: 720px">
      <el-table-column prop="name" label="线名称" width="120" />

      <el-table-column label="显示" width="100">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.visible"
            active-color="#13ce66"
            inactive-color="#ccc"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template v-slot="scope">
          <el-popover
            placement="right"
            width="360"
            trigger="click"
            v-model="popoverVisible[scope.$index]"
          >
            <div v-for="(item, idx) in scope.row.userData" :key="idx" class="subline-editor">
              <div class="subline-title">{{ item.name }}</div>
              <el-form label-width="60px" size="mini">
                <el-form-item label="颜色">
                  <el-color-picker
                    v-model="item.color"
                    show-alpha
                  />
                </el-form-item>
                <el-form-item label="宽度">
                  <el-input-number v-model="item.width" :min="1" />
                </el-form-item>
                <el-form-item label="类型">
                  <el-select v-model="item.type" placeholder="选择类型">
                    <el-option label="实线" value="实线" />
                    <el-option label="虚线" value="虚线" />
                    <el-option label="箭头线" value="箭头线" />
                  </el-select>
                </el-form-item>
              </el-form>

              <!-- 每个子线重置按钮 -->
              <div style="text-align: right; margin-bottom: 10px;">
                <el-button
                  type="danger"
                  size="mini"
                  @click="resetSubLine(scope.$index, idx)"
                >
                  重置此项
                </el-button>
              </div>

              <el-divider v-if="idx < scope.row.userData.length - 1" />
            </div>

            <el-button slot="reference" size="mini" type="primary">编辑</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "LineEditor",
  data() {
    return {
      lines: [
        {
          key: "1",
          name: "弹道线",
          visible: true,
          userData: [
            { name: "白方", color: "rgba(255,255,255,1)", width: 6, type: "实线" },
            { name: "红方", color: "rgba(255,0,0,1)", width: 6, type: "虚线" }
          ],
          defaultData: [
            { name: "白方", color: "rgba(255,255,255,1)", width: 6, type: "实线" },
            { name: "红方", color: "rgba(255,0,0,1)", width: 6, type: "虚线" }
          ]
        },
        {
          key: "2",
          name: "指挥线",
          visible: true,
          userData: [
            { name: "指挥线", color: "rgba(0,0,255,1)", width: 6, type: "箭头线" }
          ],
          defaultData: [
            { name: "指挥线", color: "rgba(0,0,255,1)", width: 6, type: "箭头线" }
          ]
        }
      ],
      popoverVisible: {}
    };
  },
  methods: {
    resetSubLine(lineIndex, subIndex) {
      const defaultItem = this.lines[lineIndex].defaultData[subIndex];
      // 用深拷贝防止引用问题
      this.$set(this.lines[lineIndex].userData, subIndex, JSON.parse(JSON.stringify(defaultItem)));
    }
  }
};
</script>

<style scoped>
.line-editor-popover-container {
  padding: 20px;
}
.subline-editor {
  margin-bottom: 10px;
}
.subline-title {
  font-weight: bold;
  margin-bottom: 4px;
}
</style>
