import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { BLOCK_LABELS, getStoredEditMode } from "../blockColors";
import {
  addPageComment,
  getPageComments,
  pointFromEvent,
  removePageComment,
  updatePageComment,
  type PageComment,
} from "../pageComments";

type Tool = "idle" | "place";

export function PageCommentsOverlay() {
  const location = useLocation();
  const [editOn, setEditOn] = useState(false);
  const [tool, setTool] = useState<Tool>("idle");
  const [comments, setComments] = useState<PageComment[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [layerHeight, setLayerHeight] = useState(0);

  function refresh() {
    setComments(getPageComments());
  }

  function syncLayerHeight() {
    setLayerHeight(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight));
  }

  useEffect(() => {
    setEditOn(getStoredEditMode());
    refresh();
    setActiveId(null);
    setTool("idle");
    syncLayerHeight();
  }, [location.pathname]);

  useEffect(() => {
    const onMode = () => {
      const on = getStoredEditMode();
      setEditOn(on);
      if (!on) setTool("idle");
    };
    const onComments = () => {
      refresh();
      syncLayerHeight();
    };
    window.addEventListener("antares-edit-mode", onMode);
    window.addEventListener("antares-comments", onComments);
    window.addEventListener("resize", syncLayerHeight);
    window.addEventListener("scroll", syncLayerHeight, { passive: true });
    syncLayerHeight();
    return () => {
      window.removeEventListener("antares-edit-mode", onMode);
      window.removeEventListener("antares-comments", onComments);
      window.removeEventListener("resize", syncLayerHeight);
      window.removeEventListener("scroll", syncLayerHeight);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.commentTool = editOn && tool === "place" ? "place" : "off";
    return () => {
      document.documentElement.dataset.commentTool = "off";
    };
  }, [editOn, tool]);

  useEffect(() => {
    if (!editOn || tool !== "place") return;

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest(".block-color-panel") ||
        target.closest(".header") ||
        target.closest(".sticky-actions") ||
        target.closest(".page-comment-pin") ||
        target.closest(".page-comment-card") ||
        target.closest(".page-comments-toolbar")
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const point = pointFromEvent(event);
      const created = addPageComment(point);
      setActiveId(created.id);
      setTool("idle");
      refresh();
      syncLayerHeight();
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [editOn, tool]);

  if (!editOn && comments.length === 0) return null;

  const active = comments.find((item) => item.id === activeId) ?? null;

  return createPortal(
    <>
      {editOn ? (
        <div className="page-comments-toolbar" role="group" aria-label="Комментарии">
          <button
            type="button"
            className={tool === "place" ? "on" : undefined}
            aria-pressed={tool === "place"}
            onClick={() => setTool((value) => (value === "place" ? "idle" : "place"))}
          >
            {tool === "place" ? "Кликните по экрану…" : "＋ Комментарий"}
          </button>
          <span className="page-comments-count">{comments.length}</span>
        </div>
      ) : null}

      <div
        className={tool === "place" ? "page-comments-layer is-placing" : "page-comments-layer"}
        style={{ height: layerHeight || undefined }}
        aria-label="Комментарии на странице"
      >
        {comments.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={item.id === activeId ? "page-comment-pin on" : "page-comment-pin"}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            title={item.text || "Комментарий"}
            aria-label={`Комментарий ${index + 1}`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setActiveId(item.id);
              setTool("idle");
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {active ? (
        <div className="page-comment-card" role="dialog" aria-label="Комментарий">
          <div className="page-comment-card-head">
            <strong>
              #{comments.findIndex((item) => item.id === active.id) + 1}
              {active.blockId ? ` · ${BLOCK_LABELS[active.blockId]}` : ""}
            </strong>
            <button type="button" aria-label="Закрыть" onClick={() => setActiveId(null)}>
              ×
            </button>
          </div>
          {editOn ? (
            <textarea
              value={active.text}
              placeholder="Текст комментария…"
              rows={4}
              onChange={(event) => {
                updatePageComment(active.id, { text: event.target.value });
                refresh();
              }}
            />
          ) : (
            <p className="page-comment-text">{active.text || "Без текста"}</p>
          )}
          {editOn ? (
            <div className="page-comment-card-actions">
              <button
                type="button"
                onClick={() => {
                  removePageComment(active.id);
                  setActiveId(null);
                  refresh();
                }}
              >
                Удалить
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>,
    document.body,
  );
}
