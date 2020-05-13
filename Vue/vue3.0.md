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
// 在 package.json 配置script后，可以直接使用 npm run dev 来启动服务
{
    "script": {
        "dev": "webpack-dev-server",
        "build": "webpack"
    }
}
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
            const count = ref(1) // 创建引用 这里的1会被ref包装成一个对象
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

#### 6. data && method

```vue
<template>
	<div>Hello {{ title }}  -  {{ count }}  -  {{ state.message }}</div>
	<div>{{ doubleCount }}</div>
	<button @click="increment">button</button>
	<Button text="FOO" @foobar="onFoobar" />
</template>
<script>
	import { defineComponent, ref, reactive, onMounted, onUnmounted, computed } from 'vue'
    import Button from './components/Button.vue'
	export default defineComponent({
        // 组件引用于Vue2相同
        components: {
            Button
        }
        
        // 组件初始化的时候执行，类似vue2中的created
        setup() {
            // 普通值 string number boolean 数据响应 需要用 ref
            const count = ref(0) // 为一个值创建引用；这里的0会被ref包装成一个对象
            // 对象需要数据响应 可以使用 reactive
            const state = reactive({
                message: 'hello'
            })
            
            const increment = () => {
                count.value += 10
                state.message = 'world'
            }
            const onFoobar = (now) => {
                console.log('button foobar', now)
            }
            
            // 计算属性
            const doubleCount = computed(() => count.value * 2) 
            
            // 生命周期
            onMounted(() => {
                // mounted 生命周期
                console.log('mounted')
            })
            onUnmounted(() => {
                // beforeDestory 生命周期
            })
            
            // setup 返回值中的成员可以直接在模板中使用
            return {
                title: 'Vue.js 3.0',
                count,
                doubleCount,
                state,
                increment,
                onFoobar
            }
        }
    })
</script>
```

#### 7. Vue3 压缩 和 Tree-shaking

Tree-shaking：可以简单理解为 按需导入

参考第六节计算属性、生命周期函数等，用到的模块需要从 vue 中导入使用，这样做在打包的时候没有到的模块不会被打包进去

#### 8. Vue3 常见用法

```vue
<!-- App.vue 参考第六节 -->

<!-- Button.vue -->
<template>
	<button>{{ props.text }}</button>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
    // 仍然可以像2.0一样接收属性
    // props: {
    //     text: String
    // },

    // setup(props, context) {
    setup(props, { emit }) { // context.emit
        
        const onClick = () => {
            console.log('clicked')
            // this.$emit('foobar') // Vue2中通过this.$emit向父组件发送事件，在Vue3中this是不存在的
            emit('foobar', Date.now())
        }
        
        console.log(props) // 也可以通过这种方式接收属性，这里的 props 是一个 Proxy 对象
        return {
            props
        }
    }
})
</script>
```

#### 9. 逻辑复用

Vue3 有更灵活的逻辑复用能力

```js
/* utils/window-size.js */
import { ref, onMounted, onUnmounted } from 'vue'

export default () => {
    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)
    const update = e => {
        width.value = window.innerWidth
        height.value = window.innerHeight
    }
    onMounted(() => {
        window.addEventListener('resize', update)
    })
    onUnmounted(() => {
        window.removeEventListener('resize', update)
    })
    return { width, height }
}

// Vue2中的mixins的缺陷：数据多了之后不方便查看数据是哪里来的，并且如果data中和mixins中有相同的数据会引起冲突
// Vue3中这样写就清晰多了，并且如果有冲突的数据还可以重命名
/*
	import windowSize from '../utils/window-size'
	const { width: windowWidth, height } = windowSize()
*/
```

















