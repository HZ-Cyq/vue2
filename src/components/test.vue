<template>
    <div class="container">
      <nav class="sidebar">
        <ul>
          <li v-for="(item, idx) in menu" :key="idx"
              @mouseenter="showChildren(item)"
              :class="{active: activeGroup === item}">
            {{ item.title }}
          </li>
        </ul>
      </nav>
      <div class="content">
        <template v-if="activeGroup">
          <tree-menu :nodes="activeGroup.subMenu" @leaf-click="openLeaf"></tree-menu>
        </template>
        <template v-else>
          <p>鼠标移到左侧菜单查看子项</p>
        </template>
  
        <div class="component-area">
          <!-- 动态加载组件 -->
          <component :is="currentComponent"></component>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // 递归树形菜单组件
  const TreeMenu = {
    name: 'tree-menu',
    props: ['nodes'],
    data() {
      return {
        expandedNodes: new Set(),
      };
    },
    methods: {
      toggle(node) {
        if (this.expandedNodes.has(node)) {
          this.expandedNodes.delete(node);
        } else {
          this.expandedNodes.add(node);
        }
      },
      isExpanded(node) {
        return this.expandedNodes.has(node);
      },
      onClick(node) {
        if (!node.subMenu || node.subMenu.length === 0) {
          this.$emit('leaf-click', node);
        } else {
          this.toggle(node);
        }
      },
    },
    template: `
      <ul>
        <li v-for="node in nodes" :key="node.title">
          <div @click="onClick(node)" style="cursor: pointer;">
            {{ node.title }}
            <span v-if="node.subMenu && node.subMenu.length">
              [{{ isExpanded(node) ? '-' : '+' }}]
            </span>
          </div>
          <tree-menu v-if="isExpanded(node)" :nodes="node.subMenu" @leaf-click="$emit('leaf-click', $event)"></tree-menu>
        </li>
      </ul>
    `,
    components: {
      'tree-menu': null // 递归组件需要在mounted里自引用
    },
    mounted() {
      this.$options.components['tree-menu'] = this.$options;
    }
  };
  
  export default {
    components: {
      'tree-menu': TreeMenu
    },
    data() {
      return {
        activeGroup: null,
        currentComponent: null, // 当前要打开的vue组件名或对象
        menu: [
          {
            title: '工具组 1',
            subMenu: [
              {
                title: '子项 1-1',
                subMenu: [
                  { title: '叶子节点 1-1-1' },
                  { title: '叶子节点 1-1-2' }
                ]
              },
              { title: '叶子节点 1-2' }
            ]
          },
          {
            title: '工具组 2',
            subMenu: [
              { title: '叶子节点 2-1' },
              { title: '叶子节点 2-2' }
            ]
          }
        ]
      };
    },
    methods: {
      showChildren(item) {
        this.activeGroup = item;
      },
      openLeaf(node) {
        alert('打开组件: ' + node.title);
        // 这里你可以用路由跳转，或者动态import组件并赋值给currentComponent
        // this.currentComponent = ...
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    height: 100vh;
  }
  .sidebar {
    width: 180px;
    background: #2c3e50;
    color: white;
    padding: 10px;
  }
  .sidebar li {
    list-style: none;
    padding: 8px;
    cursor: pointer;
  }
  .sidebar li.active {
    background: #34495e;
  }
  .content {
    flex: 1;
    padding: 10px;
    background: #f0f0f0;
    overflow: auto;
  }
  .component-area {
    margin-top: 20px;
    background: white;
    height: 300px;
    border: 1px solid #ccc;
  }
  </style>
  