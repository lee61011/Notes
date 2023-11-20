# GIt 使用指南

## 新建分支

每次开发新功能，都应该新建一个单独的分支（参考[《Git分支管理策略》](https://www.ruanyifeng.com/blog/2012/07/git.html)）

```bash
# 获取主干最新代码
$ git checkout master
$ git pull

# 新建一个开发分支myfeature
$ git checkout -b myfeature
```

## 提交分支commit

```bash
$ git add --all
$ git status
# git commit 命令的verbose参数，会列出 diff 的结果。
$ git commit --verbose
```

## 撰写提交信息

第一行是不超过50个字的提要，然后空一行，罗列出改动原因、主要变动、以及需要注意的问题。最后，提供对应的网址（比如Bug ticket）

```bash
Present-tense summary under 50 characters

* More information about commit (under 72 characters).
* More information about commit (under 72 characters).

http://project.management-system.com/ticket/123
```

## 与主干同步

```bash
$ git fetch origin
$ git rebase origin/master
```

## 合并commit

分支开发完成后，很可能有一堆commit，但是合并到主干的时候，往往希望只有一个（或最多两三个）commit，怎样才能将多个commit合并呢？这就要用到 git rebase 命令。

```bash
$ git rebase -i origin/master
```

## 推送到远程仓库

git push命令要加上force参数，因为rebase以后，分支历史改变了，跟远程分支不一定兼容，有可能要强行推送

```bash
$ git push --force origin myfeature
```







参考：[阮一峰网络日志 开发者手册](https://www.ruanyifeng.com/blog/developer/)

- [Git 工作流程](https://www.ruanyifeng.com/blog/2015/12/git-workflow.html)
- [Git 使用规范流程](https://www.ruanyifeng.com/blog/2015/08/git-use-process.html)
- [Git 常用命令清单](https://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)
- [Git 远程操作详解](https://www.ruanyifeng.com/blog/2014/06/git_remote.html)
- [Git 分支管理策略](https://www.ruanyifeng.com/blog/2012/07/git.html)
- [git-bisect](https://www.ruanyifeng.com/blog/2018/12/git-bisect.html)
- [git-cherry-pick](https://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html)
- 