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
