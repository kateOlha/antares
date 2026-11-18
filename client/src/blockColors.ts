export type BlockId =
  | "hero"
  | "works"
  | "about"
  | "services"
  | "band"
  | "process"
  | "faq"
  | "audiences"
  | "contact";

export type BlockColorKey =
  | "bg"
  | "card"
  | "accent"
  | "accentHover"
  | "heading"
  | "text"
  | "muted"
  | "border";

export type BlockColorSet = Partial<Record<BlockColorKey, string>>;

export type BlockColorMap = Partial<Record<BlockId, BlockColorSet>>;

export const BLOCK_LABELS: Record<BlockId, string> = {
  hero: "Hero",
  works: "Работы",
  about: "О нас",
  services: "Услуги",
  band: "Полоса",
  process: "Процесс",
  faq: "FAQ",
  audiences: "Аудитории",
  contact: "Контакты",
};

export const BLOCK_IDS = Object.keys(BLOCK_LABELS) as BlockId[];

export const BLOCK_COLOR_FIELDS: {
  key: BlockColorKey;
  label: string;
  css: string;
  fallback: string;
}[] = [
  { key: "bg", label: "Фон", css: "--block-bg", fallback: "#0C1224" },
  { key: "card", label: "Карточки", css: "--block-card", fallback: "#0C1224" },
  { key: "border", label: "Граница", css: "--block-border", fallback: "#1A2744" },
  { key: "heading", label: "Заголовок", css: "--block-heading", fallback: "#E8ECF5" },
  { key: "text", label: "Текст", css: "--block-text", fallback: "#C5CAD8" },
  { key: "muted", label: "Вторичный", css: "--block-muted", fallback: "#8B93A8" },
  { key: "accent", label: "Акцент", css: "--block-accent", fallback: "#0039C7" },
  { key: "accentHover", label: "Акцент hover", css: "--block-accent-hover", fallback: "#002FA6" },
];

/** Быстрые пресеты из палитры Антарес. */
export const COLOR_PRESETS = [
  "#050814",
  "#0C1224",
  "#303441",
  "#1A2744",
  "#0039C7",
  "#002FA6",
  "#15223c",
  "#E8ECF5",
  "#C5CAD8",
  "#8B93A8",
] as const;

const STORAGE_KEY = "antares-block-colors";
const EDIT_KEY = "antares-edit-mode";

function scopeKey(): string {
  const match = window.location.pathname.match(/\/clients\/([^/]+)/);
  return match?.[1] ?? "base";
}

function readAll(): Record<string, BlockColorMap> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, BlockColorMap>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, BlockColorMap>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getBlockColors(): BlockColorMap {
  return readAll()[scopeKey()] ?? {};
}

export function setBlockColors(map: BlockColorMap) {
  const all = readAll();
  all[scopeKey()] = map;
  writeAll(all);
  applyBlockColors(map);
}

export function updateBlockColors(id: BlockId, patch: BlockColorSet) {
  const current = getBlockColors();
  const next: BlockColorMap = {
    ...current,
    [id]: { ...current[id], ...patch },
  };
  const entry = next[id];
  if (entry) {
    (Object.keys(entry) as BlockColorKey[]).forEach((key) => {
      if (!entry[key]) delete entry[key];
    });
    if (Object.keys(entry).length === 0) delete next[id];
  }
  setBlockColors(next);
}

export function resetBlockColors(id?: BlockId) {
  if (!id) {
    setBlockColors({});
    return;
  }
  const current = { ...getBlockColors() };
  delete current[id];
  setBlockColors(current);
}

export function defaultDraft(): BlockColorSet {
  return Object.fromEntries(BLOCK_COLOR_FIELDS.map((field) => [field.key, field.fallback])) as BlockColorSet;
}

export function draftForBlock(id: BlockId): BlockColorSet {
  const saved = getBlockColors()[id] ?? {};
  const node = document.querySelector<HTMLElement>(`[data-block="${id}"]`);
  const draft: BlockColorSet = {};
  BLOCK_COLOR_FIELDS.forEach((field) => {
    const fromSaved = saved[field.key];
    const fromCss = node?.style.getPropertyValue(field.css).trim();
    draft[field.key] = fromSaved || fromCss || field.fallback;
  });
  return draft;
}

