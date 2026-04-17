export type DomainKey =
  | "overall"
  | "math"
  | "code"
  | "reasoning"
  | "chinese"
  | "knowledge"
  | "multilingual";

export type DomainScore = {
  key: Exclude<DomainKey, "overall">;
  label: string;
  theta: number;
  se: number;
  items: number;
};

export type ModelRecord = {
  rank: number;
  name: string;
  slug: string;
  org: string;
  theta: number;
  se: number;
  items: number;
  updated: string;
  scale: string;
  openness: "Open" | "Closed";
  summary: string;
  tags: string[];
  behavioral: {
    robustness: number;
    plasticity: number;
    note: string;
  };
  history: Array<{ label: string; theta: number }>;
  domains: DomainScore[];
};

export const siteStats = [
  { label: "公开上榜模型", value: "58", note: "首批已覆盖主流开源与闭源模型" },
  { label: "标准评测时长", value: "30 min", note: "约 20-30 题/领域，自适应停止" },
  { label: "题库规模", value: "8,432", note: "曝光控制 + 锚题校准，保持量尺稳定" },
  { label: "结果承诺", value: "θ + SE", note: "每次评测均给出能力值与不确定性" }
];

export const domainTabs: Array<{ key: DomainKey; label: string }> = [
  { key: "overall", label: "综合" },
  { key: "math", label: "数学" },
  { key: "code", label: "代码" },
  { key: "reasoning", label: "逻辑推理" },
  { key: "chinese", label: "中文理解" },
  { key: "knowledge", label: "知识问答" },
  { key: "multilingual", label: "多语言" }
];

