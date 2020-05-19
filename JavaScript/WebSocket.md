# WebSocket

------

## 什么是 WebSocket

WebSocket 是 HTML5 一种新的协议。他实现了浏览器与服务器全双工通信(full-duplex)。一开始的握手需要借助 HTTP 请求完成。WebSocket 是真正实现了全双工通信的服务器向客户端推的互联网技术。它是一种在单个 TCP 连接上进行全双工通讯协议。

> 全双工和单工的区别？
>
> - 全双工(Full Duplex) 是通讯传输的一个术语。通信允许数据在两个方向上同时传输，他在能力上相当于两个弹弓通信方式的结合。全双工指可以同时(瞬时)进行信号的双向传输( A-B且B-A )。指A-B的同时B-A是瞬时同步的
> - 单工、半双工(Half Duplex)，所谓的半双工就是指一个时间段内只有一个动作发生，举个简单例子，一条窄窄的马路，同时只能有一辆车通过，当目前有两辆车对开，这种情况下就只能一辆先过，等到头儿后另一辆再开，这个例子就形象的说明了半双工的原理。早期的对讲机、以及早期集线器等设备都是基于半双工的产品。随着技术的不断进步，半双工会逐渐退出历史舞台。
>
> 



## socket.io

Socket.IO 是一个 WebSocket 库，包括了客户端的 js 和服务器端的 nodejs，它的目标是构建可以在不同浏览器和移动设备上使用的实时应用。

### socket.io 的特点

- 易用性：socket.io 封装了服务端和客户端，使用起来非常简单方便。
- 跨平台：socket.io 支持跨平台，这就意味着你有了更多的选择，可以在自己喜欢的平台下开发实时应用。
- 自适应：他会自动根据浏览器从 WebSocket、AJAX 长轮询、iframe流等等各种方式中选择最佳的方式来实现网络实时应用，非常方便和人性化，而且支持的浏览器最低达IE5.5.

### 初步使用

#### 安装部署

使用 npm 安装 socket.io

> $ npm install socket.io

#### 启动服务

创建 `app.js` 文件

```js
var express = require('express')
var path = require('path')
var app = express()

app.get('/', function(req, res) {
    res.sendFile(path.resolve('index.html'))
})

var server = require('http').createServer(app)
var io = require('socket.io')(server)

io.on('connection', function(socket) {
    console.log('客户端已经连接')
    socket.on('message', function(msg) {
        console.log(msg)
        socket.send('sever: ' + msg)
    })
})
server.listen(80)
```

#### 客户端引用

服务端运行后会在根目录动态生成 socket.io 的客户端 js 文件，客户端可以通过固定路径 `/socket.io/socket.io.js` 添加引用