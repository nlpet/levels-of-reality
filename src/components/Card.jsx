import React from "react";
import { INFO } from "../data/levels";
import { MD } from "./Markdown";

export function Card({ title, children, caption, activeId }) {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-6 h-full overflow-hidden">
      <div className="h-full rounded-2xl p-4 border shadow-sm bg-white flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">{title}</div>
        </div>
        <div className="flex-1 overflow-hidden rounded-xl border bg-gray-50 flex items-center justify-center">
          {children}
        </div>
        {caption && <div className="text-xs text-gray-600 mt-2">{caption}</div>}
        <div className="text-xs text-gray-600 mt-2">
          <MD>{`**Math:** ${INFO[activeId]?.math}  ${INFO[activeId]?.link}`}</MD>
        </div>
      </div>
    </div>
  );
}
