import { SubmitWizard } from "@/components/submit-wizard";
import { PageIntro, Panel } from "@/components/shell";

export default function SubmitPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Core Entry"
        title="把评测提交压缩到 5 分钟内完成。"
        description="设计文档把提交页定义为核心入口，因此这里采用三步式向导：先录入模型信息，再选择 API 或本地代理接入，最后确定领域、精度和结果可见性。"
        aside={
          <Panel className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand">Design Principle</p>
            <p className="text-sm leading-7 text-ink/70">
              零技术门槛。现在页面会直接调用后端的连接测试和任务创建接口，不再只是示意性表单。
            </p>
          </Panel>
        }
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.05fr,0.95fr] lg:px-8">
        <SubmitWizard />
        <div className="space-y-6">
          <Panel className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-brand">What Happens Next</p>
            <h2 className="font-display text-3xl">提交之后的平台动作</h2>
            <div className="space-y-4">
              {[
                ["预检", "验证接口连通性、格式兼容性和速率限制"],
                ["调度", "按领域拆分为子任务并控制并发数"],
                ["CAT 测试", "根据当前 θ 与 SE 持续选题直到收敛"],
                ["发布", "生成报告并把结果推送到排行榜与消息中心"],
              ].map(([title, text], index) => (
                <div key={title} className="grid grid-cols-[auto,1fr] gap-4 rounded-[24px] border border-ink/10 bg-shell p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-shell">{index + 1}</div>
                  <div>
                    <p className="font-medium text-ink">{title}</p>
                    <p className="mt-1 text-sm leading-7 text-ink/68">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="space-y-4 bg-ink text-shell">
            <p className="text-xs uppercase tracking-[0.24em] text-shell/60">Trust Layer</p>
            <h2 className="font-display text-3xl">结果发布前的五道防线</h2>
            <div className="grid gap-3">
              {["统计门槛", "题库安全", "量尺稳定", "答案评分", "异常检测"].map((item) => (
                <div key={item} className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-shell/80">
                  {item}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}
