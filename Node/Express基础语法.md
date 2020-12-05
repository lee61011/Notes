# Express 基础语法

## Express框架基础知识

### 1.安装Express

> npm install express express-session body-parser

### 2.基本使用

- 基于Express创建服务和监听 listen
- express.static搭建web资源服务器
- 基于express实现数据请求的API接口
  - get / post



```javascript
/* server.js */
let express = require('express')
let promiseFS = require('./promiseFS')
let bodyParser = require('body-parser')

let app = express()
app.listen(8080, () => {
    console.log('server is running 8080...')
})

// 中间件：在创建完服务和处理数据(文件)请求之前，我们提前做的一些事情(公共的事情)
// 例如：我们需要在所有的请求之前，把客户端基于请求主体传递的信息获取到，存放到req.body属性上，这样以后到具体接口的处理方法中，想要获取信息直接通过req.body获取即可
// app.use((req, res, next) => {})：使用中间件 next执行是让其继续执行下面该做的事情
/* app.use((req, res, next) => {
    let chunk = ''
    // 正在分批接收客户端传递的请求主体信息 CHART：当前接收的部分
    req.on('data', chart => chunk += chart)
    req.on('end', () => {
        let qs = require('qs')
        req.body = qs.parse(chunk)
        next()
    })
}) */
// 通过执行不同的方法，把客户端传递的内容转化为对象存放在req.body上
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(bodyParser.raw())

// 数据API请求处理    app.get/post/delete/put/head...
// 客户端请求地址 http://127.0.0.1:8080/list?lx=por 将package.json中的dependencies返回，如果lx=dev，返回devDependencies
app.get('/list', (req, res) => {
    let { lx = 'pro' } = req.query // lx值默认pro
    promiseFS.readFile('./package.json').then(result => {
        result = JSON.parse(result)
        result = lx === 'dev' ? result.devDependencies : result.dependencies
        res.status(200)
        res.type('application/json')
        res.send(result)
    }).catch(err => {
        res.status(500)
        res.type('application/json')
        res.send(err)
    })
})

// POST请求 http://127.0.0.1:8080/add 请求主体传递信息 name=xxx&age=xx，服务器接收到请求后把信息存储在本地的AA.json文件中，返回给客户端成功或者失败
app.post('/add', (req, res) => {
    res.status(200)
    res.type('application/json')
    promiseFS.writeFile('./AA.json', req.body).then(() => {
        res.send({
            code: 0,
            codeText: 'OK'
        })
    }).catch(err => {
        res.send({
            code: 1,
            codeText: 'error'
        })
    })
})


// 静态资源文件的请求处理
// express.static([PATH])：到指定的目录中查找客户端需要的资源文件内容，并将其返回
app.use(express.static('./client'))
app.use((req, res) => {
    // 执行static并没有找到对应的资源文件（404处理）
    res.status(404)
    res.send('NOT FOUND ~~')
    // 除了返回404页面 还可以返回重定向处理
    // res.redirect(301, 'http://www.aaa.com')
})

/*
 *	REQUERY对象(REQ)
 *		req.path：存储请求地址的路径名称
 *		req.query：存储问号传参的相关信息(对象)
 *		req.body：在配合body-parser中间件的情况下，req.body存储的是请求主体传递过来的信息
 *		req.method：请求方式
 *		req.get：获取响应头信息
 *	RESPONSE对象(RES)
 *		res.end：类似于原生的操作，结束响应并返回内容
 *		res.json：返回给客户端内容，只不过传递的数据可以使JSON对象(内部会帮我们将其转换为JSON字符串，服务返回给客户端的内容一般都是字符串或者buffer格式)
 *		res.send：最常用的给客户端返回信息(可以传递对象/PATH/BUFFER/TXT等)，基于SEND是通过响应主体返回给客户端信息
 *		res.status：返回状态码
 *		res.type：返回content-type的类型值
 *		res.set：设置响应头信息 res.set([KEY],[VALUE])  res.set({KEY:VALUE, ...})
*/
```

