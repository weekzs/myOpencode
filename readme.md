```bash
echo "# myOpencode" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/weekzs/myOpencode.git
git push -u origin main
# 清除单个文件（比如 README.md）
git rm --cached README.md
# 清除中文文件夹（建议加引号，避免Git识别错误）
git rm --cached "OCR学习笔记"

```

```bash
#查看提交历史
git log
#撤销提交
git revert <commit_id>
# 查看远程 origin 仓库 main 分支的所有文件列表（按树形结构展示）
git ls-tree origin/main --name-only
把所有的change加到git index里然后再commit
git commit -a
git remote show
git status #查看当前状态
git restore 文件名  # Git 2.23+ 版本推荐
git remote rm origin 
```

