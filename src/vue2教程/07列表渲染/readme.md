1、遍历:
    <div v-for="(value, index) in array"></div>
    <div v-for="(value,key,index) in object"></div>
2、更新监测：
    数组：直接通过索引改值或者修改length，无法监测到
    对象：添加新的属性，无法监测到。（但是如果给对象新赋了一个值，赋值时给到的属性，如果之后进行了更新，可以监测到）