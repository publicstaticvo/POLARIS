import { LeaderboardClient } from "@/components/leaderboard-client";
import { PageIntro, Panel } from "@/components/shell";

export default function LeaderboardPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Core Page"
        title="实时排行榜既展示名次，也展示统计上的不确定性。"
        description="这里对应设计文档中的核心页面：支持综合榜与领域榜切换、按规模与开闭源过滤，并用森林图直观呈现 θ 与 95% 置信区间。"
        aside={
          <Panel className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-brand">Ranking Logic</p>
            <p className="text-sm leading-7 text-ink/70">
              排名依据综合 θ，但页面会始终提示置信区间重叠关系，避免把统计上不可区分的模型误读成绝对先后。
            </p>
          </Panel>
        }
      />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <LeaderboardClient />
      </section>
    </main>
  );
}
