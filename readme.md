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
git reset --hard id  #这个是之后的版本都不需要的回滚
git push -g #强制推送
git revert -n id  这个是新的版本
#删除文件是这个，不需要git
rm -rf skillport
```

# ssh传输大文件

> 这里的密码是zjl2581445

这是一个 SSH 密钥认证失败的问题。以下是中文解决方案：

## **问题原因：**
GitHub 无法识别你的 SSH 密钥，导致权限被拒绝。

## **解决方法：**

### **1. 检查 SSH 密钥是否存在：**
```bash
# 查看是否有 SSH 密钥
ls -al ~/.ssh
```
你应该能看到类似 `id_rsa`、`id_rsa.pub` 或 `id_ed25519`、`id_ed25519.pub` 的文件。

### **2. 如果没有 SSH 密钥，生成新的：**
```bash
# 生成新的 SSH 密钥（推荐使用 ed25519）
ssh-keygen -t ed25519 -C "你的邮箱@example.com"

# 或者使用 RSA（兼容性更好）
ssh-keygen -t rsa -b 4096 -C "你的邮箱@example.com"
```
按提示操作，可以设置密码（可选）。

### **3. 添加 SSH 密钥到 SSH 代理：**
```bash
# 启动 SSH 代理
eval "$(ssh-agent -s)"

# 添加 SSH 私钥到代理
ssh-add ~/.ssh/id_ed25519  # 如果使用 ed25519
# 或者
ssh-add ~/.ssh/id_rsa      # 如果使用 RSA
```

### **4. 复制公钥到 GitHub：**
```bash
# 显示公钥内容，然后复制
cat ~/.ssh/id_ed25519.pub
# 或者
cat ~/.ssh/id_rsa.pub
```

**在 GitHub 上添加公钥：**
1. 登录 GitHub
2. 点击右上角头像 → Settings
3. 左侧选择 **SSH and GPG keys**
4. 点击 **New SSH key**
5. 粘贴复制的公钥内容
6. 点击 **Add SSH key**

### **5. 测试 SSH 连接：**
```bash
# 测试是否配置成功
ssh -T git@github.com
```
如果看到类似这样的消息，说明成功：
```
Hi 你的用户名! You've successfully authenticated, but GitHub does not provide shell access.
```

### **6. 确认远程仓库使用 SSH URL：**
```bash
# 查看当前远程仓库地址
git remote -v

# 如果是 HTTPS URL，改为 SSH
git remote set-url origin git@github.com:用户名/仓库名.git
```

## **常见问题排查：**

### **如果还是失败：**
```bash
# 1. 检查 SSH 配置文件
cat ~/.ssh/config

# 如果没有配置文件，创建一个
# 在 ~/.ssh/config 中添加：
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519  # 或你的私钥路径
  AddKeysToAgent yes
```

### **Windows 特定问题：**
```bash
# 确保 Git Bash 以管理员身份运行
# 检查 Windows SSH 服务是否运行
Get-Service ssh-agent  # PowerShell

# 启动 SSH 代理服务
Start-Service ssh-agent
```

### **如果之前使用过 HTTPS：**
```bash
# 清除 Git 凭据缓存（Windows）
git config --global --unset credential.helper

# 或者手动删除凭据
# 控制面板 → 用户账户 → 凭据管理器 → Windows 凭据
# 删除 GitHub 相关的凭据
```

## **快速验证步骤：**
1. **生成密钥** → **添加到 SSH 代理** → **复制到 GitHub**
2. **测试连接** `ssh -T git@github.com`
3. **修改远程仓库 URL** 为 SSH 格式
4. **重新推送**

## **如果所有方法都失败：**
可以暂时切换回 HTTPS（不推荐长期使用）：
```bash
git remote set-url origin https://github.com/用户名/仓库名.git
# 然后使用个人访问令牌（PAT）代替密码
```

需要进一步帮助的话，请告诉我你执行 `ssh -T git@github.com` 时看到的具体错误信息。
