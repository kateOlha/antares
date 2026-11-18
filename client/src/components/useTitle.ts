import { useEffect } from "react";

export function useTitle(title: string) {
  useEffect(() => {
    document.title =
      title === "Главная" ? "Антарес — мастерская полного цикла" : `${title} — Антарес`;
  }, [title]);
}
