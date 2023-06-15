# Docker镜像

## image 镜像

- Docker 把应用程序及其依赖，打包在 image 文件里面，只有通过这个文件，才能生成 Docker 容器
- image文件可以看作是容器的模板
- Docker 根据 image 文件生成容器的实例
- 同一个 image 文件，可以生成多个同时运行的容器实例
- 镜像不是一个单一的文件，而是有多层
- 容器其实就是在镜像的最上面加了一层读写层，在运行容器里做的任何文件改动，都会写到这个读写层里，如果容器删除了，最上面的读写层也就删除了，改动也就丢失了
- 我们可以通过 docker history ID/NAME> 查看镜像中各层内容及大小，每层对应着 Dockerfile 中的一条指令
  

| 命令    | 含义                                         | 案例                                      |
| ------- | -------------------------------------------- | ----------------------------------------- |
| ls      | 查看全部镜像                                 | docker image ls                           |
| search  | 查找镜像                                     | docker search [imageName]                 |
| history | 查看镜像历史                                 | docker history [imageName]                |
| inspect | 显示一个或多个镜像详细信息                   | docker inspect [imageName]                |
| pull    | 拉取镜像                                     | docker pull [imageName]                   |
| push    | 推送一个镜像到镜像仓库                       | docker push [imageName]                   |
| rmi     | 删除镜像                                     | docker rmi [imageName] docker image rmi 2 |
| prune   | 移除未使用的镜像，没有被标记或补任何容器引用 | docker image prune                        |
|         |                                              |                                           |