export const models: ModelRecord[] = [
  {
    rank: 1,
    name: "Qwen3-72B",
    slug: "qwen3-72b",
    org: "Alibaba Cloud",
    theta: 2.41,
    se: 0.23,
    items: 28,
    updated: "1h ago",
    scale: "70B+",
    openness: "Open",
    summary: "综合能力最稳，数学与代码双高，置信区间与第 2 名重叠。",
    tags: ["旗舰", "高鲁棒性", "开放权重"],
    behavioral: {
      robustness: 82,
      plasticity: 61,
      note: "在正确作答后受追问仍能坚持答案，纠错能力中上。"
    },
    history: [
      { label: "Qwen-7B", theta: 1.04 },
      { label: "Qwen2-72B", theta: 1.89 },
      { label: "Qwen2.5-72B", theta: 2.19 },
      { label: "Qwen3-72B", theta: 2.41 }
    ],
    domains: [
      { key: "math", label: "数学", theta: 2.8, se: 0.21, items: 6 },
      { key: "code", label: "代码", theta: 2.61, se: 0.24, items: 5 },
      { key: "reasoning", label: "逻辑推理", theta: 2.33, se: 0.19, items: 7 },
      { key: "chinese", label: "中文理解", theta: 2.19, se: 0.22, items: 5 },
      { key: "knowledge", label: "知识问答", theta: 1.98, se: 0.25, items: 5 },
      { key: "multilingual", label: "多语言", theta: 2.11, se: 0.23, items: 6 }
    ]
  },
  {
    rank: 2,
    name: "DeepSeek-V3",
    slug: "deepseek-v3",
    org: "DeepSeek",
    theta: 2.38,
    se: 0.23,
    items: 31,
    updated: "2h ago",
    scale: "70B+",
    openness: "Open",
    summary: "代码表现全站最高，整体能力与第 1 名统计上无显著差异。",
    tags: ["强代码", "推理稳定", "开放权重"],
    behavioral: {
      robustness: 74,
      plasticity: 66,
      note: "高强度代码任务中稳定，但在多语言长尾任务略弱。"
    },
    history: [
      { label: "DeepSeek-67B", theta: 1.31 },
      { label: "DeepSeek-V2", theta: 1.92 },
      { label: "DeepSeek-V2.5", theta: 2.14 },
      { label: "DeepSeek-V3", theta: 2.38 }
    ],
    domains: [
      { key: "math", label: "数学", theta: 2.71, se: 0.24, items: 6 },
      { key: "code", label: "代码", theta: 2.88, se: 0.22, items: 6 },
      { key: "reasoning", label: "逻辑推理", theta: 2.29, se: 0.21, items: 7 },
      { key: "chinese", label: "中文理解", theta: 2.15, se: 0.23, items: 4 },
      { key: "knowledge", label: "知识问答", theta: 2.04, se: 0.24, items: 4 },
      { key: "multilingual", label: "多语言", theta: 1.97, se: 0.22, items: 4 }
    ]
  },
  {
    rank: 3,
    name: "GPT-4o",
    slug: "gpt-4o",
    org: "OpenAI",
    theta: 2.21,
    se: 0.2,
    items: 25,
    updated: "6h ago",
    scale: "API",
    openness: "Closed",
    summary: "多语言和知识问答强势，综合表现高但开放性较低。",
    tags: ["闭源", "多语言", "知识问答"],
    behavioral: {
      robustness: 69,
      plasticity: 73,
      note: "对提示纠偏响应更好，语言泛化能力优于平均。"
    },
    history: [
      { label: "GPT-4", theta: 1.83 },
      { label: "GPT-4 Turbo", theta: 2.01 },
      { label: "GPT-4.1", theta: 2.12 },
      { label: "GPT-4o", theta: 2.21 }
    ],
    domains: [
      { key: "math", label: "数学", theta: 2.55, se: 0.2, items: 5 },
      { key: "code", label: "代码", theta: 2.7, se: 0.18, items: 4 },
      { key: "reasoning", label: "逻辑推理", theta: 2.18, se: 0.19, items: 4 },
      { key: "chinese", label: "中文理解", theta: 1.92, se: 0.22, items: 4 },
      { key: "knowledge", label: "知识问答", theta: 2.21, se: 0.21, items: 4 },
      { key: "multilingual", label: "多语言", theta: 2.33, se: 0.2, items: 4 }
    ]
  },
  {
    rank: 4,
    name: "Llama-3.3-70B",
    slug: "llama-3-3-70b",
    org: "Meta",
    theta: 1.94,
    se: 0.2,
    items: 22,
    updated: "1d ago",
    scale: "70B+",
    openness: "Open",
    summary: "推理与代码中上，中文理解存在明显提升空间。",
    tags: ["开放生态", "长上下文", "社区活跃"],
    behavioral: {
      robustness: 63,
      plasticity: 55,
      note: "对复杂推理稳定，但在干扰题中更容易松动。"
    },
    history: [
      { label: "Llama2-70B", theta: 1.02 },
      { label: "Llama3-70B", theta: 1.57 },
      { label: "Llama3.1-70B", theta: 1.79 },
      { label: "Llama3.3-70B", theta: 1.94 }
    ],
    domains: [
      { key: "math", label: "数学", theta: 2.15, se: 0.22, items: 4 },
      { key: "code", label: "代码", theta: 2.08, se: 0.21, items: 4 },
      { key: "reasoning", label: "逻辑推理", theta: 1.95, se: 0.19, items: 4 },
      { key: "chinese", label: "中文理解", theta: 1.61, se: 0.23, items: 3 },
      { key: "knowledge", label: "知识问答", theta: 1.89, se: 0.21, items: 3 },
      { key: "multilingual", label: "多语言", theta: 1.98, se: 0.2, items: 4 }
    ]
  },
  {
    rank: 5,
    name: "Mistral-Large",
    slug: "mistral-large",
    org: "Mistral",
    theta: 1.87,
    se: 0.22,
    items: 27,
    updated: "2d ago",
    scale: "API",
    openness: "Closed",
    summary: "整体均衡，短板较少，但极值能力略逊于头部模型。",
    tags: ["平衡型", "API 友好", "欧陆语种"],
    behavioral: {
      robustness: 58,
      plasticity: 64,
      note: "错误后更愿意修正，稳定性略低于同档开源旗舰。"
    },
    history: [
      { label: "Mistral-7B", theta: 0.94 },
      { label: "Mixtral-8x22B", theta: 1.46 },
      { label: "Mistral Medium", theta: 1.68 },
      { label: "Mistral Large", theta: 1.87 }
    ],
    domains: [
      { key: "math", label: "数学", theta: 1.98, se: 0.23, items: 5 },
      { key: "code", label: "代码", theta: 2.04, se: 0.2, items: 4 },
      { key: "reasoning", label: "逻辑推理", theta: 1.87, se: 0.21, items: 5 },
      { key: "chinese", label: "中文理解", theta: 1.51, se: 0.24, items: 4 },
      { key: "knowledge", label: "知识问答", theta: 1.93, se: 0.23, items: 4 },
      { key: "multilingual", label: "多语言", theta: 1.89, se: 0.2, items: 5 }
    ]
  }
];

