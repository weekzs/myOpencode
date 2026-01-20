```bash
# 1. 在当前目录下创建（或追加）README.md 文件，内容为 "# myOpencode"
#    echo 是输出文本的命令，>> 表示将内容追加到文件末尾（文件不存在则创建）
echo "# myOpencode" >> README.md

# 2. 在当前目录初始化一个新的 Git 仓库
#    git init 会在当前文件夹创建 .git 隐藏目录，用于存储 Git 版本控制的所有数据
git init

# 3. 将 README.md 文件添加到 Git 的「暂存区」（准备提交的区域）
#    git add 是把文件纳入 Git 跟踪的第一步，README.md 是指定要添加的文件（也可用 git add . 添加所有文件）
git add README.md

# 4. 将暂存区的文件提交到「本地仓库」，并添加提交说明
#    git commit 是正式保存修改的操作，-m 是指定提交信息（必须写，描述这次提交的内容），"first commit" 是提交备注（首次提交）
git commit -m "first commit"

# 5. 将本地默认的 master 分支重命名为 main 分支
#    git branch 是分支操作命令，-M 是强制重命名（M=Move/Move Force），main 是新的分支名（现在 GitHub 默认分支是 main 而非 master）
git branch -M main

# 6. 关联本地仓库到 GitHub 上的远程仓库
#    git remote add 是添加远程仓库关联，origin 是远程仓库的「别名」（默认约定用 origin），后面是你的 GitHub 仓库地址
git remote add origin https://github.com/weekzs/myOpencode.git

# 7. 将本地 main 分支推送到远程 origin 仓库，并设置「上游跟踪」
#    git push 是推送本地代码到远程，-u 是 --set-upstream 的简写，设置本地 main 分支跟踪远程 origin/main 分支
#    后续再推送只需执行 git push 即可，无需重复指定 origin 和 main
git push -u origin main
```

