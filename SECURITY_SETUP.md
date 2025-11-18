# 安全配置指南

## 🔒 重要提示

本项目已进行安全优化，所有敏感信息（API 密钥、代理令牌）已从代码中移除，使用外部配置文件管理。

---

## 📋 配置步骤

### 1. 创建配置文件

`public/config.js` 文件已经为您创建（包含您的密钥），**但此文件不会提交到 Git**。

如果需要重新配置，请参考 `public/config.example.js` 创建新的配置文件：

```bash
cd public
cp config.example.js config.js
```

### 2. 编辑配置文件

打开 `public/config.js`，填入您的配置：

```javascript
window.APP_CONFIG = {
    // Vercel 代理服务域名（自动使用当前域名）
    API_BASE: window.location.origin,

    // Cloudflare Workers API 密钥
    API_KEY: '您的API密钥',

    // Vercel 代理访问令牌
    PROXY_TOKEN: '您的代理令牌',

    // 其他配置...
};
```

### 3. 配置说明

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `API_BASE` | Vercel 代理域名 | `window.location.origin` (自动) |
| `API_KEY` | Cloudflare Workers API 密钥 | `aae90c74...` |
| `PROXY_TOKEN` | Vercel 代理令牌 | `a2d4a299...` |
| `CACHE_DURATION` | 缓存时长（毫秒） | `300000` (5分钟) |

---

## 🔐 安全机制

### 双重验证

```
浏览器 → Vercel 代理 → Cloudflare API
        ↓              ↓
   X-Proxy-Token   Authorization
```

1. **X-Proxy-Token** - 验证 Vercel 代理访问权限
2. **Authorization** - 验证 Cloudflare API 访问权限

### 文件保护

以下文件已添加到 `.gitignore`，不会被提交：

- `public/config.js` - 包含敏感密钥
- `config.js` - 根目录配置（如果存在）
- `.env` - 环境变量文件

---

## ⚠️ 安全建议

### 1. 定期轮换密钥

建议每 3-6 个月轮换一次密钥：

**生成新的 Cloudflare API 密钥：**
- 访问 Cloudflare Dashboard
- Workers & Pages → 您的 Worker → Settings
- 重新生成 API 密钥

**生成新的代理令牌：**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

然后在 Vercel Dashboard 更新环境变量 `PROXY_TOKEN`。

### 2. 不要分享配置文件

- ❌ 不要将 `config.js` 提交到 Git
- ❌ 不要在截图中暴露密钥
- ❌ 不要通过邮件发送配置文件

### 3. 检查 Git 历史

如果之前误提交了密钥，需要：

1. 轮换所有密钥
2. 清理 Git 历史（如果需要）

```bash
# 查看 Git 历史中是否有敏感信息
git log -p | grep -i "api_key\|token"
```

---

## 🚀 部署说明

### 本地开发

1. 确保 `public/config.js` 已正确配置
2. 运行开发服务器：
   ```bash
   npm run dev
   ```
3. 访问 `http://localhost:3000/index.html`

### 生产部署

1. 将代码推送到 GitHub
2. Vercel 会自动部署
3. `public/config.js` **不会被部署**（被 .gitignore 忽略）
4. 访问 `https://your-domain.com/index.html`

**重要：** 生产环境需要手动上传 `config.js` 到服务器，或者使用其他方式注入配置。

---

## 🛠️ 故障排查

### 问题：页面显示"配置错误"

**原因：** `config.js` 文件不存在或配置不正确

**解决：**
1. 检查 `public/config.js` 是否存在
2. 确认文件中的 `API_KEY` 和 `PROXY_TOKEN` 不为空
3. 打开浏览器控制台查看错误信息

### 问题：请求返回 403 Forbidden

**原因：** 代理令牌无效

**解决：**
1. 检查 `config.js` 中的 `PROXY_TOKEN` 是否正确
2. 确认 Vercel 环境变量 `PROXY_TOKEN` 已配置
3. 确认两者值一致

### 问题：请求返回 401 Unauthorized

**原因：** Cloudflare API 密钥无效

**解决：**
1. 检查 `config.js` 中的 `API_KEY` 是否正确
2. 在 Cloudflare Dashboard 中验证密钥有效性
3. 如需要，重新生成密钥

---

## 📞 需要帮助？

如果遇到配置问题，请检查：

1. 浏览器控制台（F12）查看错误信息
2. Network 标签查看请求详情
3. 确认所有密钥配置正确

---

**最后更新：** 2025-11-18
