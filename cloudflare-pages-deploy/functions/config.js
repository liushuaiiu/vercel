// Cloudflare Pages Function
// 动态生成配置文件，从环境变量读取敏感信息

export async function onRequest(context) {
    // 获取环境变量，提供默认值以便调试
    const API_BASE = context.env?.API_BASE || 'https://vercel.wuwamao.com';
    const API_KEY = context.env?.API_KEY || '';
    const PROXY_TOKEN = context.env?.PROXY_TOKEN || '';

    // 如果环境变量未配置，返回错误提示（但仍然是有效的 JS）
    if (!API_KEY || !PROXY_TOKEN) {
        const errorConfig = `
console.error("⚠️ 环境变量未配置！");
console.error("请在 Cloudflare Pages 设置中配置：");
console.error("1. API_BASE = https://vercel.wuwamao.com");
console.error("2. API_KEY = your-api-key");
console.error("3. PROXY_TOKEN = your-proxy-token");
console.error("当前环境变量状态：", {
    API_BASE: '${API_BASE}',
    API_KEY: ${API_KEY ? "'已配置'" : "'未配置'"},
    PROXY_TOKEN: ${PROXY_TOKEN ? "'已配置'" : "'未配置'"}
});

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

    // 动态生成配置
    const config = `// 动态生成的配置文件
// 从 Cloudflare Pages 环境变量加载

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
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    });
}
