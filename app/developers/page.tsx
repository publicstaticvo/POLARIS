import { PageIntro, Panel } from "@/components/shell";
import { developerDocs } from "@/lib/polaris-data";

export default function DevelopersPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Developers"
        title="为模型提供方和平台集成方准备的接入文档入口。"
        description="设计文档把 API 文档列为 MVP 核心页面之一。这里先实现文档首页，包含凭证获取、OpenAI 兼容接入、本地代理和实时状态订阅四个部分。"
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[0.95fr,1.05fr] lg:px-8">
        <div className="space-y-6">
          {developerDocs.map((section) => (
            <Panel key={section.title} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-brand">{section.title}</p>
              <p className="text-sm leading-7 text-ink/72">{section.text}</p>
            </Panel>
          ))}
        </div>

        <div className="space-y-6">
          <Panel className="space-y-4 bg-ink text-shell">
            <p className="text-xs uppercase tracking-[0.22em] text-shell/60">OpenAI Compatible Request</p>
            <pre className="overflow-x-auto rounded-[24px] bg-black/20 p-5 text-sm leading-7 text-shell/90">
              <code>{`POST /v1/chat/completions
Authorization: Bearer <POLARIS_API_KEY>
Content-Type: application/json

{
  "model": "qwen3-72b",
  "messages": [
    {"role": "system", "content": "You are an evaluation target."},
    {"role": "user", "content": "Solve the problem and output the final answer."}
  ],
  "temperature": 0.0,
  "max_tokens": 2048
}`}</code>
            </pre>
          </Panel>

          <Panel className="space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-brand">WebSocket Event</p>
            <pre className="overflow-x-auto rounded-[24px] bg-shell p-5 text-sm leading-7 text-ink/82">
              <code>{`{
  "event": "leaderboard_updated",
  "model": "qwen3-72b",
  "theta": 2.41,
  "se": 0.23,
  "rank": [1, 2]
}`}</code>
            </pre>
            <p className="text-sm leading-7 text-ink/70">
              排行榜页面与任务 Dashboard 都可以基于这个事件完成实时刷新，符合文档中“前端实时更新”的技术设定。
            </p>
          </Panel>
        </div>
      </section>
    </main>
  );
}
