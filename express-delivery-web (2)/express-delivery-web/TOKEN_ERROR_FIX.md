# "访问令牌缺失" 错误解决方案

## 🔍 错误含义

**"访问令牌缺失"** 表示：
- 后端没有收到认证token
- 请求头中缺少 `Authorization: Bearer <token>`
- 用户可能未登录，或者token已过期/丢失

## ✅ 已修复的问题

### 1. **Token传递问题**
- ✅ 修复了headers合并问题，确保Authorization头正确传递
- ✅ 改进了token检查逻辑
- ✅ 添加了详细的调试日志

### 2. **错误处理改进**
- ✅ 检测到"访问令牌缺失"时自动跳转登录页
- ✅ 清除无效的token
- ✅ 更友好的错误提示

### 3. **登录状态检查**
- ✅ 提交订单前检查登录状态
- ✅ 创建了 `useAuth` hook 用于统一管理登录状态

## 📋 解决步骤

### 步骤1：检查是否已登录

1. 打开浏览器开发者工具（F12）
2. 进入 Console（控制台）
3. 输入以下命令检查token：
```javascript
localStorage.getItem('token')
```

**如果返回 `null` 或 `undefined`：**
- 说明未登录，需要先登录

**如果返回一个字符串：**
- 说明已登录，继续下一步

### 步骤2：登录

1. 访问登录页面：`/auth/login`
2. 输入手机号和密码
3. 登录成功后，token会自动保存到localStorage

### 步骤3：验证Token传递

提交订单时，查看浏览器控制台：

```javascript
API Request: {
  url: "...",
  hasAuth: true,  // 应该是 true
  token: "存在"   // 应该显示"存在"
}
```

如果 `hasAuth: false` 或 `token: "不存在"`，说明token没有正确传递。

### 步骤4：检查网络请求

1. 打开开发者工具 → Network（网络）
2. 找到 `/api/orders` 请求
3. 查看 Request Headers（请求头）
4. 确认包含：
```
Authorization: Bearer <你的token>
```

## 🔧 常见问题

### Q1: 为什么会出现"访问令牌缺失"？

**可能原因：**
1. ❌ 未登录（localStorage中没有token）
2. ❌ Token已过期
3. ❌ Token被清除（刷新页面、清除缓存等）
4. ❌ 请求头未正确设置

### Q2: 如何确认token是否正确？

**检查方法：**
```javascript
// 在浏览器控制台执行
const token = localStorage.getItem('token');
console.log('Token:', token);
console.log('Token长度:', token?.length);
console.log('Token预览:', token?.substring(0, 20));
```

### Q3: 登录后token丢失怎么办？

**可能原因：**
- 浏览器清除了localStorage
- 使用了隐私模式/无痕模式
- 跨域问题导致localStorage无法访问

**解决方法：**
- 重新登录
- 检查浏览器设置
- 确保前后端在同一域名下（或正确配置CORS）

### Q4: Token格式是什么？

**正确格式：**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**注意：**
- 必须以 `Bearer ` 开头（注意空格）
- Token是一个JWT字符串

## 🚀 快速测试

### 测试1：检查登录状态
```javascript
// 在浏览器控制台执行
localStorage.getItem('token') ? '已登录' : '未登录'
```

### 测试2：手动设置Token（仅用于测试）
```javascript
// 注意：这不是正确的做法，仅用于测试
// 正确的做法是通过登录获取token
localStorage.setItem('token', 'test-token');
```

### 测试3：清除Token
```javascript
// 清除登录信息
localStorage.removeItem('token');
localStorage.removeItem('user');
```

## 📝 调试清单

提交订单前，确认以下事项：

- [ ] 已登录（localStorage中有token）
- [ ] Token格式正确（JWT字符串）
- [ ] 浏览器控制台没有错误
- [ ] 网络请求包含Authorization头
- [ ] 后端服务正常运行
- [ ] 前后端连接正常（检查Next.js代理配置）

## 🆘 如果问题仍然存在

1. **查看浏览器控制台**
   - 检查是否有JavaScript错误
   - 查看API请求日志

2. **查看网络请求**
   - 检查请求头是否正确
   - 检查响应状态码

3. **查看后端日志**
   - 检查是否收到请求
   - 检查请求头中的Authorization字段

4. **提供以下信息以便进一步调试：**
   - 浏览器控制台的完整错误信息
   - Network标签页中请求的详细信息
   - 后端控制台的日志输出
