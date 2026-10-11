import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "名如其人 · 懂你的英文名顾问" },
      { name: "description", content: "用一句话介绍自己，获得 3 个像你的英文名，并附上推荐理由。" },
      { property: "og:title", content: "名如其人 · 懂你的英文名顾问" },
      { property: "og:description", content: "用一句话介绍自己，获得 3 个像你的英文名，并附上推荐理由。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Rec = { name: string; cn: string; say: string; meaning: string; tags: string[]; why: string };

const SAMPLE: Rec[][] = [
  [
    { name: "Iris", cn: "艾瑞斯", say: "AI-ris", meaning: "彩虹", tags: ["文艺", "安静", "有创造力"], why: "你喜欢摄影和设计，Iris 与色彩、视觉感受有关；它简洁自然，也适合在英国学习和生活时使用。" },
    { name: "Clara", cn: "克拉拉", say: "CLA-ra", meaning: "明亮、清晰", tags: ["清醒", "有主见", "温和"], why: "你安静但有主见，Clara 传达出内敛而清晰的判断力；发音简单，英国同学很容易记住。" },
    { name: "Ivy", cn: "艾薇", say: "AI-vee", meaning: "常春藤", tags: ["自然", "坚韧", "清新"], why: "“雨”让人联想到自然与生长，Ivy 安静却有韧性，和你沉稳的气质相呼应。" },
  ],
  [
    { name: "Hazel", cn: "黑兹尔", say: "HAY-zel", meaning: "榛树", tags: ["温暖", "知性", "复古"], why: "Hazel 在英国很常见又不落俗套，带有书卷气，适合热爱艺术的你。" },
    { name: "Nora", cn: "诺拉", say: "NOR-ra", meaning: "光", tags: ["简洁", "独立", "优雅"], why: "摄影即是关于光，Nora 短而有力，体现你独立安静的一面。" },
    { name: "Elise", cn: "伊莉丝", say: "eh-LEES", meaning: "誓言", tags: ["细腻", "柔和", "坚定"], why: "Elise 柔和中带着坚定，与你“安静但有主见”的描述十分契合。" },
  ],
];

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-secondary-foreground hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}

function Index() {
  const [text, setText] = useState("");
  const [gender, setGender] = useState("不限");
  const [scene, setScene] = useState("留学");
  const [loading, setLoading] = useState(false);
  const [round, setRound] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setRound((r) => (r === null ? 0 : (r + 1) % SAMPLE.length));
      setLoading(false);
    }, 900);
  };

  const copy = (r: Rec) => {
    navigator.clipboard?.writeText(`${r.name}（${r.cn}｜读作：${r.say}）\n含义：${r.meaning}\n标签：${r.tags.join("、")}\n适合你的原因：${r.why}`);
    setCopied(r.name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:py-20">
      <header className="animate-rise text-center">
        <p className="font-latin text-lg italic tracking-wide text-primary">Name like you</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">名如其人</h1>
        <p className="mt-4 text-muted-foreground">像一位懂中英文化的起名顾问，为你挑一个“像自己”的英文名。</p>
      </header>

      <section className="animate-rise mt-10 rounded-2xl border bg-card p-5 shadow-sm sm:p-7" style={{ animationDelay: "0.1s" }}>
        <label htmlFor="intro" className="font-display text-lg font-semibold">介绍一下你自己</label>
        <textarea
          id="intro"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="你的中文名、性格、兴趣、想给人留下的印象，或英文名的使用场景。&#10;例如：我叫李小雨，性格安静但有主见，喜欢摄影，准备去英国读设计。"
          className="mt-3 w-full resize-none rounded-xl border bg-background p-4 leading-relaxed outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-12 text-sm text-muted-foreground">性别</span>
            {["男", "女", "不限"].map((g) => <Chip key={g} active={gender === g} onClick={() => setGender(g)}>{g}</Chip>)}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-12 text-sm text-muted-foreground">场景</span>
            {["日常", "职场", "留学"].map((s) => <Chip key={s} active={scene === s} onClick={() => setScene(s)}>{s}</Chip>)}
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-primary py-3.5 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "正在为你斟酌…" : "为我起名"}
        </button>
      </section>

      {round !== null && (
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold">为你推荐</h2>
            <button onClick={generate} disabled={loading} className="text-sm text-primary hover:underline">重新推荐</button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">以下是基于你的描述给出的建议，并非对性格或人生的绝对判断。</p>
          <div className="mt-6 space-y-5">
            {SAMPLE[round].map((r, i) => (
              <article key={r.name} className="animate-rise rounded-2xl border bg-card p-6" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-latin text-4xl font-semibold">{r.name}</span>
                    <span className="text-muted-foreground">{r.cn}｜读作：{r.say}</span>
                  </div>
                  <button onClick={() => copy(r)} className="rounded-lg border px-3 py-1 text-sm hover:bg-secondary">
                    {copied === r.name ? "已复制" : "复制"}
                  </button>
                </div>
                <p className="mt-3 text-sm"><span className="text-muted-foreground">含义：</span>{r.meaning}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.tags.map((t) => <span key={t} className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-accent-foreground">{t}</span>)}
                </div>
                <p className="mt-4 border-l-2 border-primary pl-4 leading-relaxed">{r.why}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
