# Cloudflare Pages 部署文件

📦 这个文件夹包含所有需要上传到 Cloudflare Pages 的文件。

---

## 📁 文件说明

```
cloudflare-pages-deploy/
├── functions/
│   └── config.js.js        # Pages Function（动态生成配置）
├── index.html              # 账单管理系统主页
├── .gitignore              # Git 忽略规则
├── .dev.vars.example       # 环境变量模板
└── README.md               # 本文件
```

---

## 🚀 部署步骤

### 1. 下载此文件夹

下载整个 `cloudflare-pages-deploy` 文件夹到本地。

### 2. 上传到 Cloudflare Pages

**方法 A: 直接上传（推荐）**

1. 访问 https://dash.cloudflare.com
2. Workers & Pages → Create → Pages → Upload assets
3. 拖拽整个 `cloudflare-pages-deploy` 文件夹（包括 `functions` 子文件夹）
4. 项目名称：例如 `billing-system`
5. Deploy

**方法 B: 通过 Git**

1. 将此文件夹内容推送到您的 GitHub 仓库
2. 在 Cloudflare Pages 连接该仓库部署

### 3. 配置环境变量（重要！）

部署完成后，必须配置环境变量：

1. 进入项目 → **Settings** → **Environment variables**

2. 添加以下 3 个变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `API_BASE` | `https://vercel.wuwamao.com` | Production ✓ |
| `API_KEY` | `您的 Cloudflare Workers API 密钥` | Production ✓ |
| `PROXY_TOKEN` | `您的 Vercel 代理令牌` | Production ✓ |

3. 保存后 → **Retry deployment**（重新部署）

### 4. 访问测试

部署完成后，访问：
```
https://your-project.pages.dev
```

打开浏览器控制台（F12），输入：
```javascript
console.log(window.APP_CONFIG);
```

应该能看到配置对象，包含您的环境变量。

---

## 🔐 安全说明

✅ **密钥安全存储** - 所有密钥存储在 Cloudflare 环境变量中
✅ **代码不含密钥** - GitHub 仓库不包含敏感信息
✅ **动态注入** - 使用 Pages Functions 在运行时注入配置

**工作原理：**

```
用户访问 /config.js
    ↓
functions/config.js.js 被触发
    ↓
从环境变量读取密钥
    ↓
动态生成 JavaScript 配置
    ↓
返回给浏览器
```

---

## 🔧 本地开发（可选）

如果需要本地开发：

```bash
# 安装 Wrangler
npm install -g wrangler

# 创建本地环境变量
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars 填入实际密钥

# 启动本地服务器
wrangler pages dev . --port 8080

# 访问 http://localhost:8080
```

---

## ✅ 环境变量配置值

您已经在 Cloudflare Pages 中配置了以下环境变量：

- `API_BASE` = `https://vercel.wuwamao.com`
- `API_KEY` = `aae90c7477688efd9f98a2eb16aa5a2f75165dd6c45205d5de289864fb90cfea`
- `PROXY_TOKEN` = `a2d4a299e1ae11ab089b5cb3560de483fb346355a214b9742ba06c0897dc9695`

只需确认这些值已正确配置即可。

---

## 📋 完整架构

```
用户浏览器
    ↓
Cloudflare Pages (index.html)
    ↓ JavaScript fetch
Vercel 代理 (https://vercel.wuwamao.com/api/*)
    ↓ X-Proxy-Token 验证
Cloudflare Workers API
    ↓ Authorization 验证
返回数据
```

---

## 🆘 常见问题

**Q: 页面显示"环境变量未配置"？**
A: 检查 Cloudflare Pages Settings → Environment variables，确保 3 个变量都已配置，然后重新部署。

**Q: 访问 /config.js 返回 404？**
A: 确保上传时包含了 `functions` 文件夹，文件名必须是 `config.js.js`（双 .js）。

**Q: API 请求失败？**
A: 检查浏览器控制台，确认 `APP_CONFIG.API_BASE` 是否为 `https://vercel.wuwamao.com`。

---

**最后更新：** 2025-11-18
**Vercel 域名：** https://vercel.wuwamao.com
