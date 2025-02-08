const className = "A";

import(`./classes/${className}.js`).then((module) => {
    const InstanceClass = module.default;
    const instance = new InstanceClass("Hello");
    instance.show(); // 输出：Value: Hello
});
