# Android 封装说明（阶段一）

## 方案 A：Trusted Web Activity（TWA）
- 前提：PWA 可安装，HTTPS 站点（需域名）。
- 步骤：
  1. 安装 Bubblewrap：`npm i -g @bubblewrap/cli`。
  2. 在项目根运行：`bubblewrap init`，填入站点 URL（部署后的地址）。
  3. 构建：`bubblewrap build` 生成 Android 项目；`bubblewrap install` 推送测试（需设备）。
  4. 验证 assetlinks.json：在站点 `.well-known/assetlinks.json` 与应用签名一致。
- 优点：性能好、与 Chrome 同步更新；缺点：需公网 HTTPS。

## 方案 B：WebView 封装（离线包）
- 前提：打包 `dist/` 资源，内置到 APK。
- 步骤：
  1. 前端构建：`npm run build`，得到 `dist/`。
  2. 新建 Android 工程（Android Studio），添加 WebView Activity：
     - 启用文件访问与缓存；将 `dist/` 拷贝至 `app/src/main/assets/`。
     - `webView.loadUrl("file:///android_asset/index.html")`。
  3. 适配：启用硬件加速、处理存储权限（如需下载）。
- 优点：可离线；缺点：WebView 内核版本随设备。

## 签名与发布
- 生成签名：Android Studio → Build → Generate Signed Bundle/APK。
- 渠道分发：应用商店或企业内分发；提供旧版回滚。

## 当前项目准备度
- 已具备 PWA 清单与 Service Worker（`public/manifest.webmanifest`、`public/sw.js`）。
- 可直接用于方案 A（绑定域名后）或方案 B（离线包）。

## 建议
- 阶段一先用 WebView 封装离线包，快速交付；并行准备公网 HTTPS 与 TWA。