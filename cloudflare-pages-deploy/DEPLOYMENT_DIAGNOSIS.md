# Cloudflare Pages 部署诊断

## 🔍 问题诊断

### 步骤 1：测试 Functions 是否启用

1. 重新上传 `cloudflare-pages-deploy` 文件夹到 Cloudflare Pages
2. 访问：`https://billing-manager.pages.dev/test`

**预期结果**：
- ✅ 如果显示 "Cloudflare Pages Functions 工作正常！" → Functions 已启用，继续步骤 2
- ❌ 如果显示 404 或其他错误 → Functions 未启用，需要使用 Git 部署（见解决方案 A）

### 步骤 2：测试 config.js 是否响应

访问：`https://billing-manager.pages.dev/config.js`

**预期结果**：
- ✅ 如果显示 JavaScript 代码（包含 `window.APP_CONFIG`）→ 成功
- ❌ 如果显示 404 或错误 → 继续排查

---

## 🛠️ 解决方案 A：通过 Git 部署（推荐）

### 为什么需要 Git 部署？

**Cloudflare Pages 的直接上传（拖拽文件）不支持 Functions 功能！**

Functions 需要通过以下方式部署：
1. **Git 连接**（GitHub/GitLab）
2. **Wrangler CLI**

### 使用 Git 部署的步骤

#### 1. 在 Cloudflare Pages 中连接 GitHub

1. 登录 **Cloudflare Dashboard**
2. **Pages** → **Create a project**
3. 选择 **Connect to Git**
4. 授权 Cloudflare 访问您的 GitHub 账户
5. 选择仓库：`liushuaiiu/vercel`
6. **配置构建设置**：

```
Framework preset: None
Build command: (留空)
Build output directory: cloudflare-pages-deploy
Root directory: /
```

7. **Environment variables** → 添加：
   - `API_BASE` = `https://vercel.wuwamao.com`
   - `API_KEY` = `aae90c7477688efd9f98a2eb16aa5a2f75165dd6c45205d5de289864fb90cfea`
   - `PROXY_TOKEN` = `a2d4a299e1ae11ab089b5cb3560de483fb346355a214b9742ba06c0897dc9695`

8. **Save and Deploy**

#### 2. 等待部署完成

Cloudflare 会自动从 GitHub 拉取代码并部署，**包括 Functions**。

#### 3. 后续更新

以后只需推送到 GitHub，Cloudflare Pages 会自动重新部署。

---

## 🛠️ 解决方案 B：使用 Wrangler CLI（高级）

如果您更喜欢命令行部署：

### 1. 安装 Wrangler

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 部署

```bash
cd cloudflare-pages-deploy
wrangler pages deploy . --project-name=billing-manager
```

### 4. 设置环境变量

在 Cloudflare Dashboard 中配置环境变量。

---

## 🛠️ 解决方案 C：临时静态配置（不推荐，会暴露密钥）

如果您急需测试，可以暂时创建静态 config.js：

创建 `cloudflare-pages-deploy/config.js`：

```javascript
window.APP_CONFIG = {
    API_BASE: 'https://vercel.wuwamao.com',
    API_KEY: 'aae90c7477688efd9f98a2eb16aa5a2f75165dd6c45205d5de289864fb90cfea',
    PROXY_TOKEN: 'a2d4a299e1ae11ab089b5cb3560de483fb346355a214b9742ba06c0897dc9695',
    CACHE_DURATION: 5 * 60 * 1000,
    MESSAGE_DURATION: 3000,
    DEBOUNCE_DELAY: 300
};

console.log('✅ 配置加载成功');
console.log('🔗 API 代理地址:', window.APP_CONFIG.API_BASE);
```

**⚠️ 安全警告**：这会将密钥暴露在前端代码中，任何人都能在浏览器中看到。仅用于测试！

---

## 📊 总结

| 部署方式 | 支持 Functions | 安全性 | 推荐度 |
|---------|---------------|--------|--------|
| **拖拽上传** | ❌ 否 | N/A | ❌ 不适用 |
| **Git 连接** | ✅ 是 | ✅ 高 | ⭐⭐⭐⭐⭐ 强烈推荐 |
| **Wrangler CLI** | ✅ 是 | ✅ 高 | ⭐⭐⭐⭐ 推荐 |
| **静态 config.js** | N/A | ❌ 低（暴露密钥） | ⚠️ 仅测试用 |

---

## 🎯 推荐行动

1. **先测试**：访问 `/test` 确认是否需要 Git 部署
2. **使用 Git 部署**：连接 GitHub 仓库到 Cloudflare Pages
3. **配置环境变量**：在 Cloudflare Dashboard 中设置
4. **自动部署**：推送代码即可自动更新

---

## ❓ 需要帮助？

如果在配置 Git 连接时遇到问题，请告诉我您看到的错误信息。
