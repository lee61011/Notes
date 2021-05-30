# TypeScript

## 环境搭建

### 安装TypeScript

通过 npm 全局安装

```shell
npm install -g typescript
# 查看版本
tsc -v
# 查看帮助命令
tsc -h
```

## 手册指南

### 基础类型

- 布尔值：true / false
- 数字：number
- 字符串：string
- 数组：有两种方式可以定义数组
  - 可以在元素类型后面接上[]，表示由此类型元素组成的一个数组：let list: number[] = [1,2,3]
  - 使用数组泛型，Array<元素类型>：let list: Array<number> = [1,2,3]
- **元组 Tuple**
- **枚举 enum**
- **Any**
- Void： `void`类型像是与`any`类型相反，它表示没有任何类型。 
- Null 和 Undefined
- Never： 表示的是那些永不存在的值的类型 
- Object：表示非原始类型

### 变量声明

### 接口

- 可选属性
- 只读属性