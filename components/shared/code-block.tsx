"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  description?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  title,
  description,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border bg-gray-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          {title && (
            <span className="text-sm font-medium text-gray-300">{title}</span>
          )}
          <Badge
            variant="secondary"
            className="bg-gray-800 text-gray-400 text-[10px]"
          >
            {language}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-gray-400 hover:text-white hover:bg-gray-800 h-7 px-2"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">복사</span>
            </>
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm leading-relaxed">
          <code className="text-gray-100 font-mono whitespace-pre">
            {code}
          </code>
        </pre>
      </div>

      {/* Description */}
      {description && (
        <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-800">
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      )}
    </div>
  );
}
