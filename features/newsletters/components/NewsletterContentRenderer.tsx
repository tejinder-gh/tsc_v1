import type React from "react";

export interface NewsletterContentRendererProps {
  content: string;
  variant?: "editorial" | "email";
  className?: string;
}

interface ParsedBlock {
  type: "h2" | "h3" | "h4" | "ul" | "ol" | "blockquote" | "p";
  content?: string;
  items?: string[];
}

function parseBlocks(text: string): ParsedBlock[] {
  const lines = text.split("\n");
  const blocks: ParsedBlock[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const fullText = currentParagraph.join(" ").trim();
      if (fullText) {
        // If the entire paragraph is italicized (e.g. *Review takeaways and edit before approving publication.*), treat as callout note
        if (
          fullText.startsWith("*") &&
          fullText.endsWith("*") &&
          !fullText.slice(1, -1).includes("*")
        ) {
          blocks.push({
            type: "blockquote",
            content: fullText.slice(1, -1).trim(),
          });
        } else {
          blocks.push({
            type: "p",
            content: fullText,
          });
        }
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList && currentList.items.length > 0) {
      blocks.push({
        type: currentList.type,
        items: [...currentList.items],
      });
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "h2",
        content: trimmed.slice(3).trim(),
      });
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "h3",
        content: trimmed.slice(4).trim(),
      });
      continue;
    }

    if (trimmed.startsWith("#### ")) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "h4",
        content: trimmed.slice(5).trim(),
      });
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "blockquote",
        content: trimmed.slice(2).trim(),
      });
      continue;
    }

    const isBulletItem = trimmed.startsWith("- ") || trimmed.startsWith("* ");
    const isNumberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);

    if (isBulletItem) {
      flushParagraph();
      if (currentList?.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(trimmed.slice(2).trim());
      continue;
    }

    if (isNumberedMatch) {
      flushParagraph();
      if (currentList?.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(isNumberedMatch[2].trim());
      continue;
    }

    // Regular line continues current paragraph
    flushList();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function renderInlineText(text: string, keyPrefix: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Matches **bold**, *italic*, `code`, or [label](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = regex.exec(text);

  while (match !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const matchIdx = match.index;

    if (token.startsWith("**") && token.endsWith("**")) {
      tokens.push(
        <strong key={`${keyPrefix}-b-${matchIdx}`} className="font-semibold text-inherit">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      tokens.push(
        <em key={`${keyPrefix}-i-${matchIdx}`} className="italic text-inherit">
          {token.slice(1, -1)}
        </em>,
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      tokens.push(
        <code
          key={`${keyPrefix}-c-${matchIdx}`}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("[") && token.includes("](")) {
      const closingBracket = token.indexOf("]");
      const linkText = token.slice(1, closingBracket);
      const linkUrl = token.slice(closingBracket + 2, -1);
      tokens.push(
        <a
          key={`${keyPrefix}-a-${matchIdx}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
        >
          {linkText}
        </a>,
      );
    }

    lastIndex = matchIdx + token.length;
    match = regex.exec(text);
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens;
}

export function NewsletterContentRenderer({
  content,
  variant = "editorial",
  className = "",
}: NewsletterContentRendererProps) {
  const blocks = parseBlocks(content);

  const isEmail = variant === "email";

  return (
    <div
      className={`space-y-4 ${
        isEmail ? "text-slate-700 font-sans" : "text-[var(--tsc-ink)] font-geist"
      } ${className}`}
    >
      {blocks.map((block, idx) => {
        const key = `block-${idx}`;

        switch (block.type) {
          case "h2":
            return (
              <h2
                key={key}
                className={
                  isEmail
                    ? "text-lg font-bold text-slate-900 mt-6 first:mt-0 mb-3 pb-2 border-b border-slate-100 tracking-tight"
                    : "text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)] mt-8 first:mt-0 mb-4 pb-2 border-b border-[var(--tsc-line)]"
                }
              >
                {renderInlineText(block.content || "", key)}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={key}
                className={
                  isEmail
                    ? "text-base font-semibold text-slate-900 mt-5 mb-2 tracking-tight"
                    : "text-lg font-bold text-[var(--tsc-ink)] mt-6 mb-2 tracking-tight"
                }
              >
                {renderInlineText(block.content || "", key)}
              </h3>
            );

          case "h4":
            return (
              <h4
                key={key}
                className={
                  isEmail
                    ? "text-sm font-semibold text-slate-900 mt-4 mb-1"
                    : "text-base font-bold text-[var(--tsc-ink)] mt-4 mb-1"
                }
              >
                {renderInlineText(block.content || "", key)}
              </h4>
            );

          case "ul":
            return (
              <ul key={key} className="space-y-2 mb-4 pl-0 list-none">
                {block.items?.map((item) => (
                  <li
                    key={`${key}-${item.slice(0, 32)}`}
                    className={`flex items-start gap-2.5 ${
                      isEmail
                        ? "text-xs sm:text-sm text-slate-700 leading-relaxed"
                        : "text-sm sm:text-base text-[var(--tsc-ink)] leading-relaxed"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 mt-1.5 ${
                        isEmail
                          ? "w-1.5 h-1.5 rounded-full bg-[var(--tsc-positive)]"
                          : "font-mono text-xs text-[var(--tsc-muted)] select-none"
                      }`}
                      aria-hidden="true"
                    >
                      {isEmail ? null : "+"}
                    </span>
                    <span className="flex-1">
                      {renderInlineText(item, `${key}-${item.slice(0, 16)}`)}
                    </span>
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={key} className="space-y-2 mb-4 pl-0 list-none">
                {block.items?.map((item, itemIdx) => (
                  <li
                    key={`${key}-${item.slice(0, 32)}`}
                    className={`flex items-start gap-2.5 ${
                      isEmail
                        ? "text-xs sm:text-sm text-slate-700 leading-relaxed"
                        : "text-sm sm:text-base text-[var(--tsc-ink)] leading-relaxed"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs flex-shrink-0 mt-0.5 ${
                        isEmail ? "text-slate-400 font-bold" : "text-[var(--tsc-muted)] font-bold"
                      }`}
                    >
                      {itemIdx + 1}.
                    </span>
                    <span className="flex-1">
                      {renderInlineText(item, `${key}-${item.slice(0, 16)}`)}
                    </span>
                  </li>
                ))}
              </ol>
            );

          case "blockquote":
            return (
              <div
                key={key}
                className={
                  isEmail
                    ? "my-4 p-3.5 rounded-lg bg-[var(--tsc-surface)] border-l-2 border-[var(--tsc-positive)] text-xs text-[var(--tsc-ink)] italic leading-relaxed"
                    : "my-5 p-4 rounded-[6px] bg-[var(--tsc-surface)] border-l-2 border-[var(--tsc-line-strong)] text-sm text-[var(--tsc-muted)] italic leading-relaxed"
                }
              >
                {renderInlineText(block.content || "", key)}
              </div>
            );

          default:
            return (
              <p
                key={key}
                className={
                  isEmail
                    ? "text-xs sm:text-sm text-slate-700 leading-relaxed mb-3 last:mb-0"
                    : "text-sm sm:text-base text-[var(--tsc-ink)] leading-relaxed mb-4 last:mb-0"
                }
              >
                {renderInlineText(block.content || "", key)}
              </p>
            );
        }
      })}
    </div>
  );
}
