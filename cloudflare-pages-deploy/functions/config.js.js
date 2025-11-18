// Cloudflare Pages Function
// 动态生成配置文件，从环境变量读取敏感信息

export async function onRequest(context) {
    const {
        API_BASE,
        API_KEY,
        PROXY_TOKEN,
    } = context.env;

    // 验证环境变量是否配置
    if (!API_KEY || !PROXY_TOKEN) {
        return new Response(
            'console.error("⚠️ 环境变量未配置！请在 Cloudflare Pages 设置中配置 API_KEY 和 PROXY_TOKEN");',
            {
                status: 200,  // 改为 200 以便浏览器执行
                headers: {
                    'Content-Type': 'text/javascript; charset=utf-8',
                },
            }
        );
    }

    // 动态生成配置
    const config = `
// 动态生成的配置文件
// 从 Cloudflare Pages 环境变量加载

window.APP_CONFIG = {
    // Vercel 代理服务域名
    API_BASE: '${API_BASE || 'https://your-vercel-domain.com'}',

    // Cloudflare Workers API 密钥（从环境变量加载）
    API_KEY: '${API_KEY}',

    // Vercel 代理访问令牌（从环境变量加载）
    PROXY_TOKEN: '${PROXY_TOKEN}',

    // 其他配置
    CACHE_DURATION: 5 * 60 * 1000,
    MESSAGE_DURATION: 3000,
    DEBOUNCE_DELAY: 300
};

console.log('✅ 配置加载成功');
console.log('🔗 API 代理地址:', window.APP_CONFIG.API_BASE);
`;

    return new Response(config, {
        headers: {
            'Content-Type': 'text/javascript; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    });
}
