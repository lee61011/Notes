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

