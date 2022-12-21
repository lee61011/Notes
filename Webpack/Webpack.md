# Webpack

## webpack学习顺序

- webpack5实战使用
- webpack优化
- webpack工作流 AST抽象语法树
- loader
- plugin tapable
- hmr 实现原理



## 1. 安装
 npm install webpack webpack-cli --save-dev
### 1.2 入口(entry)
 - 入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图(dependency graph)的开始。进入入口起点后，webpack会找出有哪些模块和库是入口起点(直接和间接)依赖的
 - 默认值是 `/src/index.js` 可以通过在 `webpack configutation` 中配置 entry 属性，来指定一个(或多个)不同的入口起点
#### 1.2.1 src/index.js
 ```javascript
 let title = require('./title.txt')
 document.write(title.default)
 ```
#### 1.2.2 webpack.config.js

 ```javascript
 const { resolve } = require('path')
 module.exports = {
   entry: './src/index.js'
 }
 
 /* package.json */
 "scripts": {
     // "build": "webpack" // 默然找webpack.config.js配置
     "build": "webpack --config webpack.config2.js" // 可通过--config修改使用指定的配置文件
 }
 ```

### 1.3 输出(output)

- `output` 属性告诉 webpack 在哪里输出它所创建的 bundle 以及如何命名这些文件
- 主要输出文件的默认值是 `/dist/main.js` 其它生成文件默认放置在 `/dist` 文件夹中

`webpack.config.js`

```javascript
const path = require('path')
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // __dirname 输出文件夹的绝对路径
        filename: 'main.js' // 输出的文件名
    }
}
```

### 1.4 loader

- webpack 只能理解 JavaScript 和 JSON 文件
- loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应程序使用，以及被添加到依赖图中

```javascript
const path = require('path')
module.exports = {
    module: {
        rules: [
            {test: /\.txt$/, use: 'raw-loader'}
        ]
    }
}
```

### 1.5 插件(plugin)

- loader用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量

