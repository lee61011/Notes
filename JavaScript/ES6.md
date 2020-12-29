### 生成器 Generator 与迭代器 Iterator

> 它是理解 Koa 的基础，另外也是现代异步解决方案 async await 的基础

Generator 是一个特殊的函数，执行它会返回一个 Iterator 对象，通过遍历迭代器，Generator 函数运行后会返回一个遍历器对象，而不是普通的返回值

**Iterators模拟**

迭代器有一个 next 方法，每次执行的时候会返回一个对象，对象里面有两个属性，一个是 value 表示返回的值，还有就是布尔值 done，表示是否迭代完成

```javascript
// read生成器 用来生成迭代器的
function read(books) {
    let index = 0
    return {
        next() {
            let done = index++ === books.length - 1
            let value = books[index++]
            return {
                value,
                done
            }
        }
    }
}

// 迭代器 可以不停的调用next方法得到一个结果{value,done}
// 当done为true的时候就表示取完了
// it 有一个方法 next，每次调用 next 都会返回一个结果 {value, done}  (value表示值，done表示是否完成是否取完了)
let it = read(['js', 'node'])
// let r1 = it.next()
// let r2 = it.next()
// console.log(r1, r2)
let result
do {
    result = it.next()
    console.log(result)
} while(!result.done)
```

`generator.js`

```javascript
/*
	生成器函数和普通函数长得不一样，返回迭代器
	执行的时候也不一样
*/
function* read(books){
    for(let i = 0; i < books.length; i++){
        yield books[i]
    }
}
let it = read(['js', 'node'])
var curr
do {
    curr = it.next()
    console.log(curr)
} while (!curr.done)
```

### 集合

**Set**
一个 `Set` 是一堆东西的集合，`Set`有点像数组，不过跟数组不一样的是，`Set`里面不能有重复的内容
```javascript
var books = new Set()
books.add('js')
books.add('js') // 添加重复元素集合的元素个数不会改变
books.add('html')
books.forEach(function(book){
    console.log(book)
})
console.log(books.size) // 集合中元素的个数
console.log(books.has('js')) // 判断集合中是否有此元素
books.delete('js') // 从集合中删除此元素
console.log(books.size)
console.log(books.has('js'))
books.clear()
console.log(books.size)
```



### Promise

`Promise.js`

```javascript
// Promise/A+规范
// https://segmentfault.com/a/1190000002452115

// 构造函数的参数是一个异步任务
function Promise(task) {
    let that = this
    that.status = 'pending' // 默认状态为 pending
    that.value = undefined // 保存promise的结果
    that.onResolvedCallbacks = [] // 存放所有成功的回调函数
    that.onRejectedCallbacks = [] // 存放所有失败的回调函数
    // 调用此方法可以把当前的promise变成成功态
    function resolve(value) {
        if (that.status = 'pending') {
            that.status = 'fulfilled'
            that.value = value
            that.onResolvedCallbacks.forEach(item => item(value))
        }
    }
    // 调用此方法可以把当前的promise变成失败态
    function reject(reason) {
        if (that.status === 'pending') {
            that.status = 'rejected'
            that.value = reason
            that.onRejectedCallbacks.forEach(item => item(reason))
        }
    }
    
    // 立即执行传入的任务
    try {
        task(resolve, reject)
    } catch(e) {
        reject(e)
    }
}
Promise.prototype.then = function(onFulfilled, onReject) {
    let that = this
    if (that.status === 'fulfilled') {
        onFulfilled(that.value)
    }
    if (that.status === 'rejected') {
        onReject(that.value)
    }
    if (that.status === 'pending') {
        that.onResolvedCallbacks.push(onFulfilled)
        that.onRejectedCallbacks.push(onReject)
    }
}

module.exports = Promise


/*
	# Promise规范官方测试脚本
	npm i -g promises-aplus-tests
	promises-aplus-tests Promise.js
*/
```



## 异步流程解决方案

**事件发布/订阅模型**

订阅事件实现了一个事件与多个回调函数的关联

