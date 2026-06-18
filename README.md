# King Top 教育 App 个人站

这是一个可直接发布到 GitHub Pages 的静态个人网站，用于展示两条独立产品线：

- 教育 App 产品矩阵：首页 `index.html`
- AI Music / 石头叔叔作品线：音乐页 `ai-music.html`

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

AI Music 专辑封面放在 `assets/ai-music/covers/`。发布网站时需要连同 `assets/` 目录一起提交和部署。

## 发布到 GitHub Pages

推荐建一个个人站仓库：

```text
botonwa83-byte.github.io
```

把本目录里的 `index.html`、`ai-music.html`、`assets/`、`scripts/` 和 `.github/` 复制到该仓库根目录，提交并推送。GitHub Pages 会把个人站发布到：

```text
https://botonwa83-byte.github.io/
```

也可以把本目录内容放进任意仓库的 `docs/` 目录，通过仓库 Pages 发布到：

```text
https://botonwa83-byte.github.io/<repo-name>/
```

## 后续建议

- ChinApex、PolApex、HistApex、GeogApex 公开 App Store 下载页可访问后，在产品卡片里补真实链接。
- 保留每个 App 独立的隐私政策、用户协议和技术支持页，不要用个人主页替代合规链接。
- 当前首页按 5 个已上线、4 个上架准备展示 Apex 系列状态。