export const filters = {
  scales: ["全部规模", "<7B", "7B-13B", "30B-70B", "70B+", "API"],
  openness: ["全部来源", "开源", "闭源"],
  ranges: ["最近 24h", "最近 7 天", "最近 30 天", "全部"]
};

export const queueProgress = [
  { label: "数学推理", percent: 100, status: "完成", detail: "θ=2.80, SE=0.21" },
  { label: "代码能力", percent: 100, status: "完成", detail: "θ=2.61, SE=0.24" },
  { label: "逻辑推理", percent: 68, status: "进行中", detail: "已用 7 题，当前 θ≈2.4" },
  { label: "中文理解", percent: 8, status: "等待中", detail: "等待调度器分配" },
  { label: "知识问答", percent: 8, status: "等待中", detail: "等待调度器分配" },
  { label: "多语言", percent: 8, status: "等待中", detail: "等待调度器分配" }
];

export const taskTimeline = [
  { step: "预检 API", detail: "OpenAI 兼容格式通过，速率限制估计 22 RPM", status: "done" },
  { step: "并发调度", detail: "数学 / 代码 / 逻辑三路同时启动", status: "done" },
  { step: "CAT 自适应测试", detail: "逻辑域正在追加题目直到 SE 收敛", status: "active" },
  { step: "报告生成", detail: "等待所有领域结束后聚合结果", status: "todo" },
  { step: "排行榜发布", detail: "完成后 WebSocket 推送前端更新", status: "todo" }
];

export const questionHubHighlights = [
  "有明确标准答案或评分 rubric",
  "解析完整，可用于 FDC 特征提取",
  "覆盖简单 / 中等 / 困难多层级难度",
  "系统自动检测重复与高曝光风险"
];

export const questionHubBenefits = [
  "题目入库后永久署名",
  "贡献题量超过 50 题获得贡献者徽章",
  "贡献题量超过 200 题获得无限私有评测额度"
];

export const developerDocs = [
  {
    title: "1. 获取凭证",
    text: "注册后在控制台生成 POLARIS API Key，公开提交永久免费，私有评测预留企业版入口。"
  },
  {
    title: "2. API 接入",
    text: "默认支持 OpenAI 兼容 `/v1/chat/completions`，也为自定义 parser 预留扩展能力。"
  },
  {
    title: "3. 本地模型代理",
    text: "通过 `polaris agent start` 把 vLLM、Ollama 或 HuggingFace 本地服务注册成临时 endpoint。"
  },
  {
    title: "4. 实时状态",
    text: "任务创建后可轮询 REST 接口，也可订阅 WebSocket 事件监听排行榜刷新与任务完成通知。"
  }
];

export const methodologyLayers = [
  {
    title: "固定量尺",
    text: "每个领域保留锚题，跨批次校准能力尺度，保证历史 θ 不因新模型加入而漂移。"
  },
  {
    title: "自适应测试",
    text: "MFI+ 选题与 EAP 估计联合工作，在更少题目下收敛到可发布的 SE 阈值。"
  },
  {
    title: "题库安全",
    text: "曝光追踪控制单题使用率，异常高正确率与泄露模式会触发预警。"
  },
  {
    title: "全自动发布",
    text: "从预检、调度、评分到报告生成与排行榜更新均支持自动流水线。"
  }
];

export const navLinks = [
  { href: "/", label: "首页" },
  { href: "/leaderboard", label: "排行榜" },
  { href: "/submit", label: "提交评测" },
  { href: "/dashboard", label: "进度面板" },
  { href: "/compare", label: "能力对比" },
  { href: "/question-hub", label: "题库贡献" },
  { href: "/developers", label: "Developers" },
  { href: "/about", label: "Methodology" }
];

export const platformSteps = [
  {
    title: "用户提交",
    body: "填写模型信息、API 或本地代理配置，并选择评测领域与精度。"
  },
  {
    title: "系统预检",
    body: "验证接口连通性、响应格式与速率限制，确定并发策略。"
  },
  {
    title: "CAT 评测",
    body: "按领域拆成子任务，动态选题直到 SE 收敛到发布阈值。"
  },
  {
    title: "发布结果",
    body: "聚合综合 θ、生成 HTML/PDF 报告，并实时刷新排行榜。"
  }
];
