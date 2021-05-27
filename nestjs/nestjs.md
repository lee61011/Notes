# Nestjs

## 安装

```shell
$ npm i -g @nestjs/cli
$ nest new server
```

## 工作空间

```shell
$ cd server
# 默认创建标准模式 使用下面的命令可以转换为Monorepo模式
# 参考 https://docs.nestjs.cn/7/cli?id=%e5%b7%a5%e4%bd%9c%e7%a9%ba%e9%97%b4
$ nest g app admin # 表示在server中创建一个名为admin的子项目
```

切换为 Monorepo 模式后，启动项目需要使用 `nest start -w admin` 命令来启动子项目

```shell
# 两个模块公用的东西需要单独创建一个模块
cd server
nest g lib db
# 创建文件夹 (default: @app) ?    手动输入 @libs

|- server
	|- apps
	|- dist
	|- libs
		|- db
```

`apps/admin/src/app.module.ts`

```typescript
import { Dbmodule } from '@libs/db'

@Module({
    imports: [
        DbModule
    ]
})
```

安装 nest 数据库模块

```shell
# nestjs-typegoose 为了在nest中使用
# @typegoose/typegoose 基于ts的一个封装
yarn add nestjs-typegoose @typegoose/typegoose
yarn add mongoose @types/mongoose
```

公共模块中连接数据库

```typescript
// server/libs/db/src/db.module.ts
import { TypegooseModule } from 'nestjs-typegoose'

@Global() // 将此模块标记为全局的
@Module({
    imports: [
        TypegooseModule.forRoot('mongodb://localhost/topfullstack', { // 连接数据库
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
    ]
})
```

```typescript
/*  libs/db/src/models/user.model.ts  */
import {  } from '@typegoose/typegoose'

// 用户模型
export class User {
    @prop()
    username: string
    @prop()
    password: string
}
```























