
## git分支合并

- `git merge [branch]`
- `git rebase [branch]`
Rebase 实际上就是取出一系列的提交记录，“复制”它们，然后在另外一个地方逐个的放下去。Rebase 的优势就是可以创造更线性的提交历史，这听上去有些难以理解。如果只允许使用 Rebase 的话，代码库的提交历史将会变得异常清晰。



## git分离HEAD

- 切换到指定的提交：`git checkout [hash]`
- 切换到上一次提交：`git checkout HEAD^`
- `git branch -f main~3`

## git撤销变更

- `git reset [HEAD^]`
- `git revert [HEAD]`

## git合并

- `git cherry-pick [HEAD1 HEAD2 HEAD3]`  复制提交到当前分支
- `git rebase -i HEAD~4`


`git rebase -i` 提交重排序
`git commit --amend` 进行一些小修改
`git rebase -i` 调回原来的顺序



`git checkout [HEAD]`
`git tag [tagName]`


`git describe <ref>` 
