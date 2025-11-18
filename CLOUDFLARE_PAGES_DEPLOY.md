# Cloudflare Pages 部署指南

## 📋 架构说明

您的完整架构：

```
用户浏览器
    ↓
Cloudflare Pages                    前端 HTML/CSS/JS
    ↓ (fetch 请求)
Vercel 代理服务                     中转代理（解决国内访问）
    ↓ (API 转发)
Cloudflare Workers API              后端 API + D1 数据库
```

---

## 🚀 部署步骤

### 步骤 1: 准备文件

从当前 Vercel 项目复制以下文件到 Cloudflare Pages 项目：

```bash
需要部署到 Cloudflare Pages 的文件：
├── index.html          # 从 public/index.html 复制
├── config.js           # 从 public/config.js 复制（包含密钥）
└── config.example.js   # 从 public/config.example.js 复制（可选）
```

**重要配置：** 修改 `config.js` 中的 `API_BASE`：

```javascript
// config.js
window.APP_CONFIG = {
    // ⚠️ 修改这里：指向您的 Vercel 代理域名
    API_BASE: 'https://your-vercel-domain.com',  // ← 您的 Vercel 自定义域名

    // Cloudflare Workers API 密钥
    API_KEY: 'aae90c7477688efd9f98a2eb16aa5a2f75165dd6c45205d5de289864fb90cfea',

    // Vercel 代理访问令牌
    PROXY_TOKEN: 'a2d4a299e1ae11ab089b5cb3560de483fb346355a214b9742ba06c0897dc9695',

    CACHE_DURATION: 5 * 60 * 1000,
    MESSAGE_DURATION: 3000,
    DEBOUNCE_DELAY: 300
};
```

---

### 步骤 2: 创建 Cloudflare Pages 项目

#### 方法 A：通过 GitHub（推荐）

1. **创建新的 GitHub 仓库**（例如：`billing-frontend`）

2. **初始化项目：**
   ```bash
   # 创建新目录
   mkdir billing-frontend
   cd billing-frontend

   # 初始化 Git
   git init

   # 复制文件
   cp /home/user/vercel/public/index.html .
   cp /home/user/vercel/public/config.example.js .

   # 创建 config.js（修改 API_BASE）
   cp config.example.js config.js
   # 编辑 config.js，修改 API_BASE 为您的 Vercel 域名

   # 提交代码
   git add .
   git commit -m "Initial commit: Billing management frontend"
   git push origin main
   ```

3. **部署到 Cloudflare Pages：**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Workers & Pages → Create application → Pages
   - 连接 Git 仓库：选择 `billing-frontend`
   - Build settings:
     - Framework preset: **None**
     - Build command: 留空
     - Build output directory: `/`
   - 点击 **Deploy**

#### 方法 B：直接上传

1. **访问 Cloudflare Dashboard**
2. Workers & Pages → Create application → Pages → Upload assets
3. **拖拽文件：**
   - `index.html`
   - `config.js`
   - `config.example.js` (可选)
4. 点击 **Deploy**

---

### 步骤 3: 配置自定义域名（可选）

在 Cloudflare Pages 项目中：

1. Custom domains → Set up a custom domain
2. 输入您的域名（例如：`billing.yourdomain.com`）
3. Cloudflare 会自动配置 DNS

---

### 步骤 4: 测试完整流程

部署完成后，测试：

```bash
# 访问 Cloudflare Pages
https://your-pages-project.pages.dev

# 或自定义域名
https://billing.yourdomain.com
```

**预期结果：**
- ✅ 页面正常加载
- ✅ 可以看到账单数据
- ✅ 所有 API 请求通过 Vercel 代理转发

---

## 🔐 安全配置

### 选项 A：config.js 直接部署（简单但不推荐）

直接将 `config.js` 提交到 Git 并部署。

**风险：** 密钥暴露在 Git 历史中

### 选项 B：使用环境变量（推荐）

**Cloudflare Pages 不支持在 HTML 中直接使用环境变量**，但可以通过以下方式：

1. **部署时不包含 config.js**
2. **使用 Cloudflare Pages Functions 注入配置**

创建 `functions/_middleware.js`:

