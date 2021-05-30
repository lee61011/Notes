# Buffer

## 1. 什么是Buffer

- 缓冲区Buffer是暂时存放输入输出数据的一段内存。
- JS语言没有二进制数据类型，而在处理TCP和文件流的时候，必须要处理二进制数据。
- NodeJS提供了一个Buffer对象来提供对二进制数据的操作
- 是一个表示固定内存分配的全局对象，也就是说要放到缓存区中的字节数需要提前确定
- Buffer好比由一个8位字节元素组成的数组，可以有效的在JavaScript中表示二进制数据

## 2.什么是字节

- 字节(Byte)是计算机存储时的一种计量单位，一个字节等于8位二进制数
- 一个位就代表一个0或1，每8个位(bit)组成一个字节(Byte)
- 字节是通过网络传输信息的单位
- 一个字节最大值十进制数是255 （2的8次方-1）

**进制**

- 0b 2进制
- 0x 16进制
- 0o 8进制

- 将任意进制字符串转换为十进制

  ```javascript
  parseInt('11', 2) // 3		2进制转10进制
  parseInt('77', 8) // 63		8进制转10进制
  parseInt('e7', 16) // 175	16进制转10进制
  ```

- 将10进制转换为其他进制字符串

  ```javascript
  (3).toString(2) // 11		十进制转2进制
  (17).toString(16) // 11		十进制转16进制
  (33).toString(32) // 11		十进制转32进制
  ```

  

## 3.定义Buffer的三种方式

### 3.1通过长度定义buffer

```javascript
// 创建一个长度为10、且用 0 填充的Buffer
const buf1 = Buffer.alloc(10)
// 创建一个长度为10、且用 0x1 填充的Buffer
const buf2 = Buffer.alloc(10, 1)
// 创建一个长度为10、且未初始化的Buffer
const buf3 = Buffer.allocUnsafe(10)
```

### 3.2通过数组定义Buffer

```javascript
// 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer
const buf4 = Buffer.from([1, 2, 3])
```

> 正常情况下为 0-255 之间

