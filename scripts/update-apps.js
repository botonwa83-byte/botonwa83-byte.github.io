#!/usr/bin/env node

const fs = require("node:fs/promises");
const { execFile } = require("node:child_process");
const path = require("node:path");
const { promisify } = require("node:util");

const ROOT = path.resolve(__dirname, "..");
const INDEX_PAGE = path.join(ROOT, "index.html");
const CACHE_FILE = path.join(ROOT, ".cache", "app-status.json");
const execFileAsync = promisify(execFile);
const MIN_UPDATE_INTERVAL = 3600000;
const MAX_RETRY_ATTEMPTS = 3;

const APPS = [
  { id: "wordpulse", name: "WordPulse", subtitle: "初高中英语词汇", appId: "6767762376", tagline: "看到陌生长难词，拆开词根也能猜出意思。", description: "围绕词根词缀、词源宇宙、先猜后揭、懒人模式和纯离线学习，把背单词从记忆负担变成破译体验。", chips: ["330+ 词根词缀", "5800+ 词汇", "词源故事"], icon: "assets/wordpulse.png", tile: "tile-word" },
  { id: "mathapex", name: "MathApex", subtitle: "初高中数学", appId: "6778461030", tagline: "用高阶思维打通初高中数学关键题。", description: "常规解与降维秒杀双解对照，结合公式宇宙、错题复习、数学英雄与数学发现。", chips: ["595 道压轴题", "150+ 公式", "双解对照"], icon: "assets/mathapex.png", tile: "tile-math" },
  { id: "physicsapex", name: "PhysicsApex", subtitle: "初高中物理", appId: "6779031451", tagline: "把守恒、对称、等效变成物理难题的上帝视角。", description: "用互动模拟沙盘、考点地图、错因诊断和智能复习，让物理从抽象公式回到可观察的现象。", chips: ["互动沙盘", "考点地图", "错因诊断"], icon: "assets/physapex.png", tile: "tile-phys" },
  { id: "chemapex", name: "ChemApex", subtitle: "初高中化学", appId: "6780327495", tagline: "看见反应背后的守恒棋局。", description: "从元素星图、方程式剧本库到化学神探，把推断题、守恒题和实验题拆成可复用的识局方法。", chips: ["元素星图", "守恒战例", "方程式库"], icon: "assets/chemapex.png", tile: "tile-chem" },
  { id: "bioapex", name: "BioApex", subtitle: "初高中生物", appId: "6780727579", tagline: "把背不完的生物变成逐个掌握的系统。", description: "过程剧场、考点图谱、遗传神探、稳态回路和易混辨析，帮助学生看见生命系统如何运转。", chips: ["过程剧场", "遗传神探", "解题武器"], icon: "assets/bioapex.png", tile: "tile-bio" },
  { id: "chinapex", name: "ChinApex", subtitle: "初高中语文", appId: "6781556016", tagline: "让语文从玄学变成可操作的采分点训练。", description: "原文定位、文言解码、默写星图、作文工坊和阅卷人之眼，让学生知道每一分到底从哪里来。", chips: ["采分点", "作文工坊", "文言解码"], icon: "assets/chinapex.png", tile: "tile-chin" },
  { id: "polapex", name: "PolApex", subtitle: "初高中道法 / 思想政治", appId: null, tagline: "把政治从背了就忘，变成可检索、可迁移、可输出。", description: "围绕高权重记忆、主体职责、材料切片、答案工厂和选择题排雷。", chips: ["材料切片", "答案工厂", "主体定位"], icon: "assets/polapex.png", tile: "tile-pol", status: "plan" },
  { id: "histapex", name: "HistApex", subtitle: "初高中历史", appId: "6783254820", tagline: "把时间线、制度线和材料题写法连成历史高分系统。", description: "用时间博物馆、史料相遇、历史规律、专题突破和答案模板，把背事件推进到解释变化与因果。", chips: ["时间博物馆", "史料题", "规律迁移"], icon: "assets/histapex.png", tile: "tile-hist" },
  { id: "geogapex", name: "GeogApex", subtitle: "初高中地理", appId: "6783594491", tagline: "把读图、定位、拆因果和综合题表达练成稳定流程。", description: "围绕空间定位、图表判读、自然过程、人文区位、区域发展和答案工厂，补齐选择题与综合题两条线。", chips: ["图表判读", "区位矩阵", "综合题模板"], icon: "assets/geogapex.png", tile: "tile-geog" },
  { id: "engapex", name: "EngApex", subtitle: "初高中英语", appId: "6784478791", tagline: "把语法填空、完形填空、阅读理解练成系统能力。", description: "围绕句法解码、完形线索、阅读题型和写作框架，让英语从语感变成可操作的解题流程。", chips: ["句法解码", "完形线索", "阅读题型"], icon: "assets/engapex.png", tile: "tile-eng" }
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

function generateContentHash(apps) {
  return apps.map((a) => `${a.id}:${a.status}:${a.appId || ""}`).sort().join("|");
}

async function readCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return { lastUpdate: 0, contentHash: "", apps: [] };
  }
}

