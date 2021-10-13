# TCP

在 Node.js 中，提供了 net 模块用来实现 TCP 服务器和客户端的通信

## TCP服务器

```javascript
net.createServer([options][, connectionListener])
```

- options.allowHalfOpen 是否允许单方面连接，默认值为 false
- connectionListener 参数用于指定当客户端与服务器建立连接时所要调用的回调函数，回调中有一个参数 socket，指的是 TCP 服务器监听的 socket 端口对象

也可以通过监听 connection 事件的方式来指定监听函数

```javascript
server.on('connection', function(socket){})
```

### 启动TCP服务器

可以使用 listen 方法通知服务器开始监听客户端的连接

```javascript
server.listen(port, [host], [backlog], [callback])
```

- port 必须指定的端口号
- 

### 使用TCP服务器

### address

### getConnections

### close

## socket

### address

### 读取数据

### 监听关闭事件

### pipe

### unpipe

### pause & resume

### setTimeout

## TCP客户端

### TCP客户端

### 写入数据

### close

### unref & ref

### bufferSize

### keepAlive





