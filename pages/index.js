export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
        🚀 Cloudflare API Proxy
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
        代理服务运行正常
      </p>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>使用说明</h2>
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1rem' }}>
          此服务将所有请求代理转发到 Cloudflare Workers API：
        </p>
        <code style={{
          display: 'block',
          backgroundColor: '#f0f0f0',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '0.9rem',
          wordBreak: 'break-all',
          marginBottom: '1rem'
        }}>
          billing-api.liushuaiiu.workers.dev
        </code>
        <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>
          API 端点
        </h3>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          将原始 API 地址中的域名替换为此 Vercel 服务的域名即可。
          <br />
          例如：<code style={{ backgroundColor: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>/api/your-endpoint</code>
        </p>
        <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '2rem' }}>
          ✅ 支持所有 HTTP 方法（GET, POST, PUT, DELETE 等）
          <br />
          ✅ 自动转发所有请求头和请求体
          <br />
          ✅ 支持跨域访问（CORS）
        </p>
      </div>
    </div>
  );
}
