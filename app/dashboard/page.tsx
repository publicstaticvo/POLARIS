import { DashboardClient } from "@/components/dashboard-client";
import { PageIntro } from "@/components/shell";

export default function DashboardPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Evaluation Dashboard"
        title="让用户看到评测不是黑盒，而是一条可观察的收敛过程。"
        description="进度面板现在直接从 FastAPI 读取 active submission、timeline 和 history，并订阅任务 WebSocket 更新。"
      />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <DashboardClient />
      </section>
    </main>
  );
}
