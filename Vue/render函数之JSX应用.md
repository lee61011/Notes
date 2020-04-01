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

```jsx
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

/* 上面的写法比较麻烦，可以使用下面的方法 */
export default {
    props: {
        t: {}	// 父组件传递过来的 表示 h几
    },
    render(h){
        // <h1 on-click={()=>{alert(1)}} style={{color: 'red'}}>你好</h1>
        let tag = 'h' + this.t
        return <tag>{ this.$slots.default }</tag>
    }
}
```



如 `List.vue` 所示，如果后期需求变更，不使用 li 标签，改成 span 标签，这样使用模板来做就很不灵活了

`App.vue`

```vue
<template>
	<div>
        <List :data="['香蕉','苹果','橘子']"></List>
    </div>
</template>
<script>
import List from './components/List'
export default {
    components: {
        List
    }
}
</script>
```

`components/List.vue`

```vue
<template>
	<div>
        <template v-for="(item, index) in data">
			<li :key="index">{{item}}</li>
		</template>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    }
}
</script>
```

可以在父组件中通过 render 方法来处理

```vue
<!-- App.vue -->
<template>
	<div>
		<List :data="['香蕉','苹果','橘子']" :render="render"></List>
                      
		<!-- element-ui  scope-slot  作用域插槽 -->		
		<List1 :data="['香蕉', '苹果', '橘子']">
    		<template v-slot="{item, a}">
				<li>{{item}} {{a}}</li>
			</template>
    	</List1>
  </div>
</template>
<script>
import List from './component/List'
import List1 from './component/List1'
export default {
    components: {
			List,
			List1
    },
    methods: {
        render(h,data) {
            // data 是函数式组件在 list 组件中每次循环出来的结果
            return <span>{data}</span>
        }
    }
}
</script>


<!-- List.vue -->
<template>
	<div>
        <template v-for="(item, index) in data">
            <!-- 判断父组件有没有传递render，没有默认使用 li 渲染 -->
            <li :key="index" v-if="!render">{{item}}</li>
		   <ListItem v-else :key="`a${index}`" :render="render" :item="item"></ListItem>
		</template>
    </div>
</template>
<script>
import ListItem form './ListItem'
export default {
    components: {
        ListItem
    },
    props: {
        render: {
            type: Function
        },
        data: {
            type: Array,
            default: () => []
        }
    }
}
</script>


<!-- List1.vue -->
<template>
	<div>
        <template v-for="(item, index) in data">
            <slot :item="item" :a="1"></slot>
		</template>
    </div>
</template>
<script>
import ListItem form './ListItem'
export default {
    components: {
        ListItem
    },
    props: {
        render: {
            type: Function
        },
        data: {
            type: Array,
            default: () => []
        }
    }
}
</script>
```

```jsx
/* components/ListItem.js */
export default {
    props: {
        render: {
            type: Function
        },
        item: {
            type: String
        }
    },
    render(h){
        // 返回的是 App.vue 组件的 render
        return this.render(h, this.item)
    }
}
```





## 二、函数式组件

## 三、JSX应用

## 四、render方法定制组件内

## 五、scope-slot

## 六、编写可编辑表格

