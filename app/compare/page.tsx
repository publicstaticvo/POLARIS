import { CompareClient } from "@/components/compare-client";
import { PageIntro, Panel } from "@/components/shell";

export default function ComparePage() {
  return (
    <main>
      <PageIntro
        eyebrow="Compare"
        title="把模型之间的差异拆成区间差异和领域差异。"
        description="设计文档中的 Compare 页面强调两种视图：综合能力森林图和分领域热力图。前者回答‘是否显著更强’，后者回答‘强在哪里’。"
        aside={
          <Panel className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-brand">Export Ready</p>
            <p className="text-sm leading-7 text-ink/70">该页面预留对比报告导出和分享入口，适合作为发布后传播素材。</p>
          </Panel>
        }
      />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <CompareClient />
      </section>
    </main>
  );
}
