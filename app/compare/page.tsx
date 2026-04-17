import { CompareClient } from "@/components/compare-client";
import { PageIntro, Panel } from "@/components/shell";

export default function ComparePage() {
  return (
    <main>
      <PageIntro
        eyebrow="Compare"
        title="把模型之间的差异拆成区间差异和领域差异。"
        description="Compare 页面现在会向后端请求综合能力森林图和分领域热力图所需的数据，而不是使用本地假数据。"
        aside={
          <Panel className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-brand">Export Ready</p>
            <p className="text-sm leading-7 text-ink/70">对比报告、热力图和区间差异都已经可以和 FastAPI 对接。</p>
          </Panel>
        }
      />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <CompareClient />
      </section>
    </main>
  );
}
