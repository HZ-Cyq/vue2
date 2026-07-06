<template>
    <div>
        <el-select v-model="currentTheme" placeholder="选择主题" @change="handleChange">
            <el-option label="主题1：默认" value="default"></el-option>
            <el-option label="主题2：暗黑" value="dark"></el-option>
            <el-option label="主题3：科技蓝" value="blue"></el-option>
        </el-select>
    </div>
</template>
<script>
import { ThemeUtil } from '../../utils/theme';
export default {
    name: "ThemeSwitcher",
    data() {
        return  {
            currentTheme: 'default',
            test: 'aaa'
        };
    },

    created() {
        ThemeUtil.init();
        this.currentTheme = ThemeUtil.getCurrentTheme();
    },

    methods: {
        handleChange(themeName) {
            ThemeUtil.applyTheme(themeName);
        }
    }
}
</script>