// Cloudflare Pages Function - 配置文件
// URL: /api/config
// ⚠️ 注意：配置直接写在代码中，如需更换密钥请修改此文件

export async function onRequest(context) {
    // 从环境变量读取
    const API_BASE = context.env?.API_BASE || 'https://vercel.wuwamao.com';
    const API_KEY = context.env?.API_KEY || '';
    const PROXY_TOKEN = context.env?.PROXY_TOKEN || '';

    // 如果环境变量未配置，返回错误提示
    if (!API_KEY || !PROXY_TOKEN) {
        const errorConfig = `
console.error("⚠️ 环境变量未配置！");
console.error("请在 Cloudflare Pages 设置中配置 API_KEY 和 PROXY_TOKEN");

window.APP_CONFIG = {
    API_BASE: '${API_BASE}',
    API_KEY: '',
    PROXY_TOKEN: '',
    CACHE_DURATION: 5 * 60 * 1000,
    MESSAGE_DURATION: 3000,
    DEBOUNCE_DELAY: 300
};
`;
        return new Response(errorConfig, {
            status: 200,
            headers: {
                'Content-Type': 'application/javascript; charset=utf-8',
                'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            },
        });
    }

    const config = `// 配置文件（已加载）

window.APP_CONFIG = {
    API_BASE: '${API_BASE}',
    API_KEY: '${API_KEY}',
    PROXY_TOKEN: '${PROXY_TOKEN}',
    CACHE_DURATION: 5 * 60 * 1000,
    MESSAGE_DURATION: 3000,
    DEBOUNCE_DELAY: 300
};

console.log('✅ 配置加载成功');
console.log('🔗 API 代理地址:', window.APP_CONFIG.API_BASE);
`;

    return new Response(config, {
        status: 200,
        headers: {
            'Content-Type': 'application/javascript; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'Access-Control-Allow-Origin': '*',
        },
    });
}