#### 1.5.1 src/index.html

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    plugins: [
        new HtmlWebpackPlugin(template: './src/index.html')
    ]
}
```

### 1.6 模式(mode)

- 日常的前端开发工作中 一般都会有两套构建环境
- 一套开发时使用，构建结果用于本地开发调试，不进行代码压缩，打印debug信息 包含sourcemap文件
- 一套构建后的结果是直接应用于线上的 即代码都是压缩后 运行时不打印debug信息 静态文件不包括sourcemap
- webpack 4.x 版本引入了 mode 的概念
- 当你指定使用 production mode 时，默认会启用各种性能优化的功能，包括构建结果优化以及 webpack 运行性能优化
- 而如果是 development mode 时，则会开启 debug 工具，运行时打印详细的错误信息，以及更加快速的增量编译构建

#### 1.6.1 环境差异

- 开发环境
  - 需要生成 sourcemap 文件
  - 需要打印 debug 信息
  - 需要 live reload 或者 hot reload 的功能
- 生产环境
  - 可能需要分离 CSS 成单独的文件，以便多个页面共享同一个 CSS 文件
  - 需要压缩 HTML/CSS/JS 代码
  - 需要压缩图片
- 其默认值为 production

### 1.7 浏览器兼容性

- webpack 支持所有符合 ES5 标准的浏览器 (不支持 IE8 及以下版本)
- webpack 的 import() 和 require.ensure() 需要 Promise。如果你想要支持旧版本浏览器，在使用这些表达式之前，还需要提前加载 polyfill



## 开发环境配置

### 2.1 开发服务器

参考 webpack4 与 webpack5 官方文档

### 2.2 支持CSS

- css-loader 用来翻译处理 @import 和 url()
- style-loader 可以把 CSS 插入 DOM 中

#### 2.2.1 安装模块

```shell
cnpm i style-loader css-loader less less-loader node-sass sass-loader -D
```

#### 2.2.2 webpack.config.js

```javascript
module: {
    rules: [
        {test: /\.css$/, use: ['style-loader', 'css-loader']},
        {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
        {test: /\.sass$/, use: ['style-loader', 'css-loader', 'sass-loader']}
    ]
}
```

```javascript
module: {
    rules: [
        {test: /\.(jpg|png|gif|bmp)$/, use: [{
            loader: 'file-loader',
            options: {
                name: '[hash:10].[ext]'
            }
        }]}
    ]
}
```

#### 引入图片的方式

- 放在静态文件根目录里，通过html中的image直接引用，需要配置 `devServer.contentBase`
- 通过 require import 引入
- 可以在 CSS 中通过 url 引入图片 css-loader 来进行解析处理

#### url-loader 和 file-loader

- url-loader 是对 file-loader 的增强
- 判断图片的大小是否大于 limit，如果大于的话就会把工作交给 file-loader 处理
- 如果是小于的话，就转成base64自己处理



### 转义ES6/ES7/JSX

- Babel其实是一个编译JavaScript的平台，可以把ES6/ES7/React的JSX转义为ES5

#### 安装依赖

- `babel-loader` 使用Babel和webpack转译JavaScript文件
- `@babel/@babel/core` Babel编译的核心包
- `@babel/@babel/preset-env` 为每一个环境的预设
- `@babel/@babel/preset-react` React插件的Babel预设
- `@babel/plugin-proposal-decorators` 把类和对象装饰器编译成ES5
- `@babel/plugin-proposal-class-properties` 转换静态类属性以及使用属性初始值化语法声明的属性

```shell
cnpm i babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/polyfill -D
cnpm i @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
```

#### webpack.config.js

- `@babel/preset-env` 只能转化JS语法
- `@babel/polyfill` 提供ES2015+环境的 polyfill

```javascript
module: {
    rules: [
        {test: /\.jsx?$/,use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: [
                        // "@babel/preset-env", // 可以转换JS语法
                        ["@babel/preset-env", {
                            useBuiltIns: 'usage', // 按需加载polyfill
                            corejs: {version: 3}, // 指定corejs的版本号 2或者3 polyfill
                            targets: { // 指定要兼容哪些浏览器
                                chrome: '60',
                                firefox: '60',
                                ie: '9',
                                safari: '10',
                                edge: '17'
                            }
                        }],
                        "@babel/preset-react" // 可以转换JSX语法
                    ]
                }
            }
        ]}
    ]
}
```

#### babel-polyfill

- Babel默认只转换新的javascript语法，而不转换新的API，比如 lerator,Generator,Set, Maps ,Proxy,.Relect,Symbol Promise等全局对象。以及一些在全局对象上的方法(比如Object.assign)都不会转码。
- 比如说，ES6在Array对象上新增了Aray.form方法，Babel就不会转码这个方法，如果想让这个方法运行，必须使用babel-polyfill 来转换等
- babel-polyfill 它是通过向全局对象和内置对象的prototype上添加方法来实现的。比如运行环境中不支持Array.prototype.find方法，引入polyfill ,我们就可以使用es6方法来编写了，但是缺点就是会造成全局空间污染
- @babel@babel/preset-env为每一个环境的预设
  - "useBuiltlns : false此时不对 polyill做操作。如果引入@babel/polyfill，则无视配置的浏览器兼容，引入所有的 polyfill
  - "useBuiltins": "entry"根据配置的浏览器兼容，引入浏览器不账容的 polyfill。需要在入口文件手动添加import'@babel/polyfill，会自动根据browserslist 替换成浏览器不兼客的所有polyfill
  - 这里需要指定core-js 的版本,如果"corejs*: 3,则 import @babelpolyi 需要改成impor 'corejstabiel /impot 'regenerator-runtime/runtime';
  - "useBuitins";"usage”usage会根据配置的浏览器兼容，以及你代码中用到的API来进行 polyill，实现了按需添加

### path的区别和联系?

- publicPath可以看作是devServer对生成目录`dist`设置的虚拟目录，devServer首先从devServer.publicPath中取值，如果它没有设置，就取‘output. publicPath`的值作为虚拟目录，如果它也没有设置，就取默认值 '/'
- `output.publicPath`不仅可以影响虚拟目录的取值，也影响利用` html-webpack-plugin`插件生成的index.html中引用的js、css、img等资源的引用路径。会自动在资源路径前面追加设置的output.publicPath
- 一般情况下都要保证`devServer'中的 `publicPathR与'output.publicPath保持一致

