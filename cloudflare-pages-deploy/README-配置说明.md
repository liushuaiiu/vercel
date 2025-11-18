# 配置说明

## 直接上传部署到 Cloudflare Pages

### 步骤 1：配置 API 密钥

1. 找到 `config.example.js` 文件
2. 复制并重命名为 `config.js`
3. 打开 `config.js`，填写你的密钥：
   ```javascript
   API_KEY: '你的API密钥',
   PROXY_TOKEN: '你的代理令牌',
   ```

### 步骤 2：上传到 Cloudflare Pages

1. 登录 Cloudflare Pages 控制台
2. 创建新项目或选择现有项目
3. 选择"上传资产"（Direct Upload）
4. 将整个 `cloudflare-pages-deploy` 文件夹拖拽上传
5. 部署完成

### 步骤 3：验证

访问你的 Cloudflare Pages 域名，检查：
- 浏览器控制台应显示：`✅ 配置加载成功`
- 如果显示配置错误，说明 `config.js` 未正确配置

## 注意事项

⚠️ **安全警告**：
- `config.js` 文件会暴露在前端，任何人都可以看到你的 API_KEY 和 PROXY_TOKEN
- 建议仅在测试环境使用此方法
- 生产环境建议使用 Git 部署 + Cloudflare Pages Functions（环境变量）

## Git 部署方式（更安全）

如果你想使用环境变量保护密钥：

1. 将代码推送到 Git 仓库（GitHub/GitLab）
2. 在 Cloudflare Pages 连接 Git 仓库
3. 在 Cloudflare Pages 设置中配置环境变量：
   - `API_KEY`
   - `PROXY_TOKEN`
   - `API_BASE`（可选）
4. 系统会自动从 `functions/api/config.js` 读取环境变量

这种方式下，密钥不会暴露在前端代码中。
