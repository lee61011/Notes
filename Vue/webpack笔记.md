# webpack笔记



## webpack 中的插件

### html-webpack-plugin

html-webpack-plugin 是 webpack 中的 HTML 插件，可以通过此插件自定制 index.html 页面的内容。
需求：通过 html-webpack-plugin 插件，将 src 目录下的 index.html 首页，复制到项目根目录中一份！

- 通过 HTML 插件复制到项目跟目录中的 index.html 页面，也被放到了内存中
- HTML 插件再生成的 index.html 页面的底部，自动注入了打包的 bundle.js 文件

### devServer 节点

在 webpack.config.js 配置文件中，可以通过 devServer 节点对 webpack-dev-server 插件进行更多的配置，

```javascript
devServer: {
    open: true, // 初次打包完成后，自动打开浏览器
    host: '127.0.0.1', // 实时打包所使用的主机地址
    port: 80, // 实时打包所使用的端口号
}
```



webpack 中的 loader

2. loader 的调用过程
   ![]()

3. 打包处理 css 文件

   - 在 webpack 打包入口文件  index.js 中引入 index.css、index.less 文件

   - 运行 `npm i style-loader@2.0.0 css-loader@5.0.1 less-loader@7.1.0 less@3.12.2 -D` 命令，安装处理 css 文件的 loader

   - 在 webpack.config.js 的 module -> rules 数组中，添加 loader 规则如下

     ```javascript
     module: { // 所有第三方文件模块的匹配规则
         rules: [ // 文件后缀名的匹配规则
             { test: /\.css$/, use: ['style-loader', 'css-loader'] },
             { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
             // { test: /\.jpg|png|gif$/, use: 'url-loader?limit=22229' }
             // 带参数项的 loader 还可以通过对象的方式进行配置：
             {
                 test: /\.jpg|png|gif$/, // 匹配图片文件
                 use: {
                     loader: 'url-loader', // 通过 loader 属性指定要调用的 loader
                     options: { // 通过 options 属性指定参数项
                         limit: 22229
                     }
                 }
             }
         ]
     }
     
     /*
     	test 表示匹配的文件类型，use 表示对应要调用的 loader
     	1. use 数组中指定的 loader 顺序是固定的
     	2. 多个 loader 的调用顺序是：从后往前调用
     */
     ```

4. 打包处理样式表中与 `url路径相关` 的文件

   - 运行 `npm i url-loader@4.1.1 file-loader@6.2.0 -D` 命令
   - 在 webpack.config.js 的 module -> rules 数组中，添加 loader 规则：参考 css loader 配置
   - 配置项中的 ？之后的是 loader 的参数项：
     limit 用来指定图片的大小，单位是字节 byte
     只有 <= limit 大小的图片，才会被转为 base64 格式的图片
   - `带参数项的 loader 还可以通过对象的方式进行配置`

5. 打包处理 js 文件中的高级语法
   webpack 只能打包处理一部分高级的 JavaScript 语法；对于那些 webpack 无法处理的高级 js 语法，需要借助于 babel-loader 进行打包处理。例如 webpack 无法处理下面的 JavaScript 代码：

   ```javascript
   class Person {
       // 通过 static 关键字，为 Person 类定义了一个静态属性 info
       // webpack 无法打包处理 '静态属性' 这个高级语法
       static info = 'person info'
   }
   console.log(Person.info)
   ```

   - 安装 babel-loader 相关的包
     `npm i babel-loader@8.2.1 @babel/core@7.12.3 @babel/plugin-proposal-class-properties@7.12.1 -D`

   - 配置 babel-loader

     ```javascript
     {
         test: /\.js$/,
         // exclude 表示排除项
         exclude: /node_modules/,
         use: {
             loader: 'babel-loader',
             options: { // 参数项
                 // 声明一个 babel 插件，此插件用来转化 class 中的高级语法
                 plugins: ['@babel/plugin-proposal-class-properties'],
             }
         }
     }
     ```





### 打包发布

1. **为什么要打包发布：**

   - 开发环境下，打包生成的文件存放在内存中，无法获取到最终打包生成的文件
   - 开发环境下，打包生成的文件不会进行代码压缩和性能优化

2. **配置 webpack 的打包发布**
   在 package.json 文件的 scripts 节点下，新增 build 命令如下：

   ```json
   "scripts": {
       "dev": 'webpack serve',
       "build": "webpack --mode production"
   }
   ```

   --model 是一个参数项，用来指定 webpack 的运行模式。production 代表生产环境，会对打包生成的文件进行`代码压缩`和`性能优化`
   注意：通过 --model 指定的参数项，会覆盖 webpack.config.js 中的 model 选项

3. **把 JavaScript 文件统一生成到 js 目录中**
   在 webpack.config.js 配置文件的 output 节点中，进行如下的配置：

   ```javascript
   output: {
       path: path.join(__dirname, 'dist'),
       // 明确告诉 webpack 把生成的 bundle.js 文件存放到 dist 目录下的 js 子目录中
       filename: 'js/bundle.js'
   }
   ```

