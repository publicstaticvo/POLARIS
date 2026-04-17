import { DevelopersOverviewClient } from "@/components/developers-overview-client";
import { PageIntro } from "@/components/shell";

export default function DevelopersPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Developers"
        title="为模型提供方和平台集成方准备的接入文档入口。"
        description="开发者页现在会读取 FastAPI 返回的 REST Base URL、WebSocket 通道和示例 payload，用于前后端联调。"
      />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <DevelopersOverviewClient />
      </section>
    </main>
  );
}
