<template>
    <div style="display: flex;">
      <HoverTreeMenu :nodes="menuData" />
    </div>
  </template>
  
  <script>
  import HoverTreeMenu from "./HoverTreeMenu.vue";
  
  export default {
    components: { HoverTreeMenu },
    data() {
      return {
        menuData: [
          {
            title: "工具组 1",
            subMenu: [
              {
                title: "子项 1-1",
                subMenu: [
                  {
                    title: "子项 1-1-1",
                    subMenu: [
                      { title: "叶子 1-1-1-1" },
                      { title: "叶子 1-1-1-2" },
                    ],
                  },
                ],
              },
              { title: "叶子 1-2" },
            ],
          },
          {
            title: "工具组 2",
            subMenu: [
              {
                title: "子项 2-1",
                subMenu: [{ title: "叶子 2-1-1" }],
              },
            ],
          },
        ],
      };
    },
  };
  </script>
  