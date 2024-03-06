export const myMixin = {
    data() {
        return {
            message: 'hello from mixin'
        }
    },
    methods: {
        greet() {
            alert(this.message);
        }
    }
}