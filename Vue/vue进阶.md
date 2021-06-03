# Vue前端工程化



## 快速原型开发

可以快速识别 .vue 文件封装组件插件等功能

```shell
# vue-cli 脚手架升级到 3.0 版本
sudo npm install @vue/cli -g
sudo npm install -g @vue/cli-service-global
# 在一个空目录下新建 main.js 和 App.vue 文件，可以直接使用 vue serve 启动项目
vue serve App.vue
```
`main.js`
```js
import Vue from 'vue';
import App from './App'

const vm = new Vue({
    el: '#app',
    render: h => h(App)
})
```

`App.vue`

```vue
<template>
	<div>
    	<Parent></Parent>
    </div>
</template>

<script>
	  import Parent from './components/Parent'
    export default {
        components: {
            Parent
        }
    }
</script>
```

## Vue 组件间通信方式

### :props 和 $emit 方法

```vue
<!-- components/Parent.vue -->
<template>
	<div>
        父组件钱数: {{mny}}
        <Son1 :value="mny" @input="change"></Son1>
        <!-- .sync同步数据 -->
        <Son1 :value.sync="mny"></Son1>
    </div>
</template>

<script>
    import Son1 from './Son1'
	export default {
        components: {
            Son1
        },
        data() {
            return {
                mny
            }
        },
        methods: {
            change(value) {
                this.mny = value
            }
        }
    }
</script>


<!-- components/Son1.vue -->
<template>
	<div>
        Son1: {{value}}
        <button @click="change">点击修改</button>
        <Grandson1 :value="value" @say="say"></Grandson1>
    </div>
</template>

<script>
	import Grandson1 from './Grandson1'
	// 单向数据流 父组件给子组件绑定一个事件
	export default {
        name: 'son1',
        components: {
            Grandson1
        },
        props: {
            value: {
                type: Number,
                default: 1
            }
        },
        methods: {
            change() {
                this.$emit('input', 200)
            }
        }
    }
</script>


<!-- components/Grandson1.vue -->
<template>
	<div>
        Grandson1: {{value}}
        <button @click="changeParent">修改Parent</button>
    </div>
</template>

<script>
	export default {
        props: {
            value: {
                type: Number,
                default: 1
            }
        },
        methods: {
            changeParent() {
                // 通过 $parent 触发 Son1 组件的 input 方法
                this.$parent.$emit('input', 200)
                // this.$parent.$parent.$parent.$emit('input', 200)
            }
        }
    }
</script>
```



### $dispatch 向上传递和 $broadcast 向下广播方式

```js
/* main.js */

// 向上通知
Vue.prototype.$dispatch = function(eventName, value) {
    let parent = this.$parent;	// this表示当前触发$dispatch的组件
    while(parent) {
        parent.$emit(eventName, value);
        parent = parent.$parent;
    }
}
// 向下广播
Vue.prototype.$broadcast = function(eventName, value) {
    // 获取当前组件下的所有的子组件
    const broadcast = (children) => {
        children.forEach(child => {
            child.$emit(eventName, value);
            if (child.$children) {
                // 如果子组件还有子组件，向下递归查找
                broadcast(child.$children);
            }
        })
    }
	broadcast(this.$children);
}
```

```vue
<script>
	export default {
		mounted() {
      // 向下广播，触发所有子组件的 say 方法 (需要先在 main.js 中将 $broadcast 挂载在 Vue 的原型上)
    	this.$broadcast('say')
		}
  }
</script>

<!-- components/Parent.vue -->
<template>
	<div>
        父组件钱数: {{mny}}
        <Son1 :value="mny" @input="change"></Son1>
    </div>
</template>

<script>
  import Son1 from './Son1'
	export default {
        components: {
            Son1
        },
        data() {
            return {
                mny
            }
        },
        methods: {
            change(value) {
                this.mny = value
            }
        }
    }
</script>


<!-- components/Son1.vue -->
<template>
	<div>
        Son1: {{value}}
        <button @click="change">点击修改</button>
        <Grandson1 :value="value" @say="say"></Grandson1>
    </div>
</template>

<script>
  import Grandson1 from './Grandson1'
  // 单向数据流 父组件给子组件绑定一个事件
	export default {
        name: 'son1',
        components: {
            Grandson1
        },
        props: {
            value: {
                type: Number,
                default: 1
            }
        },
        methods: {
            change() {
                this.$emit('input', 200)
            }
        }
    }
</script>


<!-- components/Grandson1.vue -->
<template>
	<div>
        Grandson1: {{value}}
        <button @click="changeParent">修改Parent</button>
    </div>
</template>

<script>
	export default {
        props: {
            value: {
                type: Number,
                default: 1
            }
        },
        methods: {
            changeParent() {
                // 通过 $dispatch 方法向上级组件发送时间 (需要先将 $dispatch 方法在 mian.js 中挂载在 Vue 的原型上)
                this.$dispatch('inpit', 200)
            },
            say(){
                console.log('在祖级组件中通过向下广播的方法触发的事件')
            }
        }
    }
</script>
```

### 属性传递

