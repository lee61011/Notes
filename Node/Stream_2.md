# Stream

## Node.js 中有四种基本的流

- Readable - 可读的流 (例如 fs.createReadStream())
- Writable - 可写的流 (例如 fs.createWriteStream())
- Duplex - 可读写的流 (例如 net.Socket)
- Transform - 在读写过程中可以修改和变换数据的 Duplex 流 (例如 zlib.createDeflate())

## 流中的数据有两种模式，二进制模式和对象模式

- 二进制模式，每个分块都是 buffer 或者 string 对象
- 对象模式，流内部处理的是一系列普通对象

> 所有使用 Node.js API 创建的流对象都只能操作 strings 和 Buffer 对象。但是，通过一些第三方流的实现，你依然能够处理其他类型的 JavaScript 值 (除了 null，它在流处理中有特殊意义)。这些流被认为是工作在 "对象模式"( object mode )。在创建流的实例时，可以通过 objectMode 选项使流的实例切换到对象模式。试图将已经存在的流切换到对象模式是不安全的。

## 可读流的两种模式

- 可读流事实上工作在下面两种模式之一：`flowing` 和 `paused`

- 在 flowing 模式下，可读流自动从系统底层读取数据，并通过 EventEmitter 接口的事件尽快将数据提供给应用

- 在 paused 模式下，必须显式调用 stream.read() 方法来从流中读取数据片段

  ```javascript
  // 当监听 readable 事件的时候，会进入暂停模式；可读流会马上去向底层读取文件，然后把读到文件的文件放在缓存区里 const state = this._readableState
  // self.read(0) 只填充缓存，但是并不会发射 data 事件，但是会发射 stream.emit('readable') 事件
  rs.on('readable', function() {
      console.log(rs._readableState.length) // length就是指的缓存区数据的大小 state.length += chunk.length
      // read如果不加参数表示读取整个缓存区数据
      let ch = rs.read(1) // 1表示读取1个字节，如果可读流发现要读的字节大小小于等于缓存字节大小，则直接返回
      console.log(ch)
      console.log(rs._readableState.length)
      ch = rs.read(1)
      console.log(ch)
      console.log(rs._readableState.length)
      // 当读完指定的字节后，如果可读流发现剩下的字节已经比最高水位线小了，则会立马再次读取填满最高水位线
      setTimeout(function() {
          console.log(rs._readableState.lenght)
      }, 200)
  })
  ```

- 所有初始工作模式为 paused 的 Readable 流，可以通过下面三种途径切换到 flowing 模式：

  - 监听 data 事件
  - 调用 stream.resume() 方法
  - 调用 stream.pipe() 方法将数据发送到 Writable

- 可读流可以通过下面途径切换到 paused 模式：

  - 如果不存在管道目标( pipe destination )，可以通过调用 stream.pause() 方法实现。
  - 如果存在管道目标，可以通过取消 data 事件监听，并调用 stream.unpipe() 方法移除所有管道目标来实现

> 如果 Readable 切换到 flowing 模式，且没有消费者处理流中的数据，这些数据将会丢失。比如，调用了 readable.resume() 方法却没有监听 data 事件，或是取消了 data 事件监听，就有可能出现这种情况

## 缓存区

## 可读流的三种状态

## readable

## 暂停模式的简单实现
