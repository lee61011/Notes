# TypeScript

[中文文档：](https://www.tslang.cn/docs/handbook/basic-types.html)

## 1. 什么是TypeScript

`TypeScript`是`JavaScript`的超集，遵循最新的`ES5/ES6`规范。`TypeScript`扩展了`JavaScript`语法。

- `TypeScript`更像后端JAVA让`JS`可以开发大型企业应用
- TS提供的类型系统可以帮助我们在写代码时提供丰富的语法提示
- 在编写代码时会对代码进行类型检查从而避免很多线上错误

## 2. 环境搭建

### 2.1 全局编译TS文件

全局安装`TypeScript`对`TS`进行编译

```shell
npm install -g typescript
# 查看版本
tsc -v
# 查看帮助命令
tsc -h

tsc --init # 生产tsconfig.json
tsc # 可以将ts文件编译成js文件
tsc --watch # 监控ts文件变化生成js文件

# code-runer
# npm install ts-node -g
```

## 使用 rollup 构建 ts

```shell
mkdir typescript-learn
npm init -y
npm install rollup typescript rollup-plugin-typescript2 @rollup/plugin-node-resolve rollup-plugin-serve -D
```

新建 `rollup.config.js`配置文件

```javascript
import ts from 'rollup-plugin-typeScript2' // 解析ts语法的插件
import { nodeResolve } from '@rollup/plugin-node-resolve' // 解析第三方模块
import serve from 'rollup-plugin-serve'
import path from 'path'

export default {
    input: './src/index.ts',
    output: {
        file: path.resolve(__dirname, 'dist/bundle.js'),
        sourcemap: true, // 同时需要将 tsconfig.json 文件中的 sourceMap 项打开，并且修改 module 项为 ESNEXT
        format: 'iife', // 生成一个自执行函数
    },
    plugins: [
        nodeResolve({
            extensions: ['.js', '.ts']
        }),
        ts({
            tsconfig: path.resolve(__dirname, 'tsconfig.json')
        }),
        serve({
            openPage: '/public/index.html', // 默认打开的路径
            contentBase: '', // 服务启动的位置
            port: 3000
        })
    ]
}
```

新建项目打包入口`src`目录
`src/index.ts`

```typescript
let src:string = 'hello'
```

新建服务页面
`public/index.html`

```html
<script src="/dist/bundle.js"></script>
```

修改`package.json`配置文件

```json
"script": {
    "dev": "rollup -cw"
}
```



## TS中的数据类型

`src/index.ts`

```typescript
// 基础数据类型
let num:number = 10
let str:string = 'string'
let bool:boolean = true

// 元组：表示长度是固定的，内容的类型也要规定好
let tuple:[string, number, boolean] = ['zhangsan', 18, true]

// 我们无法通过索引给元组添加不存在的属性
// tuple[3] = 100

// 如果通过数组方法新增，必须元组中得支持此类型
tuple.push('lisi')
let r = tuple.pop()

// 数组类型：表示存放“一类”类型
let arr:number[] = [1,2,3,4,5]
let arr2:string[] = ['a', 'b', 'c']
let arr3:(number | string)[] = [1, 'a']
let arr4:Array<number | string> = [1,2,3,'a','b']
let arr5:any[] = ['a', {}, 1, 3] // 这种方式表示可以放任何类型，但是无法推断内容中的类型


// 枚举类型 enum 枚举中的默认值从0开始 (使用场景：状态码、权限、类型……)
// 枚举一般 key 是一个变量 值是数字
enum USER_ROLE {
    USER = 'abc',
    ADMIN = 2, // 异构枚举，枚举中存放了不同的类型，如果里面有数字后面没有 会自行的推断
    MANAGER
}
// 如果枚举中的值是数字，那么可以使用反举
console.log(USER_ROLE.USER)
// console.log(USER_ROLE.ADMIN)
console.log(USER_ROLE[2]) // ADMIN

const enum STATUS_CODE { // 常量枚举不会被进行编译
    NOUNT_FOUND
}
console.log(STATUS_CODE.NOUNT_FOUND)


// null 和 undefined，是任何类型中的子类型，在严格模式下 null -> null  undefined -> undefined
let str1:string = 'hello'
str1 = null
let u:undefined = undefined
let n:null = null


// void 类型， 一般用于函数的返回值，只能接收null或者undefined
// 如果在非严格模式下 null 可以赋值给任何类型，严格模式下 null 不能赋予给 void
function a1():void{
    return undefined
}

// never 永远不 永远达不到的类型  never是任何类型的子类型
// 1) 报错  2) 死循环  3)判断的时候可能永远进入不到某个判断
function MyError():never {
    throw new Error()
}
let err = MyError()
function whileTrue():never {
    while(true) {}
}
function byType(val:string) {
    if (typeof val === 'string') {
        val
    } else {
        val
    }
}


// object 对象类型
const create = (obj:object) => {}
create([])
create({})
create(function(){})


// JS中还有两个类型 symbol bigInt
let s1:symbol = Symbol('123')
let s2:symbol = Symbol('123')
console.log(s1 === s2) // false

let num1 = Number.MAX_SAFE_INTEGER
// console.log(num1+1 === num1+2) // true
let big1 = BigInt(num1) + BigInt(1)
let big2 = BigInt(num1) + BigInt(2)
console.log(big1 === big2)

// string | number | boolean | null | undefined | any | 元组 数组 void never object
```

**注意点补充**

```typescript
let name = 'lisi' // 直接声明 name 会报错， 当前文件已经默认声明过了name属性，可以使用 export 导出为一个独立的模块解决这个问题
export {}

// 类型标注的问题 什么时候需要标识类型 什么时候不需要标识
// ts内部会有自动推导的功能
let name = 'lisi' // 如果默认初始化的时候 是会进行类型推导的

let num:Number = 123 // ? number 和 Number 类型
// number 用来标识它的基础数据类型是什么
// Number 类也是一个类型，它可以标识实例
let num1:number = 11
let num2:Number = 11
let num3:number = Number(11)
let num4:Number = new Number(11)
let num5:number = new Number(11) // 报错 实例是一个对象类型 不能把一个对象标识成基本类型
```





## 手册指南

### 基础类型

- 布尔值：true / false
- 数字：number
- 字符串：string
- 数组：有两种方式可以定义数组
  - 可以在元素类型后面接上[]，表示由此类型元素组成的一个数组：let list: number[] = [1,2,3]
  - 使用数组泛型，Array<元素类型>：let list: Array<number> = [1,2,3]
- **元组 Tuple**
- **枚举 enum**
- **Any**
- Void： `void`类型像是与`any`类型相反，它表示没有任何类型。 
- Null 和 Undefined
- Never： 表示的是那些永不存在的值的类型 
- Object：表示非原始类型

### 变量声明

### 接口

- 可选属性
- 只读属性