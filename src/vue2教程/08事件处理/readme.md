可以用v-on(等于@)监听DOM事件
    <button v-on:click="counter += 1">Add 1</button>
v-on后面可以加一段js代码段，如代参数的函数调用，并且可以把event事件传入
    <button v-on:click="addCounter(1)">click</button>
v-on:click后面还可以添加事件修饰符，可以让方法只有纯粹的逻辑方法，而不用关心DOM事件细节
    <button v-on:click.prevent="addCounter(1)">click</button>
    事件修饰符：
        stop:停止冒泡
        prevent:阻止默认事件，如表单中的submit会自动刷新页面
        capture:捕获时触发。
        self:当是自身时才触发
        once:只触发一次
        passtive:不阻止默认事件
        注意：prevent和passtive不能一起用，注意使用顺序（.self.prevent是对的,.prevent.self是错的）
    系统修饰符
    ctrl、alt、shift、meta等按键
    <button v-on:click.ctrl='log'></button>
    <input v-on:keyup.alt.67='clear'>
    <button v-on:click.ctrl.exact></button>