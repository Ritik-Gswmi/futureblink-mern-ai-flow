import React, { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import TextInputNode from "./nodes/TextInputNode.jsx";
import ResultNode from "./nodes/ResultNode.jsx";

const initialNodes = [
  {
    id: "input",
    type: "textInput",
    position: { x: 100, y: 120 },
    data: { prompt: "", onChangePrompt: () => {} },
  },
  {
    id: "result",
    type: "result",
    position: { x: 520, y: 120 },
    data: { answer: "", onCopy: () => {}, copyLabel: "Copy" },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "input",
    target: "result",
    animated: true,
    style: { stroke: "#334155", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#334155" },
  },
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy");

  const nodeTypes = useMemo(
    () => ({
      textInput: TextInputNode,
      result: ResultNode,
    }),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes((current) =>
      current.map((node) => {
        if (node.id === "input") {
          return {
            ...node,
            data: {
              ...node.data,
              prompt,
              onChangePrompt: (value) => setPrompt(value),
            },
          };
        }
        if (node.id === "result") {
          return {
            ...node,
            data: {
              ...node.data,
              answer,
              copyLabel,
              onCopy: async () => {
                if (!answer?.trim()) return;
                try {
                  await navigator.clipboard.writeText(answer);
                  setCopyLabel("Copied");
                  setTimeout(() => setCopyLabel("Copy"), 1500);
                } catch {
                  setCopyLabel("Failed");
                  setTimeout(() => setCopyLabel("Copy"), 1500);
                }
              },
            },
          };
        }
        return node;
      })
    );
  }, [prompt, answer, copyLabel, setNodes]);

  const runFlow = async () => {
    setError("");
    setStatus("");
    setRunning(true);
    setCopyLabel("Copy");
    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : null;
      const text = data ? null : await res.text();
      if (!res.ok) throw new Error(data?.error || text || "Request failed");
      setAnswer(data?.answer || "");
      setStatus("Flow ran successfully.");
    } catch (e) {
      setError(e?.message || "Failed to run flow");
    } finally {
      setRunning(false);
    }
  };

  const saveRun = async () => {
    setError("");
    setStatus("");
    setSaving(true);
    try {
      const res = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, answer }),
      });
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : null;
      const text = data ? null : await res.text();
      if (!res.ok) throw new Error(data?.error || text || "Save failed");
      setStatus("Saved to Database.");
    } catch (e) {
      setError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const clearAll = () => {
    setError("");
    setStatus("");
    setPrompt("");
    setAnswer("");
    setCopyLabel("Copy");
  };

  return (
    <div className="grid h-full grid-rows-[auto_1fr] bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur">
        <div className="mr-1 text-sm font-semibold text-slate-900">AI Flow</div>
        <button
          onClick={runFlow}
          disabled={running || !prompt.trim()}
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm shadow-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? "Running..." : "Run Flow"}
        </button>
        <button
          onClick={saveRun}
          disabled={saving || !prompt.trim() || !answer.trim()}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={clearAll}
          disabled={running || saving || (!prompt.trim() && !answer.trim())}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Clear
        </button>
        {running ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            Running…
          </span>
        ) : null}
        {status ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {status}
          </span>
        ) : null}
        {error ? (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
            {error}
          </span>
        ) : null}
      </div>

      <div className="h-full p-3">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <Background />
          <Controls position="bottom-right" />
        </ReactFlow>
      </div>
    </div>
  );
}
