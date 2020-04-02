# JWT认证

------

## 使用 Vue-cli3.0 创建 Vue 项目

```shell
vue create jwt-lesson
```

可以通过 vue ui 创建项目 / 管理项目依赖 vue ui

## 配置 vue-config.js

```js
let path = require('path')
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/vue-project' : '/',
    outputDir: 'myassets',	// 输出路径
    assetsDir: 'static',	// 生成静态目录的文件夹
    runtimeCompiler: true,	// 是否可以使用 template 模板
    parallel: require('os').cpus().length > 1,	// 多余1核CPU时 启动并行压缩
    productionSourceMap: false,	// 生产环境下 不使用个soruceMap
    
    // ...
}
```

## 封装 ajax 发送请求的方法

`lib/ajaxRequest.js`

```js
import axios from 'axios'

// 每个请求的拦截器方法可能不一样

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/'
})

// 请求拦截 会在请求的时候拦截当前的请求
instance.interceptors.request.use((config) => {
    console.log(1)
    return config
})
// 可以给一个 axios 实例创建多个拦截器，按顺序执行
instance.interceptors.request.use((config) => {
    console.log(1)
    return config
})

export default instance
```

`api/index.js`

```js
import axios from '../lib/ajaxRequest'

// 返回是 promise
export const getTest = () => axios({ url: '/test' })
```

