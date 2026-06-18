#!/usr/bin/env node

const fs = require("node:fs/promises");
const { execFile } = require("node:child_process");
const { Resolver } = require("node:dns").promises;
const path = require("node:path");
const { promisify } = require("node:util");

const ROOT = path.resolve(__dirname, "..");
const MUSIC_PAGE = path.join(ROOT, "ai-music.html");
const COVER_DIR = path.join(ROOT, "assets", "ai-music", "covers");
const COVER_PUBLIC_DIR = "assets/ai-music/covers";
const SINGER_MID = "000aPaAE3DyZhr";
const SINGER_NAME = "石头叔叔";
const QQ_API_HOST = "c.y.qq.com";
const QQ_COVER_HOST = "y.gtimg.cn";
const QQ_ALBUM_API = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_album.fcg?singermid=${SINGER_MID}&order=time&begin=0&num=100&exstatus=1&format=json&inCharset=utf8&outCharset=utf-8&platform=yqq.json&needNewCode=0`;
const execFileAsync = promisify(execFile);
const HERO_FLOAT_CLASSES = ["float-a", "float-b", "float-c", "float-d", "float-e", "float-f"];
const COVER_SIZES = [800, 500, 300];
const PUBLIC_DNS_SERVERS = ["223.5.5.5", "119.29.29.29", "8.8.8.8"];
const HOST_RESOLVE = {
  [QQ_API_HOST]: process.env.QQ_MUSIC_API_RESOLVE,
  [QQ_COVER_HOST]: process.env.QQ_MUSIC_COVER_RESOLVE
};
const resolver = new Resolver();
resolver.setServers(PUBLIC_DNS_SERVERS);

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
  const start = `<!-- AI_MUSIC_${name}_START -->`;
  const end = `<!-- AI_MUSIC_${name}_END -->`;
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

async function fetchAlbums() {
  const data = await requestJson(QQ_ALBUM_API);
  if (data.code !== 0 || data.subcode !== 0) {
    throw new Error(`QQ Music API returned code=${data.code}, subcode=${data.subcode}`);
  }

  const albums = data?.data?.list;
  if (!Array.isArray(albums) || albums.length === 0) {
    throw new Error("QQ Music API returned no albums");
  }

  const normalized = albums
    .filter((album) => album.singerMID === SINGER_MID || album.singerName === SINGER_NAME)
    .map((album) => ({
      title: album.albumName,
      mid: album.albumMID,
      date: album.pubTime,
      type: album.albumtype || "专辑",
      language: album.lan || "未知",
      count: Number(album.latest_song?.song_count || album.song_count || 0),
      track: album.latest_song?.track_name || "最新作品"
    }))
    .filter((album) => album.title && album.mid && album.date);

  if (normalized.length === 0) {
    throw new Error("No albums matched the expected singer");
  }

  return {
    total: Number(data.data.total || normalized.length),
    albums: normalized
  };
}

function requestJson(url, attempt = 1) {
  const args = [
    "-fsSL",
    "--ipv4",
    "--retry", "2",
    "--retry-delay", "2",
    "--connect-timeout", "8",
    "--max-time", "25",
    "-H", "User-Agent: Mozilla/5.0 (compatible; KingTopSiteUpdater/1.0)",
    "-H", "Referer: https://y.qq.com/",
    url
  ];

  return runCurl(args, QQ_API_HOST, { maxBuffer: 1024 * 1024 * 8 })
    .then(({ stdout }) => JSON.parse(stdout))
    .catch((error) => {
      if (error instanceof SyntaxError) {
        throw new Error(`Unable to parse QQ Music JSON: ${error.message}`);
      }

      if (attempt < 2) {
        return new Promise((resolve) => {
          setTimeout(resolve, attempt * 1500);
        }).then(() => requestJson(url, attempt + 1));
      }

      throw error;
    });
}

async function resolveHost(host) {
  if (HOST_RESOLVE[host]) {
    return HOST_RESOLVE[host];
  }

  const addresses = await resolver.resolve4(host);
  if (!addresses.length) {
    throw new Error(`Public DNS returned no A records for ${host}`);
  }

  HOST_RESOLVE[host] = addresses[0];
  console.log(`Resolved ${host} via public DNS: ${HOST_RESOLVE[host]}`);
  return HOST_RESOLVE[host];
}

function isDnsFailure(error) {
  const text = `${error?.message || ""}\n${error?.stderr || ""}`;
  return error?.code === 6 || text.includes("Could not resolve host") || text.includes("Resolving timed out");
}

async function runCurl(args, host, options = {}, allowDnsFallback = true) {
  appendResolveArg(args, host);

  try {
    return await execFileAsync("curl", args, options);
  } catch (error) {
    if (!allowDnsFallback || !isDnsFailure(error)) {
      throw error;
    }

    await resolveHost(host);
    return runCurl(args, host, options, false);
  }
}

function appendResolveArg(args, host) {
  const ip = HOST_RESOLVE[host];

  if (ip && !args.includes("--resolve")) {
    args.splice(1, 0, "--resolve", `${host}:443:${ip}`);
  }
}

function albumUrl(mid) {
  return `https://y.qq.com/n/ryqq/albumDetail/${encodeURIComponent(mid)}`;
}

