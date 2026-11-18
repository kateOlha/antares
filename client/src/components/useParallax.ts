import { type RefObject, useEffect } from "react";

/** Слои с data-parallax="скорость" (отрицательная — медленнее скролла). */
export function useParallax(rootRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;

    function tick() {
      frame = 0;
      const scope = rootRef?.current ?? document;
      const layers = scope.querySelectorAll<HTMLElement>("[data-parallax]");
      const vh = window.innerHeight;

      layers.forEach((node) => {
        const speed = Number(node.dataset.parallax);
        if (!Number.isFinite(speed) || speed === 0) return;

        const rect = node.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > vh + 120) return;

        const centerOffset = rect.top + rect.height * 0.5 - vh * 0.5;
        const y = centerOffset * speed;
        node.style.translate = `0 ${y.toFixed(2)}px`;
      });
    }

    function requestTick() {
      if (frame) return;
      frame = window.requestAnimationFrame(tick);
    }

    tick();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);

    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [rootRef]);
}
