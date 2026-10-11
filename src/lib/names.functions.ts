import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Rec = { name: string; cn: string; say: string; meaning: string; tags: string[]; why: string };

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["names"],
  properties: {
    names: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "cn", "say", "meaning", "tags", "why"],
        properties: {
          name: { type: "string" },
          cn: { type: "string" },
          say: { type: "string" },
          meaning: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          why: { type: "string" },
        },
      },
    },
  },
};

const SYSTEM = `你是一位熟悉中英文文化的英文名顾问。根据用户的自我介绍，判断其中文名、性别、使用场景、性格气质、兴趣偏好，
从真实、常见、易读的英文名中挑选最合适的 3 个。避免生僻、与用户特点冲突或有负面联想的名字。
每个名字给出：name 英文名；cn 中文音译；say 简单读法（如 AI-ris，大写为重音）；meaning 名字原意（简短中文）；
tags 3 个中文气质标签；why 用中文写 1-2 句个性化理由，必须引用用户描述中至少 2 项具体特征。
如果用户希望避开已推荐过的名字，不要重复。语气是建议，不做绝对判断。`;

export const recommendNames = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      intro: z.string().trim().min(1).max(1000),
      gender: z.string().max(10),
      scene: z.string().max(10),
      exclude: z.array(z.string().max(40)).max(30),
    }),
  )
  .handler(async ({ data }): Promise<{ names: Rec[] } | { error: string }> => {
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) return { error: "服务未配置，请稍后再试。" };

    const user = `自我介绍：${data.intro}\n性别：${data.gender}\n场景：${data.scene}${
      data.exclude.length ? `\n请避开这些已推荐过的名字：${data.exclude.join(", ")}` : ""
    }`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: SYSTEM,
        input: user,
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        text: { format: { type: "json_schema", name: "names", strict: true, schema } },
      }),
    });

    if (!res.ok || !res.body) {
      if (res.status === 429) return { error: "请求太频繁，请稍等片刻再试。" };
      if (res.status === 402) return { error: "AI 额度已用完，请联系网站管理员。" };
      return { error: "生成失败，请稍后再试。" };
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let text = "";
    let refused = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const ev = JSON.parse(payload);
          if (ev.type === "response.output_text.delta") text += ev.delta ?? "";
          if (ev.type === "response.refusal.delta") refused = true;
          if (ev.type === "error" || ev.type === "response.failed") return { error: "生成失败，请稍后再试。" };
        } catch {
          /* partial */
        }
      }
    }
    if (refused) return { error: "这段描述暂时无法生成推荐，请换个说法。" };
    try {
      const parsed = JSON.parse(text) as { names: Rec[] };
      return { names: parsed.names.slice(0, 3) };
    } catch {
      return { error: "结果解析失败，请重新推荐。" };
    }
  });
