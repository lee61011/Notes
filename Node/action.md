# action

## 静态资源服务器命令行工具

1. 创建一个服务器
2. 实现压缩
3. 实现缓存
4. 实现断点续传
5. 发布命令行工具

`静态资源服务器`

### -r/--range

- 该选项指定下载字节的范围，常应用于分块下载文件

- range的表示方式有多种，如100-500，则指定从100开始的400个字节数据；-500表示最后的500个字节；5000-表示从第5000个字节开始的所有字节

- 另外还可以同时指定多个字节块，中间用 "," 分开

- 服务器告诉客户端可以使用range  `response.setHeader('Accept-Ranges', 'bytes')`

- Server通过请求头中的`Range: bytes=0-xxx` 来判断是否做Range请求，如果这个值存在而且有效，则只发回请求的那部分文件内容，响应的状态码变成206，如果无效，则返回416状态码，表明Request Range Not Satisfiable

  > curl -r 0-1024 -o music.mp3

## 多语言切换

可以通过 Accept-Language 检测浏览器的语言

- 请求头格式 Accept-Language: Accept-Language:zh-CN,zh;q=0.9
- 响应头格式 Content-Language:zh-CN

```javascript
let http = reqire('http')
let pack = {
    en: { title: 'hello' },
    cn: { title: '欢迎' }
}

function request(req, res) {
    // 实现服务器和客户端的协议，选择客户端最想要的，并且服务器刚好有的
    // Accept-Language:zh-CN,zh;q=0.9;en;q=0.8,jp;q=0,7
    let acceptLanguage.split(',').map(item => {
        let values = item.split(';')
        return {
            name: values[0].split('-')[0],
            q: isNaN(values[1]) ? 1 : parseInt(values[1])
        }
    }).sort((lan1, lan2) => lan1.q - lan2.q).shift().name
    // TODO
}
```

## 图片防盗链

- 从一个网站跳转，或者网页引用到某个资源文件时，HTTP请求中带有Referer表示来源网页的URL
- 通过检查请求头中的Referer来判断来源网页的域名
- 如果来源域名不在白名单内，则返回错误提示
- 用浏览器直接访问图片地址是没有Referer的

```javascript
let http = require('http')
let url = require('url')
let path = require('path')
let fs = require('fs')
let root = path.join(__dirname, 'public')

function removePort(host) {
    return host.split(':')[0]
}
function getHostName(urlAddr) {
    let { host } = url.parse(urlAddr)
    return removePort(host)
}
function request(req, res) {
    let refer = req.headers['referer'] || req.headers['referrer']
    if (refer) {
        
    }
}
```



## 代理服务器

代理(Proxy)，也称网络代理，是一种特殊的网络服务，允许一个网络终端(一般为客户端)通过这个服务与另一个网络终端(一般为服务器)进行非直接的连接。一些网关、路由器等网络设备具备网络代理功能。一般认为代理服务有利于保障网络终端的隐私或安全，防止攻击。

```javascript
npm install http-proxy --save
```

- web 代理普通的HTTP请求
- listen port
- close 关闭内置的服务

https://www.npmjs.com/package/http-proxy

```javascript
let httpProxy = require('http-proxy')
let http = require('http')
let proxy = httpProxy.createProxyServer()

http.createServer(function(req, res) {
    proxy,.web(req, res, {
        target: 'http://localhost:8000'
    })
    proxy.on('error', function(err) {
        console.log('出错了')
        res.end(err.toString())
    })
}).listen(8080)
```



## 虚拟主机

