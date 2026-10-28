import React, { useState, useEffect } from "react";

interface BookmarkButtonProps {
  id: string;
  itemType: "news" | "opportunity";
  slug: string;
  title: string;
  sourceName: string;
  categoryOrType: string;
  className?: string;
  compact?: boolean;
}

const STORAGE_KEY = "intelligence_hub_saved_items";

export function getSavedItemIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((item: any) => item.id) : [];
  } catch {
    return [];
  }
}

export function BookmarkButton({
  id,
  itemType,
  slug,
  title,
  sourceName,
  categoryOrType,
  className = "",
  compact = false,
}: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const savedIds = getSavedItemIds();
      setIsSaved(savedIds.includes(id));
    } catch {
      // Safe fallback
    }
  }, [id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let items: any[] = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(items)) items = [];

      const existsIndex = items.findIndex((i) => i.id === id);

      if (existsIndex >= 0) {
        items.splice(existsIndex, 1);
        setIsSaved(false);
      } else {
        items.push({
          id,
          itemType,
          slug,
          title,
          sourceName,
          categoryOrType,
          savedAt: new Date().toISOString(),
        });
        setIsSaved(true);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event("intelligence_hub_storage_updated"));
    } catch (err) {
      console.error("Local storage error during bookmark toggle:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      aria-label={isSaved ? `Remove ${title} from saved items` : `Save ${title} for later`}
      title={isSaved ? "Remove from Saved Items" : "Save to Research Items"}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        isSaved
          ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800"
          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
      } ${className}`}
    >
      <span className={isSaved ? "text-amber-500 font-bold" : "text-slate-400 font-normal"}>
        {isSaved ? "★" : "☆"}
      </span>
      {!compact && <span>{isSaved ? "Saved" : "Save"}</span>}
    </button>
  );
}
