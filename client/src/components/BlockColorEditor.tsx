import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  applyBlockColors,
  BLOCK_COLOR_FIELDS,
  BLOCK_LABELS,
  COLOR_PRESETS,
  defaultDraft,
  draftForBlock,
  getBlockColors,
  getStoredEditMode,
  resetBlockColors,
  updateBlockColors,
  type BlockColorKey,
  type BlockColorSet,
  type BlockId,
} from "../blockColors";

function toColorInput(value: string | undefined, fallback: string): string {
  const raw = (value || fallback).trim();
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw;
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`;
  }
  return fallback;
}

export function BlockColorEditor() {
  const location = useLocation();
  const [editOn, setEditOn] = useState(false);
  const [selected, setSelected] = useState<BlockId | null>(null);
  const [draft, setDraft] = useState<BlockColorSet>({});
  const [presetTarget, setPresetTarget] = useState<BlockColorKey>("bg");

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
      setDraft(draftForBlock(id));
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
    <aside className="block-color-panel" aria-label="Палитра блока">
      <div className="block-color-panel-head">
        <strong>Палитра · {BLOCK_LABELS[selected]}</strong>
        <button type="button" onClick={() => setSelected(null)} aria-label="Закрыть">
          ×
        </button>
      </div>
      <p className="block-color-hint">
        Полная палитра блока: фон, текст и акцент. Пресет красится в выбранное поле ниже.
      </p>

      <div className="block-color-group">
        <p className="block-color-group-title">Поверхности</p>
        {BLOCK_COLOR_FIELDS.filter((field) => ["bg", "card", "border"].includes(field.key)).map((field) => (
          <label className="block-color-field" key={field.key}>
            <span>{field.label}</span>
            <input
              type="color"
              value={toColorInput(draft[field.key], field.fallback)}
              onChange={(event) => patch({ [field.key]: event.target.value })}
            />
            <input
              type="text"
              value={draft[field.key] || ""}
              onChange={(event) => patch({ [field.key]: event.target.value })}
              spellCheck={false}
            />
          </label>
        ))}
      </div>

      <div className="block-color-group">
        <p className="block-color-group-title">Текст</p>
        {BLOCK_COLOR_FIELDS.filter((field) => ["heading", "text", "muted"].includes(field.key)).map((field) => (
          <label className="block-color-field" key={field.key}>
            <span>{field.label}</span>
            <input
              type="color"
              value={toColorInput(draft[field.key], field.fallback)}
              onChange={(event) => patch({ [field.key]: event.target.value })}
            />
            <input
              type="text"
              value={draft[field.key] || ""}
              onChange={(event) => patch({ [field.key]: event.target.value })}
              spellCheck={false}
            />
          </label>
        ))}
      </div>

      <div className="block-color-group">
        <p className="block-color-group-title">Акцент</p>
        {BLOCK_COLOR_FIELDS.filter((field) => ["accent", "accentHover"].includes(field.key)).map((field) => (
          <label className="block-color-field" key={field.key}>
            <span>{field.label}</span>
            <input
              type="color"
              value={toColorInput(draft[field.key], field.fallback)}
              onChange={(event) => patch({ [field.key]: event.target.value })}
            />
            <input
              type="text"
              value={draft[field.key] || ""}
              onChange={(event) => patch({ [field.key]: event.target.value })}
              spellCheck={false}
            />
          </label>
        ))}
      </div>

      <label className="block-color-preset-target">
        <span>Пресет →</span>
        <select
          value={presetTarget}
          onChange={(event) => setPresetTarget(event.target.value as BlockColorKey)}
        >
          {BLOCK_COLOR_FIELDS.map((field) => (
            <option key={field.key} value={field.key}>
              {field.label}
            </option>
          ))}
        </select>
      </label>

      <div className="block-color-presets" role="group" aria-label="Пресеты">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            style={{ background: color }}
            title={`${presetTarget}: ${color}`}
            aria-label={color}
            onClick={() => patch({ [presetTarget]: color })}
          />
        ))}
      </div>

      <div className="block-color-actions">
        <button
          type="button"
          onClick={() => {
            resetBlockColors(selected);
            setDraft(draftForBlock(selected));
          }}
        >
          Сбросить блок
        </button>
        <button
          type="button"
          onClick={() => {
            resetBlockColors();
            setDraft(defaultDraft());
          }}
        >
          Сбросить все
        </button>
      </div>
    </aside>
  );
}
