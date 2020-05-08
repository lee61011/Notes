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





