| 类别      | 配置名称    | 描述                                                         |
| --------- | ----------- | ------------------------------------------------------------ |
| output    | path        | 指定输出到硬盘上的目录                                       |
| output    | publicPath  | 表示的是打包生成的index.html文件里面引用资源的前缀           |
| devServer | publicPath  | 表示的是打包生成的静态文件所在的位置(若是devServer里面的publicPath没有设置，则会认为是output里面设置的publicPath的值) |
| devServer | contentBase | 用于配置提供额外静态文件内容的目录                           |



###  打包第三方类库

#### 直接引入 (痛点是比较麻烦，每次都要引)

```javascript
import _ from 'lodash'
alert(_.join(['a', 'b', 'c'], '@'))
```

#### 插件引入 (方便点是不需要手动引入了，直接就能用。缺点是无法在全局下使用)

- webpack配置ProvidePlugin后，在使用时将不再需要import和require进行引入，直接使用即可
- _函数会自动添加到当前模块的上下文，无需显示声明

```javascript
new webpack.ProvidePlugin({
    _: 'lodash'
})
```

> 没有全局的 `$` 函数，所以导入依赖全局变量的插件依旧会失败

#### expose-loader引入

#### CDN (需要手动导入插件CDN脚本，而且不管代码里有没有用到，我们都会引入)

```javascript
// 如果已经通过CDN外链引入的方式引入了一个lodash库并且挂载到了_变量上了
external: {
    lodash: '_'
}
```

#### 外链插件

```javascript
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

plugins: [
    new HtmlWebpackExternalsPlugin({
        externals: [{
            module: 'lodash',
            entry: 'https://cdn.xxx/xxx/lodash.js',
            global: '_'
        }]
    })
]
```





## 生产环境配置

### 提取CSS

- 因为CSS的下载和JS可以并行，当一个HTML文件很大的时候，我们可以把CSS单独提取出来加载

> cnpm install --save-dev mini-css-extract-plugin

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [
      // webpack在打包后会把所有的产出的资源放在一个assets对象上
      new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        // 用MiniCssExtractPlugin.loader替换掉style-loader
        // 把所有的css样式先收集起来
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
```

### hash、chunkhash和contenthash

- `文件指纹`是指打包后输出的文件名和后缀
- hash一般是结合CDN缓存来使用，通过webpack构建后，生成对应文件名自动带上对应的MD5值。如果文件内容改变的话，那么对应文件哈希值也会改变。引用的URL地址也会改变，触发CDN服务器从源服务器上拉取对应数据，进而更新本地缓存

指纹占位符

| 占位符名称  | 含义                                                   |
| ----------- | ------------------------------------------------------ |
| ext         | 资源后缀名                                             |
| name        | 文件名称                                               |
| path        | 文件的相对路径                                         |
| folder      | 文件所在的文件夹                                       |
| hash        | 每次webpack构建时生成一个唯一的hash值                  |
| chunkhash   | 根据chunk生成hash值，来源于同一个chunk，则hash值就一样 |
| contenthash | 根据内容生成hash值，文件内容相同hash值就相同           |

#### hash

- Hash 是整个项目的 hash 值，其根据每次编译内容计算得到，每次编译之后都会生成新的 hash，即修改任何文件都会导致所有文件的 hash 发生改变

#### chunkhash

- chunkhash和hash不一样，他根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。我饿们在生产环境xxxxxx,单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响

```javascript
module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].[chunkhash].css"
        })
    ]
}
```

#### contenthash

- 使用chunkhash存在一个问题，就是当在一个JS文件中引入css文件，编译后他们的hash是相同的，而且只要js文件发生变化，关联的xxxxxx，使用`mini-css-extract-plugin`里的`contenthash`值，保证即使css文件所处的模块里就算其他文件内容改变，只要css文件内用不变，那么xxxxxxx

```javascript
module.exports = {
    pluigins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash].css"
        })
    ]
}
```

### CSS兼容性

- 为了浏览器的兼容性，有时候我们必须加入-webkit,-ms,-o,-moz这些前缀
  - Trident内核:主要代表为lE浏览器,前缀为-ms
  - Gecko内核:主要代表为Firefox.前缀为-moz
  - Presto内核:主要代表为Opera,前缀为-o
  - Webkit内核:产要代表为Chrome和Safari,前缀为-webkit
- 伪元素:placeholder可以选择一个表单元素的占位文本，它允许开发者和设计师自定义占位文本的样式。

#### 安装

- https://caniuse.com
- postcss-loader可以使用PostCSS处理CSS
- postcss-preset-env把现代的CSS转换成大多数浏览器能理解的
- PostCSS Preset Env 已经包含了 autoprefixer 和 browsers 选项

> npm i postcss-loader postcss-preset-env -D

#### postcss.config.js

```javascript
let postcssPreseEnv = require('postcss-preset-env')
module.exports = {
    plugins: [postcssPreseEnv()]
}
```

### 压缩JS、CSS和HTML

- optimize-css-assets-webpack-plugin 是一个优化和压缩CSS资源的插件
- terser-webpack-plugin 是一个优化和压缩JS资源的插件

```javascript
// webpack.config.js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

