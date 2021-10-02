# fs文件模块系统

09 - fs 	1:03
09 - fs 	1:09.40



## 从指定位置处开始读取文件

### 打开文件

### 读取文件

### 写入文件

### 关闭文件

>   fs.close(fd, [callback])

### 同步磁盘缓存

>   fs.fsync(fd, [callback])

```javascript
let buf = Buffer.from('珠峰培训')
fs.open('./2.txt', 'w', function(err, fd) {
  fs.write(fd, buf, 3, 6, 0, function(err, written, buffer) {
    console.log(written)
    fs.fsync(fd, function(err) {
      fs.close(fd, function(err) {
        console.log('写入完毕')
      })
    })
  })
})
```

### 拷贝文件



### 目录操作

#### 创建目录

>   fs.mkdir(path[, mode], callback)
>   要求父目录必须存在

**判断一个文件是否有权限访问**

>   fs.access(path[, mode], callback)
>
>   ```javascript
>   fs.access('/etc/passwd', fs.constants.R_OK | fs.constants.W_OK, (err) => {
>     console.log(err ? 'no access!' : 'can read/write')
>   })
>   ```

### 递归创建目录

```javascript
let fs = require('fs')
let path = require('path')
function mkdirp(dirs, cb) {
  let paths = dirs.split('/')
  !function next(i) {
		if (i > paths.length) return cb()
		// TODO SOMETHING
  }
}
```

```javascript
// dir.js

// 如何创建目录
let fs = require('fs')
// 当创建目录的时候 必须要求父目录是存在的
fs.mkdir('a/b', function(err) {
  console.log(err)
})


// 判断一个文件或目录是否存在 fs.exists(该方法已废弃,可使用下面的方法)
/* fs.access('a', fs.constants.R_OK, funciton(err) {
	console.log(err)
}) */

// 递归异步创建目录 mkdirp: linux mkdir -p
function mkdirp(dir) {
  let paths = dir.split('/')
  !function next(index) {
		if(index > paths.length) return
		let current = paths.slice(0, index).join('/')
    fs.access(current, fs.constants.R_OK, function(err) {
			if (err) {
				fs.mkdir(current, 0o666, next.bind(null, index+1))
      } else {
				next(index+1)
      }
    })
  }(1);
}
mkdirp('a/b/c')
```

```javascript
/* 作业：实现一个rmdirp()方法递归删除非空目录 */
let path = require('path')
let fs = require('fs')
// 获取一个目录下面的所有的文件或目录
fs.readdir()
// 删除一个文件
fs.unlink(path)
// 删除一个空目录
fs.rmdir('a/b/c')

// 同步方法实现
function rmdirp(dir) {
  let files = fs.readdirSync(dir)
  files.forEach(funciton(file) {
		let current = dir+'/'+file
		let child = fs.statSync(current)
  	if (child.isDirectory()) { // 判断是目录还是文件
			rmdirp(current)
    } else {
			fs.unlinkSync(current)
    }
	})
  // 如果把一个目录下面的所有文件或目录全部删除后 要删除自己
  fs.rmdirSync(dir)
}
rmdirp('a')
```



## 文本编码

使用 NodeJs 编写前端工具时，操作的最多的是文本文件，因此也就涉及到了文件编码的处理问题。我们常用的文本编码有 UTF8 和 GBK 两种，并且 UTF8 文件还可能带有 BOM。在读取不同编码的文本文件时，需要将文件内容转换为 JS 使用的 UTF8 编码字符串后才能正常处理。

### BOM 的移除

BOM用于标记一个文本文件使用 Unicode 编码，其本身是一个 Unicode 字符("\uFEFF")，位于文本文件头部。在不同 Unicode 编码下，BOM 字符对应的二进制字节如下：

>   | Bytes    | Encoding |
>   | -------- | -------- |
>   | FE FF    | UTF16BE  |
>   | FF FE    | UTF16LE  |
>   | EF BB BF | UTF8     |

因此，我们可以根据文本文件头几个字节等于啥来判断文件是否包含 BOM，以及使用哪种 Unicode 编码。但是，BOM 字符虽然起到了标记文件编码的作用，其本身却不属于文件内容的一部分，如果读取文本文件时不去掉 BOM，在某些使用场景下就会有问题。例如我们把几个 JS 文件合并成一个文件后，如果文件中间含有 BOM 字符，就会导致浏览器 JS 语法错误。因此，使用 NodeJs 读取文本文件时，一般需要去掉BOM。

```javascript
/*  bom.js  */
let fs = require('fs')
fs.readFile('1.txt', function(err, data) {
  if (data[0] === 0xef && data[1] === 0xbb && data[2] === 0xbf) {
    data = data.slice(3) // 'utf-8' 编码格式打开后内容会多三个字节bom 需要移除bom
  }
})

function readText(pathname) {
  var bin = fs.readFileSync(pathname)
  if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
    bin = bin.slice(3)
  }
  return bin.toString('utf-8')
}
```

### GBK 转 UTF8

NodeJs 支持在读取文本文件时，或者在 Buffer 转换为字符串时指定文本编码，但遗憾的是，GBK 编码不在 NodeJs 自身支持范围内(NodeJs不支持GBK编码)。因此，一般我们借助 iconv-lite 这个三方包来转换编码。使用 NPM 下载包后，我们可以按下边方式编写一个读取 GBK 文本文件的函数

```javascript
var iconv = require('iconv-lite')
function readGBKText(pathname) {
  var bin = fs.readFileSync(pathname)
  // 实现转码操作，把一个GBK编码的Buffer转变成UTF8字符串
  return iconv.decode(bin, 'gbk')
}
```



