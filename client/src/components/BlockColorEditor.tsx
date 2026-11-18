import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  applyBlockColors,
  BLOCK_COLOR_FIELDS,
  BLOCK_LABELS,
  COLOR_PRESETS,
  copyThemeScheme,
  defaultDraft,
  downloadThemeScheme,
  draftForBlock,
  getBlockColors,
  getScopeKey,
  getStoredEditMode,
  importThemeScheme,
  resetBlockColors,
  themeSchemeToJson,
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
  const fileRef = useRef<HTMLInputElement>(null);
  const [editOn, setEditOn] = useState(false);
  const [selected, setSelected] = useState<BlockId | null>(null);
  const [draft, setDraft] = useState<BlockColorSet>({});
  const [presetTarget, setPresetTarget] = useState<BlockColorKey>("bg");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [status, setStatus] = useState<string | null>(null);

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
      setPasteOpen(false);
      setStatus(null);
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

  if (!editOn) return null;

  function patch(next: BlockColorSet) {
    if (!selected) return;
    setDraft((prev) => ({ ...prev, ...next }));
    updateBlockColors(selected, next);
  }

  function flash(message: string) {
    setStatus(message);
    window.setTimeout(() => setStatus(null), 2400);
  }

  async function onCopy() {
    try {
      await copyThemeScheme();
      flash("Схема скопирована в буфер");
    } catch {
      flash("Не удалось скопировать");
    }
  }

  function onDownload() {
    downloadThemeScheme();
    flash("JSON скачан");
  }

  function onImportRaw(raw: string) {
    try {
      const scheme = importThemeScheme(raw);
      if (selected) setDraft(draftForBlock(selected));
      setPasteOpen(false);
      setPasteText("");
      flash(`Импорт: ${Object.keys(scheme.blocks).length} блоков`);
    } catch (error) {
      flash(error instanceof Error ? error.message : "Ошибка импорта");
    }
  }

  async function onPasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        flash("Буфер пуст");
        return;
      }
      onImportRaw(text);
    } catch {
      setPasteOpen(true);
      flash("Вставь JSON вручную");
    }
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onImportRaw(String(reader.result ?? ""));
    reader.onerror = () => flash("Не удалось прочитать файл");
    reader.readAsText(file);
  }

  return (
    <aside className="block-color-panel" aria-label="Палитра блока">
      <div className="block-color-panel-head">
        <strong>{selected ? `Палитра · ${BLOCK_LABELS[selected]}` : "Схема оформления"}</strong>
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            document.querySelectorAll("[data-block].is-editing").forEach((node) => {
              node.classList.remove("is-editing");
            });
          }}
          aria-label="Свернуть выбор"
        >
          ×
        </button>
      </div>

      {!selected ? (
        <p className="block-color-hint">Кликни блок на странице, чтобы править цвета. Ниже — обмен схемой.</p>
      ) : (
        <p className="block-color-hint">
          Шаблон: <code>{getScopeKey()}</code>. Полная палитра блока + экспорт схемы.
        </p>
      )}

      {selected ? (
        <>
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
        </>
      ) : null}

      <div className="block-color-group block-color-scheme">
        <p className="block-color-group-title">Схема · {getScopeKey()}</p>
        <div className="block-color-actions">
          <button type="button" onClick={() => void onCopy()}>
            Копировать JSON
          </button>
          <button type="button" onClick={onDownload}>
            Скачать JSON
          </button>
          <button type="button" onClick={() => void onPasteFromClipboard()}>
            Вставить JSON
          </button>
          <button type="button" onClick={() => fileRef.current?.click()}>
            Загрузить файл
          </button>
          <button type="button" onClick={() => setPasteOpen((value) => !value)}>
            {pasteOpen ? "Скрыть поле" : "Вставить вручную"}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json,text/plain"
          hidden
          onChange={(event) => {
            onFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        {pasteOpen ? (
          <div className="block-color-paste">
            <textarea
              value={pasteText}
              onChange={(event) => setPasteText(event.target.value)}
              placeholder='{"version":1,"kind":"antares-theme-scheme","blocks":{...}}'
              rows={7}
              spellCheck={false}
            />
            <div className="block-color-actions">
              <button type="button" onClick={() => onImportRaw(pasteText)}>
                Применить
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasteText(themeSchemeToJson());
                  flash("Текущая схема в поле");
                }}
              >
                Подставить текущую
              </button>
            </div>
          </div>
        ) : null}
        {status ? <p className="block-color-status">{status}</p> : null}
      </div>
    </aside>
  );
}
