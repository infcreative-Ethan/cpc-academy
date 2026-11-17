# CPC Academy 云端发音反馈与安全更新配置

## 云端同步
- 旧版反馈仍保存在 localStorage 原有键名中，不会被迁移清空。
- 配置后，未同步的反馈会在联网时发送，收到服务器成功响应才标记已同步。
- 仅上传单词、错误类型、记录时间和随机反馈 ID；不上传学习进度或 PDF。
- 服务端使用 Cloudflare Worker 创建 GitHub Issues，标题以「[发音反馈]」开头。
- ChatGPT 可在用户要求查看时，通过已连接的 GitHub 读取这些 Issues；不会自动持续监听。

### 一次性部署步骤
1. 登录 Cloudflare 并运行 npx wrangler login。
2. 创建一个只对 infcreative-Ethan/cpc-academy 仓库有 Issues: Read and write 权限的 GitHub fine-grained token。
3. 在项目根目录运行 npx wrangler secret put GITHUB_TOKEN，把该 token 存入 Worker 的私有环境变量。不能将 token 写入 APP 或公开仓库。
4. 运行 npx wrangler deploy，并访问生成的 https://...workers.dev/health 确认返回 ok。
5. 到 GitHub 仓库 Settings > Secrets and variables > Actions > Variables，创建 CPC_REPORT_ENDPOINT，值为 https://...workers.dev/report。
6. 重新构建 APK，云端地址会嵌入静态 App；旧 APK 不会自行获得新地址。
7. 建议对 Worker 的 /report 路径添加 Cloudflare 限流规则。可选创建 KV 命名空间 REPORT_IDS 以减少重复反馈。

**没有配置并部署服务之前，App 只保存本地反馈，不能宣称云端上传成功。**

## Android 固定签名
之前使用临时 debug 签名，不同构建的签名可能不同，导致不能覆盖安装。

1. 在可信电脑上生成并妥善备份同一份 keystore。示例命令：
   keytool -genkeypair -v -keystore cpc-academy-release.jks -storetype PKCS12 -alias cpcacademy -keyalg RSA -keysize 3072 -validity 10000
2. GitHub 仓库 Settings > Secrets and variables > Actions > Secrets 中添加以下 4 项：
   - CPC_ANDROID_KEYSTORE_B64：将 keystore 整个文件 base64 编码为单行后的内容
   - CPC_ANDROID_STORE_PASSWORD：keystore 密码
   - CPC_ANDROID_KEY_ALIAS：例如 cpcacademy
   - CPC_ANDROID_KEY_PASSWORD：密钥密码
3. 合并到 main 并完成验证后，Actions 会构建正式签名的 APK，使用固定包名 com.cpcacademy.app。
4. 正式签名 APK 会作为 GitHub Latest Release 的 CPC-Academy.apk 发布，App 可以读取该地址。
5. 此后不得更换签名密钥，versionCode 必须递增。发布前要在真实手机上连续测试两个签名版本的覆盖安装。

**首次迁移限制：** 旧 debug 签名与新 release 签名不同的情况下，Android 必然拒绝覆盖。必须先通过现有的进度备份功能导出并验证数据，然后才可卸载旧版、安装新版并恢复学习记录。PDF 原文件不包含在 JSON 备份中，卸载后可能需要重新导入。之后使用同一签名即可持续覆盖升级。

## App 内更新
- 检查更新会读取 GitHub 最新的正式签名版本，而不是最近一次 Actions 日志。
- 下载并安装会调用 Android DownloadManager，下载完成后由系统显示安装确认界面。
- 若设备未允许此来源安装应用，必须由用户在 Android 设置中授权后重试。
- APK 支持 SHA-256 校验（当 GitHub API 提供摘要），Android 最终仍会检查包签名。
- 不可能绕过系统许可静默安装，也不可能用新签名直接覆盖旧签名 APK。
