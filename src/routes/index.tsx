import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { recommendNames, type Rec } from "@/lib/names.functions";

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
  const [results, setResults] = useState<Rec[] | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const recommend = useServerFn(recommendNames);

  const generate = async (again = false) => {
    if (!text.trim()) { setError("先介绍一下你自己吧。"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await recommend({ data: { intro: text, gender, scene, exclude: again ? seen : [] } });
      if ("error" in res) setError(res.error);
      else {
        setResults(res.names);
        setSeen((s) => [...(again ? s : []), ...res.names.map((n) => n.name)].slice(-30));
      }
    } catch {
      setError("生成失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
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
          onClick={() => generate(false)}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-primary py-3.5 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "正在为你斟酌…" : "为我起名"}
        </button>
      </section>

      {error && <p className="mt-6 text-center text-sm text-destructive">{error}</p>}
      {results && (
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold">为你推荐</h2>
            <button onClick={() => generate(true)} disabled={loading} className="text-sm text-primary hover:underline">重新推荐</button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">以下是基于你的描述给出的建议，并非对性格或人生的绝对判断。</p>
          <div className="mt-6 space-y-5">
            {results.map((r, i) => (
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
