<template>
  <div style="display: flex;">
    <!-- 左侧菜单 -->
    <HoverTreeMenu
      :nodes="menuData"
      @component-selected="loadComponent"
    />

    <!-- 右侧组件展示区 -->
    <div style="flex: 1; padding: 20px; border-left: 1px solid #ccc;">
      <component v-if="currentComponent" :is="currentComponent" />
      <div v-else style="color: gray;">请选择一个叶子节点</div>
    </div>
  </div>
</template>

<script>
import HoverTreeMenu from "./HoverTreeMenu.vue";
export default {
  components: { HoverTreeMenu },
  data() {
    return {
      currentComponent: null,
      menuData: [
        {
          title: "工具组 1",
          subMenu: [
            {
              title: "子项 1-1",
              subMenu: [
                {
                  title: "Demo 组件 1",
                  componentName: "DemoComponent1",
                },
              ],
            },
          ],
        },
        {
          title: "工具组 2",
          subMenu: [
            {
              title: "Demo 组件 2",
              componentName: "DemoComponent2",
            },
          ],
        },
      ],
    };
  },
  methods: {
    async loadComponent(name) {
      try {
        const mod = await import(`@/components/hover_tree_menus/${name}.vue`);
        this.currentComponent = mod.default;
      } catch (e) {
        alert(`加载组件失败：${name}`);
        console.error(e);
      }
    },
  },
};
</script>
