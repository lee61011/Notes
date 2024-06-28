## GIT 工作原理

- 工作区：我们能看到的，并且用来写代码的区域
- 暂存区：临时存储用的
- 历史去：生产历史版本

工作区 -> 暂存区 -> 历史区

## GIT 的全局配置

```shell
git config -l	# 查看配置信息
git config --global -l # 查看全局配置信息
```



## 查看、添加、提交、删除、找回，重置修改文件

```shell
git help <command>			# 显示 command 的 help
git show					# 显示某次提交的内容
git show $id
git co -- <file>			# 抛弃工作区修改  (co是checkout的缩写 需要配置)
git co .					# 抛弃工作区修改
git -rf filename			# 抛弃本地新增文件(并没有git add到暂存区)
git clean -xdf				# 删除新增的文件 如果已经git add到暂存区 并不会被删除
git clean -xdff				# 删除新增的文件和文件夹 如果已经git add到暂存区 并不会被删除
git add <file>				# 将工作文件修改提交到本地暂存区
git add .					# 将所有修改过的工作文件提交暂存区
git rm <file>				# 从版本库中删除文件
git rm <file> --cached		# 从版本库中删除文件，但不删除文件
git reset <file>			# 从暂存区恢复到工作文件
git reset -- .				# 从暂存区恢复到工作文件
git reset --hard			# 恢复最近一次提交过的状态，即放弃上次提交后的所有本次修改
git reset --merge
git ci <file>
git ci .
git ci -a					# 将 git add, git rm 和 git ci 等操作都合并在一起做
git ci -am "some comments"
git ci --amend				# 修改最后一次提交记录
git revert <$id>			# 恢复某次提交的状态，恢复动作本身也创建了一次提交对象
git revert HEAD				# 恢复最后一次提交的状态

# 查看历史版本信息（历史记录）
git log
git reflog	# 包含回滚的信息
```

## 查看文件 diff

```shell
git diff <file> # 比较当前文件和暂存区文件的差异
git diff
git diff <$id1> <$id2> # 比较两次提交之间的差异
```

## GIT 分支

```shell
git branch -a 				# 查看所有本地和远程分支
git branch -r				# 仅查看远程分支
git remote show origin		 # 查看远程与本地分支对应关系
git remote prune origin		 # 删除远程不存在的分支
git branch -d xx			 # 删除本地分支
git push origin --delete xx	  # 删除远程分支
git branch --list '*xxx*'	  # 列出本地仓库中所有包含xxx的分支
git branch -r --list '*xxx*'	  # 列出远程仓库中所有包含xxx的分支
git branch -a --list '*xxx*'	  # 列出本地和远程仓库中所有包含xxx的分支
git checkout -b 'branch name' # 新建本地分支
git branch -u 'origin/branch name' # 关联远程分支
git checkout -b 'local branch name' 'origin/ branch name' # 创建本地分支并关联远程分支
```



## 解决git bash终端显示中文乱码

```bash
# 参考 https://zhuanlan.zhihu.com/p/133706032
git config --global core.quotepath false
```