```javascript
/*
	这是node核心模块中的一个类，通过它可以创建时间发射器的实例，里面有两个核心方法：
		1. on 表示注册监听
		2. emit 表示发射事件
*/
let fs = require('fs')
let EventEmitter = require('events')
let eve = new EventEmitter()
let html = {}
eve.on('ready', function(key, value){
    html[key] = value
    if(Object.keys(html).length === 2) {
        console.log(html)
    }
})
function render() {
    fs.readFile('template.txt', 'utf8', function(err, template) {
        eve.emit('ready', 'template', template)
    })
    fs.readFile('data.txt', 'utf8', function(err, data) {
        eve.emit('ready', 'data', data)
    })
}
render()
```

**哨兵变量**

```javascript
let fs = require('fs')
let after = function(times, callback) {
    let result = {}
    return function(key, value) {
        result[key] = value
        if (Object.keys(result).length === times) {
            callback(result)
        }
    }
}
let done = after(2, function(result) {
    console.log(result)
})
function render() {
    fs.readFile('template.txt', 'utf8', function(err, template) {
        done('template', template)
    })
    fs.readFile('data.txt', 'utf8', function(err, data) {
        done('data', data)
    })
}
render()
```



**Promise/Deferred模式**

**生成器Generators / yield**

- 当你在执行一个函数的时候，你可以在某个点暂停函数的执行，并且做一些其他工作，然后再返回这个函数继续执行，甚至是携带一些新的值，然后继续执行
- 上面描述的场景正是 JavaScript 生成器函数所致力于解决的问题。当我们调用一个生成器函数的时候，它并不会立即执行，而是需要我们手动的去执行跌倒操作（next方法）。也就是说，调用生成器函数，它会返回给你一个迭代器。迭代器会遍历每个中断点。
- next 方法返回值的 value 属性，是 Generator 函数向外输出数据；next 方法还可以接收参数，这是想 Generator 函数体内输入数据

`生成器的使用`

```javascript
function* foo() {
    var index = 0
    while (index < 2) {
        yield index++ // 暂停函数执行，并执行 yield 后的操作
    }
}
var bar = foo() // 返回的其实是一个迭代器
console.log(bar.next()) // {value: 0, done: false}
console.log(bar.next()) // {value: 1, done: false}
console.log(bar.next()) // {value: undefined, done: true}
```



```javascript
// 生成器函数和普通函数不一样，调用它的话函数并不会立即执行
// 它会返回此生成器的迭代器，迭代器是一个对象，每调用一次 next 就可以返回一个值对象
function *go() {
    console.log(1)
    let b = yield 'a'
    console.log(2)
    let c = yield b
    console.log(3)
    return c
}
let it = go('A值')
let r1 = it.next() // next 第一次执行不需要参数，传参数是没有意义的，如果第一次需要传参 可以放在go(a)内
// 第一次调用 next 会返回一个对象，此对象有两个属性，一个是value就是yield后面的那个值，一个是done表示是否迭代完成
console.log(r1) // { value: 'a', done: false }
let r2 = it.next('B值')
console.log(r2) // { value: 'B值', done: false }
let r3 = it.next()
console.log(r3) // { value: undefined, done: true }
```



**Promise**

`case.js`

```javascript
let MyPromise = require('./Promsie')
let p1 = new MyPromise(function(resolve, reject) {
    setTimeout(function() {
        let num = Math.random()
        if (num < .5) {
            resolve(num)
        } else {
            reject('失败')
        }
    })
})
p1.then(function(data) {
    console.log(data)
}, function(err) {
    console.log(err)
})
```

`Promise.js`

