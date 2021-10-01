# fs文件模块系统

09 - fs 	1:03
09 - fs 	1:09.40



## 目录操作

### 创建目录

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

## 递归创建目录

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



