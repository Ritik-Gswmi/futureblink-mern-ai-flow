import React from "react";
import { Handle, Position } from "reactflow";

export default function ResultNode({ data }) {
  return (
    <div className="w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-emerald-600 to-teal-500 px-3 py-2 text-sm font-semibold text-white">
        <span>Result</span>
        <button
          type="button"
          onClick={data.onCopy}
          disabled={!data.answer?.trim()}
          className="rounded-lg bg-white/15 px-2 py-1 text-xs font-semibold text-white ring-1 ring-white/20 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          title="Copy answer"
        >
          {data.copyLabel || "Copy"}
        </button>
      </div>
      <div className="p-3">
        <div className="nodrag nowheel h-48 w-full overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-white p-2.5 pr-3 text-sm text-slate-900">
          {data.answer || "Run the flow to see output."}
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
