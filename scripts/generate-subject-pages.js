#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

const APPS = [
  {
    id: "wordpulse",
    name: "WordPulse",
    subtitle: "初高中英语词汇",
    appId: "6767762376",
    icon: "assets/wordpulse.png",
    theme: { brand: "#2563eb", brandDark: "#1e3a8a", brandRgb: "37, 99, 235", accent: "#14b8a6", accentRgb: "20, 184, 166", warm: "#f59e0b", warmRgb: "245, 158, 11" },
    title: "看到陌生长难词，拆开词根也能猜出意思。",
    description: "围绕词根词缀、词源宇宙、先猜后揭、懒人模式和纯离线学习，把背单词从记忆负担变成破译体验。",
    heroTag: "初高中英语词汇 · 词根破译",
    heroLead: "不是再给学生一串要死记的单词，而是把词根、词缀、词源和例句做成可练习的破译流程。遇到生词先猜、再揭晓、再复现，逐步建立长难词的拆解直觉。",
    badges: ["330+ 词根词缀", "5800+ 核心词汇", "词源故事", "离线学习"],
    metrics: [
      ["330+", "词根词缀被整理成可复习的词族网络"],
      ["5800+", "初高中核心词汇覆盖常见阅读与考试场景"],
      ["4 步", "先猜含义、拆构词、看故事、再复现"],
      ["0 登录", "离线优先，不注册也能开始学习"]
    ],
    preview: {
      label: "今日破译任务",
      main: "thermo + meter",
      normalLabel: "死记单词",
      normalValue: "孤立背诵",
      smartLabel: "词根破译",
      smartValue: "成片理解",
      weapons: ["词根词缀", "词源宇宙", "先猜后揭", "懒人复习"]
    },
    methods: [
      ["拆", "词根词缀", "把长词拆成前缀、词根、后缀，先建立可解释的结构。"],
      ["猜", "先猜后揭", "看到陌生词先用结构和语境推断，再揭晓答案校正直觉。"],
      ["连", "词源宇宙", "把同源词、故事和例句串起来，减少孤立记忆。"],
      ["复", "懒人模式", "每天少量滚动复现，把高频词和易忘词优先推回来。"],
      ["测", "阅读迁移", "把词义、词性、前后缀判断放回句子里练。"],
      ["存", "本地记录", "学习记录优先保存在本地，打开就能继续。"]
    ],
    duel: {
      title: "从背词表，换成破译流程",
      lead: "WordPulse 的核心不是把词库塞得更大，而是让学生看到一个陌生词时，有一套能立刻执行的判断动作。",
      normalTitle: "常规背法",
      normalValue: "看到就查",
      normalText: "词义、拼写、例句分散记忆，复习时很难迁移到新词。",
      smartTitle: "破译法",
      smartValue: "先拆再猜",
      smartText: "先识别构词线索，再用词源和例句确认，形成可迁移的猜词能力。"
    },
    chapters: ["词根词缀", "高频词族", "词源故事", "阅读猜词", "易混词", "派生词", "例句训练", "错词复现"],
    workflow: [
      ["识别结构", "先找前缀、词根、后缀和词性线索。"],
      ["大胆猜义", "根据结构和语境给出初步判断。"],
      ["揭晓校正", "看释义、词源和例句，把错因标出来。"],
      ["间隔复现", "把易忘词自动送回后续练习。"]
    ]
  },
  {
    id: "mathapex",
    name: "MathApex",
    subtitle: "初高中数学",
    appId: "6778461030",
    icon: "assets/mathapex.png",
    theme: { brand: "#7c3aed", brandDark: "#4c1d95", brandRgb: "124, 58, 237", accent: "#06b6d4", accentRgb: "6, 182, 212", warm: "#f59e0b", warmRgb: "245, 158, 11" },
    title: "用高阶思维打通初高中数学关键题。",
    description: "常规解与降维秒杀双解对照，结合公式宇宙、错题复习、数学英雄与数学发现。",
    heroTag: "初高中数学 · 降维解题",
    heroLead: "同一道压轴题，普通解法一步步推，高手先识别结构。MathApex 把常规解与降维思路放在同一个屏幕里，让学生看见关键转折点在哪里。",
    badges: ["595 道压轴题", "150+ 公式", "双解对照", "错题复习"],
    metrics: [
      ["595", "道关键题覆盖函数、几何、数列与综合压轴场景"],
      ["150+", "常用公式与模型被整理成可检索宇宙"],
      ["2 解", "常规推导与降维思路同台对照"],
      ["0 登录", "题目、公式与复习路径离线优先"]
    ],
    preview: {
      label: "压轴题双解 PK",
      main: "函数零点 + 参数范围",
      normalLabel: "常规推导",
      normalValue: "7 步",
      smartLabel: "降维识局",
      smartValue: "3 步",
      weapons: ["数形结合", "参数分离", "对称结构", "构造函数"]
    },
    methods: [
      ["题", "压轴题库", "高频难题按模型、章节和思维方式组织。"],
      ["解", "双解对照", "先保留常规解，再展示更短的结构化解法。"],
      ["式", "公式宇宙", "把公式、变形、适用条件和典型题放在一起。"],
      ["错", "错题复习", "错题不只是收藏，而是回到对应模型继续练。"],
      ["史", "数学发现", "用数学家的发现故事增强理解和记忆。"],
      ["迁", "模型迁移", "从一道题迁移到一类题，减少机械刷题。"]
    ],
    duel: {
      title: "同题双解，把高手视角显性化",
      lead: "学生真正缺的往往不是答案，而是不知道为什么高手第一眼就能换一个方向。",
      normalTitle: "常规解",
      normalValue: "逐步计算",
      normalText: "适合兜底，但步骤长，容易在中途被代数细节拖住。",
      smartTitle: "降维解",
      smartValue: "识别结构",
      smartText: "先抓模型、对称和临界条件，再用更短路径拿下关键分。"
    },
    chapters: ["函数", "几何", "数列", "导数", "概率", "三角", "圆锥曲线", "综合压轴"],
    workflow: [
      ["读题定型", "先判断题目属于哪类核心模型。"],
      ["常规兜底", "保留完整推导路径，确保答案可复盘。"],
      ["降维突破", "寻找对称、构造、换元或图像视角。"],
      ["错因回流", "把错题挂回模型和公式，后续优先复习。"]
    ]
  },
  {
    id: "physicsapex",
    name: "PhysicsApex",
    subtitle: "初高中物理",
    appId: "6779031451",
    icon: "assets/physapex.png",
    theme: { brand: "#4338ca", brandDark: "#1e1b4b", brandRgb: "67, 56, 202", accent: "#06b6d4", accentRgb: "6, 182, 212", warm: "#f59e0b", warmRgb: "245, 158, 11" },
    title: "降维秒杀高考物理压轴题。",
    description: "同一道压轴题，常规解法耗时 1 分 48 秒，用对的武器 38 秒拿下。双解同台 PK、核心定律、间隔复习、全套高考章节。",
    heroTag: "初高中物理 · 压轴题武器库",
    heroLead: "每道高频压轴题都把常规解与降维秒杀左右对照。学生不是只看答案，而是学会判断什么时候用守恒、对称、等效、极限和图像这些更高阶的物理武器。",
    badges: ["双解同台 PK", "40+ 核心定律", "SM-2 间隔复习", "全套高考章节"],
    metrics: [
      ["1:48", "常规解法完整推导的典型耗时示例"],
      ["0:38", "识别武器后完成关键突破的示例路径"],
      ["40+", "核心定律、模型和解题武器沉淀"],
      ["0 登录", "免费下载，无需注册即可开始训练"]
    ],
    preview: {
      label: "压轴题武器选择",
      main: "带电粒子 + 复合场",
      normalLabel: "常规解",
      normalValue: "1 分 48 秒",
      smartLabel: "降维秒杀",
      smartValue: "38 秒",
      weapons: ["守恒", "对称", "等效", "图像法", "极限法"]
    },
    methods: [
      ["武", "物理武器库", "把守恒、对称、等效、图像和极限法整理成可调用的解题武器。"],
      ["题", "压轴题双解", "同一道题先看常规解，再看更短的降维路径。"],
      ["图", "考点地图", "力学、电磁、热学、光学按章节和模型建立地图。"],
      ["诊", "错因诊断", "把错题归因到读题、受力、过程、公式或计算问题。"],
      ["复", "间隔复习", "按记忆曲线把高错率题和定律推回训练。"],
      ["沙", "互动沙盘", "用可观察的变化帮助学生把公式还原成现象。"]
    ],
    duel: {
      title: "常规解打底，降维解提速",
      lead: "PhysicsApex 保留完整推导，不牺牲严谨；同时把真正提分的识局动作放大。",
      normalTitle: "常规解法",
      normalValue: "1 分 48 秒",
      normalText: "逐段受力、列式、代入，能得到答案，但速度和稳定性受细节影响。",
      smartTitle: "降维秒杀",
      smartValue: "38 秒",
      smartText: "先判断守恒量和等效过程，把复杂计算压缩成关键关系。"
    },
    chapters: ["运动学", "力与平衡", "牛顿定律", "功和能", "动量", "电场", "磁场", "复合场"],
    workflow: [
      ["判过程", "先分清对象、状态、过程和约束条件。"],
      ["选武器", "在守恒、对称、等效、图像等方法中选择。"],
      ["双解对照", "用常规解校验，用降维解提炼关键转折。"],
      ["回炉复习", "把错因和章节标签写回复习队列。"]
    ]
  },
  {
    id: "chemapex",
    name: "ChemApex",
    subtitle: "初高中化学",
    appId: "6780327495",
    icon: "assets/chemapex.png",
    theme: { brand: "#059669", brandDark: "#064e3b", brandRgb: "5, 150, 105", accent: "#22c55e", accentRgb: "34, 197, 94", warm: "#f59e0b", warmRgb: "245, 158, 11" },
    title: "看见反应背后的守恒棋局。",
    description: "从元素星图、方程式剧本库到化学神探，把推断题、守恒题和实验题拆成可复用的识局方法。",
    heroTag: "初高中化学 · 反应识局",
    heroLead: "化学高分不是背更多零散方程式，而是快速判断元素去向、电荷守恒、物料守恒和实验现象之间的关系。",
    badges: ["元素星图", "守恒战例", "方程式库", "实验推断"],
    metrics: [
      ["4 类", "元素、离子、氧化还原、实验推断核心场景"],
      ["3 守恒", "质量、电荷、电子得失作为解题底层规则"],
      ["1 库", "常见方程式与反应条件集中复盘"],
      ["0 登录", "离线优先，随时打开复习"]
    ],
    preview: {
      label: "化学神探",
      main: "未知溶液 + 离子推断",
      normalLabel: "硬背现象",
      normalValue: "易混",
      smartLabel: "守恒识局",
      smartValue: "可推",
      weapons: ["元素星图", "电荷守恒", "氧化还原", "实验现象"]
    },
    methods: [
      ["元", "元素星图", "把元素性质、常见价态和反应路径放在一张图里。"],
      ["恒", "守恒战例", "用质量、电荷、电子守恒处理计算和推断题。"],
      ["式", "方程式剧本库", "按反应类型、条件和现象组织方程式。"],
      ["探", "化学神探", "把实验现象变成一步步排除和定位。"],
      ["错", "易混辨析", "沉淀、气体、颜色、条件等高频混淆集中复盘。"],
      ["迁", "题型迁移", "从一道推断题抽出可复用的判断链。"]
    ],
    duel: {
      title: "从背反应，换成推反应",
      lead: "化学题最怕现象多、条件散。ChemApex 把这些信息收束到守恒和反应路径上。",
      normalTitle: "常规记忆",
      normalValue: "现象堆叠",
      normalText: "记住了很多颜色和沉淀，但遇到综合推断还是容易乱。",
      smartTitle: "守恒识局",
      smartValue: "关系推导",
      smartText: "先锁定元素和价态变化，再用守恒关系排除不可能项。"
    },
    chapters: ["元素化合物", "离子反应", "氧化还原", "化学平衡", "电化学", "有机基础", "实验探究", "综合推断"],
    workflow: [
      ["定位元素", "先确定涉及元素、价态和可能产物。"],
      ["建立守恒", "质量、电荷、电子得失优先列关系。"],
      ["匹配现象", "把颜色、气体、沉淀和条件挂到反应路径。"],
      ["复盘错因", "把漏看条件和易混现象送回复习。"]
    ]
  },
  {
    id: "bioapex",
    name: "BioApex",
    subtitle: "初高中生物",
    appId: "6780727579",
    icon: "assets/bioapex.png",
    theme: { brand: "#16a34a", brandDark: "#14532d", brandRgb: "22, 163, 74", accent: "#0ea5e9", accentRgb: "14, 165, 233", warm: "#f59e0b", warmRgb: "245, 158, 11" },
    title: "把背不完的生物变成逐个掌握的系统。",
    description: "过程剧场、考点图谱、遗传神探、稳态回路和易混辨析，帮助学生看见生命系统如何运转。",
    heroTag: "初高中生物 · 生命系统图谱",
    heroLead: "生物不是把概念碎片背到考试前，而是看懂过程、回路、层级和变量关系。BioApex 把这些看不见的系统做成可复盘的路径。",
    badges: ["过程剧场", "遗传神探", "稳态回路", "易混辨析"],
    metrics: [
      ["5 类", "细胞、遗传、稳态、生态、实验核心模块"],
      ["1 图", "考点与过程串成生命系统图谱"],
      ["4 步", "变量、过程、结果、例外逐层拆解"],
      ["0 登录", "离线学习记录，打开即可继续"]
    ],
    preview: {
      label: "过程剧场",
      main: "减数分裂 + 遗传规律",
      normalLabel: "背概念",
      normalValue: "易串",
      smartLabel: "看过程",
      smartValue: "可追踪",
      weapons: ["过程剧场", "遗传神探", "稳态回路", "实验变量"]
    },
    methods: [
      ["剧", "过程剧场", "把光合、呼吸、分裂、免疫等过程做成连续场景。"],
      ["谱", "考点图谱", "用层级图连接概念、过程、实验和题型。"],
      ["遗", "遗传神探", "从亲本、子代比例和基因型一步步推断。"],
      ["稳", "稳态回路", "把神经、体液、免疫调节放在反馈回路里理解。"],
      ["辨", "易混辨析", "集中处理概念相似、过程相邻的高频混淆。"],
      ["题", "解题武器", "把实验变量、对照组和结论表达训练成流程。"]
    ],
    duel: {
      title: "从背名词，换成看系统",
      lead: "BioApex 关注的是概念之间如何发生作用，而不是让学生孤立记更多名词。",
      normalTitle: "碎片记忆",
      normalValue: "名词很多",
      normalText: "概念背过，但遇到过程图、实验题和遗传推断时容易断线。",
      smartTitle: "系统理解",
      smartValue: "关系清楚",
      smartText: "从结构到功能，从变量到结果，把题目还原为生命系统变化。"
    },
    chapters: ["细胞结构", "代谢过程", "遗传规律", "变异进化", "稳态调节", "生态系统", "实验设计", "综合推断"],
    workflow: [
      ["找层级", "先判断题目处在分子、细胞、个体还是生态层级。"],
      ["追过程", "按时间线或反馈链追踪变化。"],
      ["控变量", "实验题先看自变量、因变量和对照。"],
      ["辨易混", "把相邻概念和典型陷阱集中回看。"]
    ]
  },
  {
    id: "chinapex",
    name: "ChinApex",
    subtitle: "初高中语文",
    appId: "6781556016",
    icon: "assets/chinapex.png",
    theme: { brand: "#dc2626", brandDark: "#7f1d1d", brandRgb: "220, 38, 38", accent: "#f59e0b", accentRgb: "245, 158, 11", warm: "#0ea5e9", warmRgb: "14, 165, 233" },
    title: "让语文从玄学变成可操作的采分点训练。",
    description: "原文定位、文言解码、默写星图、作文工坊和阅卷人之眼，让学生知道每一分到底从哪里来。",
    heroTag: "初高中语文 · 采分点训练",
    heroLead: "语文不是只能靠感觉。ChinApex 把阅读、文言、诗歌、默写和作文拆成定位、解释、组织和表达这些可练动作。",
    badges: ["采分点", "作文工坊", "文言解码", "阅卷人之眼"],
    metrics: [
      ["4 类", "现代文、文言文、诗歌、作文核心题型"],
      ["1 套", "从原文定位到答案表达的采分流程"],
      ["多轮", "作文素材、结构和修改闭环训练"],
      ["0 登录", "本地学习记录，随时复盘"]
    ],
    preview: {
      label: "阅卷人之眼",
      main: "现代文阅读 + 作用题",
      normalLabel: "凭感觉写",
      normalValue: "不稳",
      smartLabel: "采分点",
      smartValue: "可控",
      weapons: ["原文定位", "题型模板", "文言解码", "作文工坊"]
    },
    methods: [
      ["定", "原文定位", "所有阅读题先回到文本证据，减少空泛表达。"],
      ["分", "采分点拆解", "把题型答案拆成对象、手法、内容、效果和情感。"],
      ["言", "文言解码", "词类活用、特殊句式、实虚词按规则训练。"],
      ["诗", "诗歌路径", "意象、手法、情感和时代背景串联分析。"],
      ["写", "作文工坊", "素材、结构、立意和语言表达分层训练。"],
      ["眼", "阅卷人视角", "让学生看懂答案为什么得分、哪里失分。"]
    ],
    duel: {
      title: "从感觉答题，换成采分答题",
      lead: "语文提分的关键是知道每一类题到底在考什么，以及答案里必须出现哪些信息。",
      normalTitle: "感觉表达",
      normalValue: "看懂但写不准",
      normalText: "学生知道大意，却不知道该写哪个角度，答案常常漏点。",
      smartTitle: "采分表达",
      smartValue: "按点组织",
      smartText: "先定位文本证据，再按题型拆出可得分的表达结构。"
    },
    chapters: ["现代文", "文言文", "古诗词", "名句默写", "语言运用", "作文素材", "作文结构", "阅读表达"],
    workflow: [
      ["审题型", "先判断题目问的是内容、手法、作用还是情感。"],
      ["找原文", "回到原文定位证据句和关键词。"],
      ["组采分点", "按题型模板组织必要角度。"],
      ["改表达", "用阅卷标准检查是否空泛、漏点或重复。"]
    ]
  },
  {
    id: "polapex",
    name: "PolApex",
    subtitle: "初高中道法 / 思想政治",
    appId: null,
    icon: "assets/polapex.png",
    status: "plan",
    theme: { brand: "#be123c", brandDark: "#881337", brandRgb: "190, 18, 60", accent: "#f97316", accentRgb: "249, 115, 22", warm: "#22c55e", warmRgb: "34, 197, 94" },
    title: "把政治从背了就忘，变成可检索、可迁移、可输出。",
    description: "围绕高权重记忆、主体职责、材料切片、答案工厂和选择题排雷。",
    heroTag: "初高中道法 / 思政 · 材料题输出",
    heroLead: "政治和道法不是把整本书背下来，而是快速识别主体、角度、关键词和材料触发点，再把答案组织成稳定表达。",
    badges: ["材料切片", "答案工厂", "主体定位", "选择题排雷"],
    metrics: [
      ["5 类", "国家、社会、公民、企业、青年等主体角度"],
      ["1 套", "材料切片到答案输出的结构化流程"],
      ["高频", "核心概念、时政表达和易混选项集中复盘"],
      ["准备中", "上架准备中，先提供产品介绍页"]
    ],
    preview: {
      label: "答案工厂",
      main: "材料分析 + 主体职责",
      normalLabel: "背段落",
      normalValue: "难迁移",
      smartLabel: "切材料",
      smartValue: "可输出",
      weapons: ["主体定位", "关键词库", "材料切片", "答案模板"]
    },
    methods: [
      ["主", "主体定位", "先分清国家、政府、社会、企业、公民等答题主体。"],
      ["切", "材料切片", "把材料拆成问题、原因、措施和意义。"],
      ["库", "关键词库", "高权重术语按专题和题型集中复盘。"],
      ["厂", "答案工厂", "按主体、角度和材料证据生成答题骨架。"],
      ["排", "选择题排雷", "针对绝对化、偷换概念和因果倒置做训练。"],
      ["迁", "时政迁移", "把时政语言转成课本概念和答题表达。"]
    ],
    duel: {
      title: "从背模板，换成材料驱动",
      lead: "真正稳定的政治答案不是套万能段落，而是让材料、主体和课本关键词对齐。",
      normalTitle: "机械背诵",
      normalValue: "套不上",
      normalText: "背了很多句子，但遇到新材料不知道从哪个角度写。",
      smartTitle: "材料切片",
      smartValue: "有抓手",
      smartText: "先识别主体和问题，再选择概念，最后组织分点答案。"
    },
    chapters: ["法治", "国情", "民主", "文化", "经济", "哲学", "政治制度", "时政综合"],
    workflow: [
      ["切材料", "把长材料切成问题、背景、措施和结果。"],
      ["定主体", "判断谁在行动、谁承担责任、谁受到影响。"],
      ["配概念", "匹配课本关键词和高频表达。"],
      ["写答案", "按观点、材料、意义或措施分点输出。"]
    ]
  },
  {
    id: "histapex",
    name: "HistApex",
    subtitle: "初高中历史",
    appId: "6783254820",
    icon: "assets/histapex.png",
    theme: { brand: "#92400e", brandDark: "#451a03", brandRgb: "146, 64, 14", accent: "#0ea5e9", accentRgb: "14, 165, 233", warm: "#eab308", warmRgb: "234, 179, 8" },
    title: "把时间线、制度线和材料题写法连成历史高分系统。",
    description: "用时间博物馆、史料相遇、历史规律、专题突破和答案模板，把背事件推进到解释变化与因果。",
    heroTag: "初高中历史 · 时间线与史料题",
    heroLead: "历史不是事件堆叠。HistApex 把时间、制度、人物、材料和因果串起来，让学生能解释变化，而不是只背发生了什么。",
    badges: ["时间博物馆", "史料题", "规律迁移", "答案模板"],
    metrics: [
      ["3 线", "时间线、制度线、专题线互相连接"],
      ["多题型", "原因、影响、变化、特点、评价集中训练"],
      ["史料", "材料题从出处、关键词和时代背景切入"],
      ["0 登录", "离线优先，章节和错题可持续复盘"]
    ],
    preview: {
      label: "史料相遇",
      main: "制度变迁 + 材料解读",
      normalLabel: "背事件",
      normalValue: "散",
      smartLabel: "连线索",
      smartValue: "能解释",
      weapons: ["时间线", "制度线", "史料题", "因果模板"]
    },
    methods: [
      ["时", "时间博物馆", "把重大事件放回同一条时间轴上比较。"],
      ["料", "史料相遇", "从材料出处、关键词和时代背景提取信息。"],
      ["律", "历史规律", "提炼制度变迁、社会转型和经济发展的规律。"],
      ["题", "专题突破", "按政治、经济、文化、外交等专题组织复习。"],
      ["答", "答案模板", "训练原因、影响、特点、评价等题型表达。"],
      ["迁", "中外关联", "把中国史和世界史放在同一时代背景下理解。"]
    ],
    duel: {
      title: "从记事件，换成解释变化",
      lead: "历史题要得分，关键是把材料、时代和问题类型连接起来。",
      normalTitle: "事件记忆",
      normalValue: "知道发生",
      normalText: "能说出事件名称，但很难说明原因、特点和影响。",
      smartTitle: "结构解释",
      smartValue: "说清变化",
      smartText: "用时间线定位时代，再用专题线解释因果和趋势。"
    },
    chapters: ["中国古代", "中国近代", "中国现代", "世界古代", "世界近代", "世界现代", "制度史", "经济文化史"],
    workflow: [
      ["定时代", "先把材料放回具体时间和背景。"],
      ["抓关键词", "从史料中提取制度、人物、阶层和变化。"],
      ["连因果", "把原因、过程、影响和评价连成链条。"],
      ["写模板", "按题型输出有层次的历史表达。"]
    ]
  },
  {
    id: "geogapex",
    name: "GeogApex",
    subtitle: "初高中地理",
    appId: "6783594491",
    icon: "assets/geogapex.png",
    theme: { brand: "#0f766e", brandDark: "#134e4a", brandRgb: "15, 118, 110", accent: "#38bdf8", accentRgb: "56, 189, 248", warm: "#f97316", warmRgb: "249, 115, 22" },
    title: "把读图、定位、拆因果和综合题表达练成稳定流程。",
    description: "围绕空间定位、图表判读、自然过程、人文区位、区域发展和答案工厂，补齐选择题与综合题两条线。",
    heroTag: "初高中地理 · 读图定位与综合题",
    heroLead: "地理高分来自读图定位、过程推演和区位分析。GeogApex 把这些动作拆成步骤，让学生从图中提信息，再把因果写完整。",
    badges: ["图表判读", "区位矩阵", "综合题模板", "区域分析"],
    metrics: [
      ["2 线", "选择题读图与综合题表达两条线并行"],
      ["4 层", "位置、自然、人文、发展逐层分析"],
      ["多图", "地图、气候图、统计图、剖面图集中训练"],
      ["0 登录", "离线内容和本地进度优先"]
    ],
    preview: {
      label: "读图定位",
      main: "区域图 + 区位分析",
      normalLabel: "看图找答案",
      normalValue: "漏信息",
      smartLabel: "定位拆因果",
      smartValue: "成流程",
      weapons: ["空间定位", "图表判读", "区位矩阵", "综合题模板"]
    },
    methods: [
      ["定", "空间定位", "经纬度、海陆位置、地形和区域特征先定位。"],
      ["图", "图表判读", "训练地图、气候图、统计图、等值线图读取。"],
      ["过", "自然过程", "把大气、水文、地貌、土壤过程串成因果链。"],
      ["位", "人文区位", "产业、交通、市场、政策等因素矩阵化分析。"],
      ["域", "区域发展", "从资源、环境、产业和治理看区域问题。"],
      ["答", "答案工厂", "综合题按条件、过程、影响、措施组织表达。"]
    ],
    duel: {
      title: "从看懂地图，走到写出答案",
      lead: "地理题往往不是没知识点，而是图上信息没有转成完整因果表达。",
      normalTitle: "直接判断",
      normalValue: "信息散落",
      normalText: "看到一些图例和数据，但不知道哪些是答题关键。",
      smartTitle: "流程分析",
      smartValue: "因果完整",
      smartText: "先定位，再读图，再拆自然与人文因素，最后组织答案。"
    },
    chapters: ["地图定位", "地球运动", "大气过程", "水文地貌", "自然环境", "人口城市", "产业区位", "区域发展"],
    workflow: [
      ["空间定位", "先用经纬度、地形和区域特征确定位置。"],
      ["读取图表", "把图例、数值、变化趋势和异常点标出来。"],
      ["拆因果", "按自然因素和人文因素解释现象。"],
      ["组织表达", "综合题按条件、过程、影响和措施分点写。"]
    ]
  },
  {
    id: "engapex",
    name: "EngApex",
    subtitle: "初高中英语",
    appId: null,
    icon: null,
    status: "plan",
    theme: { brand: "#0284c7", brandDark: "#0c4a6e", brandRgb: "2, 132, 199", accent: "#8b5cf6", accentRgb: "139, 92, 246", warm: "#f59e0b", warmRgb: "245, 158, 11" },
    title: "把语法填空、完形填空、阅读理解练成系统能力。",
    description: "围绕句法解码、完形线索、阅读题型和写作框架，让英语从语感变成可操作的解题流程。",
    heroTag: "初高中英语 · 句法阅读与写作",
    heroLead: "EngApex 面向英语综合题型：看懂句子结构、抓住完形线索、识别阅读题型，再把写作表达组织成稳定框架。",
    badges: ["句法解码", "完形线索", "阅读题型", "写作框架"],
    metrics: [
      ["4 类", "语法填空、完形、阅读、写作核心题型"],
      ["1 套", "从句法到题型的可执行解题流程"],
      ["多场景", "长难句、语篇线索和写作表达集中训练"],
      ["准备中", "上架准备中，先展示产品方向"]
    ],
    preview: {
      label: "句法解码",
      main: "长难句 + 阅读推断",
      normalLabel: "凭语感",
      normalValue: "不稳定",
      smartLabel: "拆结构",
      smartValue: "可迁移",
      weapons: ["句法解码", "完形线索", "阅读题型", "写作框架"]
    },
    methods: [
      ["句", "句法解码", "主谓宾、从句、非谓语和修饰关系一步步拆。"],
      ["完", "完形线索", "从逻辑、复现、搭配和情感色彩找答案。"],
      ["读", "阅读题型", "细节、推断、主旨、态度题按题型训练。"],
      ["写", "写作框架", "开头、扩展、转折、总结和高级表达分层积累。"],
      ["词", "词汇迁移", "连接 WordPulse 的词根能力，服务阅读和写作。"],
      ["错", "错因复盘", "把语法错、理解错和定位错分开复习。"]
    ],
    duel: {
      title: "从语感，换成可解释流程",
      lead: "英语题真正稳定的提分点，是让学生知道自己为什么选这个答案。",
      normalTitle: "凭语感",
      normalValue: "时好时坏",
      normalText: "能读个大概，但遇到长难句和干扰项时容易摇摆。",
      smartTitle: "拆结构",
      smartValue: "有依据",
      smartText: "先拆句法，再定位语篇线索，最后按题型排除干扰。"
    },
    chapters: ["句子成分", "从句", "非谓语", "语法填空", "完形填空", "阅读理解", "七选五", "写作表达"],
    workflow: [
      ["拆句子", "先找主干，再处理修饰和从句。"],
      ["找线索", "完形和阅读优先定位上下文依据。"],
      ["判题型", "区分细节、推断、主旨和态度题。"],
      ["练输出", "把词汇、句型和段落结构迁移到写作。"]
    ]
  }
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

function appStoreUrl(app) {
  return app.appId ? `https://apps.apple.com/cn/app/${app.appId}` : "";
}

function subjectUrl(app) {
  return `${app.id}.html`;
}

function iconHtml(app, className = "", alt = "") {
  if (app.icon) {
    return `<img${className ? ` class="${className}"` : ""} src="${app.icon}" alt="${escapeAttr(alt)}">`;
  }

  return `<span${className ? ` class="${className} letter-icon"` : ` class="letter-icon"`} aria-hidden="true">${escapeHtml(app.name.charAt(0))}</span>`;
}

function renderStoreButton(app, classes = "button primary") {
  const url = appStoreUrl(app);
  if (url) {
    return `<a class="${classes}" href="${url}" target="_blank" rel="noopener">免费下载</a>`;
  }

  return `<a class="${classes}" href="mailto:botonwa83@gmail.com?subject=${encodeURIComponent(app.name)}%20上架提醒">获取上架提醒</a>`;
}

function renderSubjectPage(app) {
  const related = APPS
    .filter((item) => item.id !== app.id)
    .map((item) => `
        <a class="subject-link" href="${subjectUrl(item)}">
          ${iconHtml(item, "", `${item.name} 图标`)}
          <span class="subject-copy"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.subtitle)}</span></span>
        </a>`)
    .join("");

  const storeMeta = appStoreUrl(app);
  const canonical = `${app.id}.html`;
  const themeStyle = [
    `--brand: ${app.theme.brand}`,
    `--brand-dark: ${app.theme.brandDark}`,
    `--brand-rgb: ${app.theme.brandRgb}`,
    `--accent: ${app.theme.accent}`,
    `--accent-rgb: ${app.theme.accentRgb}`,
    `--warm: ${app.theme.warm}`,
    `--warm-rgb: ${app.theme.warmRgb}`
  ].join("; ");

  return `<!doctype html>
<html lang="zh-Hans">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeAttr(`${app.name}：${app.description}`)}">
  <meta name="theme-color" content="${app.theme.brand}">
  <meta property="og:title" content="${escapeAttr(`${app.name} · ${app.title}`)}">
  <meta property="og:description" content="${escapeAttr(app.description)}">
  ${app.icon ? `<meta property="og:image" content="${escapeAttr(app.icon)}">` : ""}
  <meta property="og:type" content="website">
  <title>${escapeHtml(app.name)} · ${escapeHtml(app.title)}</title>
  <link rel="stylesheet" href="assets/subject-landing.css">
</head>
<body style="${themeStyle}">
  <header class="landing-header">
    <nav class="landing-nav" aria-label="${escapeAttr(app.name)} 导航">
      <a class="brand" href="${canonical}" aria-label="${escapeAttr(app.name)} 首页">
        ${iconHtml(app, "", `${app.name} 图标`)}
        <span>${escapeHtml(app.name)}</span>
      </a>
      <div class="nav-links">
        <a href="#method">方法</a>
        <a href="#chapters">章节</a>
        <a href="#workflow">流程</a>
        <a href="#related">全部学科</a>
        <a href="index.html">King Top</a>
      </div>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="wrap hero-inner">
        <div>
          <p class="eyebrow">${escapeHtml(app.heroTag)}</p>
          <h1>${escapeHtml(app.title)}</h1>
          <p class="hero-lead">${escapeHtml(app.heroLead)}</p>
          <div class="hero-actions">
            ${renderStoreButton(app)}
            <a class="button secondary" href="#method">查看训练方法</a>
          </div>
          <div class="badge-row" aria-label="核心卖点">
            ${app.badges.map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`).join("")}
          </div>
        </div>

        <div class="hero-visual" aria-label="${escapeAttr(app.name)} 产品预览">
          <div class="app-icon-plate">
            ${iconHtml(app, "", `${app.name} 图标`)}
            <span>${escapeHtml(app.name)}</span>
          </div>
          <div class="phone-frame">
            <div class="phone-content">
              <div class="phone-top">
                <div class="phone-title">
                  <strong>${escapeHtml(app.name)}</strong>
                  <span>${escapeHtml(app.subtitle)}</span>
                </div>
                <span class="status-dot">${app.appId ? "已上线" : "准备中"}</span>
              </div>
              <div class="screen-card">
                <div class="label">${escapeHtml(app.preview.label)}</div>
                <p class="screen-main">${escapeHtml(app.preview.main)}</p>
                <div class="compare-bars">
                  <div class="bar normal"><span>${escapeHtml(app.preview.normalLabel)}</span><strong>${escapeHtml(app.preview.normalValue)}</strong></div>
                  <div class="bar smart"><span>${escapeHtml(app.preview.smartLabel)}</span><strong>${escapeHtml(app.preview.smartValue)}</strong></div>
                </div>
              </div>
              <div class="screen-card">
                <div class="label">可调用武器</div>
                <div class="weapon-list">
                  ${app.preview.weapons.map((weapon) => `<span>${escapeHtml(weapon)}</span>`).join("")}
                </div>
              </div>
              <div class="screen-card">
                <div class="label">今日复习</div>
                <p class="screen-main">错因回炉 + 间隔复现</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="metric-band">
      <div class="wrap">
        <div class="metric-grid" aria-label="${escapeAttr(app.name)} 数据概览">
          ${app.metrics.map(([value, label]) => `<div class="metric"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="method">
      <div class="wrap">
        <div class="section-head">
          <h2>不是堆内容，是把能力拆成动作</h2>
          <p class="lead">${escapeHtml(app.description)}</p>
        </div>
        <div class="feature-grid">
          ${app.methods.map(([mark, title, text]) => `
          <article class="method-card">
            <div class="method-icon">${escapeHtml(mark)}</div>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(text)}</p>
          </article>`).join("")}
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="wrap split">
        <div>
          <p class="eyebrow">核心差异</p>
          <h2>${escapeHtml(app.duel.title)}</h2>
          <p class="lead">${escapeHtml(app.duel.lead)}</p>
        </div>
        <div class="duel-panel">
          <div class="duel-row">
            <div class="duel-box">
              <strong>${escapeHtml(app.duel.normalTitle)}</strong>
              <div class="value">${escapeHtml(app.duel.normalValue)}</div>
              <p>${escapeHtml(app.duel.normalText)}</p>
            </div>
            <div class="duel-box">
              <strong>${escapeHtml(app.duel.smartTitle)}</strong>
              <div class="value">${escapeHtml(app.duel.smartValue)}</div>
              <p>${escapeHtml(app.duel.smartText)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="chapters">
      <div class="wrap">
        <div class="section-head">
          <h2>覆盖章节与训练场景</h2>
          <p class="lead">每个模块都服务一个目标：让学生知道题目属于哪里、该调用什么方法、错了应该回到哪里复习。</p>
        </div>
        <div class="chapter-grid">
          ${app.chapters.map((chapter) => `<div class="chapter">${escapeHtml(chapter)}</div>`).join("")}
        </div>
      </div>
    </section>

    <section class="section alt" id="workflow">
      <div class="wrap">
        <div class="section-head">
          <h2>一次训练的完整路径</h2>
          <p class="lead">从看题、识别、操作到复盘，尽量让每一步都有明确动作，而不是只给学生一个最终答案。</p>
        </div>
        <div class="workflow-grid">
          ${app.workflow.map(([title, text], index) => `
          <article class="workflow-item">
            <span class="step">${index + 1}</span>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(text)}</p>
          </article>`).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="cta-band">
          <div>
            <h2>${app.appId ? "打开 App Store，开始训练" : "产品上架准备中"}</h2>
            <p>${app.appId ? `${app.name} 已配置中国区 App Store 下载入口。` : `${app.name} 已纳入 King Top 教育产品矩阵，上架后会补充公开下载入口。`}</p>
          </div>
          ${renderStoreButton(app, "button secondary")}
        </div>
      </div>
    </section>

    <section class="section" id="related">
      <div class="wrap">
        <div class="section-head">
          <h2>全部学科广告页</h2>
          <p class="lead">同一套产品方法，分别落到初高中英语、数理化生、语政史地。</p>
        </div>
        <div class="related-grid">
          ${related}
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="wrap">
      <span>© 2024-2026 King Top / Top King. All rights reserved.</span>
      <span>${storeMeta ? `<a href="${storeMeta}" target="_blank" rel="noopener">App Store</a>` : "Built for GitHub Pages."}</span>
    </div>
  </footer>

  <script>
    (() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const revealTargets = document.querySelectorAll(".metric, .method-card, .duel-panel, .chapter, .workflow-item, .cta-band, .subject-link");

      if (!reduceMotion && "IntersectionObserver" in window) {
        revealTargets.forEach((el, index) => {
          el.classList.add("reveal");
          el.style.transitionDelay = \`\${Math.min((index % 6) * 50, 250)}ms\`;
        });

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.14 });

        revealTargets.forEach((el) => observer.observe(el));
      }

      const hero = document.querySelector(".hero");
      const visual = document.querySelector(".hero-visual");
      if (!reduceMotion && finePointer && hero && visual) {
        hero.addEventListener("pointermove", (event) => {
          const rect = hero.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          visual.style.transform = \`translate3d(\${x * 18}px, \${y * 14}px, 0)\`;
        });

        hero.addEventListener("pointerleave", () => {
          visual.style.transform = "translate3d(0, 0, 0)";
        });
      }
    })();
  </script>
</body>
</html>
`;
}

async function main() {
  await Promise.all(APPS.map((app) => fs.writeFile(path.join(ROOT, subjectUrl(app)), renderSubjectPage(app))));
  console.log(`Generated ${APPS.length} subject landing pages.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
