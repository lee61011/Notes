# Vue 查漏补缺



## 组件的基本使用

### 通过 name 属性注册组件

在注册组件期间，除了可以`直接提供组件的注册名称`之外，还可以`把组件的 name 属性`作为注册后`组件的名称`

```vue
<template>
	<h3>轮播图组件</h3>
</template>
<script>
	export default {
        name: 'MySwiper' // name 属性为当前组件的名字
    }
</script>

import Swiper from './components/MySwiper.vue'
app.component(Swiper.name, Swiper) // 相当于 app.component('MySwiper', Swiper)
```

### /deep/ 样式穿透原理

```vue
<style lang="less" scoped>
    .title {
        color: blue; /* 不加 /deep/ 时，生成的选择器格式为 .title[data-v-052242de] */
    }
    
    /deep/ .title {
        color: blue; /* 加上 /deep/ 时，生成的选择器格式为 [data-v-052242de] .title */
    }
    
    :deep(.title) {
        color: blue; /* 在 vue3.x 中推荐使用 :deep() 替代 /deep/ */
    }
</style>
```

注意：`/deep/`是 vue2.x 中实现样式穿透的方案。在 vue3.x 中推荐使用 `:deep()`替代`/deep/`

### 自定义事件

**声明自定义事件**
开发者为自定义组件封装的自定义事件，必须事先在 emits 节点中声明
**触发自定义事件**
在 emits 节点下声明的自定义事件，可以通过 this.$emit('自定义事件的名称') 方法进行触发

```vue
<template>
	<h3>Counter 组件</h3>
	<button>+1</button>
</template>
<script>
export default {
    // my-counter 组件的自定义事件，必须事先声明到 emits 节点中
    emits: ['change'],
    methods: {
        onBtnClick() {
            this.$emit('change') // 当点击 +1 按钮时，调用 this.$emit() 方法，触发自定义的 change 事件
        }
    }
}
</script>
```

### 组件上的 v-model

**为什么需要在组件上使用 v-model**
v-model 是双向数据绑定指令，当`需要维护组件内外数据的同步`时，可以在组件上使用 v-model 指令
**在组件上使用 v-model 的步骤**

1. 在 v-bind: 指令之前添加 v-model 指令

2. 在子组件中声明 emits 自定义事件，格式为 update:xxx

3. 调用 $emit() 触发自定义事件，更新父组件中的数据

   ```javascript
   // v-model:number="count"
   // emits: ['update:number']
   // this.$emits('update:number', this.number + 1)
   ```

   

