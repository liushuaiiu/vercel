# Cloudflare Workers API Proxy

这是一个部署在 Vercel 上的代理服务，用于转发请求到 Cloudflare Workers API，解决国内网络访问问题。

## 功能特性

- ✅ 支持所有 HTTP 方法（GET, POST, PUT, DELETE, PATCH, OPTIONS）
- ✅ 自动转发所有请求头（包括 Authorization 等认证信息）
- ✅ 自动转发请求体（支持 JSON、表单等格式）
- ✅ 支持跨域访问（CORS）
- ✅ 保持原始 API 的响应状态码和响应头
- ✅ 支持大文件上传（最大 10MB）
- 🔒 **访问令牌验证（推荐启用）**

## 目标 API

代理目标：`https://billing-api.liushuaiiu.workers.dev`

## 使用方法

### 原始 API 调用
```bash
curl https://billing-api.liushuaiiu.workers.dev/your-endpoint \
  -H "Authorization: Bearer your-token"
```

### 通过代理调用（未启用安全令牌）
```bash
curl https://your-project.vercel.app/api/your-endpoint \
  -H "Authorization: Bearer your-token"
```

### 通过代理调用（启用安全令牌，推荐）
```bash
curl https://your-project.vercel.app/api/your-endpoint \
  -H "Authorization: Bearer your-token" \
  -H "X-Proxy-Token: your-proxy-secret-token"
```

只需将域名从 `billing-api.liushuaiiu.workers.dev` 替换为您的 Vercel 部署域名，路径前加上 `/api/` 前缀。

## 🔒 安全配置（强烈推荐）

为了防止未授权访问，建议启用代理访问令牌验证。

### 配置步骤

#### 1. 生成安全令牌

在终端运行以下命令生成强随机令牌：

```bash
# 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或使用 OpenSSL
openssl rand -hex 32
```

示例输出：
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

#### 2. 在 Vercel 中配置环境变量

**方法一：通过 Vercel Dashboard（推荐）**

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加新变量：
   - **Name**: `PROXY_TOKEN`
   - **Value**: `您生成的令牌`
   - **Environment**: 选择 `Production`, `Preview`, `Development`（全选）
5. 点击 **Save**
6. **重要**：重新部署项目使环境变量生效

**方法二：通过 Vercel CLI**

```bash
vercel env add PROXY_TOKEN
# 输入您的令牌
# 选择环境：Production, Preview, Development
```

#### 3. 本地开发配置

创建 `.env.local` 文件（不要提交到 Git）：

```bash
PROXY_TOKEN=your-secret-proxy-token-here
```

### 安全机制说明

启用 `PROXY_TOKEN` 后：

1. **双重验证**：客户端需要提供两个令牌
   - `X-Proxy-Token`：Vercel 代理层验证（防止代理滥用）
   - `Authorization`：Cloudflare Workers API 验证（业务逻辑验证）

2. **访问控制**：只有知道代理令牌的客户端才能使用代理服务

3. **令牌不转发**：`X-Proxy-Token` 仅在代理层验证，不会转发到 Cloudflare API

4. **错误响应**：
   - 缺少令牌：`401 Unauthorized`
   - 令牌错误：`403 Forbidden`

### 使用示例

```javascript
// JavaScript Fetch 示例
fetch('https://your-project.vercel.app/api/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your-cloudflare-api-key',
    'X-Proxy-Token': 'your-proxy-secret-token'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

```python
# Python requests 示例
import requests

response = requests.get(
    'https://your-project.vercel.app/api/users',
    headers={
        'Authorization': 'Bearer your-cloudflare-api-key',
        'X-Proxy-Token': 'your-proxy-secret-token'
    }
)
print(response.json())
```

## 部署到 Vercel

### 方法一：通过 Vercel CLI

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 登录并部署：
```bash
vercel login
vercel --prod
```

### 方法二：通过 GitHub 自动部署

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel Dashboard](https://vercel.com/dashboard) 中导入项目
3. Vercel 会自动检测 Next.js 项目并完成部署

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看服务状态。

## 项目结构

```
.
├── pages/
│   ├── api/
│   │   └── [...path].js    # 通配符 API 路由（代理核心）
│   └── index.js            # 首页
├── next.config.js          # Next.js 配置
├── vercel.json             # Vercel 部署配置
└── package.json            # 项目依赖
```

## 技术栈

- **Next.js 14** - React 全栈框架
- **Vercel Serverless Functions** - 无服务器函数
- **Node.js Fetch API** - HTTP 请求

## 注意事项

1. **强烈建议启用 `PROXY_TOKEN` 环境变量**，防止代理服务被滥用
2. 所有请求头（除 `X-Proxy-Token`）都会被自动转发到 Cloudflare API
3. `X-Proxy-Token` 仅用于代理层验证，不会泄露给上游 API
4. 支持 JSON 和文本格式的响应
5. 已启用 CORS，可从任何域名访问
6. 请求体大小限制为 10MB
7. 不配置 `PROXY_TOKEN` 时，代理服务可被公开访问（不推荐）

## License

MIT
