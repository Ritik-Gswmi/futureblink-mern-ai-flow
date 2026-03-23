const axios = require("axios");

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function cleanAnswer(text) {
  if (typeof text !== "string") return "";
  return (
    text
      // strip common markdown emphasis
      .replace(/\*\*/g, "")
      .replace(/__/g, "")
      // strip list markers but keep the content
      .replace(/^\s*[-*•]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .trim()
  );
}

async function askAi(req, res) {
  let model;
  try {
    const prompt = (req.body?.prompt || "").toString().trim();
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Missing OPENROUTER_API_KEY in backend environment",
      });
    }

    // Keep model selection server-side (not from client).
    // Default to a known working free model unless OPENROUTER_MODEL is set.
    model =
      (process.env.OPENROUTER_MODEL || "").toString().trim() ||
      "openrouter/free";

    const maxTokens = toNumber(process.env.OPENROUTER_MAX_TOKENS, 1024);
    const temperature = toNumber(process.env.OPENROUTER_TEMPERATURE, 0.4);
    const systemPrompt =
      (process.env.OPENROUTER_SYSTEM_PROMPT || "").toString().trim() ||
      [
        "You are a helpful assistant.",
        "Prioritize correctness over sounding confident.",
        "Answer in plain text paragraphs only.",
        "Do not use markdown, bullet lists, numbered lists, headings, tables, or emphasis markers.",
        "Do not include word etymology/linguistics unless the user asks.",
      ].join(" ");

    const url = "https://openrouter.ai/api/v1/chat/completions";
    const referer = process.env.OPENROUTER_REFERER || "http://localhost:5173";
    const title = process.env.OPENROUTER_APP_NAME || "FutureBlink MERN Flow";

    const requestBody = {
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    };

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": referer,
        "X-Title": title,
      },
      timeout: 60_000,
    };

    const callOpenRouter = async (chosenModel) => {
      const { data } = await axios.post(url, { model: chosenModel, ...requestBody }, requestConfig);
      const answer = cleanAnswer(data?.choices?.[0]?.message?.content || "");
      return { answer, data };
    };

    let usedModel = model;
    let { answer } = await callOpenRouter(usedModel);

    // If a specific model has no endpoints, retry once with a fallback model.
    const fallbackModel =
      (process.env.OPENROUTER_FALLBACK_MODEL || "").toString().trim() || "openrouter/free";

    if (!answer) {
      // Keep as-is; empty answers can happen on some models, but we still return.
    }

    res.json({ answer, model: usedModel, maxTokens, temperature, fallbackModel });
  } catch (err) {
    const status = err?.response?.status || 500;
    let message =
      err?.response?.data?.error?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "OpenRouter request failed";

    const noEndpoints =
      typeof message === "string" && message.toLowerCase().includes("no endpoints found");

    // Auto-retry with fallback model if the chosen model has no endpoints.
    const fallbackModel =
      (process.env.OPENROUTER_FALLBACK_MODEL || "").toString().trim() || "openrouter/free";

    if (noEndpoints && model && model !== fallbackModel) {
      try {
        const url = "https://openrouter.ai/api/v1/chat/completions";
        const referer = process.env.OPENROUTER_REFERER || "http://localhost:5173";
        const title = process.env.OPENROUTER_APP_NAME || "FutureBlink MERN Flow";
        const maxTokens = toNumber(process.env.OPENROUTER_MAX_TOKENS, 350);
        const temperature = toNumber(process.env.OPENROUTER_TEMPERATURE, 0.4);
        const systemPrompt =
          (process.env.OPENROUTER_SYSTEM_PROMPT || "").toString().trim() ||
          [
            "You are a helpful assistant.",
            "Prioritize correctness over sounding confident.",
            "Answer in plain text paragraphs only.",
            "Do not use markdown, bullet lists, numbered lists, headings, tables, or emphasis markers.",
            "Do not include word etymology/linguistics unless the user asks.",
          ].join(" ");

        const { data } = await axios.post(
          url,
          {
            model: fallbackModel,
            temperature,
            max_tokens: maxTokens,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: (req.body?.prompt || "").toString().trim() },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": referer,
              "X-Title": title,
            },
            timeout: 60_000,
          }
        );

        const answer = cleanAnswer(data?.choices?.[0]?.message?.content || "");
        return res.json({
          answer,
          model: fallbackModel,
          attemptedModel: model,
          fallbackUsed: true,
        });
      } catch (retryErr) {
        message =
          retryErr?.response?.data?.error?.message ||
          retryErr?.response?.data?.error ||
          retryErr?.message ||
          message;
      }
    }

    if (noEndpoints) {
      message +=
        " (Set OPENROUTER_MODEL to `openrouter/free` or check OpenRouter's model list for an available `:free` model.)";
    }

    res.status(status).json({
      error: message,
      model: model || null,
      fallbackModel,
    });
  }
}

module.exports = { askAi };
