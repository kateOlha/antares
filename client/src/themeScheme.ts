import {
  BLOCK_COLOR_FIELDS,
  BLOCK_IDS,
  getBlockColors,
  getScopeKey,
  setBlockColors,
  type BlockColorMap,
  type BlockColorSet,
  type BlockId,
} from "./blockColors";
import {
  getPageComments,
  sanitizeComments,
  setPageComments,
  type PageComment,
} from "./pageComments";

export type ThemeScheme = {
  version: 1 | 2;
  kind: "antares-theme-scheme";
  scope: string;
  exportedAt: string;
  blocks: BlockColorMap;
  comments?: PageComment[];
};

export function buildThemeScheme(): ThemeScheme {
  return {
    version: 2,
    kind: "antares-theme-scheme",
    scope: getScopeKey(),
    exportedAt: new Date().toISOString(),
    blocks: getBlockColors(),
    comments: getPageComments(),
  };
}

export function themeSchemeToJson(scheme: ThemeScheme = buildThemeScheme()): string {
  return `${JSON.stringify(scheme, null, 2)}\n`;
}

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.trim());
}

export function parseThemeScheme(raw: string): ThemeScheme {
  const parsed = JSON.parse(raw) as Partial<ThemeScheme> & { blocks?: unknown; comments?: unknown };
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Не JSON-объект");
  }

  let blocks: BlockColorMap = {};
  let comments: PageComment[] = [];

  if (parsed.kind === "antares-theme-scheme") {
    if (parsed.blocks && typeof parsed.blocks === "object") blocks = parsed.blocks as BlockColorMap;
    comments = sanitizeComments(parsed.comments);
  } else if (parsed.blocks && typeof parsed.blocks === "object") {
    blocks = parsed.blocks as BlockColorMap;
    comments = sanitizeComments(parsed.comments);
  } else if (Array.isArray(parsed.comments) && !parsed.blocks) {
    comments = sanitizeComments(parsed.comments);
  } else if (!parsed.kind && !parsed.blocks && !parsed.comments && typeof parsed === "object") {
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
    version: 2,
    kind: "antares-theme-scheme",
    scope: typeof parsed.scope === "string" ? parsed.scope : getScopeKey(),
    exportedAt: typeof parsed.exportedAt === "string" ? parsed.exportedAt : new Date().toISOString(),
    blocks: cleaned,
    comments,
  };
}

export function importThemeScheme(raw: string): ThemeScheme {
  const scheme = parseThemeScheme(raw);
  setBlockColors(scheme.blocks);
  setPageComments(scheme.comments ?? []);
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
  link.download = `antares-scheme-${scheme.scope}-${scheme.exportedAt.slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
