"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

export default function MarkdownMessage({ content }: Props) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-pre:my-2 prose-ul:my-2 prose-ol:my-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ children, href }) {
            // Basic safe link handling (also improves UX)
            const safeHref = href ?? "#";
            return (
              <a
                href={safeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline break-words"
              >
                {children}
              </a>
            );
          },
          code({ children, className }) {
            // Minimal code styling (no syntax highlighting dependency)
            const isBlock = (className ?? "").includes("language-");
            if (isBlock) {
              return (
                <code className="block whitespace-pre-wrap rounded-md bg-black/90 text-white p-3">
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-gray-200 dark:bg-gray-800 px-1 py-0.5">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
