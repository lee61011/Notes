# fs文件模块系统

09 - fs 	1:03

## fs模块

- 在 Node.js 中，使用 fs 模块来实现所有有关文件及目录的创建、写入及删除操作
- 在 fs 模块中，所有的方法都分为同步和异步两种实现
- 具有 `sync`后缀的方法为同步方法，不具有`sync`后缀的方法为异步方法

## 整体读取文件

**异步读取**

> fs.readFile(path[, options], callback)

- options
  - encoding
  - flag flag 默认 = 'r'

**同步读取**

> fs.readFileSync(path[, options])

## 从指定位置处开始读取文件

### 打开文件

### 读取文件

### 写入文件

```javascript
// write.js
let str = '珠峰'
let fs = require('fs')
fs.open('./1.txt', 'w', 0o666, (err, fd) => {
  let buff = Buffer.from(str)
  fs.write(fd, buff, 0, 3 null, (err, bytesWritten) => {
    console.log(bytesWritten)
    // 当我们调用write方法写入文件的时候，并不会直接写入物理文件，而是会先写入缓存区，在批量写入物理文件
    fs.write(fd, buff, 3, 3, null, (err) => {
      // 迫使操作系统立刻马上把缓存区的内容写入物理文件
      fs.fsync(fd, () => {
        fs.close(fd, () => {
          console.log("文件关闭完成")
        })
      })
    })
  })
})
```



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

```javascript
function copy(src, dest, callback) {
  let buf = Buffer.alloc(BUFFER_SIZE)
  fs.open(src, 'r', function(err, readFd) {
    err ? callback(err) : fs.open(dest, 'w', function(err, writeFd) {
      err ? callback(err) : !function read(err) {
        err ? callback(err) : fs.read(readFd, buf, 0, BUFFER_SIZE, null, function(err, bytesRead, buffer) {
          bytesRead && fs.write(writeFd, buf, 0, bytesRead, read)
        })
      }();
    })
  })
}
```



### 目录操作

#### 创建目录

>   fs.mkdir(path[, mode], callback)
>   要求父目录必须存在

#### 判断一个文件是否有权限访问

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
fs.rmdir('a/b/c') // 这一定是一个空目录

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

#### 读取目录下所有的文件

>   fs.readdir(path[, options], callback)

```javascript
// readdir.js
let fs = require('fs')
let path = require('path')
fs.readdir('./a', function(err, files) {
  console.log(files)
  files.forEach(file => {
    let child = path.join('a', file) // 拼接子路径
    fs.state(child, function(err, stat) {
      console.log(stat) // 文件详细信息
    })
  })
})
```



#### 查看文件目录信息

>   fs.stat(path, callback)

-   stats.isFile()
-   stats.isDirectory()
-   atime(Access Time) 上次被读取的时间
-   ctime(State Change Time) 属性或内容上次被修改的时间
-   mtime(Modified Time) 档案的内容上次被修改的时间

#### 移动文件或目录

>   fs.rename(oldPath, newPath, callback)

#### 删除文件

>   fs.unlink(path, callbakc)

#### 截断文件

>   fs.ftruncate(fd[, len], callback)

```javascript
const fd = fs.openSync('temp.txt', 'r+')
// 截断文件至前4个字节
fs.ftruncate(fd, 4, (err) => {
  console.log(fs.readFileSync('temp.txt', 'utf8'))
})
```

#### 删除空目录

只能用在空目录上

```javascript
let fs = require('fs')
function rmdirp(target) {
  let files = fs.readdirSync(target)
  files.forEach(function(item) {
    let child = target+'/'+item
    if(fs.statSync(child).isDirectory()) {
      rmdirp(child)
    } else {
      fs.unlinkSync(child)
    }
  })
  fs.rmdirSync(target)
}
rmdirp('a')
```

异步删除非空目录

```javascript
function rm(dir) {
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err, stat) => {
      if (err) return reject(err)
      if (stat.isDirectory()) {
        fs.readdir(dir, (err, files) => {
          if (err) return reject(err)
          Promise.all(files.map(file => rm(path.join(dir, file)))).then(() => {
            fs.rmdir(dir, resolve)
          })
        })
      } else {
        fs.unlink(dir, resolve)
      }
    })
  })
}
rm('a').then(data => console.log(data), function(err) {
  console.error(err)
})
```

#### 遍历算法

目录是一个树状结构，在遍历时一般使用深度优先+先序遍历算法。深度优先，意味着到达一个节点后，首先接着遍历子节点而不是邻居节点。先序遍历意味着首次到达了某个节点就算遍历完成，而不是最后一次返回某个节点才算数。因此使用这种遍历方式时，下边这棵树的遍历顺序是 A>B>D>E>C>F	

```javascript
			A
   B			C
D		E				F
```

##### 同步深度优先+先序遍历

