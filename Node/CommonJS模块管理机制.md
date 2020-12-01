## CommonJS 模块管理机制

> AMD：require.js
> CMD：sea.js
> CommonJS：node.js
> ES6 Module
>
> 这些模块化思想，规定了在JS中我们的模块该如何创建、如何导入及如何导出

- 内置模块
- 第三方模块
- 自定义模块：自己写的模块

### NODE 中的模块管理

1. 在 NODE 环境中，每创建一个 JS，都相当于创建了一个新的模块；模块中的方法也都是模块的私有方法，不同模块之间的同名方法不会有任何的冲突

2. module.exports 就是 NODE 天生自带的用来导出模块中方法的方式

   ```javascript
   /* A.js */
   module.exports = {
       xxx: xxx	// 这些属性方法就是需要暴露给外面调取使用的
   }
   
   /* B.js */
   let A = require('./A')
   ```

3. require 是 NODE 天生提供的用来导入模块的方法；语法：let [模块名] = require([模块的地址])

4. require 导入模块是同步的（没导入完成，后面的事情是不处理的）；每一次导入模块都是吧导入的模块中的 JS 代码从上到下执行一遍



```javascript
/*
	需求：创建A/B/C三个模块
		A中有一个SUM方法实现任意数求和
		B中有一个方法AVG求平均数：去掉最大和最小值，剩余值求和（调取A中的SUM方法，实现求和）
		C中调取B中的AVG，传递：98 95 85 67 25，实现求一堆数中平均数
*/

/* A.js */
// let sum = (...arg) => eval(arg.join('+')) // 任意数求和方式一：不做非有效数字校验
function sum(...arg) {
    let total = 0;
    arg.forEach(item => {
        item = Number(item)
        if (!isNaN(item)) {
            total += item
        }
    })
    return total
}
// sum(10, 20, 30)
module.exports = { sum }


/* B.js */
let A = require('./A')
let avg = (...arg) => {
    arg = arg.sort((a, b) => a - b).slice(1, arg.length - 1)
    return (A.sum(...arg) / arg.length).toFixed(2)
}
module.exports = { avg }

/* C.js */
let { avg } = require('./B.js')
```





### 内置模块

- fs 内置模块

  - 常规方法：readdir / readFile / writeFile / mkdir / rmdir / appendFile / copyFile ... ...
    
    fs.readFileSync([path], [encoding])：不设置编码格式，默认得到的是 Buffer 文件流格式的数据，设置 UTF8，得到的结果是字符串（例如：JSON格式、HTML或者CSS等格式）；但是对于富媒体资源（例如：图片，音视频等）我们读取和传输过程中就是基于 BUFFER 文件流格式操作的，所以不要设置 UTF8 读取

    fs.rmdir 删除目录，但是一定要保证目录中不再有文件，否则不让删除
    fs.unlink([path], [callback]) 删除文件
    
  - promise 异步的 fs 操作

- url 内置模块

  - url.parse(url[, flag])

- path 内置模块

  - __dirname：模块中这个内置变量是当前模块所在的绝对路径
  - ____filename：相对于 ____dirname 来讲，多了模块名称
  - path.resolve()

- http 内置模块

  - http.createServer()
  - erver.listen()

### Promise 版 FS 库的封装

```javascript
let fs = require('fs')
let path = require('path')

function readFile(pathname) {
    // 富媒体资源在获取内容的时候不能使用UTF8编码格式
    let suffixREG = /\.([0-9a-zA-Z]+)$/, // 以 .xxx 结尾的正则
        suffix = suffixREG.test(pathname) ? suffixREG.exec(pathname)[1] : '',
        encoding = 'utf8'
    /^(PNG|GIF|JPG|JPEG|WEBP|BMP|ICO|SVG|MP3|MP4|WAV|OGG|M3U8)$/i.test(suffix) ? encoding = null : null
    
    // 用户调用的时候，传递的pathname都是以项目根目录作为参考(执行JS也是在根目录执行的)，用户只需要把读取文件，相对根目录的路径和名称传递进来即可 => 获取的是绝对路径
    pathname = path.resolve(pathname)
    
    return new Promise((resolve, reject) => {
        fs.readFile(pathname, encoding, (err, result) => {
            if(err !== null) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
}

// fs.readFile('').then(result => {})
module.exports = { readFile }
```

