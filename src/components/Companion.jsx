import React from "react";
import { DEEP } from "../data/companion";
import { Section } from "./Markdown";

export function Companion({ active }) {
  const d = DEEP[active];
  return (
    <div className="col-span-12 md:col-span-3 lg:col-span-3 h-full overflow-hidden">
      <div className="h-full rounded-2xl p-4 border shadow-sm bg-white flex flex-col overflow-hidden">
        <div className="text-lg font-semibold mb-1">
          Companion: Why this level exists
        </div>
        <div className="text-xs text-gray-600 mb-3">
          Synced to the active level. Scroll to read the deep dive.
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          <Section label="Problem" text={d.problem} />
          <Section label="Idea" text={d.idea} />
          <Section label="Why we need it" text={d.why} />
          <Section label="Bridge" text={d.bridge} />
        </div>
      </div>
    </div>
  );
}
