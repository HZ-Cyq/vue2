<template>
  <div>
    <el-select
      v-model="version"
      placeholder="请选择版本"
      popper-class="my-select-dropdown"
    >
      <el-option
        v-for="item in versions"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </div>
</template>

<script>
import { Select, Option } from 'element-ui'

export default {
  components: {
    'el-select': Select,
    'el-option': Option
  },
  data() {
    return {
      versions: ['v1.0','v2.0','v3.0','4.0','5.0','6.0','7.0','8.0','9.0'],
      version: 'v1.0'
    }
  }
}
</script>

<style>
/* 箭头 */
.my-select-dropdown .popper__arrow {
  display: none;
}

/* 往上移动 */
.my-select-dropdown {
  margin-top: -8px !important;
}

/* 展开和收回 */
.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  transition: all 0.01s ease !important;
}
</style>