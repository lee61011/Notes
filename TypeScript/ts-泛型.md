# 泛型

- 泛型(Generics)是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性
- 泛型`T`作用域只限于函数内部使用

## 泛型函数

- 首先，来实现一个函数 createArray，它可以创建一个指定长度的数组，同时将每一项都填充一个默认值

  ```typescript
  function createArray(length:number, value:any): Array<any> {
      let result:any = []
      for (let i = 0; i < length; i++) {
          result[i] = value
      }
      return result
  }
  let result = createArray(3, 'x')
  console.log(result)
  ```

  

