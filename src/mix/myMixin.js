export default {
    data() {
        return {
            message: 'Hello from mixin!'
        };
    },
    methods: {
        greet() {
            alert(this.message);
        }
    }
}