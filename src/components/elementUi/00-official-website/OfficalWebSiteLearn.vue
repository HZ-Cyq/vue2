<template>
    <div>
        <ThemeSwitcher></ThemeSwitcher>
        <div>
            <AelRowAndElCol></AelRowAndElCol>
        </div>
    </div>
</template>
<script>
import ThemeSwitcher from '../ThemeSwitcher.vue';
import AelRowAndElCol from './1-basic/AelRowAndElCol.vue';
export default {
    name: "OfficalWebSiteLearn",
    components: {
        AelRowAndElCol,
        ThemeSwitcher,
    },
    data() {
        return {
            test1:"aaa",
            test2:"bbb",
        }
    }
}
</script>
