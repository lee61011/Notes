# compress

## 压缩与解压缩处理

可以使用`zlib`模块进行压缩及解压缩处理，压缩文件以后可以减少体积，加快传输速度和节约带宽代码

## 压缩对象

压缩和解压缩对象都是一个可读可写流

| 方法               | 说明                                                   |
| ------------------ | ------------------------------------------------------ |
| zlib.createGzip    | 返回Gzip流对象，使用Gzip算法对数据进行压缩处理         |
| zlib.createGunzip  | 返回Gzip流对象，使用Gzip算法对压缩的数据进行解压缩处理 |
| zlib.createDeflate | 返回Deflate流对象，使用Deflate算法对数据进行压缩处理   |
| zlib.createInflate | 返回Deflate流对象，使用Deflate算法对数据进行解压缩处理 |



## 压缩和解压缩

## 在http中的应用

## 方法调用

