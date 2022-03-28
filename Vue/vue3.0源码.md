# Vue3源码





## `Vue3` 项目结构

- `reactivity`：响应式系统
- `runtime-core`：与平台无关的运行时核心(可以创建针对特定平台的运行时 - 自定义渲染器)
- `runtime-dom`：针对浏览器的运行时。包括`DOM API`，属性，事件处理等
- `runtime-test`：用于测试
- `server-renderer`：用于服务器端渲染
- `compiler-core`：与平台无关的编译器核心
- `compiler-dom`：针对浏览器的编译模块
- `compiler-ssr`：针对服务端渲染的编译模块
- `compiler-sfc`：针对单文件解析
- `size-check`：用来测试代码体积
- `template-explorer`：用于调试编译器输出的开发工具
- `shared`：多个包之间共享的内容
- `vue`：完整版本，包括运行时和编译器







## 使用 rollup 进行打包

> yarn add typescript rollup rollup-plugin-typescript2 @rollup/plugin-node-resolve @rollup/plugin-json execa --ignore-workspace-root-check

`--ignore-workspace-root-check`表示是给根安装的 并不是给子模块安装的



























