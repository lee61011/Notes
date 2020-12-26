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