```javascript
function deepSync(dir) {
  console.log(dir)
  fs.readdirSync(dir).forEach(file => {
    let child = path.join(dir, file)
    let stat = fs.statSync(child)
    if (stat.isDirectory()) {
      deepSync(child)
    } else {
      console.log(child)
    }
  })
}
```

##### 异步深度优先+先序遍历

```javascript
// preorder.js
let fs = require('fs')
function preDeep(dir, callback) {
  console.log(dir)
  fs.readdir(dir, (err, files) => {
    !function next(i) {
      if (i >= files.length) return callback()
      let child = path.join(dir, files[i])
      fs.stat(child, (err, stat) => {
        if (stat.isDirectory()) {
          preDeep(child, () => next(i+1))
        } else {
          console.log(child)
          next(i+1)
        }
      })
    }(0);
  })
}
preDeep('a', () => {
  console.log('全部迭代完毕')
})
```

##### 同步的广度优先先序遍历

```javascript
// wide.js
let fs = require('fs')
let path = require('path')
function wide(dir) {
  let arr = [dir]
  while(arr.length > 0) {
    let current = arr.shift() // 取出队列最左边的元素
    console.log(current)
    let stat = fs.statSync(current)
    if (stat.isDirectory()) {
      let files = fs.readdirSync(current)
      files.forEach(item => {
        arr.push(path.join(current, item))
      })
    }
  }
}
wide('a')
```

##### 异步广度优先+先序遍历

##### 监视文件或目录

>   fs.watchFile(filename[, options], listener)

```javascript
let fs = require('fs')
fs.watchFile('1.txt', (curr, prev) => {
  // parse() 方法可解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
  if (Date.parse(prev.ctime) === 0) {
    console.log('创建')
  } else if (Date.parse(curr.ctime) == 0) {
    console.log('删除')
  } else if (Date.parse(prev.ctime) != Date.parse(curr.ctime)) {
    console.log('修改')
  }
})
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


**flags** 读取文件flag标志位参数

| 符号 | 含义                                     |
| ---- | ---------------------------------------- |
| r    | 读文件，文件不存在报错                   |
| r+   | 读取并写入，问价不存在报错               |
| rs   | 同步读取文件并忽略缓存                   |
| w    | 写入文件，不存在则创建，存在则清空       |
| wx   | 排它写入文件                             |
| w+   | 读取并写入文件，不存在则创建，存在则清空 |
| wx+  | 和w+类似，排它方式打开                   |
| a    | 追加写入                                 |
| ax   | 与a类似，排它方式写入                    |
| a+   | 读取并追加写入，不存在则创建             |
| ax+  | 作用与a+类似，但是以排它方式打开文件     |

**助记**

- r 读取
- w 写入
- s 同步
- +. 增加相反操作
- x 排他方式
- r+ w+的区别
  - 当文件不存在时，r+不会创建，而会导致调用失败，但w+会创建
  - 如果文件存在，r+不会自动清空文件，但w+会自动把已有文件的内容清空



### Linux权限







## path

path是node中专门处理路径的一个核心模块

-   path.join 将多个参数值字符串组合为一个路径字符串
-   path.basename 获取一个路径中的文件名
-   path.extname 获取一个路径中的扩展名
-   path.sep 操作系统指定的文件分割符
-   path.delimiter 属性值为系统指定的环境变量路径分隔符
-   path.normalize 将非标准的路径字符串转化为标准路径字符串 特点：
    -   可以解析 . 和 ..
    -   多个杠可以转换成一个杠
    -   在Windows下反杠会转化成正杠
    -   如结尾以杠结尾，则保留斜杠
-   resolve
    -   以应用程序根目录为起点
    -   如果参数是普通字符串，则意思是当前目录的下级目录
    -   如果参数是 .. 回到上一级目录
    -   如果是 / 开头表示一个绝对的根路径

```javascript
// path.js
let path = require('path')

// 连接两个目录
console.log(path.join('a', 'b'))
// resolve从当前路径出发，解析出一个绝对路径
// ..代表上一级目录	.代表当前目录		字符串a代表当前目录下面的a目录
console.log(path.resolve('..', '.', 'a'))

// 环境变量路径分割符；	=> 因为在不同的操作系统 分割符不一样
path.delimiter
console.log(path.win32.delimiter) // win系统分割符;
console.log(path.posix.delimiter) // linux系统分割符:
// 文件路径分割符\
path.sep
console.log(path.win32.sep) // \
console.log(path.posix.sep) // /

path.relative // 获取两个路径之间的相对路径

// basename获取的是文件名
path.basename('aa.jpg') // aa.jpg
path.basename('aa.jpg', '.jpg') // aa 第二个参数表示取消.jpg后缀
path.extname('aa.jpg') // extname获取的是文件扩展名
```

