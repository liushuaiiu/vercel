// 配置文件示例
// 复制此文件为 config.js 并填入您的实际配置

window.APP_CONFIG = {
    // Vercel 代理服务域名（使用您的自定义域名）
    API_BASE: 'https://your-domain.com',

    // Cloudflare Workers API 密钥
    API_KEY: 'your-cloudflare-api-key-here',

    // Vercel 代理访问令牌
    PROXY_TOKEN: 'your-proxy-token-here',

    // 缓存时长（毫秒）
    CACHE_DURATION: 5 * 60 * 1000, // 5分钟

    // 消息显示时长（毫秒）
    MESSAGE_DURATION: 3000,

    // 防抖延迟（毫秒）
    DEBOUNCE_DELAY: 300
};
