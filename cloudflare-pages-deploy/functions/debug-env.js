// 调试端点 - 检查环境变量
// URL: /debug-env
// ⚠️ 仅用于调试，生产环境请删除此文件

export async function onRequest(context) {
    // 获取所有环境变量
    const envKeys = Object.keys(context.env || {});

    // 检查特定变量
    const API_BASE = context.env?.API_BASE;
    const API_KEY = context.env?.API_KEY;
    const PROXY_TOKEN = context.env?.PROXY_TOKEN;

    const debug = `环境变量调试信息
==================

可用的环境变量键: ${envKeys.length} 个
${envKeys.join(', ')}

特定变量检查:
- API_BASE: ${API_BASE ? '✅ 已设置 (值: ' + API_BASE + ')' : '❌ 未设置'}
- API_KEY: ${API_KEY ? '✅ 已设置 (长度: ' + API_KEY.length + ' 字符, 前6位: ' + API_KEY.substring(0, 6) + '...)' : '❌ 未设置'}
- PROXY_TOKEN: ${PROXY_TOKEN ? '✅ 已设置 (长度: ' + PROXY_TOKEN.length + ' 字符, 前6位: ' + PROXY_TOKEN.substring(0, 6) + '...)' : '❌ 未设置'}

context.env 类型: ${typeof context.env}
context.env 存在: ${context.env ? '是' : '否'}

完整的 context.env 对象键:
${JSON.stringify(envKeys, null, 2)}
`;

    return new Response(debug, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}
