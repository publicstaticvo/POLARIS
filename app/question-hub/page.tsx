import { PageIntro, Panel } from "@/components/shell";
import { questionHubBenefits, questionHubHighlights } from "@/lib/polaris-data";

export default function QuestionHubPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Question Hub"
        title="把题库扩充做成一个清晰可参与的社区入口。"
        description="这里根据设计文档实现题库贡献页，强调题目质量要求、AI 初审到入库的流程，以及贡献者的长期权益。"
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1fr,0.94fr] lg:px-8">
        <Panel className="space-y-5">
          <div className="flex flex-wrap gap-3">
            {["提交单道题目", "批量上传 CSV", "查看我的贡献"].map((item) => (
              <button key={item} type="button" className="rounded-full border border-ink/10 bg-shell px-4 py-2 text-sm text-ink/72">
                {item}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-ink/68">
              <span>题目标题</span>
              <input defaultValue="例如：化学平衡常数推导题" className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3" />
            </label>
            <label className="space-y-2 text-sm text-ink/68">
              <span>所属领域</span>
              <select className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3">
                <option>数学推理</option>
                <option>代码能力</option>
                <option>逻辑推理</option>
                <option>中文理解</option>
                <option>知识问答</option>
                <option>多语言</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-ink/68 md:col-span-2">
              <span>标准答案 / 评分标准</span>
              <textarea defaultValue="写入标准答案、评分 rubric 与解析。" className="min-h-28 w-full rounded-[24px] border border-ink/10 bg-white px-4 py-3" />
            </label>
          </div>
          <div className="rounded-[24px] border border-brand/15 bg-brand/8 px-5 py-4 text-sm leading-7 text-ink/75">
            当前题库状态：总题量 8,432 题，本月新增 312 题，贡献机构 / 个人 47 个。
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-brand">Quality Bar</p>
            <h2 className="font-display text-3xl">题目质量要求</h2>
            <div className="space-y-3">
              {questionHubHighlights.map((item) => (
                <div key={item} className="rounded-[20px] border border-ink/10 bg-shell px-4 py-3 text-sm text-ink/75">
                  ✓ {item}
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-brand">Review Flow</p>
            <h2 className="font-display text-3xl">审核流程</h2>
            <div className="grid gap-3">
              {["提交", "AI 初审（3 分钟）", "FDC 预标定", "人工抽样验证", "入库"].map((item, index) => (
                <div key={item} className="grid grid-cols-[auto,1fr] gap-3 rounded-[22px] border border-ink/10 bg-white/70 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-shell">{index + 1}</div>
                  <div className="flex items-center text-sm text-ink/78">{item}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="space-y-4 bg-ink text-shell">
            <p className="text-xs uppercase tracking-[0.22em] text-shell/60">Contributor Benefits</p>
            <h2 className="font-display text-3xl">贡献者权益</h2>
            <div className="space-y-3 text-sm leading-7 text-shell/80">
              {questionHubBenefits.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}
