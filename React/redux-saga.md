# redux-saga

## 1. redux-saga

- redux-saga 是一个redux 的中间件，而中间件的作用是为 redux 提供额外的功能。
- 在reducers 中的所有操作都是同步的并且是纯粹的，即 reduce都是纯函数，纯函数是指一个函数的返回结果只依赖于它的参数，并且在执行过程中不会对外部产生副作用，即给它传什么，就吐出什么。
- 但是在实际的应用开发中，我们希望做一些异步的如Alax请求 目不纯粹的操作《如改变外部的状态)，这些在函教式编程范式中被称为“副/作用"

> redux-saga 就是用来处理上述副作用(异步任务)的一个中间件。它是一个接收事件，并可能触发新事件的过程管理者，为你的应用管理复杂的流程。

## 2. redux-sage工作原理

- sages 采用 Generator 函数来 yield Effects (包含指令的文本对象)
- Generator 函数的作用是可以暂停执行，再次执行的时候从上次暂停的地方继续执行。
- Effect 是一个简单的对象，该对象包含了一些给 middleware 解释执行的信息。
- 你可以通过使用 effects API如 fork，call，take，put，cancel 等来创建 Efect.

## 3. redux-saga分类

- worker saga 做实际的工作，如调用API，进行异步请求，获取异步封装结果。
- watcher saga 监听被dispatch的actions,当接受到action或者知道其被触发时，调用worker执行任务。
- root saga 立即启动saga的唯一入口

## 4. 构建项目

### 4.1 初始化项目

```shell
# https://create-react-app.bootcss.com/docs/getting-started
# cnpm install create-react-app -g
npx create-react-app my-saga-start
cd my-saga-start
cnpm i redux react-redux redux-saga tape --save
```



## 5. 跑通saga

### 5.1 src\index.js

```javascript
import store from './store'
```

### 5.2 store\index.js

```javascript
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './saga'
const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
// const store = applyMiddleware(sagaMiddleware)(createStore)(reducer) // 这两种写法功能相同
sagaMiddleware.run(rootSaga)
export default store
```

### 5.3 store\reducer.js

```javascript
let initialState = { number: 0 }
export default function(state=initialState, action) {
    return state
}
```

### 5.4 store\sagas.js

```javascript
// saga其实指的就是一个generaotr函数
export default function* rootSaga() {
    console.log('开始启动rootSaga')
}
```



## 6. 异步计数器

### 6.1 /Counter.js

```jsx
// src/components/Counter.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../store/actions'
class Counter extends Component {
    render() {
        return (
        	<div>
                <p>{this.props.number}</p>
                <button onClick={this.props.add}>同步加1</button>
                <button onClick={this.props.thunkAdd}>thunk异步加1</button>
                <button onClick={this.props.sagaAdd}>saga异步加1</button>
            </div>
        )
    }
}
export default connect(
	state => state,
    actions
)(Counter)
```



### 6.2 src/index.js

```jsx
import store from './store'
import Counter from './components/Counter'
import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux' // Provider连接组件和仓库 

ReactDom.render(
	<Provider store={store}>
        <Counter />
    </Provider>,
    document.getElementById('root')
)
```



### 6.3 store/action-types.js

```jsx
export const ADD = 'ADD'
```



### 6.4 store/actions.js

```jsx
import * as types from './action-types'
export default {
    add() {
        return { type: types.ADD }
    },
    thunkAdd() {
        //！ 需要在 store/index 中引入thunk
        // import thunk from 'redux-thunk'
        // const store = createStore(reducer, applyMiddleware(thunk, sagaMiddleware))
        return function(dispatch, getState) {
            setTimeout(() => {
                dispatch({type:types.ADD})
            }, 1000)
        }
    },
    sagaAdd() {
        return {type:types.ASYNC_ADD}
    }
}
```



### 6.5 src/store/index.js

### 6.6 store/reducer.js

```jsx
import * as types from './action-types'
let initialState = { number: 0 }

export default function(state=initialState, action) {
    switch(action.type) {
        case types.ADD:
            return {...state, number:state.number+1}
        default:
            return state
    }
}
```



### 6.7 store/sagas.js

```jsx
import { put, takeEvery, all, delay, call } from 'redux-saga/effects'
import * as types from './action-types'

const delay2 = ms => new Promise(resolve => setTimeout(() => { // 模拟delay实现
    resolve()
}, ms))
function* asyncAdd() { // worker saga
    //# 异步方案一
    yield delay(1000) // 如果yield一个Promise 当前saga会进行等待 等待这个Promise变成成功态
    //# 异步方案二
    yield call(delay2, 3000) // call就是调用方法的意思 意思要让saga中间件帮我调用delay2这个方法 并传入3000参数 然后它会返回一个Promise
    //# 异步方案三
    yield apply({name:'zhangsan'}, delay2, [3000]) // delay2.apply({name:'zhangsan'},[3000])
    
    // 产出一个put 相当于派发一个动作 {type:'PUT',action:{type:types.ADD}}   当产出一个put effect对象之后 saga中间件就会向仓库重新派发{type:types.ADD}动作
    yield put({ type: types.ADD })
}
// 这就是我们的watch saga 负责监听异步加1的动作
function* watchAdd() {
    // 我们要监听每一次派发ASYNC_ADD的动作  yield产出的意思 就是生产出一个effect对象(一个普通对象)发给saga中间件 saga中间件会去监听所有的ASYNC_ADD动作 当这个动作被派发的时候 就会执行asyncAdd这个worker saga
    // takeEvery 不会阻塞当前saga执行
    yield takeEvery(types.ASYNC_ADD, asyncAdd)
}
function* hello() {
    console.log('hello saga')
}
export default function* rootSaga() {
    console.log('rootSaga 开始执行')
    // 如果项目中有多个watcher saga都要启动
    yield all([watchAdd(), hello()])
    console.log('rootSaga 执行结束')
}
```



## 7. 单元测试

### 7.1 安装模块

> cnpm i @babel/core @babel/node @babel/plugin-transform-modules-commonjs --save-dev

### 7.2 测试脚本

```json
"scripts": {
    "test": "babel-node src/store/sagas.spec.js --plugins @babel/plugin-transform-modules-commonjs"
}
```



### 7.3 store/sagas.spec.js

### 7.4 utils.js

### 7.5 store/sagas.spec.js

## 8. 声明式Effects



