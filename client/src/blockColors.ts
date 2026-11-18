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

export type BlockColorSet = {
  bg?: string;
  card?: string;
  accent?: string;
};

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

/** Быстрые пресеты из палитры Антарес + пара вариантов для правок. */
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
  // drop empty keys
  const entry = next[id];
  if (entry) {
    (Object.keys(entry) as (keyof BlockColorSet)[]).forEach((key) => {
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

export function applyBlockColors(map: BlockColorMap = getBlockColors()) {
  BLOCK_IDS.forEach((id) => {
    const node = document.querySelector<HTMLElement>(`[data-block="${id}"]`);
    if (!node) return;
    const colors = map[id];
    if (colors?.bg) node.style.setProperty("--block-bg", colors.bg);
    else node.style.removeProperty("--block-bg");
    if (colors?.card) node.style.setProperty("--block-card", colors.card);
    else node.style.removeProperty("--block-card");
    if (colors?.accent) node.style.setProperty("--block-accent", colors.accent);
    else node.style.removeProperty("--block-accent");
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
