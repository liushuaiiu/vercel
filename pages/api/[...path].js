// Cloudflare Workers API 代理
// 支持所有 HTTP 方法，转发所有请求头和请求体

const CLOUDFLARE_API = 'https://billing-api.liushuaiiu.workers.dev';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  try {
    // 获取请求路径
    const { path } = req.query;
    const requestPath = Array.isArray(path) ? path.join('/') : path || '';

    // 构建完整的目标 URL
    const targetUrl = `${CLOUDFLARE_API}/${requestPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

    // 准备转发的请求头（排除一些不应转发的头）
    const forwardHeaders = {};
    const excludeHeaders = ['host', 'connection', 'content-length'];

    Object.keys(req.headers).forEach(key => {
      if (!excludeHeaders.includes(key.toLowerCase())) {
        forwardHeaders[key] = req.headers[key];
      }
    });

    // 准备请求选项
    const fetchOptions = {
      method: req.method,
      headers: forwardHeaders,
    };

    // 如果有请求体，添加到选项中（GET 和 HEAD 请求通常没有 body）
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body) {
        if (typeof req.body === 'string') {
          fetchOptions.body = req.body;
        } else {
          fetchOptions.body = JSON.stringify(req.body);
        }
      }
    }

    // 发送请求到 Cloudflare Workers API
    const response = await fetch(targetUrl, fetchOptions);

    // 获取响应内容
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // 转发响应头
    response.headers.forEach((value, key) => {
      // 排除一些不应转发的响应头
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    // 添加 CORS 头（允许跨域访问）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // 返回响应
    return res.status(response.status).send(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy request failed',
      message: error.message,
    });
  }
}
