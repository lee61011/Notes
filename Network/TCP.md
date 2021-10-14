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



# UDP

## 创建socket

```javascript
let socket = dgram.createSocket(type, [callback])
socket.on('message', function(msg, rinfo) {})
```

- type 必须输入，指定是udp4还是udp6

- callback 从该接口接收到数据时调用回调函数

  - msg 接收到的数据
  - rinfo 信息对象
    - address 发送者的地址
    - family ipv4还是ipv6
    - port 发送者的 socket 端口号
    - size 发送者所发送的数据字节数

  ```javascript
  socket.bind(port,[address],[callback])
  socket.on('listening', callback)
  ```

- port 绑定的端口号

- address 监听的地址

- callback 监听成功后的回调函数

## 向外发送数据

如果发送数据前还没有绑定过地址和端口号，操作系统将为其分配一个随机端口并可以接收任何地址的数据

```javascript
socket.send(buf, offset, length, port, address, [callback])
```

- buffer 代表缓存区
- offset 从缓存区第几个字节开始发
- length 要发送的字节数
- port 对方的端口号
- address 接收地址的 socket 地址





