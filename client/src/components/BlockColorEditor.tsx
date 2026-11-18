import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  applyBlockColors,
  BLOCK_LABELS,
  COLOR_PRESETS,
  getBlockColors,
  getStoredEditMode,
  resetBlockColors,
  updateBlockColors,
  type BlockColorSet,
  type BlockId,
} from "../blockColors";

function readComputed(id: BlockId, key: "--block-bg" | "--block-card" | "--block-accent", fallback: string) {
  const node = document.querySelector<HTMLElement>(`[data-block="${id}"]`);
  if (!node) return fallback;
  const value = getComputedStyle(node).getPropertyValue(key).trim();
  return value || fallback;
}

export function BlockColorEditor() {
  const location = useLocation();
  const [editOn, setEditOn] = useState(false);
  const [selected, setSelected] = useState<BlockId | null>(null);
  const [draft, setDraft] = useState<BlockColorSet>({});

  useEffect(() => {
    setEditOn(getStoredEditMode());
    applyBlockColors(getBlockColors());
  }, [location.pathname]);

  useEffect(() => {
    const onMode = () => setEditOn(getStoredEditMode());
    window.addEventListener("antares-edit-mode", onMode);
    return () => window.removeEventListener("antares-edit-mode", onMode);
  }, []);

  useEffect(() => {
    if (!editOn) {
      setSelected(null);
      return;
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(".block-color-panel") || target.closest(".header") || target.closest(".sticky-actions")) {
        return;
      }
      const block = target.closest<HTMLElement>("[data-block]");
      if (!block?.dataset.block) {
        setSelected(null);
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const id = block.dataset.block as BlockId;
      document.querySelectorAll("[data-block].is-editing").forEach((node) => {
        node.classList.remove("is-editing");
      });
      block.classList.add("is-editing");
      block.scrollIntoView({ behavior: "smooth", block: "nearest" });
      const saved = getBlockColors()[id] ?? {};
      setDraft({
        bg: saved.bg || readComputed(id, "--block-bg", "#0C1224"),
        card: saved.card || readComputed(id, "--block-card", "#0C1224"),
        accent: saved.accent || readComputed(id, "--block-accent", "#0039C7"),
      });
      setSelected(id);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [editOn]);

  if (!editOn || !selected) return null;

  function patch(next: BlockColorSet) {
    setDraft((prev) => ({ ...prev, ...next }));
    updateBlockColors(selected!, next);
  }

  return (
    <aside className="block-color-panel" aria-label="Цвета блока">
      <div className="block-color-panel-head">
        <strong>{BLOCK_LABELS[selected]}</strong>
        <button type="button" onClick={() => setSelected(null)} aria-label="Закрыть">
          ×
        </button>
      </div>
      <p className="block-color-hint">Клик по блоку на странице — выбор. Цвета сохраняются для текущего шаблона.</p>

      <label className="block-color-field">
        <span>Фон блока</span>
        <input
          type="color"
          value={draft.bg || "#0C1224"}
          onChange={(event) => patch({ bg: event.target.value })}
        />
        <input
          type="text"
          value={draft.bg || ""}
          onChange={(event) => patch({ bg: event.target.value })}
          spellCheck={false}
        />
      </label>

      <label className="block-color-field">
        <span>Карточки</span>
        <input
          type="color"
          value={draft.card || "#0C1224"}
          onChange={(event) => patch({ card: event.target.value })}
        />
        <input
          type="text"
          value={draft.card || ""}
          onChange={(event) => patch({ card: event.target.value })}
          spellCheck={false}
        />
      </label>

      <label className="block-color-field">
        <span>Акцент</span>
        <input
          type="color"
          value={draft.accent || "#0039C7"}
          onChange={(event) => patch({ accent: event.target.value })}
        />
        <input
          type="text"
          value={draft.accent || ""}
          onChange={(event) => patch({ accent: event.target.value })}
          spellCheck={false}
        />
      </label>

      <div className="block-color-presets" role="group" aria-label="Пресеты">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            style={{ background: color }}
            title={color}
            aria-label={color}
            onClick={() => patch({ bg: color })}
          />
        ))}
      </div>

      <div className="block-color-actions">
        <button
          type="button"
          onClick={() => {
            resetBlockColors(selected);
            setDraft({
              bg: readComputed(selected, "--block-bg", "#0C1224"),
              card: readComputed(selected, "--block-card", "#0C1224"),
              accent: readComputed(selected, "--block-accent", "#0039C7"),
            });
          }}
        >
          Сбросить блок
        </button>
        <button
          type="button"
          onClick={() => {
            resetBlockColors();
            setDraft({
              bg: "#0C1224",
              card: "#0C1224",
              accent: "#0039C7",
            });
          }}
        >
          Сбросить все
        </button>
      </div>
    </aside>
  );
}