```javascript
/* utils/promiseFS.js */

let fs = require('fs')
let path = require('path')
let exportsOBJ = {}

// 根据后缀名返回编码格式 UTF8 / null
function suffixHandle(pathname) {
    let suffixREG = /\.([0-9a-zA-Z]+)$/,
        suffix = suffixREG.test(pathname) ? suffixREG.exec(pathname)[1] : '',
        encoding = 'utf8'
    /^(PNG|GIF|JPG|JPEG|WEBP|BMP|IOC|SVG|MP3|MP4|WAV|OGG|M3U8)$/i.test(suffix) ? encoding = null : null
    return encoding
}

['readFile', 'readdir', 'mikdir', 'rmdir', 'unlink'].forEach(item => {
    exportsOBJ[item] = function anonymous(pathname) {
		// 根据后缀处理 encoding
        pathname = path.resolve(pathname)
        return new Promise((resolve, reject) => {
            let encoding = suffixHandle(pathname),
                callback = (err, result) => {
                    if (err!==null) {
                        reject(err)
                        return
                    }
                    resolve(result)
                }
            if (item !== 'readFile') {
                encoding = callback
                callback = null
            }
            fs[item](pathname, encoding, callback)
        })
    }
})

// writeFile / appendFile
['writeFile', 'appendFile'].forEach(item => {
    exportsOBJ[item] = function anonymous(pathname, content) {
		// 根据后缀处理 encoding
        pathname = path.resolve(pathname)
        // 如果content是JSON对象 转化为JSON字符串
        content !== null && typeof content === 'object' ? content = JSON.stringify(content) : null
        typeof content !== 'string' ? content += '' : null
        
        return new Promise((resolve, reject) => {
            let encoding = suffixHandle(pathname),
                callback = (err, result) => {
                    if (err!==null) {
                        reject(err)
                        return
                    }
                    resolve(result)
                }
            fs[item](pathname, content, encoding, callback)
        })
    }
})

// copyFile
exportsOBJ['copyFile'] = function anonymous(pathname1, pathname2) {
    // 根据后缀处理 encoding
    pathname1 = path.resolve(pathname1)
    pathname2 = path.resolve(pathname2)
    
    return new Promise((resolve, reject) => {
        fs['copyFile'](pathname1, pathname2, err => {
            if (err!==null) {
                reject(err)
                return
            }
            resolve()
        })
    })
}

module.exports = exportsOBJ
```



### HTTP内置模块和服务创建

```javascript
let url = require('url')

// url.parse() 用来解析 URL 中每一部分信息，第二个参数传 true，自动会把问好参数解析成键值对的方式，存储在query属性中
let str = 'http://www.baidu.com:80/stu/index.html?lx=1&from=weixin#teacher'
console.log(url.parse(str))
```

```javascript
/* server.js */

/*
	服务器端要做的常规任务
		1.首先想干事需要有一个服务（创建服务：IIS/NGINX/APPACHE/NODE[HTTP/HTTPS 内置模块]） => 端口号
		2.接收客户端的请求信息（请求静态资源文件的、请求数据的）
		3.查找到对应的资源文件内容或者对应的数据信息
		4.把找到的内容返回给客户端
*/
let http = require('http'),
    url = require('url')

let server = http.createServer();
function listen(PORT) {
    try {
        server.listen(PORT, () => {
            console.log(`server is runing ${PORT}`)
        })
    } catch (err) {
        PORT++
        listen(PORT)
    }
}
listen(80)
```

