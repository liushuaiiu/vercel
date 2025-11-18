// Cloudflare Pages Function - 配置文件
// URL: /api/config
// ⚠️ 注意：配置直接写在代码中，如需更换密钥请修改此文件

export async function onRequest(context) {
    // 直接配置（不再依赖环境变量）
    const API_BASE = 'https://vercel.wuwamao.com';
    const API_KEY = 'aae90c7477688efd9f98a2eb16aa5a2f75165dd6c45205d5de289864fb90cfea';
    const PROXY_TOKEN = 'a2d4a299e1ae11ab089b5cb3560de483fb346355a214b9742ba06c0897dc9695';

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
