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

退出运行 Node.js 应用程序的进程

```javascript
process.exit(0)
```

### kill 方法

用于向进程发送一个信号

- SIGINT 程序终止(interrupt)信号，在用户键入INTR字符(通常是Ctrl-C)时发出，用于通知前台进程组终止进程

- SIGTERM 程序结束(terminate)信号，该信号可以被阻塞和处理。通常用来要求程序自己正常退出，shell命令kill缺省产生这个信号

  ```javascript
  process.kill(pid,[signal])
  ```

- pid 是一个整数，用于指定需要接收信号的进程ID

- signal 发送的信号，默认为 SIGTERM

### uptime

返回当前程序的运行时间

```javascript
process.uptime()
```

### hrtime

测试一个代码段的运行时间，返回两个时间，第一个单位是秒，第二个单位是纳秒

```javascript
let fs = require('fs')
let time = process.hrtime()
let data = fs.readFileSync('index.txt')
let diff = process.hrtime()
console.log(`读文件操作耗费的%d秒`, diff[0])
```

### exit 事件

当运行Nodejs应用程序进程退出时触发进程对象的exit事件。可以通过指定事件回调函数来指定进程退出时所执行的处理

```javascript
process.on('exit', function() {
    console.log('Node.js进程被退出')
})
process.exit()
```

### uncaughtException 事件

当应用程序抛出一个未被捕获的异常时触发进程对象的uncaughtException事件

```javascript
process.on('uncaughtException', function(err) {
    console.log('捕获到一个未被处理的错误', err)
})
notExist()
```

### 信号事件

```javascript
process.stdin.resume()
process.on('SIGINT', function() {
    console.log('接收到SIGINT信号')
})
```

## 子进程

- 在 Nodejs 中，只有一个线程执行所有操作，如果某个操作需要大量消耗CPU资源的情况下，后续操作都需要等待
- 在 Nodejs 中，提供了一个 `child_process` 模块，通过它可以开启多个子进程，在多个子进程之间可以共享内存空间，可以通过子进程的互相通信来实现信息的交换。

### spawn

#### 语法

```javascript
child_process.spawn(command,[args],[options])
```

- command 必须指定的参数，指定需要执行的命令
- args 数组，存放了所有运行该命令需要的参数
- options 参数为一个对象，用于指定开启子进程时使用的选项
  - cwd 子进程的工作目录
  - env 环境变量
  - detached 如果为 true，该子进程为一个进程组中的领头进程，当父进程不存在时也可以独立存在
  - stdio 三个元素的数组，设置标准输入/输出
    - pipe 在父进程和子进程之间创建一个管道，父进程可以通过子进程的 stdio[0] 访问子进程的标准输入，通过 stdio[1] 访问标准输出，stdio[2] 访问错误输出
    - ipc 在父进程和子进程之间创建一个专用与传递消息的IPC通道。可以调用子进程的 send 方法向子进程发消息，子进程会触发 message 事件
    - ignore 指定不为子进程设置文件描述符。这样子进程的标准输入、标准输出和错误输出被忽略
    - stream 子进程和父进程共享一个终端设备、文件、端口或管道
    - 正整数值 和共享一个stream是一样的
    - null或undefined 在子进程中创建与父进程相连的管道

默认情况下，子进程的stdin，stdout，stderr导向了 ChildProcess 这个对象的 child.stdin，child.stdout，child.stderr流

```javascript
let spawn = require('child_process').spawn
spawn('prg', [], {stdio: ['pipe', 'pipe', process.stderr]})
```

- ignore ['ignore','ignore','ignore'] 全部忽略

- pipe ['pipe','pipe','pipe'] 通过管道连接

- inherit [process.stdin, process.stdout, process.stderr]或[0,1,2] 和父进程共享输入输出

```javascript
let spawn = require('child_process').spawn
spawn('prg', [], {stdio: 'inherit'})
```

- spawn 方法返回一个隐式创建的代表子进程的 ChildProcess 对象
- 子进程对象同样拥有 stdin 属性值为一个可用于读入子进程的标准输入流对象
- 子进程对象同样拥有 stdout 属性值和 stderr 属性值可分别用于写入子进程的标准输出流与标准错误输出流

#### close

- 当子进程所有输入输出都终止时，会触发子进程对象的close事件

  ```javascript
  child.on('close', function(code, signal){})
  ```

  - code 为0表示正常退出，为null表示异常退出
  - 当在父进程中关闭子进程时，signal 参数值为父进程发给子进程的信号名称

#### exit

- 当子进程退出时，触发子进程对象的 exit 事件

- 因为多个进程可能会共享i个输入/输出，所以当子进程退出时，子进程的输入/输出可能并未终止

  ```javascript
  child.on('exit', function(code, signal){})
  ```

#### error

如果子进程开启失败，那么将会触发子进程对象的error事件

```javascript
child1.on('error', function(err) {
    console.log(err)
})
```

#### kill

- 父进程和可以使用 kill 方法向子进程发送信号，参数为描述该信号的字符串，默认参数值为 `SIGTERM`

