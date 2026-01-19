import { toast } from "sonner";

interface AIConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

const getAIConfig = (): AIConfig => {
  // Ensure baseUrl doesn't have a trailing slash
  let baseUrl = import.meta.env.VITE_AI_BASE_URL || "https://api.openai.com/v1";
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const apiKey = import.meta.env.VITE_AI_API_KEY;
  const model = import.meta.env.VITE_AI_MODEL || "gpt-3.5-turbo";

  if (!apiKey) {
    throw new Error("未配置 VITE_AI_API_KEY 环境变量");
  }

  return { baseUrl, apiKey, model };
};

export interface MindMapNode {
  label: string;
  children?: MindMapNode[];
}

export interface GeneratedCritique {
  summary: string;
  mindmap: MindMapNode;
}

export async function generateArticleCritique(
  content: string,
  title: string
): Promise<GeneratedCritique> {
  const config = getAIConfig();

  const systemPrompt = `你是一个专业的文章审阅助手。请分析用户提供的文章内容。
你需要生成两个部分的内容：
1. **文章评论与总结** (summary)：
   - 总结文章的核心知识点（足够概括）。
   - **批判性纠错与补充**：
     - 指出文章可能遗漏的技术点、错误理解或需要注意的细节。
     - 对于指出的每一个遗漏点或问题，**必须紧接着给出合理的补充说明、正确答案或修正建议**。严禁只抛出问题而不解决。
     - 例如：“文章未提及X” -> “文章未提及X，X是指...其作用是...”
   - 语言客观，富有洞见。
   - 使用 Markdown 格式，大小标题格式化输出。

2. **思维导图** (mindmap)：
   - 基于全文内容生成一个树形结构的 JSON 对象。
   - 根节点是文章标题。
   - 结构字段：{ "label": "节点文本", "children": [...] }
   - 确保层级深度适中（至少 3 层）。

请以 JSON 格式返回结果，包含 'summary' 和 'mindmap' 两个字段。`;

  const userPrompt = `文章标题：${title}\n\n文章内容：\n${content.slice(
    0,
    8000
  )}`; // Truncate to avoid token limits if necessary

  const endpoint = `${config.baseUrl}/chat/completions`;

  try {
    console.log(`[AI] Requesting: ${endpoint} (Model: ${config.model})`);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }, // Enforce JSON if supported
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg =
        errorData.error?.message ||
        `API 请求失败: ${response.status} (${response.statusText})`;

      if (response.status === 404) {
        console.error(
          `[AI] 404 Not Found at ${endpoint}. Please check your VITE_AI_BASE_URL.`
        );
        throw new Error(
          `API 路径未找到 (404): ${endpoint}. 请检查 BASE_URL 配置。`
        );
      }

      throw new Error(errorMsg);
    }

    const data = await response.json();
    const resultString = data.choices[0].message.content;

    let resultJSON;
    try {
      resultJSON = JSON.parse(resultString);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      // Fallback: try to extract JSON if it's wrapped in markdown code blocks
      const match = resultString.match(/```json([\s\S]*?)```/);
      if (match) {
        resultJSON = JSON.parse(match[1]);
      } else {
        throw new Error("无法解析 AI 返回的数据格式");
      }
    }

    return {
      summary: resultJSON.summary || "生成摘要失败",
      mindmap: resultJSON.mindmap || { label: title, children: [] },
    };
  } catch (error) {
    console.error("AI Generation Error:", error);
    toast.error(
      error instanceof Error ? error.message : "AI 生成过程中发生错误"
    );
    throw error;
  }
}
