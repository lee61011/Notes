
### JSX

### 元素渲染

### 组件

### props属性

### 事件处理

### State

### 生命周期函数
- componentWillMount: 组件渲染之前执行
- componentDidMount: 组件渲染之后执行
- shouldComponentUpdate: 返回true和false，true表示允许改变 false表示不允许改变
- componentWillUpdate: 数据在改变之前执行 (state, props)
- componentDidUpdate: 数据修改完成(state, props)
- componentWillReveiceProps: props发生改变执行
- componentWillUnmount: 组件卸载前执行

### setState更新是同步的还是异步的









React项目解决跨域：
http-proxy-middleware => src/setupProxy.js



### React路由
https://reactrouter.com/en/main

HashRouter: 锚点链接
BrowserRouter: h5新特性 上线后需要后台做重定向处理

路由匹配 path="/path" component={Comp}
路径包裹 exact
路由精确匹配 strict exact
404处理 未匹配到的才显示404  Switch
NavLink高亮 默认class="active"    自定义设置：activeClassName="selected"  /  activeStyle={{color: "red"}}
路由传参：path="/main/ucenter/:id?/:name?"  ?表示参数可有可无(不加的话不带参数会报404)    props.match.params.id
获取路由参数的方法：
- const params = new URLSearchParams(props.location.search)    params.get('name')    params.get('age')
- import querystring from 'querystring'    const value = querystring.parse(props.location.search)
Link to - object 隐形传递参数
```jsx
<NavLink to={{
	pathname: "main",
	search: "?sort=name",
	hash: "#the-hash",
	state: { flag: 'flag' }  // props.location.state 隐形传递参数 页面导航路径里看不到的
}}></NavLink>
```

重定向：
- </Redirect  to="/main" />
- 按钮点击  props.history.push("/")    props.history.replace("/")
  push 叠加的上一次的页面依然存在内存中，replace是替换，上一次的页面不存在了

withRouter高阶组件：
组件没有直接被路由管理的没有路由对象，需要返回withRouter高阶组件
```jsx
import React from 'react'
import { withRouter } from 'react-router-dom'

class MineDomo extends React.Component {
  clickHandle() {
    console.log(this.props)
  }
  render() {
    return (
      <div><button onClick={ this.clickHandle.bind(this) }>回到Home</button></div>
    )
  }
}
// 高阶组件
export default withRouter(MineDemo)
```

Prompt路由钩子
```jsx
// when 条件成立时  离开当前路由页面显示message提示消息
<Prompt when={{ !!this.state.name }} message={ '确定要离开吗？' } />
```







































