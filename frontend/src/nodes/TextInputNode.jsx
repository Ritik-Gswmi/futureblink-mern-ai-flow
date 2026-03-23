import React from "react";
import { Handle, Position } from "reactflow";

export default function TextInputNode({ data }) {
  return (
    <div className="w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
      <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-sky-500 px-3 py-2 text-sm font-semibold text-white">
        Prompt
      </div>
      <div className="p-3">
        <textarea
          className="nodrag min-h-[140px] w-full resize-y rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          placeholder='Type a prompt (e.g., "What is the capital of France?")'
          value={data.prompt}
          spellCheck={false}
          onChange={(e) => data.onChangePrompt(e.target.value)}
        />
        <div className="mt-2 text-xs text-slate-500">
          {data.prompt?.trim()?.length ? `${data.prompt.trim().length} chars` : "Waiting for input…"}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
