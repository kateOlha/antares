/** Учитывает Vite `base` (локально `/`, на Pages `/antares/`). */
export function asset(path: string): string {
  const clean = path.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}
