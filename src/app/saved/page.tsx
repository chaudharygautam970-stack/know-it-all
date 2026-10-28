import React, { useState, useEffect } from "react";
import { EmptyState } from "../../components/ui/EmptyState.tsx";
import { formatDateTime } from "../../lib/design-system.ts";

interface SavedItemRecord {
  id: string;
  itemType: "news" | "opportunity";
  slug: string;
  title: string;
  sourceName: string;
  categoryOrType: string;
  savedAt: string;
  userNotes?: string;
}

const STORAGE_KEY = "intelligence_hub_saved_items";

export default function SavedItemsPage() {
  const [savedItems, setSavedItems] = useState<SavedItemRecord[]>([]);
  const [filterType, setFilterType] = useState<"all" | "news" | "opportunity">("all");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState("");

  const loadItems = () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedItems(parsed);
          return;
        }
      }
      setSavedItems([]);
    } catch {
      setSavedItems([]);
    }
  };

  useEffect(() => {
    loadItems();
    window.addEventListener("intelligence_hub_storage_updated", loadItems);
    window.addEventListener("storage", loadItems);

    return () => {
      window.removeEventListener("intelligence_hub_storage_updated", loadItems);
      window.removeEventListener("storage", loadItems);
    };
  }, []);

  const handleRemove = (id: string) => {
    try {
      const updated = savedItems.filter((i) => i.id !== id);
      setSavedItems(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("intelligence_hub_storage_updated"));
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  const handleStartEditNote = (item: SavedItemRecord) => {
    setEditingNoteId(item.id);
    setTempNoteText(item.userNotes || "");
  };

  const handleSaveNote = (id: string) => {
    try {
      const updated = savedItems.map((item) => {
        if (item.id === id) {
          return { ...item, userNotes: tempNoteText.trim() };
        }
        return item;
      });
      setSavedItems(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setEditingNoteId(null);
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const filteredItems = savedItems.filter((item) => {
    if (filterType === "all") return true;
    return item.itemType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Saved Research & Bookmarks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personal repository of pinned scholarships, research grants, and technical intelligence dispatches.
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <strong>{savedItems.length}</strong> items saved in local workspace
        </div>
      </div>

      {/* Filter Tabs */}
      {savedItems.length > 0 && (
        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === "all"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            All Saved ({savedItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("opportunity")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === "opportunity"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            Opportunities ({savedItems.filter((i) => i.itemType === "opportunity").length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("news")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === "news"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            News & Tech ({savedItems.filter((i) => i.itemType === "news").length})
          </button>
        </div>
      )}

      {/* List or Empty State */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No saved items yet"
          description={
            savedItems.length === 0
              ? "You haven't bookmarked any opportunities or news records yet. Click the 'Save' button on any card to pin it here."
              : "No saved items match the selected filter."
          }
          actionHref="/opportunities"
          actionLabel="Browse Opportunities Catalog"
        />
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const detailUrl =
              item.itemType === "opportunity"
                ? `/opportunities/${item.slug}`
                : `/news/${item.slug}`;

            const isEditingNote = editingNoteId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase">
                        {item.categoryOrType}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Saved {formatDateTime(item.savedAt)}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      <a href={detailUrl} className="hover:text-indigo-600 transition-colors">
                        {item.title}
                      </a>
                    </h3>
                    <div className="text-xs text-slate-500">
                      Issuing Entity / Source: <strong>{item.sourceName}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={detailUrl}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Open Detail
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Personal Notes Surface */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {isEditingNote ? (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Research Notes:
                      </label>
                      <textarea
                        value={tempNoteText}
                        onChange={(e) => setTempNoteText(e.target.value)}
                        placeholder="Add personal application notes, faculty advisor thoughts, or checklist items..."
                        rows={2}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveNote(item.id)}
                          className="px-2.5 py-1 bg-indigo-600 text-white rounded text-xs font-semibold"
                        >
                          Save Note
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingNoteId(null)}
                          className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="text-slate-600 dark:text-slate-400">
                        {item.userNotes ? (
                          <span>
                            <strong className="text-slate-700 dark:text-slate-300">Note:</strong> {item.userNotes}
                          </span>
                        ) : (
                          <span className="italic text-slate-400">No personal notes added yet.</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartEditNote(item)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold ml-2 shrink-0"
                      >
                        {item.userNotes ? "Edit Note" : "+ Add Note"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
