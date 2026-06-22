#!/usr/bin/env node

const fs = require("node:fs/promises");
const { execFile } = require("node:child_process");
const path = require("node:path");
const { promisify } = require("node:util");

const ROOT = path.resolve(__dirname, "..");
const INDEX_PAGE = path.join(ROOT, "index.html");
const execFileAsync = promisify(execFile);

const APPS = [
  { id: "wordpulse", name: "WordPulse", subtitle: "初高中英语词汇", appId: "6767762376", tagline: "看到陌生长难词，拆开词根也能猜出意思。", description: "围绕词根词缀、词源宇宙、先猜后揭、懒人模式和纯离线学习，把背单词从记忆负担变成破译体验。", chips: ["330+ 词根词缀", "5800+ 词汇", "词源故事"], icon: "assets/wordpulse.png", tile: "tile-word" },
  { id: "mathapex", name: "MathApex", subtitle: "初高中数学", appId: "6778461030", tagline: "用高阶思维打通初高中数学关键题。", description: "常规解与降维秒杀双解对照，结合公式宇宙、错题复习、数学英雄与数学发现。", chips: ["595 道压轴题", "150+ 公式", "双解对照"], icon: "assets/mathapex.png", tile: "tile-math" },
  { id: "physicsapex", name: "PhysicsApex", subtitle: "初高中物理", appId: "6779031451", tagline: "把守恒、对称、等效变成物理难题的上帝视角。", description: "用互动模拟沙盘、考点地图、错因诊断和智能复习，让物理从抽象公式回到可观察的现象。", chips: ["互动沙盘", "考点地图", "错因诊断"], icon: "assets/physapex.png", tile: "tile-phys" },
  { id: "chemapex", name: "ChemApex", subtitle: "初高中化学", appId: "6780327495", tagline: "看见反应背后的守恒棋局。", description: "从元素星图、方程式剧本库到化学神探，把推断题、守恒题和实验题拆成可复用的识局方法。", chips: ["元素星图", "守恒战例", "方程式库"], icon: "assets/chemapex.png", tile: "tile-chem" },
  { id: "bioapex", name: "BioApex", subtitle: "初高中生物", appId: "6780727579", tagline: "把背不完的生物变成逐个掌握的系统。", description: "过程剧场、考点图谱、遗传神探、稳态回路和易混辨析，帮助学生看见生命系统如何运转。", chips: ["过程剧场", "遗传神探", "解题武器"], icon: "assets/bioapex.png", tile: "tile-bio" },
  { id: "chinapex", name: "ChinApex", subtitle: "初高中语文", appId: null, tagline: "让语文从玄学变成可操作的采分点训练。", description: "原文定位、文言解码、默写星图、作文工坊和阅卷人之眼，让学生知道每一分到底从哪里来。", chips: ["采分点", "作文工坊", "文言解码"], icon: "assets/chinapex.png", tile: "tile-chin", status: "plan" },
  { id: "polapex", name: "PolApex", subtitle: "初高中道法 / 思想政治", appId: null, tagline: "把政治从背了就忘，变成可检索、可迁移、可输出。", description: "围绕高权重记忆、主体职责、材料切片、答案工厂和选择题排雷。", chips: ["材料切片", "答案工厂", "主体定位"], icon: "assets/polapex.png", tile: "tile-pol", status: "plan" },
  { id: "histapex", name: "HistApex", subtitle: "初高中历史", appId: null, tagline: "把时间线、制度线和材料题写法连成历史高分系统。", description: "用时间博物馆、史料相遇、历史规律、专题突破和答案模板，把背事件推进到解释变化与因果。", chips: ["时间博物馆", "史料题", "规律迁移"], icon: "assets/histapex.png", tile: "tile-hist", status: "plan" },
  { id: "geogapex", name: "GeogApex", subtitle: "初高中地理", appId: null, tagline: "把读图、定位、拆因果和综合题表达练成稳定流程。", description: "围绕空间定位、图表判读、自然过程、人文区位、区域发展和答案工厂，补齐选择题与综合题两条线。", chips: ["图表判读", "区位矩阵", "综合题模板"], icon: "assets/geogapex.png", tile: "tile-geog", status: "plan" }
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function replaceGeneratedBlock(source, name, content) {
  const start = `<!-- APP_STATUS_${name}_START -->`;
  const end = `<!-- APP_STATUS_${name}_END -->`;
  const pattern = new RegExp(`(^[ \\t]*)${start}[\\s\\S]*?\\n^[ \\t]*${end}`, "m");
  const match = source.match(pattern);

  if (!match) {
    throw new Error(`Missing generated block markers for ${name}`);
  }

  const indent = match[1];
  const indented = content
    .split("\n")
    .map((line) => (line ? `${indent}${line}` : line))
    .join("\n");

  return source.replace(pattern, `${indent}${start}\n${indented}\n${indent}${end}`);
}

async function fetchAppInfo(appId) {
  if (!appId) return null;

  const url = `https://itunes.apple.com/cn/lookup?id=${appId}`;
  const args = [
    "-fsSL",
    "--ipv4",
    "--retry", "2",
    "--retry-delay", "2",
    "--connect-timeout", "8",
    "--max-time", "25",
    "-H", "User-Agent: Mozilla/5.0 (compatible; KingTopSiteUpdater/1.0)",
    url
  ];

  try {
    const { stdout } = await execFileAsync("curl", args, { maxBuffer: 1024 * 1024 * 8 });
    const data = JSON.parse(stdout);
    return data.resultCount > 0 ? data.results[0] : null;
  } catch (error) {
    console.warn(`Fetch failed for appId ${appId}: ${error.message}`);
    return null;
  }
}

async function fetchAllAppStatus() {
  const results = [];

  for (const app of APPS) {
    const info = await fetchAppInfo(app.appId);
    let status = app.status || "plan";

    if (info) {
      status = "live";
    } else if (app.appId && !app.status) {
      status = "review";
    }

    results.push({ ...app, status, appInfo: info });
  }

  return results;
}

function appStoreUrl(appId) {
  return `https://apps.apple.com/cn/app/${appId}`;
}

function renderProductCard(app) {
  const isLive = app.status === "live" && app.appId;
  const isPlan = app.status === "plan";
  const title = escapeHtml(app.name);
  const attrTitle = escapeAttr(app.name);
  const subtitle = escapeHtml(app.subtitle);

  let statusClass, statusText;
  switch (app.status) {
    case "live": statusClass = "live"; statusText = "已上线"; break;
    case "review": statusClass = "review"; statusText = "审核中"; break;
    default: statusClass = "plan"; statusText = "上架准备";
  }

  const chips = app.chips.map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join("");

  if (isPlan) {
    return `
<article class="product-card">
  <div class="product-top">
    <div class="product-id">
      <img class="product-icon" src="${app.icon}" alt="${attrTitle} 图标">
      <div class="product-title">
        <h3>${title}</h3>
        <p>${subtitle}</p>
      </div>
    </div>
    <span class="status ${statusClass}">${statusText}</span>
  </div>
  <p class="tagline">${escapeHtml(app.tagline)}</p>
  <p>${escapeHtml(app.description)}</p>
  <div class="chips">${chips}</div>
</article>`;
  }

  const iconHtml = isLive
    ? `<a class="store-icon-link" href="${appStoreUrl(app.appId)}" target="_blank" rel="noopener" aria-label="前往 App Store 下载 ${title}"><img class="product-icon" src="${app.icon}" alt="${attrTitle} 图标"></a>`
    : `<img class="product-icon" src="${app.icon}" alt="${attrTitle} 图标">`;

  return `
<article class="product-card">
  <div class="product-top">
    <div class="product-id">
      ${iconHtml}
      <div class="product-title">
        <h3>${title}</h3>
        <p>${subtitle}</p>
      </div>
    </div>
    <span class="status ${statusClass}">${statusText}</span>
  </div>
  <p class="tagline">${escapeHtml(app.tagline)}</p>
  <p>${escapeHtml(app.description)}</p>
  <div class="chips">${chips}</div>
</article>`;
}

function renderAppCloud(apps) {
  return apps.map((app) => {
    const isLive = app.status === "live" && app.appId;
    const isPlan = app.status === "plan";
    const title = escapeHtml(app.name);
    const subtitle = escapeHtml(app.subtitle);

    if (isPlan) {
      return `<div class="app-tile ${app.tile}"><img src="${app.icon}" alt=""><strong>${title}</strong><span>${subtitle}</span></div>`;
    }

    const link = isLive
      ? `href="${appStoreUrl(app.appId)}" target="_blank" rel="noopener" aria-label="前往 App Store 下载 ${title}"`
      : "";
    const tag = isLive ? "a" : "div";

    return `<${tag} class="app-tile ${app.tile}" ${link}><img src="${app.icon}" alt=""><strong>${title}</strong><span>${subtitle}</span></${tag}>`;
  }).join("\n          ");
}

function renderMetrics(apps) {
  const liveCount = apps.filter((a) => a.status === "live").length;
  const reviewCount = apps.filter((a) => a.status === "review").length;
  const planCount = apps.filter((a) => a.status === "plan").length;
  const totalCount = apps.length;

  return [
    `<div class="metric"><strong>${totalCount}</strong><span>初高中教育产品方向，覆盖英语与核心学科</span></div>`,
    `<div class="metric"><strong>${liveCount}</strong><span>已上线 App Store，点击产品图标可进入下载页</span></div>`,
    `<div class="metric"><strong>${reviewCount + planCount}</strong><span>${reviewCount + planCount > 0 ? "审核中或上架准备中" : "暂无"}</span></div>`,
    `<div class="metric"><strong>100%</strong><span>优先离线内容、本地学习记录、低依赖发布</span></div>`
  ].join("\n          ");
}

async function main() {
  const apps = await fetchAllAppStatus();
  const page = await fs.readFile(INDEX_PAGE, "utf8");

  const liveCount = apps.filter((a) => a.status === "live").length;
  const reviewCount = apps.filter((a) => a.status === "review").length;
  const planCount = apps.filter((a) => a.status === "plan").length;

  console.log(`App status: ${liveCount} live, ${reviewCount} review, ${planCount} plan`);

  const withCloud = replaceGeneratedBlock(page, "CLOUD", renderAppCloud(apps));
  const withMetrics = replaceGeneratedBlock(withCloud, "METRICS", renderMetrics(apps));
  const withProducts = replaceGeneratedBlock(withMetrics, "PRODUCTS", apps.map(renderProductCard).join("\n\n          "));

  await fs.writeFile(INDEX_PAGE, withProducts);
  console.log(`Updated ${path.relative(ROOT, INDEX_PAGE)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
