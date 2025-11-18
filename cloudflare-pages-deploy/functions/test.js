// 测试 Cloudflare Pages Functions 是否正常工作
export async function onRequest(context) {
    return new Response('Cloudflare Pages Functions 工作正常！', {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}
