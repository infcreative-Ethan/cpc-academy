# 安卓手机：通过 GitHub Codespaces 一次性配置 CPC Academy 永久签名

现有 CPC Academy 的 Cloudflare 云端服务与两个反馈类别已验证可以创建 GitHub Issues。接下来为每一个正式 APK 使用**同一份私有签名密钥**。

## 事前条件
- 使用可管理 `infcreative-Ethan/cpc-academy` 仓库的 GitHub 账户。
- 手机 CPC Academy 学习记录已导出并备份，且保留旧 App。
- 不要把私钥、恢复 ZIP、密码或 Cloudflare/GitHub Token 发到聊天或公开仓库。

## 1. 在手机浏览器开启云端终端
1. 打开仓库的 `fix/cloud-pronunciation-translation-updates-20261117` 分支。
2. 点击绿色的 **Code** → **Codespaces** → **Create codespace on this branch**。若页面不适配，手机 Chrome 可开启「桌面版网站」。
3. Codespaces 打开后，在网页编辑器中选择 **Terminal → New Terminal**。

**重要：必须创建 Codespace，而不是仅打开 github.dev（github.dev 没有终端）。**

## 2. 一条命令生成并保存永久签名
在 Codespaces 终端输入：

```bash
bash scripts/setup-release-signing-codespaces.sh
```

脚本自动：
- 在 Codespaces 私有工作目录生成长期有效的 PKCS12 Android 签名密钥；
- 使用随机密码，不会在终端中打印私钥或密码；
- 将 `CPC_ANDROID_KEYSTORE_B64`、`CPC_ANDROID_STORE_PASSWORD`、`CPC_ANDROID_KEY_ALIAS` 和 `CPC_ANDROID_KEY_PASSWORD` 安全写入 GitHub Actions Secrets；
- 在 `.private-signing/CPC-Academy-Signing-Backup.zip` 生成完整恢复备份，并禁止 Git 跟踪。

若终端显示 `SUCCESS: four release signing secrets saved to GitHub Actions.`，即配置成功。

**如果提示 GitHub 权限不足：** 脚本会自动开启 GitHub CLI 网页或设备授权流程。按照屏幕提示授权后继续，不要把验证码、Token 或密码发到聊天。如果仍无法授权，不要删除 Codespace，也不要重新生成密钥。

## 3. 必须下载密钥恢复 ZIP
在 Codespaces 左侧文件浏览器中：
1. 找到 `.private-signing` 文件夹（隐藏文件夹通常显示）。
2. 对 `CPC-Academy-Signing-Backup.zip` 打开右键/长按菜单，选择 **Download / 下载**。
3. 将 ZIP 文件保存在自己的安全存储位置，并单独再备份一份。ZIP 内含密钥和密码，**没有额外加密**，不可公开分享。
4. 确认文件确实下载成功以后，才允许删除 Codespace。

如果丢失这份签名密钥，未来的 APK 将无法覆盖先前发布的版本；**这是整个更新流程中最重要的备份**。

## 4. 完成正式发布
配置 Secrets 后，由维护者合并待发布的代码到 `main`，触发 GitHub Actions。工作流必须显示以下步骤成功：
- `Build permanently signed release APK`
- `Upload signed update APK artifact`
- `Publish signed APK as latest installable GitHub release`

之后在 GitHub **Releases** 页下载正式签名的 `CPC-Academy.apk`。正式应用可在以后使用「检查更新 → 下载并安装」的方式安装下一个版本。

旧版 Debug 签名与新正式签名可能不同。**首次迁移必须在核对学习进度备份以后进行**；旧版卸载会丢失原有 app-private PDF 文件，可能需要再次导入。正式版安装后再导入学习记录。两次正式签名的版本间才能验证无需卸载的覆盖升级。

不要用 Debug 构建产物充当正式 App。
