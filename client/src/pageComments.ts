import { BLOCK_IDS, type BlockId } from "./blockColors";

export type PageComment = {
  id: string;
  x: number;
  y: number;
  text: string;
  blockId?: BlockId;
  createdAt: string;
};

const STORAGE_KEY = "antares-page-comments";

function scopeKey(): string {
  const match = window.location.pathname.match(/\/clients\/([^/]+)/);
  return match?.[1] ?? "base";
}

function readAll(): Record<string, PageComment[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, PageComment[]>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, PageComment[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("antares-comments"));
}

export function getPageComments(): PageComment[] {
  return readAll()[scopeKey()] ?? [];
}

export function setPageComments(comments: PageComment[]) {
  const all = readAll();
  all[scopeKey()] = comments;
  writeAll(all);
}

export function addPageComment(input: {
  x: number;
  y: number;
  text?: string;
  blockId?: BlockId;
}): PageComment {
  const comment: PageComment = {
    id: `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    x: clamp(input.x, 0, 100),
    y: clamp(input.y, 0, 100),
    text: (input.text ?? "").trim(),
    blockId: input.blockId,
    createdAt: new Date().toISOString(),
  };
  setPageComments([...getPageComments(), comment]);
  return comment;
}

export function updatePageComment(id: string, patch: Partial<Pick<PageComment, "text" | "x" | "y">>) {
  setPageComments(
    getPageComments().map((item) =>
      item.id === id
        ? {
            ...item,
            ...patch,
            text: patch.text !== undefined ? patch.text.trim() : item.text,
            x: patch.x !== undefined ? clamp(patch.x, 0, 100) : item.x,
            y: patch.y !== undefined ? clamp(patch.y, 0, 100) : item.y,
          }
        : item,
    ),
  );
}

export function removePageComment(id: string) {
  setPageComments(getPageComments().filter((item) => item.id !== id));
}

export function clearPageComments() {
  setPageComments([]);
}

export function pointFromEvent(event: MouseEvent): { x: number; y: number; blockId?: BlockId } {
  const root = document.documentElement;
  const width = Math.max(root.scrollWidth, root.clientWidth, 1);
  const height = Math.max(root.scrollHeight, root.clientHeight, 1);
  const x = ((event.clientX + window.scrollX) / width) * 100;
  const y = ((event.clientY + window.scrollY) / height) * 100;
  const block = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-block]");
  const blockId = block?.dataset.block;
  return {
    x: clamp(x, 0, 100),
    y: clamp(y, 0, 100),
    blockId: blockId && BLOCK_IDS.includes(blockId as BlockId) ? (blockId as BlockId) : undefined,
  };
}

export function sanitizeComments(raw: unknown): PageComment[] {
  if (!Array.isArray(raw)) return [];
  const result: PageComment[] = [];
  raw.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const row = item as Partial<PageComment>;
    const x = Number(row.x);
    const y = Number(row.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const text = typeof row.text === "string" ? row.text.trim() : "";
    const blockId =
      typeof row.blockId === "string" && BLOCK_IDS.includes(row.blockId as BlockId)
        ? (row.blockId as BlockId)
        : undefined;
    const comment: PageComment = {
      id:
        typeof row.id === "string" && row.id.trim()
          ? row.id.trim()
          : `c-import-${index}-${Date.now().toString(36)}`,
      x: clamp(x, 0, 100),
      y: clamp(y, 0, 100),
      text,
      createdAt: typeof row.createdAt === "string" ? row.createdAt : new Date().toISOString(),
    };
    if (blockId) comment.blockId = blockId;
    result.push(comment);
  });
  return result;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
