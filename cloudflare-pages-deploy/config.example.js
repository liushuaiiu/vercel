// 静态配置文件（浏览器端）
// ⚠️ 警告：此文件包含敏感信息，会暴露在前端
// 生产环境建议使用 Cloudflare Pages Functions（通过 Git 部署）

// 使用说明：
// 1. 将此文件复制并重命名为 config.js
// 2. 填写你的 API_KEY 和 PROXY_TOKEN
// 3. 上传整个文件夹到 Cloudflare Pages

window.APP_CONFIG = {
    // Vercel 代理服务域名（通常不需要修改）
    API_BASE: 'https://vercel.wuwamao.com',

    // Cloudflare Workers API 密钥（必填）
    // 从你的后端 API 或 Cloudflare Workers 管理面板获取
    API_KEY: '在此填写你的 API_KEY',

    // Vercel 代理访问令牌（必填）
    // 从你的 Vercel 或代理服务获取
    PROXY_TOKEN: '在此填写你的 PROXY_TOKEN',

    // 其他配置（通常不需要修改）
    CACHE_DURATION: 5 * 60 * 1000,      // 缓存时长 5 分钟
    MESSAGE_DURATION: 3000,              // 消息显示时长 3 秒
    DEBOUNCE_DELAY: 300                  // 防抖延迟 300ms
};

console.log('✅ 配置加载成功');
console.log('🔗 API 代理地址:', window.APP_CONFIG.API_BASE);