4. **把图片文件统一生成到 image 目录中**
   修改 webpack.config.js 中的 url-loader 配置项，新增 outPutPath 选项即可指定图片文件的输出路径

   ```javascript
   {
       test: /\.jpg|png|gif$/,
       use: {
           loader: 'url-loader',
           options: {
               limit: 22229,
               outputPath: 'image' // 指定把打包生成的图片文件，存储到 dist 目录下的 image 文件夹中
           }
       }
   }
   ```

5. **自动清理 dist 目录下的旧文件**
   为了在每次打包发布时`自动清理掉 dist 目录中的旧文件`，可以安装并配置 clean-webpack-plugin 插件：

   ```javascript
   // 安装清理 dist 目录的 webpack 插件
   # npm install clean-webpack-plugin@3.0.0 -D
   
   // 按需导入插件、得到插件的构造函数之后，创建插件的实例对象
   const { CleanWebpackPlugin } = require('clean-webpack-plugin')
   const cleanPlugin = new CleanWebpackPlugin()
   
   // 把创建的 cleanPlugin 插件实例对象，挂载到 plugins 节点中
   plugins: [htmlPlugin, cleanPlugin], // 挂载插件
   ```

6. **企业级项目的打包发布**
   企业级项目在进行打包发布时，主要的发布流程如下：

   - 生成打包报告，根据报告分析具体的优化方案
   - Tree-Shaking
   - 为第三方库启用 CDN 加载
   - 配置组件的按需加载
   - 开启路由懒加载
   - 自定制首页内容







### Source Map

1. 生产环境遇到的问题
   前端项目在投入生产环境之前，都需要对 JavaScript 源代码进行压缩混淆，从而减小文件的体积，提高文件的加载效率。此时就不可避免的产生了另一个问题：
   对压缩混淆之后的代码除错(debug)是一件极其困难的事情
   变量被替换成没有任何语义的名称
   空行和注释被剔除

2. 什么是 Source Map
   Source Map 就是一个信息文件，里面存储着位置信息。也就是说，Source Map 文件中存储着代码压缩混淆前后的对应关系
   有了它，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码，能够极大地方便后期的调试

3. webpack 开发环境下的 Source Map
   在开发环境下，webpack 默认启用了 Source Map 功能，当程序运行出错时，可以直接在控制台提示错误行的位置，并定位到具体的源代码
   3.1 开发环境下默认生成的 Source Map 记录的是生成后的代码的位置，会导致运行时报错的行数与源代码的行数不一致的问题
   3.2 解决默认Source Map 的问题
   开发环境下，推荐在 webpack.config.js 中添加如下的配置，即可保证运行时报错的行数与源代码的行数保持一致

   ```javascript
   module.exports = {
       mode: 'development',
       // eval-source-map 仅限在'开发模式'下使用，不建议在'生产模式'下使用
       // 此选项生成的 Source Map 能够保证'运行时报错的行数'与'源代码的行数'保持一致
       devtool: 'eval-source-map',
   }
   ```

4. webpack 生产环境下的 Source Map
   在生产环境下，如果省略了 devtool 选项，则最终生成的文件中不包含 Source Map 这能够防止原始代码通过 Source Map 的形式暴露给别有所图之人
   4.1 只定位行数不暴露源码
   在生产环境下，如果只想定位报错的具体行数，且不想暴露源码，此时可以将 devtool 的值设置为 `nosources-source-map`
   4.2 定位行数且暴露源码
   再生产环境下，如果想在定位报错行数的同事，展示具体报错的源码，此时可以将 devtool 的值设置为 `source-map`

5. Source Map 的最佳实践

   1. 开发环境下：
      建议把 devtool 的值设置为 eval-source-map
      好处：可以精准定位到具体的错误行
   2. 生产环境下：
      建议关闭 Source Map 或将 devtool 的值设置为 `nosources-source-map`
      好处：防止源码泄漏，提高网站的安全性









### vue3.x 和 vue2.x 版本的对比

vue2.x 中绝大多数的 API 与特性，在 vue3.x 中同样支持。同时，vue3.x 中还新增了 3.x 所特有的功能、并废弃了某些 2.x 中的旧功能

新增的功能例如：
组合式API、多根节点组件、更好的 TypeScript 支持等

废弃的旧功能如下：
过滤器、不在支持 $on，$off 和 $once 实例方法等







## Vue3.0

### 单页面应用程序的缺点

对于 SPA 单页面应用程序来说，主要的缺点有如下两个：

1. 首屏加载慢
   - 路由懒加载
   - 代码压缩
   - CDN 加速
   - 网络传输压缩
2. 不利于 SEO
   - SSR 服务端渲染

### 快速创建 Vue 的 SPA 项目的两种方式

|                            | vite               | vue-cli                |
| -------------------------- | ------------------ | ---------------------- |
| 支持的 vue 版本            | 仅支持 vue3.x      | 支持 3.x 和 2.x        |
| 是否基于 webpack           | 否                 | 是                     |
| 运行速度                   | 快                 | 较慢                   |
| 功能完整度                 | 小而巧（逐渐完善） | 大而全                 |
| 是否建议在企业级开发中使用 | 目前不建议         | 建议在企业级开发中使用 |

**创建 vite 项目**
按照顺序执行如下命令，即可基于 vite 创建 vue3.x 的工程化项目：

```shell
npm init vite-app 项目名称
cd 项目名称
npm install
npm run dev
```











