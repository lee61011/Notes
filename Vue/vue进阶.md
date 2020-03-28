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
		inheritAttrs: false,
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

