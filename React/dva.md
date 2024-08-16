# DVA

## 1. dva

- 基于 redux 、 redux-saga 和 react-router 的轻量级前端架。(nspired by elm and choo)。
- dva是基于react+redux最佳实践上实现的封装方案，简化了redux和redux-saga使用上的诸多繁琐操作

## 2. 数据流向

- 数据的改变发生通堂是通过:
  - 用户交互行为 (用户点击按钮等)
  - 浏览器行为 (如路由跳转等)触发的
- 当此类行为会改变数据的时候可以通过 dispath 发起一个 action，如果是同步行为会直接通过 Reducers 改变 State，如果是异步行为作用)会先发 Efedts 然后流向Reducers 最终改变 State

参考 [dva数据流向](https://dvajs.com/guide/concepts.html#%E6%95%B0%E6%8D%AE%E6%B5%81%E5%90%91)

## 3. 8个概念

### 3.1 State

- State 表示 Model 的状态数据，通常表现为一个 iavascript 对象(当然它可以是任何值)
- 操作的时候每次都要当作不可变数据(mmutable data)来对，保证每次都是全新对象，没有引用关系，这样才能保证 State 的立性，便于测过和追踪变化

### 3.2 Action

- Action 是一个普通iavascript 对象，它是改变 State 的唯一途径
- 无论是从 UI事件、网络回调，还是 WebSocket 等数据源所获得的数据，最终都会通过 dispatch 函数调用一个 action，从而改变对应的数据
- action 必须带有 type 属性指明具体的行为，其它字段可以自定义
- 如果要发起一个action 需要使用dispatch函数
- 需要注意的是 dispatch 是在组件 connect Models以后，通过 props 传入的

### 3.3 dispatch

- dispatching function 是一个用于触发 action 的函数

- action 是改变 State 的唯一途径，但是它只描述了一个行为，而 dipatch 可以看作是发这个行为的方式，而 Reducer 则是描述如何改变数据的

- 在dva 中，connect Model 的组件通过 props 可以访问到 dispatch，可以调用 Mode 中的 Reducer 或者 Efects，常见的形式如:
  ```jsx
  dispatch({
      type: "user/add", // 如果在model外调用 需要添加namespace
      payload: {} // 需要传递的信息
  })
  ```

### 3.4 Reducer

- Reducer(也称为 reducing unchn) 函数接受两参数:之前已经积运算的结果和当前要被累的值，返回的是一个新的累机结，该函数把一个集合旧并成一个单值
- 在dva 中，reducers 聚合积累的结果是当前 model的 state 对象。
- 通过actions 中传入的值，与当前 reducers 中的值进行运算获得新的值 (也就是新的 state)。
- 需要注意的是 Reducer 必须是纯函数，所以同样的输入必然得到同样的输出，它们不应该产生任何副作用。
- 并且，每一次的计算都应该使用immutable data，这种特性简单理解就是每次作都是返回一个全新的数据(立，纯净)，所以热重载和时间旅行这些功能才能够使用

### 3.5 Effect

- Effect 被称为副作用，在我们的应用中，最常见的就是异步操作。
- 它来自于函数编程的概念，之所以叫副作用是因为它使得我们的函数变得不纯，同样的输入不一定获得同样的输出。
- dva 为了控制|作用的操作，底展引入了reduxsaas做异步流程控制，由于采用了cenerator的相关概念，所以将异步转成同步写法，从而将efects转为纯函数。

### 3.6 Subscription

- Subscriptions 是一种从源获取数据的方法，它来自于 elm。
- Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action
- 数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。

### 3.7 Router

- 这里的路由通常指的是前端路由
- 由于我们的应用现在通常是单页应用，所以需要前端代码来控制路由逻辑。
- 通过浏览器提供的 History API 可以监听浏览器url的变化，从而控制路由相关操作。

### 3.8 Router Components

- 在组件设计方法中，我们提到过 Container Components，在 dva 中我们通常将其约束为 Route Components
- 因为在 dva 中我们通常以页面维度来设计 Container Components。
- 所以在 dva 中,通常需要 comnect Mode的组件都是 Route Components,组织在routes/目录下,而/components/目录下则是纯组件(Presentational Componentis)

## 4. 初始化环境

```shell
create-react-app dva-app
cd dva-app
npm install dva keymaster -S
```

## 5. 文件结构

```
|—— /mock/				# 数据mock的接口文件
|—— /src/				# 项目源码目录
|	|—— /components/	 # 项目组件
|	|—— /routes/		 # 路由组件(页面维度)
|	|—— /models/		# 数据模型
|	|—— /services/		# 数据接口
|	|—— /utils/			# 工具函数
|	|—— route.js		# 路由配置
|	|—— index.js		# 入口文件
|	|—— index.less
|	|—— index.html
|—— package.json		# 定义依赖的pkg文件
|—— proxy.config.js		# 数据mock配置文件
```



## 6. 计数器

| 用法                                        | 说明                    |
| ------------------------------------------- | ----------------------- |
| app = dva(opts)                             | 创建应用 返回dva实例    |
| app.use(hooks)                              | 配置 hooks 或者注册插件 |
| app.model(model)                            | 注册 model              |
| app.router(({history, app} => RouterConfig) | 注册路由表              |
| app.start(selector?)                        | 启动应用 selector可选   |

```jsx
// 参考：https://dvajs.com/guide/examples-and-boilerplates.html#%E5%AE%98%E6%96%B9

import React from 'react';
import keymaster from 'keymaster' // 使用keymaster库实现按键盘空格键调用add加1方法
// dva是对 redux redux-saga react-redux react-router-dom做的一个简单封装
import dva, { connect } from 'dva';
import './style.css';

const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms))
// 1. Initialize
const app = dva(); // 执行dva函数可以得到一个app对象 代表dva的应用对象

console.log(2);

// 2. Model  定义模型
app.model({
  namespace: 'count',  // 命名空间
  state: 0, // 状态对象
  reducers: { // 处理器 修改状态的
    add  (count) { return count + 1 },
    minus(count) { return count - 1 },
  },
  effects: {
      // 在effects中 每个属性都是一个generator
      *asyncAdd(action, {put}) { // redux-saga/effects {call, put, delay}
          yield delay(1000) // 延迟1s
          yield put({type: 'add'}) // 派发一个动作给仓库 让仓库中的状态number+1
      }
  },
  subscriptions: {
      // 我们可以在subscriptions里定义很多个属性和值 值是一个函数 这些函数会在应用初始化的时候执行一次
      keyboard({dispatch}) {
          keymaster('space', () => {
              dispatch({type: 'add'})
          })
      }
  }
});

class TestError extends React.Component {
  componentDidCatch(e) {
    alert(e.message);
  }
  componentDidMount() {
    // throw new Error('a');
  }
  render() {
    return <div>TestError</div>
  }
}

// 3. View
const App = connect(({ count }) => ({
  count
}))(function(props) {
  return (
    <div>
      <TestError />
      <h2>{ props.count }</h2>
      <button key="add" onClick={() => { props.dispatch({type: 'count/add'})}}>+</button>
      <button key="add" onClick={() => { props.dispatch({type: 'count/asyncAdd'})}}>effect异步+</button>
      <button key="minus" onClick={() => { props.dispatch({type: 'count/minus'})}}>-</button>
    </div>
  );
});

// 4. Router
app.router(() => <App />);

// 5. Start
app.start('#root');

```



## 7. 构建应用

## 8. 参考

[DvaJS](https://dvajs.com/)



## 9.dva-cli

[dva-cli 快速上手](https://dvajs.com/guide/getting-started.html#%E5%AE%89%E8%A3%85-dva-cli)
[使用 antd](https://dvajs.com/guide/getting-started.html#%E4%BD%BF%E7%94%A8-antd)

```json
{
   "extraBabelPlugins": [
     ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
   ]
}
```

libraryDirectory: es 按需导入的前提必须是es模块 不能是被webpack打包编译后的产物 (antd 组件库中es 和 lib目录中都包含所有的组件)