- SIGTERM 程序结束(terminate)信号，与 SIGKILL 不同的是该信号可以被阻塞和处理，通常用来要求程序自己正常退出

  ```javascript
  child.kill([signal])
  ```

#### 案例

1.spawn.js

```javascript
let path = require('path')
let { spawn } = require('child_process')
// 默认情况下，子进程的 stdin,stdout,stderr 导向 ChildProcess 这个对象的 child.stdin,child.stdout,child.stderr 流
// 这和设置 stdio 为 ['pipe', 'pipe', 'pipe'] 是一样的
let p1 = spawn('node', ['test1.js', 'a'], {
    cwd: path.join(__dirname, 'test1')
})
let p2 = spawn('node', ['test3.js'], {
    cwd: path.join(__dirname, 'test3')
    stdio: 'pipe'
})
// 监听 test1.js 脚本子进程对象的标准输出的data事件，把数据写给p2
p1.stdout.on('data', function(data) {
    console.log('p1:子进程的标准输出：' + data)
    p2.stdin.write(data)
})
p1.on('error', function() {
    console.log('p1:子进程1开启失败')
})
p2.on('error', function() {
    console.log('p2:子进程2开启失败')
})
```

2.test1.js

```javascript
process.stdout.write('p1:子进程当前工作目录为: ' + process.cwd() + '\r\n')
process.stdout.write('p1: ' + process.argv[2] + '\r\n')
```

3.test2.js

```javascript
let fs = require('fs')
let path = require('path')
let out = fs.createWriteStream(path.join(__dirname, 'msg.txt'))
process.stdin.on('data', function(data) {
    out.write(data)
})
process.stdin.on('end', function() {
    process.exit()
})
```

#### detached

- 在默认情况下，只有在子进程全部退出后，父进程才能退出。为了让父进程可以先退出，而让子进程继续进行I/O操作，可以在spawn方法中使用options参数，把detached属性值设置为true

- 默认情况下父进程会等待所有的子进程退出后才可以退出，使用subprocess.unref方法可以让父进程不用等待子进程退出就可以直接退出

  ```javascript
  let cp = require('child_process')
  let fs = require('fs')
  let path = require('path')
  let out = fs.openSync(path.join(__dirname, 'msg.txt'), 'w', 0o666)
  let sp = cp.spawn('node', ['4.detached.js'], {
      detached: true,
      stdio: ['ignore', out, 'ignore']
  })
  sp.unref()
  ```

```javascript
let count = 10
let $timer = setInterval(() => {
    process.stdout.write(new Date().toString() + '\r\n')
    if (--count === 0) {
        clearInterval($timer)
    }
}, 500)
```

### fork开启子进程

- 衍生一个新的 Node.js 进程，并通过建立一个 IPC 通讯通道来调用一个指定的模块，该通道允许父进程与子进程之间相互发送信息

- fork 方法返回一个隐式创建的代表子进程的 ChildProcess 对象

- 子进程的输入/输出操作执行完毕后，子进程不会自动退出，必须使用 `process.exit()`方法显式退出

  ```javascript
  child_process.fork(modulePath, [args], [options])
  ```

- args 运行该文件模块文件时需要使用的参数

- options 选项对象

  - cwd 指定子进程当前的工作目录
  - env 属性值为一个对象，用于以"键名/键值"的形式为子进程指定环境变量
  - encoding 属性值为一个字符串，用于指定输出及标准错误输出数据的编码格式，默认值为 'utf8'
  - silent 属性值为布尔值，当属性值为 false 时，子进程和父进程对象共享标准(输入/输出), true时不共享

#### 发送消息

```javascript
child.send(message, [sendHandle]) // 在父进程中向子进程发送消息
process.send(message, [sendHandle]) // 在子进程中向主进程发送消息
```

- message 是一个对象，用于指定需要发送的消息

- sendHandle 是一个 net.Socket 或 net.Server 对象

- 子进程可以监听父进程发送的message事件

  ```javascript
  process.on('message', function(m, setHandle){})
  ```

- m 参数值为子进程收到的消息

- sendHandler 为服务器对象或 socket 端口对象

当父进程收到子进程发出的消息时，触发子进程的 message 事件

```javascript
child.on('message', function(m, setHandle) {
    // TODO 事件回调函数代码
})
```

5.fork.js

```javascript
let { fork } = require('child_process')
let path = require('path')
let child = fork(path.join(__dirname, 'fork.js'))
child.on('message', function(m) {
    console.log('父进程接收到消息', m)
    process.exit()
})
child.send({
    name: 'zs'
})
child.on('error', function(err) {
    console.error(arguments)
})
```

fork.js

```javascript
process.on('message', function(m, setHandle) {
    console.log('子进程收到消息', m)
    process.send({
        
    })
})
```



#### silent

#### 子进程与父进程共享HTTP服务器

#### 子进程与父进程共享socket对象

### exec 开启子进程

### execFile 开启子进程



