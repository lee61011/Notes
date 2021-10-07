# Stream

## 流的概念

-   流是一组有序的，有起点和终点的字节数据传输手段
-   它不关心文件的整体内容，只关注是否从文件中读到了数据，以及读到数据之后的处理
-   流是一个抽象接口，被 Node 中的很多对象所实现。比如 HTTP 服务器 request 和 response 对象都是流

## 可读流 createReadStream

实现了 `stream.Readalbe` 接口的对象，将对象数据读取为流数据，当监听data事件后，开始发射数据

```javascript
fs.createReadStream = function(path, options) {
  return new ReadStream(path, options)
}
util.inherits(ReadStream, Readable)
```

### 创建可读流

```javascript
var rs = fs.createReadStream(path, [options])
```

```javascript
/*  可读流  */
let fs = require('fs')
// 通过 fs.createReadStream 创建一个可读流
let rs = fs.createReadStream('./1.txt', {
  flags: 'r', // 要对文件进行何种操作
  mode: 0o666, // 权限位
  encoding: 'utf8', // 设置编码
  start: 3, // 从索引为3的位置开始读
  end: 8, // 读到索引为8结束(唯一一个包括结束索引的)
  highWaterMark: 3 // 缓冲区大小
})
rs.on('open', function() {
  console.log('文件打开')
})
// rs.setEncoding('utf8') // 设置编码，也可写在参数内

// 监听它的data事件，一旦开始监听data事件的时候，流就开始读文件的内容并且发射data
// 默认情况下，当监听data事件后，会不停的读数据，然后触发data事件，触发完data事件后再次读数据
rs.on('data', function(data) {
  console.log(data)
})
// 如果读取文件出错了，会触发error事件
rs.on('error', function() {
  console.log('error')
})
// 如果文件的内容读完了，会触发end事件
rs.on('end', function() {
  console.log('读完了')
})
rs.on('close', function() {
  console.log('文件关闭')
})
```

1.   path 读取文件的路径
2.   options
     1.   flags 打开文件要做的操作，默认为'r'
     2.   encoding 默认为 null
     3.   start 开始读取的索引位置
     4.   end 结束读取的索引位置 (包括结束位置)
     5.   highWateMark 读取缓存区默认的大小 64kb

### 监听data事件

### 监听end事件

### 监听error事件

### 监听open事件

### 监听close事件

### 设置编码

### 暂停和恢复触发data

## 可写流 createWriteStream

### 创建可写流

### write方法

### end方法

### drain方法

### finish方法

## pipe方法

### pipe方法的原理


### pipe用法

### unpipe用法

### cork

### uncork

## 简单实现

### 可读流的简单实现
