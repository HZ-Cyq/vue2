<template>
  <ul class="menu-root" v-if="nodes && nodes.length">
    <li
      v-for="(node, index) in nodes"
      :key="index"
      class="menu-item"
      @mouseenter="hovered = node"
      @mouseleave="hovered = null"
    >
      <div class="label" @click="onClick(node)">
        {{ node.title }}
        <span v-if="node.subMenu && node.subMenu.length"> ▶ </span>
      </div>

      <!-- 子菜单递归 -->
      <HoverTreeMenu
        v-if="hovered === node && node.subMenu && node.subMenu.length"
        :nodes="node.subMenu"
        @component-selected="$emit('component-selected', $event)"
        class="submenu"
      />
    </li>
  </ul>
</template>

<script>
export default {
  name: "HoverTreeMenu",
  props: {
    nodes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      hovered: null,
    };
  },
  methods: {
    onClick(node) {
      if (!node.subMenu || node.subMenu.length === 0) {
        if (node.componentName) {
          this.$emit("component-selected", node.componentName);
        } else {
          alert("无 componentName：" + node.title);
        }
      }
    },
  },
  components: {
    HoverTreeMenu: null,
  },
  mounted() {
    this.$options.components.HoverTreeMenu = this.$options;
  },
};
</script>

<style scoped>
.menu-root {
  list-style: none;
  padding: 0;
  margin: 0;
  background: #2c3e50;
  color: white;
  display: inline-block;
  white-space: nowrap;
  position: relative;
  min-width: 100px;
  max-width: 400px;
  font-size: 14px;
}

.menu-item {
  position: relative;
}

.label {
  padding: 10px 15px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.label:hover {
  background-color: #34495e;
}

.submenu {
  position: absolute;
  top: 0;
  left: 100%;
  background: #34495e;
  white-space: nowrap;
  min-width: 100px;
  max-width: 400px;
  z-index: 100;
  display: inline-block;
}
</style>
