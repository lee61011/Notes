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

`rs.js`
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
// 希望流有一个暂停和恢复触发的机制
rs.on('data', function(data) {
  console.log(data)
  rs.pause() // 暂停读取和发射data事件
  setTimeout(function() {
    rs.resume() // 恢复读取并触发data事件
  }, 2000)
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

不是所有流都有打开关闭事件的，只有文件流才有

### 监听close事件

### 设置编码

### 暂停和恢复触发data

## 可写流 createWriteStream

`ws.js`
```javascript
/*  可写流 就是往里面写  */
// 当往可写流里写数据的时候，不是会立刻写入文件的，而是会先写入缓存区缓存区的大小就是highWaterMark,默认值是16k. 然后等缓存区满了之后再次真正的写入文件里
let fs = require('fs')
let ws = fs.createWriteStream('./2.txt', {
  flags: 'w',
  mode: 0o666,
  start: 0,
  highWaterMark: 3
})

// 如果缓存区已满，返回false，如果缓存区未满，返回true
// 如果能接着写，返回true，如果不能接着写，返回false
// 按理说如果返回了false，就不能再往里面写了，但是如果真写了，数据也不会丢失，会缓存在内存里。等缓存区清空之后再从内存里读出来
let flag = ws.write('1')
console.log(flag) // true
flag = ws.write('2')
console.log(flag) // true
flag = ws.write('3')
console.log(flag) // false
flag = ws.write('4')
console.log(flag) // false
```

### 创建可写流

### write方法

### end方法

```javascript
ws.end(chunk, [encoding], [callback])
```

> 表明接下来没有数据要被写入 Writable 通过传入可选的 chunk 和 encoding 参数，可以在关闭流之前再写入一段数据，如果传入了可选的 callback 函数，它将作为 'finish' 事件的回调函数

### drain方法

- 当一个流不处在 drain 的状态，对 write() 的调用会缓存数据块，并且返回 false。一旦所有当前所有缓存的数据块都排空了(被操作系统接受来进行输出)，那么 'drain' 事件就会被触发

- 建议，一旦 write() 返回 false，在 'drain' 事件触发前，不能写入任何数据块

  ```javascript
  let fs = require('fs')
  let ws = fs.createWriteStream('./2.txt', {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: 3
  })
  let i = 10
  function write() {
      let flag = true
      while (i && flag) {
          flag = ws.write('1')
          i--
          // TODO 未完待续
      }
  }
  ```

### finish方法

在调用了 stream.end() 方法，且缓冲区数据都已经传给底层系统之后，'finish' 事件将被触发

```javascript
var writer = fs.createWriteStream('./2.txt')
for (let i = 0; i < 100; i++) {
    writer.write(`hello, ${i}!\n`)
}
writer.end('结束\n')
writer.on('finish', () => {
    console.error('所有的写入已经完成！')
})
```

## pipe方法

### pipe方法的原理

```javascript
var fs = require('fs')
var ws = fs.createWriteStream('./2.txt')
var rs = fs.createReadStream('./1.txt')
rs.on('data', function(data) {
    var flag = ws.write(data)
    if (!flag)
        rs.pause()
})
ws.on('drain', function() {
    rs.resume()
})
rs.on('end', function() {
    ws.end()
})
```

### pipe用法

```javascript
readStream.pipe(writeStream)
var from = fs.createReadStream('./1.txt')
var to = fs.createWriteStream('./2.txt')
from.pipe(to)
```

> 将数据的滞留量限制到一个可接受的水平，以使得不同速度的来源和目标不会淹没可用内存

### unpipe用法

- readable.unpipe() 方法将之前通过 stream.pipe() 方法绑定的流分离
- 如果 destination 没有传入，则所有绑定的流都会被分离

### cork

### uncork

## 简单实现

### 可读流的简单实现

```javascript
let fs = require('fs')
let ReadStream = require('./ReadStream')
let rs = ReadStream('./1.txt', {
    flags: 'r',
    encoding: 'utf8',
    start: 3,
    end: 7,
    highWaterMark: 3
})
rs.on('open', function() {
    console.log('open')
})
rs.on('data', function(data) {
    console.log(data)
})
rs.on('end', function() {
    console.log('end')
})
rs.on('close', function() {
    console.log('close')
})
```

`ReadStream.js`

```javascript
module.exports = ReadStream
let fs = require('fs')
let util = require('util')
let EventEmitter = require('events')

function ReadStream(path, options) {
    // TODO 未完待续
}
```



### 可写流的简单实现

`write.js`

```javascript
let fs = require('fs')
let WriteStream = require('./WriteStream')
// let ws = fs.createWriteStream('./1.txt', {
let ws = new WriteStream('./1.txt', {
    flags: 'w',
    mode: 0o666,
    start: 0,
    encoding: 'utf8',
    autoClose: true, // 当流写完之后自动关闭文件
    highWaterMark: 3
})
let n = 9

ws.on('error', err => console.log(err))
function write() {
    let flag = true
    while(flag && n>0) {
        flag = ws.write(n+'', 'utf8', () => {console.log('ok')})
        n--
        console.log(flag)
    }
    ws.once('drain', () => {
        console.log('drain')
        write()
    })
}
write()
```

`WriteStream.js`

```javascript
let fs = require('fs')
let EventEmitter = require('events')

class WriteStream extends EventEmitter {
    constructor(path, options) {
        super(path, options)
        this.path = path
        this.flags = options.flags || 'w'
        this.mode = options.mode || 0o666
        this.start = options.start || 0
        this.pos = this.start // 文件的写入索引
        this.encoding = options.encoding || 'utf8'
        this.autoClose = options.autoClose
        this.highWaterMark = options.highWaterMark || 16*1024
        this.buffers = [] // 缓存区
        
        this.writing = false // 表示内部正在写入数据
        this.length = 0 // 表示缓存区字节的长度
        this.open()
    }
    
    open() {
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if (err) {
                if (this.autoClose) {
                    this.destroy() // 打开文件失败，销毁流
                }
                this.emit('error', err)
            }
            this.fd = fd
            this.emit('open')
        })
    }
    // 如果底层已经在写入数据的话，则必须当前要写入数据放在缓冲区里
    write(chunk, encoding, cb) {
        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, this.encoding)
        let len = chunk.length
        // 缓存区的长度加上当前写入的长度
        this.length += len
        // 判断当前最新的缓存区是否小于最高水位线
        let ret = this.length < this.highWaterMark
        if (this.writing) { // 表示正在向底层写数据，则当前数据必须放在缓存区里
            this.buffers.push({
                chunk,
                encoding,
                cb
            })
        } else { // 直接调用底层的写入方法进行写入
            // 在底层写完当前数据后要清空缓存区
            this.writing = true
            this._write(chunk, encoding, () => this.clearBuffer())
        }
        return ret
    }
    clearBuffer() {
        // 取出缓存区中的第一个buffer
        let data = this.buffers.shift()
        if (data) {
            this._write(data.chunk, data.encoding, () => this.clearBuffer())
        } else {
            this.writing = false
            this.emit('drain') // 缓存区清空了
        }
    }
    _write(chunk, encoding, cb) {
        if (typeof this.fd !== 'number') { // 文件还没有打开
            return this.once('open', () => this._write(chunk, encoding, cb))
        }
        fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, bytesWritten) => {
            if (err) {
                if (this.autoClose) {
                    this.destroy()
                    this.emit('error', err)
                }
            }
            this.pos += bytesWritten
            this.length -= bytesWritten // 写入多少字节，缓存区要减少多少字节
            cb && cb()
        })
    }
    destroy() {
        fs.close(this.fd, () => {
            this.emit('close')
        })
    }
}

module.exports = WriteStream
```

