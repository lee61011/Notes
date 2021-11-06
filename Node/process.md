# process

## 进程

- 在 Node.js 中每个应用程序都是一个进程类的实例对象。
- 使用 `process` 对象代表应用程序，这是一个全局对象，可以通过它来获取 Node.jsy 应用程序以及运行该程序的用户、环境等各种信息的属性、方法和事件。

### 进程对象属性

- execPath 可执行文件的绝对路径，如 `/usr/local/bin/node`
- version 版本号
- versions 依赖库的版本号
- platform 运行平台。如 darwin、freebsd、linux、sunos、win32
- stdin 标准输入流可读流，默认暂停状态
- stdout 标准输出可写流，同步操作
- stderr 错误输出可写流，同步操作
- argv 属性值为数组
- env 操作系统环境信息
- pid 应用程序进程ID
- title 窗口标题
- arch 处理器架构 arm ia32x64

```javascript
process.stdin.resume()
process.stdin.on('data', function(chunk) {
    process.stdout.write('进程接收到数据：' + chunk)
})
```

```javascript
process.argv.forEach((val, index, ary) => console.log(index, val))
```

### memoryUsage 方法

```javascript
process.memoryUsage()
/* {
  rss: 24870912,        // resident set size: 所有内存占用，包括指令区和堆栈
  heapTotal: 4210688,   // '堆'占用的内存，包括用到的和没用到的
  heapUsed: 2072712,    // 用到的堆的部分
  external: 673884      // V8引擎内部的 C++ 对象占用的内存
} */
```

### nextTick 方法

nextTick方法用于将一个函数推迟到代码中所书写的下一个同步方法执行完毕或异步方法的回调函数开始执行前调用

### chdir

chdir方法用具修改 Node.js 应用程序中使用的当前工作目录，使用方法如下

```javascript
process.chdir(directory)
```

### cwd 方法

cwd方法用于返回当前目录，不使用任何参数

```javascript
console.log(process.cwd())
```

### chdir 方法

改变当前的工作目录

```javascript
console.log(`当前目录：${process.cwd()}`)
process.chdir('..')
console.log(`上层目录：${process.cwd()}`)
```

### exit 方法

### kill 方法

### uptime

### hrtime

### exit 事件

### uncaughtException 事件

### 信号事件



## 子进程