/* module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin()
        ]
    }
} */
module.exports = (env) => ({
    optimization: {
        minimize: env && env.production, // 如果是生产环境才开启压缩
        minimizer: (env && env.production) ? [
            new TerserPlugin() // 如果是生产环境才会配置js压缩器
        ] : [] // 否则不配置任何压缩器
    },
    plugins: [
        (env && env.production) && new OptimizeCssAssetsWebpackPlugin()
    ].filter(Boolean)
})
```



### px 自动转成 rem

- lib-flexible + rem 实现移动端自适应
- px2rem-loader 自动将px转换为rem
- px2rem
- 页面渲染时计算根元素的 font-size 值

#### 安装

> cnpm i px2rem-loader lib-flexible -D

`index.html`

```html
<script>
	let docEle = document.documentElement
    function setRemUnit() {
        // 750/10=75	375/10=37.5
        docEle.style.fontsize = docEle.clientWidth / 10 + 'px'
    }
    setRemUnit()
    window.addEventListener('resize', setRemUnit)
</script>
```

















CopyWebpackPlugin
// 一个入口可能会对应多个代码块，一个代码块可能会对应多个文件 main main.js main.css  (代码分割)







WebpackDevMiddleware

DevServer: { proxy }

before







```javascript
// public 是属性修饰符  public 表示自己和子类和子类之外都可以访问到
// protected 只有自己和自己的后辈能访问
// private 就是只有自己能访问的属性
// readonly 仅读 (类似const) 如果在初始化完毕后不能再修改了 如果是对象可以更改属性

class Animal {
    // 我们可以给构造函数添加修饰符 如果被标识成 protected 说明不能被 new 了，如果标识成 private 说明不能继承了，同时也不能被new
    // protected constructor(protected name: string, public age: number) {
    // private constructor(protected name: string, public age: number) {
    constructor(protected name: string, public age: number) {
        console.log(this.name)
    }
}
class Cat extends Animal {
    constructor(name: string, age: number, public address: string) {
        super(name, age) // Animal.call(this,name,age)
        console.log(this.name)
    }
}
let cat = new Cat('Tom', 8, '美国')
console.log(cat.name)
```











CPU亲和

- 把CPU内核和Nginx的工作进程绑定在一起，让每个worker进程固定在一个CPU上执行，从而减少CPU的切换并提高缓存命中率，提高性能











