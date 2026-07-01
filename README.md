# King Top 教育 App 个人站

这是一个可直接发布到 GitHub Pages 的静态个人网站，用于展示多条独立产品线：

- 教育 App 产品矩阵：首页 `index.html`
- 健康 App 产品线：`kingfit.html`
- AI Music / 石头叔叔作品线：音乐页 `ai-music.html`
- 各学科广告落地页：`wordpulse.html`、`mathapex.html`、`physicsapex.html` 等独立页面
- 推广方案动画页：`promotion.html`

教育 App 包括：

- WordPulse
- MathApex
- PhysApex
- ChemApex
- BioApex
- ChinApex
- PolApex
- HistApex
- GeogApex
- EngApex

健康 App 包括：

- KingFit 健康趋势

## 学科广告页

每个教育产品都有一个独立广告页，页面结构参考 PhysicsApex 的 Convertly 落地页：首屏卖点、产品预览、数据概览、方法卡片、双解 / 双路径对照、章节覆盖、训练流程、下载或上架提醒 CTA。

广告页由统一脚本生成：

```bash
node scripts/generate-subject-pages.js
```

生成文件包括：

```text
wordpulse.html
mathapex.html
physicsapex.html
chemapex.html
bioapex.html
chinapex.html
polapex.html
histapex.html
geogapex.html
engapex.html
```

共享样式放在：

```text
assets/subject-landing.css
```

首页教育产品卡片中的“查看广告页”入口由 `scripts/update-apps.js` 生成；如果后续自动同步 App Store 状态，也会保留这些广告页链接。KingFit 属于独立健康产品线，不由该脚本生成。

## 健康产品页

`kingfit.html` 展示已上线的 KingFit 健康趋势 App，和教育产品线分开。页面包含 App Store 下载入口、健康趋势定位、恢复评分、训练负荷、睡眠详情、Apple Watch 支持和隐私说明。

## 推广方案动画页

`promotion.html` 是面向推广执行的动态网页方案，包含：

- 产品矩阵推广定位
- 学生、家长、老师 / 学习博主三类人群
- 短视频、搜索 / SEO、社群、App Store 四类渠道策略
- 30 天推广节奏
- 内容脚本工厂
- 转化漏斗和复盘指标

页面是纯静态 HTML/CSS/JS，使用现有 App 图标作为视觉资产，可直接随 GitHub Pages 发布。

## AI Music 自动更新

音乐页的专辑区由 `scripts/update-ai-music.js` 生成。脚本会拉取 QQ 音乐歌手“石头叔叔”的公开专辑数据，更新 `ai-music.html` 中的首屏封面、统计数据、专辑卡片、封面、专辑链接、发布日期、曲目数量和代表曲。

专辑封面会下载到本地：

```text
assets/ai-music/covers/
```

页面引用本地封面文件，避免访问者打开网站时因为 QQ 音乐图片 CDN 波动导致封面显示不全。新专辑出现时，脚本会自动下载缺失封面。

脚本默认先正常访问 QQ 音乐；如果当前网络的 DNS 解析 QQ 域名失败，会自动用公共 DNS 回退。也可以手动指定解析 IP：

```bash
QQ_MUSIC_API_RESOLVE=140.206.162.227 QQ_MUSIC_COVER_RESOLVE=157.255.130.139 node scripts/update-ai-music.js
```

本地手动更新：

```bash
node scripts/update-ai-music.js
```

仓库也包含 GitHub Actions 工作流：`.github/workflows/update-ai-music.yml`。

- 每天北京时间 07:40 自动运行一次。
- 也可以在 GitHub Actions 页面手动点 `Run workflow`。
- 如果 QQ 音乐数据有新专辑或专辑信息变化，工作流会自动提交更新后的 `ai-music.html` 和本地封面文件。
- 如果你用 GitHub Pages 从默认分支发布，提交后网站会跟随 Pages 自动重新部署。

## 本地图片资源

教育产品线图标已经放在 `assets/` 根目录，首页全部使用本地图片：

- `assets/wordpulse.png`
- `assets/mathapex.png`
- `assets/physapex.png`
- `assets/chemapex.png`
- `assets/bioapex.png`
- `assets/chinapex.png`
- `assets/polapex.png`
- `assets/histapex.png`
- `assets/geogapex.png`
- `assets/kingfit.png`

AI Music 专辑封面放在 `assets/ai-music/covers/`。发布网站时需要连同 `assets/` 目录一起提交和部署。

## 发布到 GitHub Pages

推荐建一个个人站仓库：

```text
botonwa83-byte.github.io
```

把本目录里的 `index.html`、`kingfit.html`、`ai-music.html`、`promotion.html`、各学科 `*.html` 广告页、`assets/`、`scripts/` 和 `.github/` 复制到该仓库根目录，提交并推送。GitHub Pages 会把个人站发布到：

```text
https://botonwa83-byte.github.io/
```

也可以把本目录内容放进任意仓库的 `docs/` 目录，通过仓库 Pages 发布到：

```text
https://botonwa83-byte.github.io/<repo-name>/
```

## 后续建议

- PolApex 公开 App Store 下载页可访问后，在 `scripts/update-apps.js` 和 `scripts/generate-subject-pages.js` 里补真实 `appId`。
- 保留每个 App 独立的隐私政策、用户协议和技术支持页，不要用个人主页替代合规链接。
- 当前首页按 9 个已上线、1 个上架准备展示教育产品状态，并单独展示已上线的 KingFit 健康产品线。
