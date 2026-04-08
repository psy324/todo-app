"use client";

import type { Tag } from "@/types";

interface TagBadgeProps {
  tag: Tag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        color: "var(--text-3)",
        letterSpacing: "0.02em",
      }}
    >
      #{tag.name}
    </span>
  );
}
