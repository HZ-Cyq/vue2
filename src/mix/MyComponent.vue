<template>
    <div>
        <h2>My Component</h2>
        <p>{{message}}</p>
        <button @click="greet">Greet</button>
    </div>
</template>
<script>
import myMixin from './myMixin';
export default {
    mixins:[myMixin]
};
</script>