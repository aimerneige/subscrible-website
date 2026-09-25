# Subscrible

遵循 Material Design 3 的颜色角色、圆角容器、导航、筛选 chips、按钮与对话框风格的轻量静态订阅管理工具。原生 HTML / CSS / JavaScript，无运行时依赖、外部字体、分析脚本、远程图标或 API。

## 本地运行与构建

需要 Node.js 22 或更新版本，无需安装依赖。

```sh
npm run dev
npm test
npm run build
npm run preview
```

开发与预览地址为 `http://localhost:5173`。构建结果为 `dist/`，直接部署其内容即可。所有资源采用相对路径，无服务端路由或 SPA 路由回退要求。`public/CNAME`（`subscrible.aimer.moe`）、`.nojekyll` 和图标会复制到输出目录。未创建 GitHub CI。

## 功能与数据

- 添加、编辑、删除及暂停订阅；记录金额、货币、每周/月/季/年周期、付款方式、付款日期、分类及备注。
- 房租也可作为周期性支出：选择「住房租金」分类，填写每次实际应付金额、付款周期及付款日期。例如每月租金 3000 CNY、按季支付时，填写金额 9000、周期「每季」，月均统计为 3000 CNY；付款方式可填写银行转账。押金等一次性费用不计入周期金额，可记录在备注中。住房租金与其他订阅共用统计、日历和备份功能。
- 分币种月均支出、近期扣款、月历、搜索、筛选以及卡片/列表视图。
- 手机话费、宽带选择「通讯网络」，保险选择「保险保障」，分别显示手机及盾牌图标。按每次应付金额设置周期，例如 1200 CNY / 每年的保费折算为月均 100 CNY。浮动话费可填写预算金额，统计为估算，不代表实际账单；备注可填写套餐或保障期限。
- 月均金额为预算估算；周付按每年 52 周折算，不请求汇率。不同币种不相加。
- 以填写的付款日期为锚点计算预计扣款，月末不足天数取当月最后一天，后续月份继续沿用原始锚点；不代表实际支付成功，也不会发起扣款或后台通知。
- 首次打开显示明确标注的示例预览，示例不会自动存储；添加第一项订阅或选择「开始使用」后进入个人数据。可在数据页面显式载入示例。
- 数据保存于当前站点来源下的 `localStorage`，不会上传；清除浏览器数据、切换浏览器或域名将导致数据不可见。提供 JSON 导出与验证后导入，替换前需确认。
- 付款方式只记录名称或备注，不要保存完整卡号、密码等敏感资料。静态资源仍由托管/CDN 服务提供，基础访问日志由服务商管理。

## GitHub Pages 与 Cloudflare 免费 CDN

此项目为个人本地管理工具，无交易处理、收费 SaaS、服务器、视频或大型下载文件，仅提供小型 HTML/CSS/JS/SVG 资源，适合 GitHub Pages 配合 Cloudflare 免费 CDN 的常规静态网站用途。实际账号、内容、流量及后续服务条款仍由部署者负责。

- [GitHub Pages 限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)：GitHub Free 使用公开仓库；站点不超过 1 GB，带宽软限制为 100 GB/月，构建软限制为每小时 10 次。不得将 Pages 用于主要促成商业交易的站点或商业 SaaS。
- [Cloudflare CDN 服务条款](https://www.cloudflare.com/service-specific-terms-application-services/)：免费 CDN 可用于此类常规网页；视频和其他大型文件需使用适用服务，本项目不包含此类内容。此处使用的是 CDN 代理，不依赖 Cloudflare Pages、Workers、R2 或其配额。
- 在 GitHub Pages 配置自定义域名 `subscrible.aimer.moe`，根据 GitHub 指引设置 Cloudflare DNS，并在源站证书生效后启用 HTTPS 与 Cloudflare Full (strict)。CNAME 文件本身不会自动配置 DNS。
- 本项目使用严格 CSP（`connect-src 'none'`）；保持 Cloudflare 的脚本注入功能（如 Web Analytics、Rocket Loader）关闭，以保留纯本地行为。

条款核对日期：2026-09-25。不对未来条款、流量或账户状态作保证。
