// Cloudflare Pages Function - 备用路由
// URL: /api/config
// 如果 /config.js 无法工作，使用此路由

export async function onRequest(context) {
    const API_BASE = context.env?.API_BASE || 'https://vercel.wuwamao.com';
    const API_KEY = context.env?.API_KEY || '';
    const PROXY_TOKEN = context.env?.PROXY_TOKEN || '';

    const config = `// 从 /api/config 加载的配置

window.APP_CONFIG = {
    API_BASE: '${API_BASE}',
    API_KEY: '${API_KEY || '未配置'}',
    PROXY_TOKEN: '${PROXY_TOKEN || '未配置'}',
    CACHE_DURATION: 5 * 60 * 1000,
    MESSAGE_DURATION: 3000,
    DEBOUNCE_DELAY: 300
};

console.log('✅ 配置加载成功（从 /api/config）');
console.log('🔗 API 代理地址:', window.APP_CONFIG.API_BASE);
console.log('环境变量状态:', {
    API_BASE: '${API_BASE}',
    API_KEY: ${API_KEY ? "'✅ 已配置'" : "'❌ 未配置'"},
    PROXY_TOKEN: ${PROXY_TOKEN ? "'✅ 已配置'" : "'❌ 未配置'"}
});
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