```javascript
const PENDING = 'pending' // 初始态
const FULFILLED = 'fulfilled' // 成功态
const REJECTED = 'rejected' // 失败态

function Promise(executor) {
    let self = this // 缓存当前promise实例
    self = status = PENDING
    self.onResolvedCallbacks = [] // 定义存放成功的回调的数组
    self.onRejectedCallbacks = [] // 定义存放失败的回调的数组
    // 当调用此方法的时候，如果promise状态为pending，则可以转成成功态，如果已经是成功态或者失败态了，则什么都不做
    function resolve(value) {
        if (value instanceof Promise) {
            return value.then(resolve, reject)
        }
        if (self.status === PENDING) {
            self.status = FULFILLED
            self.value = value // 成功后会得到一个值，这个值不能改
            // 调用所有成功的回调
            self.onResolvedCallbacks.forEach(cb => cb(self.value))
        }
    }
    function reject(reason) {
        if (self.status === PENDING) {
            self.status = REJECTED
            self.value = reason
            self.onRejectedCallbacks.forEach(cb => cb(self.value))
        }
    }
    
    try {
        executor(resolve, reject) // 因为此函数执行可能会异常，所以需要捕获，如果出错了，需要用错误对象reject
    } catch(e) {
        reject(e) // 如果函数执行失败了，则用失败的原因reject这个promise
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promsie2 === x) {
        return reject(new TypeError('循环引用'))
    }
    let called = false // promise2 是否已经resolve或者reject了
    if (x instanceof Promise) {
        setTimeout(function() {
            if (x.status === PENDING) {
                x.then(function(y) {
                    resolvePromise(promise2, y, resolve, reject)
                }, reject)
            } else {
                x.then(resolve, reject)
            }
        })
    } else if (x !== null && ((typeof x === 'object') || (typeof x === 'function'))) {
        // x是一个thenable对象或函数，只要有then方法的对象
        // 当我们的promise和别人的promise进行交互，编写这段代码的时候尽量的考虑兼容性，允许别人瞎写
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x, function(y) {
                    // 如果promise2已经成功或者失败了，则不会再处理了
                    if (called) return
                    called = true
                    resolvePromise(promise2, y, resolve, reject) // 递归调用
                }, function(err) {
                    if(called) return
                    called = true
                    reject(err)
                })
            } else {
                // 到此的话x不是一个thenable对象，那直接把它当成值resolve promise2就可以了
                resolve(x)
            }
        } catch(e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        // 如果x是一个普通的值，则用x的值去resolve promise2
        resolve(x)
    }
}

// onFulfilled 是用来接收promise成功的值或者失败的原因
Promise.prototype.then = function(onFulfilled, onRejected) {
    // 如果没有传成功或失败的回调，则表示这个then没有任何逻辑，只会把值往后抛
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason}
    
    let self = this
    let promise2
    if (self.status === FULFILLED) {
        return promise2 = new Promise(function(resolve, reject) {
            setTimeout(function() {
                try {
                    let x = onFulfilled(this.value)
                    // 如果获取到了返回值x，会走解析promise的过程
                    resolvePromise(promise2, x, resolve, reject)
                } catch(e) {
                    // 如果执行成功的回调过程中出错了，用错误原因把promise2 reject
                    reject(e)
                }
            })
        })
    }
    if (self.status === REJECTED) {
        return promise2 = new Promise(function(resolve, reject) {
            setTimeout(function() {
                try {
                    let x = onRejected(self.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch(e) {
                    reject(e)
                }
            })
        })
    }
    if (self.status === PENDING) {
        return promise2 = new Promise(function(resolve, reject) {
            self.onResolvedCallbacks.push(function() {
                setTimeout(function() {
                    try {
                        let x = onFulfilled(self.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                })
            })
            self.onRejectedCallbacks.push(function() {
                setTimeout(function() {
                    try {
                        let x = onRejected(self.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                })
            })
        })
    }
}
Promise.all = function(promise) {
    return new Promsie(function(resolve, reject) {
        
    })
}
// catch 的原理就是只传失败的回调
Promise.prototype.catch = function(onRejected) {
    this.then(null, onRejected)
}
Promise.deferred = Promise.defer = function() {
    let defer = {}
    defer.promise = new Promise(function(resolve, reject) {
        defer.resolve = resolve
        defer.reject = reject
    })
    return defer
}

module.exports = Promise
```



### Promise 周边生态

**Q**

> Q是一个在 JavaScript 中实现 promise 的模块

`q的基本用法`

```javascript
// 这个模块是用来实现 promise，在 angular.js 里的 promise 就是用的 q
// let Q = require('q')
let Q = {
  defer() {
    let success, error
    return {
      resolve(data) {
        success(data)
      },
      reject(err) {
        error(err)
      },
      promise: {
        then(onFulfilled, onRejected) {
          success = onFulfilled
          error = onRejected
        }
      }
    }
  }
}
let fs = require('fs')

function readFile(filename) {
  let defer = Q.defer()
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) {
      defer.reject(err)
    } else {
      defer.resolve(data)
    }
  })
  return defer.promise  
}

readFile('1.txt').then(function(data){
  console.log(data)
})

```













