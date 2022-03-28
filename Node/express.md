# express

## express应用

### 中间件

中间件就是处理HTTP请求的函数，用来完成各种特定的任务，比如检查用户是否登录、检测用户是否有权限访问等，它的特点是：

- 一个中间件处理完请求和响应可以把相应数据再传递给下一个中间件
- 回调函数的 next 参数，表示接受其他中间件的调用，函数体中的 next()，表示将请求数据继续传递
- 可以根据路径来区分返回执行不同的中间件

中间件的使用方法：

增加中间件

```javascript
var express = require('express')
var app = express()
app.use(function (req, res, next) {
    console.log('全部匹配')
    next()
})
app.use('/water', function(req, res, next) {
    console.log('只匹配 /water')
    next()
})
app.get('/water', function(req, res) {
    res.end('water')
})
app.listen(3000)
```

### 获取参数和查询字符串

- `req.hostname` 返回请求头里的主机名
- `req.path` 返回请求的URL的路径名
- `req.query` 查询字符串

```javascript
// 系统内置中间件，用来为请求和响应对象添加一些方法和属性
app.use(function(req, res, next) {
  const urlObj = url.parse(req.url, true)
  req.query = urlObj.query
  req.path = urlObj.pathname
  req.hostname = req.headers['host'].split(':')[0]
  next()
})
```

### 获取params参数

req.params 匹配到的所有路径参数组成的对象

## 模板的应用

## 静态文件服务器

## 重定向

## 接收 post 响应体