```javascript
export async function onRequest(context) {
    const response = await context.next();

    // 仅在请求 config.js 时动态生成
    if (context.request.url.endsWith('/config.js')) {
        const config = `
window.APP_CONFIG = {
    API_BASE: '${context.env.API_BASE}',
    API_KEY: '${context.env.API_KEY}',
    PROXY_TOKEN: '${context.env.PROXY_TOKEN}',
    CACHE_DURATION: 300000,
    MESSAGE_DURATION: 3000,
    DEBOUNCE_DELAY: 300
};
        `;

        return new Response(config, {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache'
            }
        });
    }

    return response;
}
```

然后在 Cloudflare Pages 设置环境变量：
- `API_BASE`: 您的 Vercel 域名
- `API_KEY`: Cloudflare Workers API 密钥
- `PROXY_TOKEN`: Vercel 代理令牌

### 选项 C：第三方密钥管理（最安全）

使用 Cloudflare Workers KV 或 Durable Objects 存储密钥。

---

## 📁 推荐的项目结构

```
billing-frontend/ (Cloudflare Pages 仓库)
├── index.html
├── config.js              # ⚠️ 添加到 .gitignore
├── config.example.js      # 提交到 Git
├── .gitignore
├── functions/             # Cloudflare Pages Functions
│   └── _middleware.js    # 动态生成 config.js
└── README.md
```

`.gitignore`:
```
config.js
.env
```

---

## 🔄 工作流程

### 开发流程

1. **本地开发：**
   ```bash
   # 创建 config.js（不提交）
   cp config.example.js config.js
   # 编辑 config.js 填入密钥

   # 本地预览
   npx wrangler pages dev .
   ```

2. **提交代码：**
   ```bash
   git add index.html config.example.js
   git commit -m "Update frontend"
   git push
   ```

3. **Cloudflare Pages 自动部署**

### 更新密钥

如果需要更新密钥：

- **使用 config.js 方式：** 重新上传文件到 Cloudflare Pages
- **使用环境变量方式：** 在 Cloudflare Dashboard 更新环境变量

---

## 🧪 完整测试

### 1. 测试前端访问

```bash
curl https://your-pages-project.pages.dev
```

### 2. 测试 API 代理（通过浏览器控制台）

打开浏览器控制台：

```javascript
// 应该能看到配置
console.log(window.APP_CONFIG);

// 测试 API 请求
fetch('https://your-vercel-domain.com/api/transactions', {
    headers: {
        'Authorization': 'Bearer aae90c74...',
        'X-Proxy-Token': 'a2d4a299...'
    }
}).then(r => r.json()).then(console.log);
```

---

## 🎯 快速部署命令

```bash
# 快速部署脚本
cd /home/user/vercel

# 复制文件到临时目录
mkdir -p /tmp/billing-frontend
cp public/index.html /tmp/billing-frontend/
cp public/config.js /tmp/billing-frontend/

# 修改 config.js 中的 API_BASE
sed -i 's|window.location.origin|https://your-vercel-domain.com|g' /tmp/billing-frontend/config.js

# 提示
echo "✅ 文件已准备好，位于 /tmp/billing-frontend/"
echo "📤 请将这些文件上传到 Cloudflare Pages"
```

---

## 📞 常见问题

### Q: config.js 要不要提交到 Git？

**A:** 不推荐。建议使用 Cloudflare Pages Functions 动态生成，或者手动上传。

### Q: 本地开发怎么办？

**A:** 本地创建 `config.js`（添加到 .gitignore），开发完成后只提交其他文件。

### Q: 更新代码后如何重新部署？

**A:** 推送到 Git，Cloudflare Pages 会自动重新部署。

---

## ✅ 检查清单

部署前确认：

- [ ] `config.js` 中的 `API_BASE` 已修改为 Vercel 域名
- [ ] `API_KEY` 和 `PROXY_TOKEN` 已正确填写
- [ ] 文件已上传到 Cloudflare Pages
- [ ] 部署成功（绿色勾号）
- [ ] 可以访问页面
- [ ] API 请求正常工作

---

**最后更新：** 2025-11-18
