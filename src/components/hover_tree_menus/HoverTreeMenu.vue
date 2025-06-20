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
  
        <!-- 子菜单：递归 -->
        <HoverTreeMenu
          v-if="hovered === node && node.subMenu && node.subMenu.length"
          :nodes="node.subMenu"
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
          alert("点击叶子节点：" + node.title);
          // 可触发动态加载、路由跳转等
        }
      },
    },
    components: {
      HoverTreeMenu: null, // 递归引用
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
    min-width: 200px;
    position: relative;
  }
  .menu-item {
    position: relative;
  }
  .label {
    padding: 10px;
    cursor: pointer;
    white-space: nowrap;
  }
  .label:hover {
    background-color: #34495e;
  }
  .submenu {
    position: absolute;
    top: 0;
    left: 100%;
    z-index: 100;
  }
  </style>
  