export function applyBlockColors(map: BlockColorMap = getBlockColors()) {
  BLOCK_IDS.forEach((id) => {
    const node = document.querySelector<HTMLElement>(`[data-block="${id}"]`);
    if (!node) return;
    const colors = map[id];
    BLOCK_COLOR_FIELDS.forEach((field) => {
      const value = colors?.[field.key];
      if (value) node.style.setProperty(field.css, value);
      else node.style.removeProperty(field.css);
    });
  });
}

export function getStoredEditMode(): boolean {
  return localStorage.getItem(EDIT_KEY) === "on";
}

export function setEditMode(on: boolean) {
  document.documentElement.setAttribute("data-edit-mode", on ? "on" : "off");
  localStorage.setItem(EDIT_KEY, on ? "on" : "off");
  if (!on) {
    document.querySelectorAll("[data-block].is-editing").forEach((node) => {
      node.classList.remove("is-editing");
    });
  }
}

export function initBlockColors() {
  setEditMode(getStoredEditMode());
  applyBlockColors();
}

export type ThemeScheme = {
  version: 1;
  kind: "antares-theme-scheme";
  scope: string;
  exportedAt: string;
  blocks: BlockColorMap;
};

export function getScopeKey(): string {
  return scopeKey();
}

export function buildThemeScheme(): ThemeScheme {
  return {
    version: 1,
    kind: "antares-theme-scheme",
    scope: scopeKey(),
    exportedAt: new Date().toISOString(),
    blocks: getBlockColors(),
  };
}

export function themeSchemeToJson(scheme: ThemeScheme = buildThemeScheme()): string {
  return `${JSON.stringify(scheme, null, 2)}\n`;
}

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.trim());
}

export function parseThemeScheme(raw: string): ThemeScheme {
  const parsed = JSON.parse(raw) as Partial<ThemeScheme> & { blocks?: unknown };
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Не JSON-объект");
  }

  let blocks: BlockColorMap = {};

  if (parsed.kind === "antares-theme-scheme" && parsed.blocks && typeof parsed.blocks === "object") {
    blocks = parsed.blocks as BlockColorMap;
  } else if (!parsed.kind && parsed.blocks && typeof parsed.blocks === "object") {
    blocks = parsed.blocks as BlockColorMap;
  } else if (!parsed.kind && !parsed.blocks && typeof parsed === "object") {
    // plain map: { hero: { bg: "#..." }, ... }
    blocks = parsed as BlockColorMap;
  } else {
    throw new Error("Не похоже на схему оформления Антарес");
  }

  const cleaned: BlockColorMap = {};
  Object.entries(blocks).forEach(([blockId, colors]) => {
    if (!BLOCK_IDS.includes(blockId as BlockId) || !colors || typeof colors !== "object") return;
    const entry: BlockColorSet = {};
    BLOCK_COLOR_FIELDS.forEach((field) => {
      const value = (colors as BlockColorSet)[field.key];
      if (isHexColor(value)) entry[field.key] = value.trim();
    });
    if (Object.keys(entry).length) cleaned[blockId as BlockId] = entry;
  });

  return {
    version: 1,
    kind: "antares-theme-scheme",
    scope: typeof parsed.scope === "string" ? parsed.scope : scopeKey(),
    exportedAt: typeof parsed.exportedAt === "string" ? parsed.exportedAt : new Date().toISOString(),
    blocks: cleaned,
  };
}

export function importThemeScheme(raw: string): ThemeScheme {
  const scheme = parseThemeScheme(raw);
  setBlockColors(scheme.blocks);
  return scheme;
}

export async function copyThemeScheme(): Promise<void> {
  const json = themeSchemeToJson();
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(json);
    return;
  }
  const area = document.createElement("textarea");
  area.value = json;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
}

export function downloadThemeScheme() {
  const scheme = buildThemeScheme();
  const blob = new Blob([themeSchemeToJson(scheme)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `antares-theme-${scheme.scope}-${scheme.exportedAt.slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
