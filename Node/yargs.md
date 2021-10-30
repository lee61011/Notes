# yarges

## 可执行脚本

```shell
# yargs 解析执行命令行参数模块 win/Mac都可用
$npm i yargs --save
```

```javascript
// 2.hello.js
let yargs = require('yargs')
// 它可以帮我们解析命令行参数，把参数数组变成对象的形式
let argv = yargs.argv
console.log(argv)
console.log('hello ' + argv.name) // hello --name zfpx => name: 'zfpx'
// hello.bat
node 2.hello.js %1 %2
// 当前目录下执行 hello name
```

```javascript
// 实现简易 yargs => yargs.js
let argv = {}
let args = process.argv
for(let i = 2; i < args.length; i++) {
    let val = args[i]
    if (val.startWith('--')) {
        argv[val.slice(2)] = args[++i]
    }
}

exports.argv = argv
```



使用 JavaScript 语音编写一个可执行脚本

```javascript
#!/usr/bin/env node
console.log('hello')

// 1.hello.js
console.log('hello ' + process.argv[2])
console.log(process.argv)
// hello.bat
node 1.hello.js %1 %2 // %1 %2表示参数占位符
# 在当前目录下执行 $ hello name age
```

然后修改权限

```javascript
chmod 755 hello
```

执行脚本

```javascript
./hello
hello
```

如果想把路径去掉可以把 hello 的路径加入环境变量PATH。但是，另一种更好的做法是在当前目录下新建一个 package.json

```json
{
    name: 'hello',
    "bin": {
        "hello": "hello"
    }
}
```



## 命令行参数的原始写法

命令行参数可以用系统变量 `process.env` 获取

```javascript
#!/usr/bin/env node
console.log('hello ', process.argv[2])
```

```javascript
hello zfpx
process.env = ['node', 'hello', 'zfpx']
```

## 新建进程

脚本可以通过 `child_process`模块新建子进程，从而执行 `linux` 命令

```javascript
#!/usr/bin/env node
let name = process.argv[2]
let {exec} = require('child_process')
let child = exec('echo hello ' + name, (err, stdout, stderr) => {
    if (err) throw err
    console.info(stdout)
})
```

```javascript
hello zfpx
```

## yargs

yargs 模块能够解决如何处理命令行参数

### 安装

```shell
npm install yargs --save
```

### 读取命令行参数

yargs 模块提供了 argv 对象，用来读取命令行参数

```javascript
#!/usr/bin/env node
let argv = require('yargs').argv
console.log('hello ', argv.name)
```

```javascript
hello --name=zfpx
hello --name zfpx
```

> process.argv
>
> ```javascript
> ['/usr/local/bin/node', '/usr/local/bin/hello4', '--name=zfpx']
> ```
>
> argv
>
> ```javascript
> {
>     name: 'zfpx'
> }
> ```

### 还可以指定别名

```javascript
let argv = require('yargs')
	.alias('n', 'name')
	.argv
```

```javascript
hello -n zfpx
hello --name zfpx
```

### 下划线属性

argv 对象有一个下划线属性，可以获取非连词线开头的参数

```javascript
let argv = require('yargs').argv
console.log('hello ', argv.n)
console.log(argv._)
```

```javascript
hello A -n zfpx B C
hello zfpx ['A', 'B', 'C']
```

### 命令行参数的配置

- demand 是否必选
- default 默认值
- describe 提示

```javascript
#!/usr/bin/env node
let argv = require('yargs')
	.demand(['n'])
	.default({n: 'zfpx'})
	.describe({n: '你的名字'})
	.argv
console.log('hello ', argv.n)
```

这个代表n不能省略，默认值为 zfpx，并给出提示
option 方法允许将所有的配置写入配置对象

```javascript
#!/usr/bin/env node
let argv = require('yargs')
	.option('n', {
        alias: 'name',
        demand: true,
        default: 'zfpx',
        describe: '请输入你的名字',
        type: 'string',
        boolean: true
    }).argv
console.log('hello', argv.n)
```

有时候，某些参数不需要，只起到开关作用。可以用boolean指定这些参数返回布尔值

```javascript
#!/usr/bin/env node
let argv = require('yargs')
	.boolean(['private'])
	.argv
console.log('hello', argv.n)
```

参数private总是返回一个布尔值

```javascript
hello
```



### 帮助信息

