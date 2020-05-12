### 一、体验3.0API

#### 1. 初始化项目

```shell
# 创建项目目录
$ mkdir vue-next-sample
# 初始化 package.json 文件，管理项目依赖
$ npm init --yes
# 安装 Vue.js 3.0 模块
$ npm i vue@next
# 安装 Webpack 相关模块
$ npm i webpack webpack-cli webpack-dev-server --save-dev
# 安装一些需要用到的 Webpack 插件
$ npm i html-webpack-plugin mini-css-extract-plugin css-loader --save-dev
# 安装 Vue.js 单文件组件的加载器
$ npm i vue-loader@next @vue/compiler-sfc --save-dev
```

#### 2.新建项目所需要的基本文件

```js
/* src/main.js */
import { createApp } from 'vue'
import App from './App.vue'
// 创建应用对象
const app = createApp(App)
app.mount('#root')
```

```vue
<template>
	<!-- 3.0中的 template 可以有多个根节点 -->
	<div>hello {{ title }}</div>
</template>
<script>
    // export default {
    //     setup() {}
    // }
    
    // 上面这种方式书写没有智能提示，建议使用下面的方法
    import { defineComponent } from 'vue'
    export default defineComponent({
        setup() {
            return {
                title: 'Vue.js 3.0'
            }
        }
    })
</script>
<style>
    div{
        color: red;
    }
</style>
```

```js
/* webpack.config.js */
// module.exports = {}
import webpack from 'webpack'  // 这种写法只是方便书写，有智能提示，在使用的时候需要注释掉这行
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
/**
 *@type {webpack.Configuration}
 */
const config = {
	entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({	// 通过这个插件可以生成html文件
            template: './public/index.html' // 这里需要设置一个模板，新建./public/index.html文件，该文件中需要有一个#root的根节点，这个插件会根据这个模板来生成html文件
        }),
        new MiniCssExtractPlugin(),
        new VueLoaderPlugin()
    ]
}

module.exports = config
```

#### 4. webpack-dev-server

```shell
# 使用 npx webpack-dev-server 命令启动项目，修改代码后浏览器会自动刷新；如果页面中有表单数据，那么刷新页面后数据就没了
npx webpack-dev-server
# 上面这种浏览器自动刷新的方式有时候在调试的时候会造成很多不方便，可以配置热更新
```

```js
/* 方式一 */
// 可以使用 npx webpack-dev-server --hot 来启动热更新服务

/* 方式二 */
// webpack.config.js
const webpack = require('webpack')
// 在 module 和 plugin 同级下配置 devServer
devServer: {
    hot: true
},
plugins: [
    // 新增
    new webpack.HotModuleReplacementPlugin()
]
// 通过上面的配置可以使用 npx webpack-dev-server 来启动热更新服务，和 npx webpack-dev-server --hot 效果相同
```

#### 5. 数据交互

需求: 点击按钮，数字自增

```vue
<template>
	<button @click="increment">Add {{ count }}</button>
	<input type="text">
	<span>{{ state.title }}</span>
</template>
<script>
	import { defineComponent, ref, reactive } from 'vue' // 这里的 ref 和Vue2中的ref不是一个概念，这里的ref的作用是引用传递
    export default defineComponent({
        setup(){
            // Vue3.0 中可以在 setup 函数中定义方法
            const count = ref(1) // 创建引用
            const state = reactive({
                title: 'Vue 3.0'
            })
            const increment = () => {
                // console.log(111)
                count.value++ // 这里的count被包装了一层，里面的value才是真正的值，在上面的模板中可以直接使用count，不需要.value
                state.title = '111111'
            }
            return {
                count,
                state,
                increment // 方法引入
            }
        }
    })
</script>
```

**Vue3.0 没有 this**  ------  Vue2.0 中的 this 指向当前组件对象



















