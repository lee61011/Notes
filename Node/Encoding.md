# Encoding

## 字符发展历史

### 字节

- 计算机内部，所有信息最终都是一个二进制值
- 每一个二进制(bit)有0和1两种状态，因此八个二进制位就可以组合出256中状态，这被称为一个字节(byte)

### 单位

- 8位 = 1字节
- 1024字节 = 1K
- 1024K = 1M
- 1024M = 1G
- 1024G = 1T



## Buffer

### 什么是 Buffer

- 缓冲区 Buffer 是暂时存放输入输出的数据的一段内存
- JS 语言没有二进制数据类型，而在处理 TCP 和文件流的时候，必须要处理二进制数据
- Nodejs 提供了一个 Buffer 对象来提供对二进制数据的操作
- 是一个表示固定内存分配的全局对象，也就是说要放到缓存区中的字节数需要提前确定
- Buffer 好比由一个8位字节元素组成的数组，可以有效的在 JavaScript 中表示二进制数据

### 什么是字节

- 字节 byte 是计算机存储时的一种计量单位，一个字节等于8位二进制数
- 一个位就代表一个0或1，每8个位 bit 组成一个字节 Byte
- 字节是通过网络传输信息的单位
- 一个字节最大值十进制数是255  2**8-1

### 进制

- 0b 2进制
- 0x 16进制
- 0o 8进制

- 将任意进制字符串转换为十进制
  - parseInt('11', 2)   // 3 2进制转10进制
  - parseInt('77', 8)   // 63 8进制转10进制
  - parseInt('e7', 16)   // 175 16进制转10进制
- 将10进制转换为其他进制字符串
  - (3).toString(2)    // '11'  十进制转2进制
  - (17).toString(16)    // '11'  十进制转16进制
  - (33).toString(32)    // '11'  十进制转32进制



### 定义Buffer的三种方式

- 通过长度定义buffer
- 通过数组定义buffer
- 字符串创建

### buffer常用方法

- buf.fill(value[, offset[, end]][,encodin])
- write方法
- writeInt8
  - Little-Endian & Big-Endian
- toString方法
- slice方法
  - 截取乱码问题
- copy方法
- concat方法
- isBuffer
- length

### base64转换

- Base64是网络上最常见的用于传输8Bit字节码的编码方式之一，Base64就是一种基于64个可打印字符来表示二进制数据的方法

- Base64要求把每三个8Bit的字节转换为四个6Bit的字节(38 = 46 = 24)，然后把6Bit再添两位高位0，组成四个8Bit的字节，也就是说，转换后的字符串理论上将要比原来的长 1/3

  ```javascript
  const CHARTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabckefghijklmnopqrstuvwxyz0123456789+/'
  function transfer(str) {
      let buf = Buffer.from(ste)
      let result = ''
      for(let b of buf) {
          result += b.toString(2)
      }
      return result.match(/(\d{6})/g/).map(val=>parseInt(val,2)).map(val=>CHARTS[val]).join('')
  }
  let r = transfer('珠') // 54+g
  ```

  























