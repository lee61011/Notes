# Stream

## 自定义可读流

为了实现可读流，引用 Readable 接口并用它构造新对象

- 我们可以直接把供使用的数据 push 进去
- 当 push 一个 null 对象就意味着我们想发出信号 —— 这个流没有更多数据了

```javascript
var stream = require('stream')
var util = require('util')
util.inherits(Counter, stream.Readable)
function Counter(options) {
    stream.Readable.call(this, options)
    this._index = 0
}
Counter.prototype._read = function() {
    if(this._index++ < 3) {
        this.push(this._index+'')
    } else {
        this.push(null)
    }
}
var counter = new Counter()
counter.on('data', function(data) {
    cosole.log('读到数据： ' + data.toString()) // no maybe
})
counter.on('end', function(data) {
    console.log('读完了')
})
```

## 可写流

```javascript
// write.js
let {Writable} = require('stream')
let arr = []
let ws = Writable({
    write(chund, encoding, callback) {
        arr.push(chunk)
        callback()
    }
})

for (let i = 0; i < 5; i++) {
    ws.write('' + i)
}
ws.end()
setTimeout(function(){
    console.log(arr.toString())
}, 500)
```

## 管道流

```javascript
// pipe.js
let {Writable, Readable} = require('stream')
let i = 0
let rs = Readable({
    highWaterMark: 2,
    read() {
        if (i < 10) {
            this.push(''+i++)
        } else {
            this.push(null)
        }
    }
})
let ws = Writable({
    write(chunk, encoding, callback) {
        console.log(chunk.toString())
        callback()
    }
})
rs.pipe(ws)
setTimeout(function() {
    // console.log(rs._readableState.length)
    // console.log(rs._writableState.length)
    console.log(rs._readableState.buffer)
    console.log(rs._writableState)
})
```

## 实现双工流

```javascript
// duplex.js
let {Duplex} = requlre('stream')
let index = 0
let duplex = Duplex({
    read() {
        index++<3 ? this.push('a') : this.push(null) // push(null) 表示结束流
    },
    write(chunk, encoding, callback) {
        console.log(chunk.toString().toUpperCase())
        callback() // 写入下一个Buffer
    }
})
// process.stdin 标准输入流
// process.stdout 标准输出流
process.stdin.pipe(duplex).pipe(process.stdout)
// 命令行运行代码 键盘输入a 写入A
```

## 实现转换流

```javascript
// transform.js
let {Transform} = require('stream')
// 转换流是实线数据转换的
let t = Transform({
    transform(chunk, encoding, cb) {
        this.push(chunk.toString().toUpperCase())
        cb()
    }
})
process.stdin.pipe(t).pipe(process.stdout)
```

## 对象流

```javascript
// object.js
let {Transform} = require('stream')
let fs = require('fs')
let rs = fs.createReadStream('./user.json')
// 普通流里放的是Buffer，对象流里放的是对象
let toJSON = Transform({
    readableObjectMode: true, // 加上就可以向可读流里放对象了
    transform(chunk, encoding, cb) {
        // console.log(chunk)
        this.push(JSON.parse(chunk.toString())) // 向可读流里的缓存区里放
    }
})
let outJSON = Transform({
    writeableObjectMode: true,
    transform(chunk, encoding, cb) {
        console.log(chunk)
        cb()
    }
})
rs.pipe(toJSON).pipe(outJSON)


// user.json
{
    "name": "zhangsan"
}
```

## unshift



-------



## 通过流读取数据

- 用 Readable 创建对象 readable 后，便得到了一个可读流
- 如果实现 _read 方法，就将流连接到一个底层数据源
- 流通过调用 _read 向底层请求数据，底层再调用流的 push 方法将需要的数据传递过来
- 当 readable 连接了数据源后，下游便可以调用 readable.read(n) 向流请求数据，同时监听 readable 的 data 事件来接收取到的数据

~~插图~~

## read(fs:2060,372)

## push(fs:2108,197)

## end事件

## doRead

## howMuchToReador