function coverFileName(mid) {
  return `${String(mid).replace(/[^a-zA-Z0-9_-]/g, "")}.jpg`;
}

function localCoverSrc(mid) {
  return `${COVER_PUBLIC_DIR}/${coverFileName(mid)}`;
}

function remoteCoverUrl(mid, size) {
  return `https://y.gtimg.cn/music/photo_new/T002R${size}x${size}M000${encodeURIComponent(mid)}_1.jpg`;
}

async function fileExists(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile() && stats.size > 1024;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

async function downloadCover(album) {
  await fs.mkdir(COVER_DIR, { recursive: true });

  const finalPath = path.join(COVER_DIR, coverFileName(album.mid));
  if (await fileExists(finalPath)) {
    return false;
  }

  const tempPath = `${finalPath}.tmp`;
  let lastError;

  for (const size of COVER_SIZES) {
    const args = [
      "-fsSL",
      "--ipv4",
      "--retry", "2",
      "--retry-delay", "2",
      "--connect-timeout", "8",
      "--max-time", "35",
      "-H", "User-Agent: Mozilla/5.0 (compatible; KingTopSiteUpdater/1.0)",
      "-H", "Referer: https://y.qq.com/",
      "-o", tempPath,
      remoteCoverUrl(album.mid, size)
    ];
    appendResolveArg(args, QQ_COVER_HOST);

    try {
      await runCurl(args, QQ_COVER_HOST, { maxBuffer: 1024 * 256 });

      if (!(await fileExists(tempPath))) {
        throw new Error(`Downloaded cover for ${album.title} is empty`);
      }

      await fs.rename(tempPath, finalPath);
      return true;
    } catch (error) {
      lastError = error;
      await fs.rm(tempPath, { force: true });
    }
  }

  throw new Error(`Unable to download cover for ${album.title}: ${lastError?.message || "unknown error"}`);
}

async function downloadMissingCovers(albums) {
  let downloaded = 0;

  for (const album of albums) {
    if (await downloadCover(album)) {
      downloaded += 1;
      console.log(`Downloaded cover: ${album.title}`);
    }
  }

  return downloaded;
}

function renderStats(total, albums) {
  const years = albums
    .map((album) => Number(album.date.slice(0, 4)))
    .filter(Boolean)
    .sort((a, b) => a - b);
  const yearRange = years.length ? `${years[0]}-${years[years.length - 1]}` : "持续更新";
  const languages = [...new Set(albums.map((album) => album.language).filter(Boolean))];
  const types = [...new Set(albums.map((album) => album.type).filter(Boolean))];

  return [
    `<div class="metric"><strong>${total}</strong><span>QQ 音乐公开专辑，歌手名：${SINGER_NAME}</span></div>`,
    `<div class="metric"><strong>${yearRange}</strong><span>从同名 Demo 到持续 AI 音乐专辑发布</span></div>`,
    `<div class="metric"><strong>${languages.length}</strong><span>主要语种：${escapeHtml(languages.join("、"))}</span></div>`,
    `<div class="metric"><strong>${types.length}</strong><span>作品形态：${escapeHtml(types.join("、"))}</span></div>`
  ].join("\n");
}

function renderAlbumCard(album) {
  const title = escapeHtml(album.title);
  const attrTitle = escapeAttr(album.title);
  const track = escapeHtml(album.track);
  const count = album.count > 0 ? `${album.count} 首` : "曲目";

  return [
    `<a class="album-card" href="${albumUrl(album.mid)}" target="_blank" rel="noopener">`,
    `  <div class="cover"><img src="${localCoverSrc(album.mid)}" alt="${attrTitle} 封面" loading="lazy"></div>`,
    `  <div class="album-body"><div class="album-meta"><span class="pill">${escapeHtml(album.date)}</span><span class="pill">${escapeHtml(album.type)}</span><span class="pill">${escapeHtml(count)}</span></div><h3>${title}</h3><p>代表曲：${track}</p><span class="qq-link">QQ音乐专辑页</span></div>`,
    `</a>`
  ].join("\n");
}

function renderHeroCovers(albums) {
  return albums.slice(0, HERO_FLOAT_CLASSES.length).map((album, index) => {
    const title = escapeHtml(album.title);

    return `<a class="cover-float ${HERO_FLOAT_CLASSES[index]}" href="${albumUrl(album.mid)}" target="_blank" rel="noopener"><img src="${localCoverSrc(album.mid)}" alt=""><strong>${title}</strong></a>`;
  }).join("\n");
}

async function main() {
  const { total, albums } = await fetchAlbums();
  const downloaded = await downloadMissingCovers(albums);
  const page = await fs.readFile(MUSIC_PAGE, "utf8");
  const withHero = replaceGeneratedBlock(page, "HERO", renderHeroCovers(albums));
  const withStats = replaceGeneratedBlock(withHero, "STATS", renderStats(total, albums));
  const withAlbums = replaceGeneratedBlock(withStats, "ALBUMS", albums.map(renderAlbumCard).join("\n"));

  await fs.writeFile(MUSIC_PAGE, withAlbums);
  console.log(`Updated ${path.relative(ROOT, MUSIC_PAGE)} with ${albums.length} albums; QQ Music total=${total}; downloaded covers=${downloaded}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