```vue
<!-- Parent.vue -->
<template>
	<Son2 name="张三" age="10" address="西安" @son="son"></Son2>
</template>
<script>
  import Son2 from './Son2'
	export default {
		components: {
			Son2
    },
		// 希望数据被子组件公用，不希望传递来传递去；可以通过数据注入直接把父组件注入进去（provide）
		provide(){
			return {parent: this}
    },
		data(){
			return {}
  	},
		methods: {
			son(){
				console.log('有人点我')
  	  }
  	}
  },
	
</script>


<!-- Son2.vue -->
<template>
	<div>
		儿子二 {{$attrs}} {{$listeners}}
		<!-- v-bind="$attrs" 传递所有属性  v-on="$listeners" 传递所有方法 -->
		<Grandson2 v-bind="$attrs" v-on="$listeners"></Grandson2>
  </div>
</template>
<script>
  import Grandson2 from './Grandson2'
	export default {
		components: {
			Grandson2
    },
		inheritAttrs: false,	// 表示不把当前父组件传递的属性挂载在自己的DOM元素上
		data(){
			return {}
  	},
		methods: {
			son(){
				console.log('有人点我')
  	  }
  	}
  },
</script>

<!-- Grandson2.vue -->
<template>
	<div>
		孙子二 {{$attrs}}
  </div>
</template>
<script>
	export default {
		inject: [
			'parent'  // this.parent：父组件的实例
    ],
		mounted(){
			this.$listeners.son()
    }
  }
</script>
```

### eventBus

> eventBus 的缺陷：eventBus 定义到全局上，加入一个组件发送了事件，同名的会全部触发，不管是子组件还是父组件，都会触发

`main.js`

```js
Vue.prototype.$bus = new Vue();	// $on $emit
```

```vue
<!-- Son2.vue -->
<script>
	export default {
		mounted(){
			this.$bus.$on('come', function(){
				console.log('事件被触发了')
      })
    }
  }
</script>


<!-- Grandson1.vue -->
<script>
export default {
  mounted(){
		// this.$bus.$emit('come', 'xxxxxx') // 直接这样写不生效，父子组件挂载顺序问题
		this.$nextTick(() => {
			this.$bus.$emit('come', 'xxxxxx')
    })
  }
}
</script>
```



### observer

```javascript
/* observer.js */
let arrayProt = Array.prototype // 数组原型上的方法
let proto = Object.create(arrayProt);
['push', 'shift', 'splice'].forEach(method => {
    proto[method] = function(...args) { // 这个数组应该也被监控
        console.log(arguments)
        // Array.prototype.push.call([1,2,3],4,5,6)
        let inserted; // 默认没有插入新的数据
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice': // 数组的 splice 只有传递三个参数 才有追加元素效果
                inserted = args.slice(2)
            default:
                break;
        }
        ArrayObserver(inserted)
        arrayProto[method].call(this, ...args)
    }
})

function ArrayObserver(obj) {
    for (let i = 0; i < obj.length; i++) {
        let item = obj[i]
        observer(item) // 如果是对象会被 defineReactive
    }
}
function observer(obj) {
    if (typeof obj !== 'object' || obj == null) {
        return obj
    }
    if (Array.isArray(obj)) {
        // 处理数组格式 (如果调用 push shift splice 这三个方法，应该把这个值判断一下是否是个对象)
        Object.setPrototypeOf(obj, proto) // obj.__proto__ = proto 实现一个对数组的方法进行重写
        ArrayObserver(obj)
    } else { // 处理是对象的
        for (let key in obj) {
            defineReactive(obj, key, obj[key]) // 默认只循环第一层
        }
    }
}
function defineReactive(obj, key, value) {
    observer(value) // 递归创建响应式数据 性能不好
    Object.defineProperty(obj, key, {
        get() {
            return value
        },
        set(newVal) { // 给某个key设置值的时候 可能也是一个对象
            if (value !== newValue) {
                observer(value)
                value = newValue
                console.log('视图更新')
            }
        }
    })
}
let data = {name: '张三'}
observer(data)
console.log(data.name)
data.name = '123'
data.name = {n: 'lisi'}
// 特点：使用对象的时候 必须先声明属性，这个属性才是响应式的
// 1. 增加不存在的属性，不能更新视图 (不会触发defineReactive函数set方法中的视图更新，使用vm.$set解决)
// 2. vue默认会递归所有数据 增加getter和setter
// 3. 数组里套对象 对象是支持响应式变化的 如果是常量则没有效果
// 4. 修改数组索引和长度 是不会导致视图更新的
// 5. 如果新增的数据 vue中也会帮你监控 (对象类型)
```

template 不能和 v-show 一起用

### 自定义指令 directive

**全局指令**
所有组件 实例都可以使用

```javascript
// el 代表当前指令元素
// bindings 绑定属性
// VNode 虚拟节点  context上下文， 当前指令所在的上下文
/*
Vue.directive('focus', function(el, bindings, vnode) {
    // 此方法默认只在绑定时和更新时才会执行 (只有依赖的数据发生变化才会重新执行)
    console.log(el, bindings, vnode)
    el.focus()
})
*/
Vue.directive('focus', {
    inserted(el, bindings, vnode) { // 指令元素插入到页面时执行
        el.focus()
    }
    // bind(el, bindings, vnode) {
    // 	Vue.nextTick(() => el.focus())
	// }
})
let vm = new Vue({
    el: '#app',
    data: {}
})
```

```javascript
// v-clickOutside  可以实现点击时判断是否存在当前的dom中
let vm = new Vue({
    el: '#app',
    directives: {
        clickOutside: {
            bind(el, bindings, vnode) {
                el.fn = e => {
                    if (el.contains(e.target)) {
                        vnode.context['focus']()
                    } else {
                        vnode.context['blur']()
                    }
                }
                document.addEventListener('click', el.fn)
            },
            unbind(el) {
                document.removeEventListener('click', el.fn)
            }
        }
    },
    data: {
        isShow: false
    },
    methods: {
        blur() {
            this.isShow = false
        },
        focus() {
            this.isShow = true
        }
    }
})
```



































