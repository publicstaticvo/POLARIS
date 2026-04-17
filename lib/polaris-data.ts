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

export const domainTabs: Array<{ key: DomainKey; label: string }> = [
  { key: "overall", label: "综合" },
  { key: "math", label: "数学" },
  { key: "code", label: "代码" },
  { key: "reasoning", label: "逻辑推理" },
  { key: "chinese", label: "中文理解" },
  { key: "knowledge", label: "知识问答" },
  { key: "multilingual", label: "多语言" },
];

export const filters = {
  scales: ["全部规模", "<7B", "7B-13B", "30B-70B", "70B+", "API"],
  openness: ["全部来源", "开源", "闭源"],
  ranges: ["最近 24h", "最近 7 天", "最近 30 天", "全部"],
};

export const navLinks = [
  { href: "/", label: "首页" },
  { href: "/leaderboard", label: "排行榜" },
  { href: "/submit", label: "提交评测" },
  { href: "/dashboard", label: "进度面板" },
  { href: "/compare", label: "能力对比" },
  { href: "/question-hub", label: "题库贡献" },
  { href: "/developers", label: "Developers" },
  { href: "/about", label: "Methodology" },
];

export const siteStats = [
  { label: "公开上榜模型", value: "58", note: "首批已覆盖主流开源与闭源模型" },
  { label: "标准评测时长", value: "30 min", note: "约 20-30 题/领域，自适应停止" },
  { label: "题库规模", value: "8,432", note: "曝光控制 + 锚题校准，保持量尺稳定" },
  { label: "结果承诺", value: "θ + SE", note: "每次评测都附带能力值与不确定性" },
];

export const platformSteps = [
  {
    title: "用户提交",
    body: "填写模型信息、API 或本地代理配置，并选择评测领域与精度。",
  },
  {
    title: "系统预检",
    body: "验证接口连通性、响应格式与速率限制，确定并发策略。",
  },
  {
    title: "CAT 评测",
    body: "按领域拆成子任务，动态选题直到 SE 收敛到发布阈值。",
  },
  {
    title: "发布结果",
    body: "聚合综合 θ、生成 HTML/PDF 报告，并实时刷新排行榜。",
  },
];

export const methodologyLayers = [
  {
    title: "固定量尺",
    text: "每个领域保留锚题，跨批次校准能力尺度，保证历史 θ 不因新模型加入而漂移。",
  },
  {
    title: "自适应测试",
    text: "MFI+ 选题与 EAP 估计联合工作，在更少题目下收敛到可发布的 SE 阈值。",
  },
  {
    title: "题库安全",
    text: "曝光追踪控制单题使用率，异常高正确率与泄露模式会触发预警。",
  },
  {
    title: "全自动发布",
    text: "从预检、调度、评分到报告生成与排行榜更新均支持自动流水线。",
  },
];

export const domainOptions: Array<{ key: Exclude<DomainKey, "overall">; label: string }> = [
  { key: "math", label: "数学推理" },
  { key: "code", label: "代码能力" },
  { key: "reasoning", label: "逻辑推理" },
  { key: "chinese", label: "中文理解" },
  { key: "knowledge", label: "知识问答" },
  { key: "multilingual", label: "多语言" },
];
