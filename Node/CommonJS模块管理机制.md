## CommonJS 模块管理机制

> AMD：require.js
> CMD：sea.js
> CommonJS：node.js
> ES6 Module
>
> 这些模块化思想，规定了在JS中我们的模块该如何创建、如何导入及如何导出

- 内置模块
- 第三方模块
- 自定义模块：自己写的模块

### NODE 中的模块管理

1. 在 NODE 环境中，每创建一个 JS，都相当于创建了一个新的模块；模块中的方法也都是模块的私有方法，不同模块之间的同名方法不会有任何的冲突

2. module.exports 就是 NODE 天生自带的用来导出模块中方法的方式

   ```javascript
   /* A.js */
   module.exports = {
       xxx: xxx	// 这些属性方法就是需要暴露给外面调取使用的
   }
   
   /* B.js */
   let A = require('./A')
   ```

3. require 是 NODE 天生提供的用来导入模块的方法；语法：let [模块名] = require([模块的地址])

4. require 导入模块是同步的（没导入完成，后面的事情是不处理的）；每一次导入模块都是吧导入的模块中的 JS 代码从上到下执行一遍



```javascript
/*
	需求：创建A/B/C三个模块
		A中有一个SUM方法实现任意数求和
		B中有一个方法AVG求平均数：去掉最大和最小值，剩余值求和（调取A中的SUM方法，实现求和）
		C中调取B中的AVG，传递：98 95 85 67 25，实现求一堆数中平均数
*/

/* A.js */
// let sum = (...arg) => eval(arg.join('+')) // 任意数求和方式一：不做非有效数字校验
function sum(...arg) {
    let total = 0;
    arg.forEach(item => {
        item = Number(item)
        if (!isNaN(item)) {
            total += item
        }
    })
    return total
}
// sum(10, 20, 30)
module.exports = { sum }


/* B.js */
let A = require('./A')
let avg = (...arg) => {
    arg = arg.sort((a, b) => a - b).slice(1, arg.length - 1)
    return (A.sum(...arg) / arg.length).toFixed(2)
}
module.exports = { avg }

/* C.js */
let { avg } = require('./B.js')
```





### 内置模块

- fs 内置模块
  - 常规方法：readdir / readFile / writeFile / mkdir / rmdir / appendFile / copyFile ... ...
  - promise 异步的 fs 操作
- url 内置模块
  - url.parse(url[, flag])
- path 内置模块
  - __dirname：模块中这个内置变量是当前模块所在的绝对路径
  - __filename：相对于 __dirname 来讲，多了模块名称
  - path.resolve()
- http 内置模块
  - http.createServer()
  - erver.listen()

