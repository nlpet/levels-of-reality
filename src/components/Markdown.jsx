import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export function MD({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({node, ...props}) => <p className="mb-2" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
        code: ({inline, children, ...props}) => (
          <code className={`px-1 py-0.5 rounded ${inline ? "bg-gray-100" : "bg-gray-50 block p-2"}`} {...props}>
            {children}
          </code>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

export function Section({ label, text }) {
  return (
    <div className="mb-4">
      <div className="text-sm font-semibold mb-1">{label}</div>
      <div className="text-sm text-gray-800 leading-relaxed">
        <MD>{text}</MD>
      </div>
    </div>
  );
}