async function writeCache(cache) {
  await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

async function fetchAppInfoWithRetry(appId, attempt = 1) {
  if (!appId) return { ok: true, info: null };

  const storefronts = ["cn", "us"];
  let sawError = false;

  for (const country of storefronts) {
    const url = `https://itunes.apple.com/${country}/lookup?id=${appId}`;
    const args = [
      "-fsSL",
      "--ipv4",
      "--retry", "3",
      "--retry-delay", "2",
      "--retry-all-errors",
      "--connect-timeout", "8",
      "--max-time", "25",
      "-H", "User-Agent: Mozilla/5.0 (compatible; KingTopSiteUpdater/1.0)",
      url
    ];

    try {
      const { stdout } = await execFileAsync("curl", args, { maxBuffer: 1024 * 1024 * 8 });
      const data = JSON.parse(stdout);
      if (data.resultCount > 0) {
        return { ok: true, info: data.results[0] };
      }
    } catch (error) {
      sawError = true;
      console.warn(`Fetch failed for appId ${appId} (${country}): ${error.message}`);
    }
  }

  if (sawError && attempt < MAX_RETRY_ATTEMPTS) {
    const backoffDelay = Math.pow(2, attempt) * 1000;
    console.warn(`Retrying appId ${appId} (attempt ${attempt}/${MAX_RETRY_ATTEMPTS}) in ${backoffDelay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    return fetchAppInfoWithRetry(appId, attempt + 1);
  }

  return sawError ? { ok: false } : { ok: true, info: null };
}

function collectPriorLiveAppIds(page) {
  const ids = new Set();
  const pattern = /apps\.apple\.com\/[a-z]{2}\/app\/(\d+)/g;
  let match;
  while ((match = pattern.exec(page)) !== null) {
    ids.add(match[1]);
  }
  return ids;
}

async function checkIconExists(iconPath) {
  if (!iconPath) return false;

  try {
    await fs.access(iconPath);
    return true;
  } catch {
    return false;
  }
}

async function fetchAllAppStatus(priorLiveIds) {
  const results = [];

  for (const app of APPS) {
    const result = await fetchAppInfoWithRetry(app.appId);
    let status = app.status || "plan";
    let appInfo = null;
    const iconPath = app.icon ? path.join(ROOT, app.icon) : null;
    const hasIcon = await checkIconExists(iconPath);

    if (result.ok && result.info) {
      status = "live";
      appInfo = result.info;
    } else if (!result.ok && app.appId && priorLiveIds.has(app.appId)) {
      status = "live";
      console.warn(`Preserving prior live status for ${app.name} after fetch failure.`);
    } else if (app.appId && !app.status) {
      status = "review";
    }

    if (app.icon && !hasIcon) {
      console.warn(`Icon not found for ${app.name}: ${app.icon}, will use letter marker instead.`);
    }

    results.push({ ...app, status, appInfo, hasIcon });
  }

  return results;
}

function appStoreUrl(appId) {
  return `https://apps.apple.com/cn/app/${appId}`;
}

function landingUrl(app) {
  return `${app.id}.html`;
}

function renderIconMark(app) {
  const letter = app.name.charAt(0).toUpperCase();
  return `<div class="icon-mark" aria-hidden="true">${letter}</div>`;
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
  const landingLink = `<a class="chip chip-link" href="${landingUrl(app)}">查看广告页</a>`;

  const iconHtml = app.hasIcon
    ? `<img class="product-icon" src="${app.icon}" alt="${attrTitle} 图标">`
    : renderIconMark(app);

  if (isPlan) {
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
  <div class="chips">${chips}${landingLink}</div>
</article>`;
  }

  const wrappedIconHtml = isLive
    ? `<a class="store-icon-link" href="${appStoreUrl(app.appId)}" target="_blank" rel="noopener" aria-label="前往 App Store 下载 ${title}">${iconHtml}</a>`
    : iconHtml;

  return `
<article class="product-card">
  <div class="product-top">
    <div class="product-id">
      ${wrappedIconHtml}
      <div class="product-title">
        <h3>${title}</h3>
        <p>${subtitle}</p>
      </div>
    </div>
    <span class="status ${statusClass}">${statusText}</span>
  </div>
  <p class="tagline">${escapeHtml(app.tagline)}</p>
  <p>${escapeHtml(app.description)}</p>
  <div class="chips">${chips}${landingLink}</div>
</article>`;
}

function renderAppCloud(apps) {
  return apps.map((app) => {
    const isLive = app.status === "live" && app.appId;
    const isPlan = app.status === "plan";
    const title = escapeHtml(app.name);
    const subtitle = escapeHtml(app.subtitle);

    const iconContent = app.hasIcon
      ? `<img src="${app.icon}" alt="">`
      : renderIconMark(app);

    if (isPlan) {
      return `<div class="app-tile ${app.tile}">${iconContent}<strong>${title}</strong><span>${subtitle}</span></div>`;
    }

    const link = isLive
      ? `href="${appStoreUrl(app.appId)}" target="_blank" rel="noopener" aria-label="前往 App Store 下载 ${title}"`
      : "";
    const tag = isLive ? "a" : "div";

    return `<${tag} class="app-tile ${app.tile}" ${link}>${iconContent}<strong>${title}</strong><span>${subtitle}</span></${tag}>`;
  }).join("\n          ");
}

function joinNames(apps) {
  return apps.map((a) => a.name).join("、");
}

function renderMetrics(apps) {
  const liveCount = apps.filter((a) => a.status === "live").length;
  const reviewCount = apps.filter((a) => a.status === "review").length;
  const planCount = apps.filter((a) => a.status === "plan").length;
  const pendingCount = reviewCount + planCount;
  const totalCount = apps.length;

  let pendingText;
  if (pendingCount === 0) {
    pendingText = "全部产品均已上线 App Store";
  } else if (reviewCount > 0 && planCount > 0) {
    pendingText = `${reviewCount} 个审核中、${planCount} 个上架准备中`;
  } else if (reviewCount > 0) {
    pendingText = "提交审核中，等待 App Store 放出下载页";
  } else {
    pendingText = "上架准备中，内容打磨与提审推进中";
  }

  return [
    `<div class="metric"><strong>${totalCount}</strong><span>初高中教育产品方向，覆盖英语与核心学科</span></div>`,
    `<div class="metric"><strong>${liveCount}</strong><span>已上线 App Store，点击产品图标可进入下载页</span></div>`,
    `<div class="metric"><strong>${pendingCount}</strong><span>${pendingText}</span></div>`,
    `<div class="metric"><strong>100%</strong><span>优先离线内容、本地学习记录、低依赖发布</span></div>`
  ].join("\n          ");
}

function renderRoadmap(apps) {
  const liveApps = apps.filter((a) => a.status === "live");
  const reviewApps = apps.filter((a) => a.status === "review");
  const planApps = apps.filter((a) => a.status === "plan");
  const pendingApps = [...reviewApps, ...planApps];

  const liveCard = liveApps.length > 0
    ? `<div class="road-card"><h3>${liveApps.length} 个已上线</h3><p>${joinNames(liveApps)} 已配置中国区 App Store 下载页，点击图标即可直达。</p></div>`
    : `<div class="road-card"><h3>即将上线</h3><p>首批产品正在提审，公开下载页放出后立即在此更新。</p></div>`;

  let pendingCard;
  if (pendingApps.length === 0) {
    pendingCard = `<div class="road-card"><h3>矩阵已全部上线</h3><p>所有学科产品均可在 App Store 下载，后续以内容更新与体验打磨为主。</p></div>`;
  } else {
    const reviewPart = reviewApps.length > 0 ? `${joinNames(reviewApps)} 提交审核中` : "";
    const planPart = planApps.length > 0 ? `${joinNames(planApps)} 上架准备中` : "";
    const detail = [reviewPart, planPart].filter(Boolean).join("，");
    pendingCard = `<div class="road-card"><h3>${pendingApps.length} 个推进中</h3><p>${detail}，已纳入教育产品线，当前不放无效下载入口。</p></div>`;
  }

  const noteCard = `<div class="road-card"><h3>状态每日自动同步</h3><p>每天自动检测 App Store 公开页，上线后产品图标会自动切换为下载跳转，无需手动改文案。</p></div>`;

  return [liveCard, pendingCard, noteCard].join("\n          ");
}

async function main() {
  const cache = await readCache();
  const now = Date.now();

  if (now - cache.lastUpdate < MIN_UPDATE_INTERVAL && cache.contentHash) {
    console.log(`Skipping update: last update was ${Math.floor((now - cache.lastUpdate) / 60000)} minutes ago`);
    return;
  }

  try {
    const page = await fs.readFile(INDEX_PAGE, "utf8");
    const priorLiveIds = collectPriorLiveAppIds(page);

    const apps = await fetchAllAppStatus(priorLiveIds);
    const newHash = generateContentHash(apps);

    if (newHash === cache.contentHash && cache.apps.length > 0) {
      console.log("No changes detected in app status, skipping update");
      await writeCache({ ...cache, lastUpdate: now });
      return;
    }

    const liveCount = apps.filter((a) => a.status === "live").length;
    const reviewCount = apps.filter((a) => a.status === "review").length;
    const planCount = apps.filter((a) => a.status === "plan").length;

    console.log(`App status: ${liveCount} live, ${reviewCount} review, ${planCount} plan`);

    const withCloud = replaceGeneratedBlock(page, "CLOUD", renderAppCloud(apps));
    const withMetrics = replaceGeneratedBlock(withCloud, "METRICS", renderMetrics(apps));
    const withProducts = replaceGeneratedBlock(withMetrics, "PRODUCTS", apps.map(renderProductCard).join("\n\n          "));
    const withRoadmap = replaceGeneratedBlock(withProducts, "ROADMAP", renderRoadmap(apps));

    await fs.writeFile(INDEX_PAGE, withRoadmap);
    await writeCache({ lastUpdate: now, contentHash: newHash, apps });

    console.log(`Updated ${path.relative(ROOT, INDEX_PAGE)}`);
  } catch (error) {
    console.error(`Failed to update app status: ${error.message}`);

    if (cache.apps.length > 0) {
      console.log("Using cached data from previous successful update");
    } else {
      process.exitCode = 1;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});