import { QuestionHubSummaryClient } from "@/components/question-hub-summary-client";
import { PageIntro } from "@/components/shell";

export default function QuestionHubPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Question Hub"
        title="把题库扩充做成一个清晰可参与的社区入口。"
        description="这里根据设计文档实现题库贡献页，当前题库规模、审核流程和贡献者权益都直接来自后端接口。"
      />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <QuestionHubSummaryClient />
      </section>
    </main>
  );
}
