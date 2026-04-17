"use client";

import { useState } from "react";

import { Panel } from "@/components/shell";
import { cx } from "@/lib/utils";

const steps = [
  { id: 1, label: "基础信息" },
  { id: 2, label: "接入方式" },
  { id: 3, label: "评测配置" }
];

export function SubmitWizard() {
  const [step, setStep] = useState(1);
  const [accessMode, setAccessMode] = useState<"api" | "local">("api");
  const [domains, setDomains] = useState(["数学推理", "代码能力", "逻辑推理", "中文理解", "知识问答", "多语言"]);

  const toggleDomain = (domain: string) => {
    setDomains((current) => (current.includes(domain) ? current.filter((item) => item !== domain) : [...current, domain]));
  };

  return (
    <Panel className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {steps.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setStep(item.id)}
            className={cx(
              "rounded-full border px-4 py-2 text-sm transition",
              step === item.id ? "border-ink bg-ink text-shell" : "border-ink/10 bg-shell text-ink/68"
            )}
          >
            Step {item.id} / 3 · {item.label}
          </button>
        ))}
      </div>

      {step === 1 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ["模型名称", "Qwen3-72B-Instruct"],
            ["版本号", "v1.0"],
            ["机构 / 个人", "Alibaba Cloud"],
            ["HuggingFace 链接", "https://huggingface.co/Qwen/Qwen3-72B"]
          ].map(([label, placeholder]) => (
            <label key={label} className="space-y-2 text-sm text-ink/68">
              <span>{label}</span>
              <input
                defaultValue={placeholder}
                className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand"
              />
            </label>
          ))}
          <label className="space-y-2 text-sm text-ink/68 md:col-span-2">
            <span>模型描述</span>
            <textarea
              defaultValue="可选，将展示在模型详情页中。"
              className="min-h-28 w-full rounded-[24px] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand"
            />
          </label>
          <div className="space-y-3 text-sm text-ink/68 md:col-span-2">
            <p>模型规模</p>
            <div className="flex flex-wrap gap-3">
              {["<7B", "7B-13B", "30B-70B", "70B+"].map((size, index) => (
                <button
                  key={size}
                  type="button"
                  className={cx(
                    "rounded-full border px-4 py-2 transition",
                    index === 3 ? "border-ink bg-ink text-shell" : "border-ink/10 bg-shell text-ink/70"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3 text-sm text-ink/68 md:col-span-2">
            <p>开源状态</p>
            <div className="flex gap-3">
              <button type="button" className="rounded-full border border-ink bg-ink px-4 py-2 text-shell">
                开源
              </button>
              <button type="button" className="rounded-full border border-ink/10 bg-shell px-4 py-2 text-ink/70">
                闭源
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setAccessMode("api")}
              className={cx(
                "rounded-[24px] border p-5 text-left transition",
                accessMode === "api" ? "border-ink bg-ink text-shell" : "border-ink/10 bg-white/70 text-ink"
              )}
            >
              <p className="text-xs uppercase tracking-[0.18em]">推荐</p>
              <p className="mt-2 font-display text-2xl">API 接入</p>
              <p className="mt-2 text-sm leading-7 opacity-80">支持 OpenAI 兼容接口与自定义 parser。</p>
            </button>
            <button
              type="button"
              onClick={() => setAccessMode("local")}
              className={cx(
                "rounded-[24px] border p-5 text-left transition",
                accessMode === "local" ? "border-ink bg-ink text-shell" : "border-ink/10 bg-white/70 text-ink"
              )}
            >
              <p className="text-xs uppercase tracking-[0.18em]">CLI</p>
              <p className="mt-2 font-display text-2xl">本地部署接入</p>
              <p className="mt-2 text-sm leading-7 opacity-80">面向 vLLM、Ollama 与 HuggingFace 代理。</p>
            </button>
          </div>

          {accessMode === "api" ? (
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-ink/68 md:col-span-2">
                <span>API Endpoint</span>
                <input
                  defaultValue="https://your-api.com/v1/chat/completions"
                  className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand"
                />
              </label>
              <label className="space-y-2 text-sm text-ink/68">
                <span>API Key</span>
                <input
                  defaultValue="sk-••••••••••••••••••••"
                  className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand"
                />
              </label>
              <label className="space-y-2 text-sm text-ink/68">
                <span>请求格式</span>
                <select className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand">
                  <option>OpenAI 兼容</option>
                  <option>自定义 Parser</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-ink/68">
                <span>Temperature</span>
                <input defaultValue="0.0" className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3" />
              </label>
              <label className="space-y-2 text-sm text-ink/68">
                <span>Max Tokens</span>
                <input defaultValue="2048" className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3" />
              </label>
              <label className="space-y-2 text-sm text-ink/68 md:col-span-2">
                <span>System Prompt</span>
                <textarea
                  defaultValue="留空使用默认评测指令。"
                  className="min-h-24 w-full rounded-[24px] border border-ink/10 bg-white px-4 py-3"
                />
              </label>
              <div className="rounded-[22px] border border-brand/20 bg-brand/8 px-4 py-3 text-sm text-brand md:col-span-2">
                API 连通性验证通过
              </div>
            </div>
          ) : (
            <div className="rounded-[28px] border border-ink/10 bg-ink p-6 text-shell">
              <p className="text-xs uppercase tracking-[0.22em] text-shell/60">POLARIS CLI</p>
              <pre className="mt-4 overflow-x-auto rounded-[20px] bg-black/20 p-4 text-sm leading-7 text-shell/90">
                <code>{`pip install polaris-eval
polaris agent start \\
  --model ollama/qwen3:72b \\
  --api-key YOUR_POLARIS_KEY \\
  --domains math,code,reasoning`}</code>
              </pre>
            </div>
          )}
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-ink/68">评测领域</p>
            <div className="flex flex-wrap gap-3">
              {["数学推理", "代码能力", "逻辑推理", "中文理解", "知识问答", "多语言"].map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => toggleDomain(domain)}
                  className={cx(
                    "rounded-full border px-4 py-2 text-sm transition",
                    domains.includes(domain) ? "border-ink bg-ink text-shell" : "border-ink/10 bg-shell text-ink/68"
                  )}
                >
                  {domains.includes(domain) ? "☑" : "☐"} {domain}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: "标准", detail: "SE < 0.25，约 20-30 题/领域，约 30 分钟", active: true },
              { title: "快速", detail: "SE < 0.35，约 12-18 题/领域，约 15 分钟", active: false },
              { title: "精确", detail: "SE < 0.18，约 35-50 题/领域，约 60 分钟", active: false }
            ].map(({ title, detail, active }) => (
              <button
                key={title}
                type="button"
                className={cx(
                  "rounded-[24px] border p-5 text-left transition",
                  active ? "border-ink bg-ink text-shell" : "border-ink/10 bg-white/70 text-ink"
                )}
              >
                <p className="font-display text-2xl">{title}</p>
                <p className="mt-3 text-sm leading-7 opacity-80">{detail}</p>
              </button>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm text-ink/68">
              <span>结果可见性</span>
              <select className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3">
                <option>公开（展示在排行榜）</option>
                <option>私有（企业版）</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-ink/68">
              <span>完成后通知</span>
              <input defaultValue="your@email.com" className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3" />
            </label>
          </div>
          <div className="grid gap-4 rounded-[28px] border border-brand/20 bg-brand/8 p-5 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-brand">预计费用</p>
              <p className="mt-2 text-lg font-medium text-ink">免费</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-brand">预计完成</p>
              <p className="mt-2 text-lg font-medium text-ink">约 30 分钟</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-brand">上线结果</p>
              <p className="mt-2 text-lg font-medium text-ink">θ + SE + HTML/PDF 报告</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(1, current - 1))}
          className="rounded-full border border-ink/10 bg-shell px-5 py-3 text-sm text-ink/70"
        >
          上一步
        </button>
        <button
          type="button"
          onClick={() => setStep((current) => Math.min(3, current + 1))}
          className="rounded-full bg-ink px-5 py-3 text-sm text-shell"
        >
          {step === 3 ? "确认提交，开始评测" : "下一步"}
        </button>
      </div>
    </Panel>
  );
}
