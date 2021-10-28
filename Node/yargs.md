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

## 新建进程

## yargs

### 安装

### 读取命令行参数

### 还可以指定别名

### 下划线属性

### 命令行参数的配置

### 帮助信息

