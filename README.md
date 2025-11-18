# Cloudflare Workers API Proxy

这是一个部署在 Vercel 上的代理服务，用于转发请求到 Cloudflare Workers API，解决国内网络访问问题。

## 功能特性

- ✅ 支持所有 HTTP 方法（GET, POST, PUT, DELETE, PATCH, OPTIONS）
- ✅ 自动转发所有请求头（包括 Authorization 等认证信息）
- ✅ 自动转发请求体（支持 JSON、表单等格式）
- ✅ 支持跨域访问（CORS）
- ✅ 保持原始 API 的响应状态码和响应头
- ✅ 支持大文件上传（最大 10MB）

## 目标 API

代理目标：`https://billing-api.liushuaiiu.workers.dev`

## 使用方法

### 原始 API 调用
```bash
curl https://billing-api.liushuaiiu.workers.dev/your-endpoint \
  -H "Authorization: Bearer your-token"
```

### 通过代理调用
```bash
curl https://your-project.vercel.app/api/your-endpoint \
  -H "Authorization: Bearer your-token"
```

只需将域名从 `billing-api.liushuaiiu.workers.dev` 替换为您的 Vercel 部署域名，路径前加上 `/api/` 前缀。

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

1. 所有请求头（包括 Authorization）都会被自动转发
2. 支持 JSON 和文本格式的响应
3. 已启用 CORS，可从任何域名访问
4. 请求体大小限制为 10MB

## License

MIT
