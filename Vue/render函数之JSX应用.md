# render函数之JSX应用

## 一、模板缺陷

```vue
<!-- 需求：做一个标题组件，显示 h1 到 h6 标题 -->

<!-- components/Level.vue -->
<template>
	<div>
		<h1 v-if="t === 1">
  		<slot></slot>
  	</h1>
		<h2 v-else-if="t === 1">
  		<slot></slot>
  	</h2>
		<h3 v-else-if="t === 1">
  		<slot></slot>
  	</h3>
  </div>
</template>

<script>
export default {
  props: {
		t: {
			type: Number
    }
  }
}
</script>
```

上面这种写法很麻烦，也很不美观；可以用下面的方法

`components/LevelFunctional.js`

```js
/* 函数式组件  没有模板  必须要有一个 render 函数 */
export default {
  render(h) {		// h 等同于 createElement
		return h('h1', {
			on: {
				click(){
					alert(1)
        }
      }，
			attrs: {		// 添加属性
				a: 1
    	}
    }, [h('span', {}, '你好')])		// 参数数组表示 子元素
  }
}
```



## 二、函数式组件

## 三、JSX应用

## 四、render方法定制组件内

## 五、scope-slot

## 六、编写可编辑表格

