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
            <!-- 蓝色背景内容区 -->
            <div class="popover-body">
              <div
                v-for="(item, idx) in scope.row.userData"
                :key="idx"
                class="subline-editor"
              >
                <div class="subline-title">{{ item.name }}</div>
                <el-form label-width="60px" size="mini">
                  <el-form-item label="颜色">
                    <div class="color-reset-line">
                      <el-color-picker v-model="item.color" show-alpha />
                      <el-button
                        type="danger"
                        size="mini"
                        @click="resetSubLine(scope.$index, idx)"
                      >
                        重置此项
                      </el-button>
                    </div>
                  </el-form-item>
                </el-form>

                <el-divider v-if="idx < scope.row.userData.length - 1" />
              </div>
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
            {
              name: "白方",
              color: "rgba(255,255,255,1)",
              width: 6,
              type: "实线"
            },
            {
              name: "红方",
              color: "rgba(255,0,0,1)",
              width: 6,
              type: "虚线"
            }
          ],
          defaultData: [
            {
              name: "白方",
              color: "rgba(255,255,255,1)",
              width: 6,
              type: "实线"
            },
            {
              name: "红方",
              color: "rgba(255,0,0,1)",
              width: 6,
              type: "虚线"
            }
          ]
        },
        {
          key: "2",
          name: "指挥线",
          visible: true,
          userData: [
            {
              name: "指挥线",
              color: "rgba(0,0,255,1)",
              width: 6,
              type: "箭头线"
            }
          ],
          defaultData: [
            {
              name: "指挥线",
              color: "rgba(0,0,255,1)",
              width: 6,
              type: "箭头线"
            }
          ]
        }
      ],
      popoverVisible: {}
    };
  },
  methods: {
    resetSubLine(lineIndex, subIndex) {
      const defaultItem = this.lines[lineIndex].defaultData[subIndex];
      this.$set(
        this.lines[lineIndex].userData,
        subIndex,
        JSON.parse(JSON.stringify(defaultItem))
      );
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

.color-reset-line {
  display: flex;
  align-items: center;
  gap: 10px;
}

.popover-body {
  background-color: #e0f0ff;
  padding: 12px;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
}
</style>

<!-- 全局样式覆盖 el-popover 的默认白色背景 -->
<style>
/* 强制设置 el-popover 所有内部容器背景为蓝色 */
.el-popover,
.el-popover__content,
.el-popover__inner,
.el-popper .el-popover__content {
  background-color: #e0f0ff !important;
  border: none !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
  padding: 0 !important;
  border-radius: 6px !important;
  overflow: hidden;
}
</style>