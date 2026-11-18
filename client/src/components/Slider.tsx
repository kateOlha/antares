import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

const gap = 24;

function perViewFor(width: number, columns: number) {
  if (width < 720) return 1;
  if (width < 1100) return Math.min(2, columns);
  return columns;
}

export function Slider({
  items,
  label,
  columns = 1,
  index,
  onIndexChange,
}: {
  items: ReactNode[];
  label: string;
  columns?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [inner, setInner] = useState(0);
  const drag = useRef({ x: 0, active: false, suppressClick: false });

  useLayoutEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const update = () => setWidth(node.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const perView = perViewFor(width || 1280, columns);
  const max = Math.max(0, items.length - perView);
  const raw = index ?? inner;
  const page = Math.min(Math.max(0, raw), max);

  useEffect(() => {
    if (index === undefined && inner > max) setInner(max);
  }, [index, inner, max]);

  function go(next: number) {
    const clamped = Math.max(0, Math.min(max, next));
    if (onIndexChange) onIndexChange(clamped);
    else setInner(clamped);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    drag.current = { x: event.clientX, active: true, suppressClick: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const delta = event.clientX - drag.current.x;
    drag.current.active = false;
    if (Math.abs(delta) < 56) return;
    drag.current.suppressClick = true;
    if (delta > 0) go(page - 1);
    else go(page + 1);
  }

  function onClickCapture(event: { preventDefault: () => void; stopPropagation: () => void }) {
    if (!drag.current.suppressClick) return;
    drag.current.suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }

  const slideWidth = width > 0 ? (width - gap * (perView - 1)) / perView : 0;
  const shift = page * (slideWidth + gap);

  if (items.length === 0) return null;

  return (
    <div
      className="slider"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") go(page - 1);
        if (event.key === "ArrowRight") go(page + 1);
      }}
    >
      <div
        className="slider-viewport"
        ref={viewport}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClickCapture={onClickCapture}
        onPointerCancel={() => {
          drag.current.active = false;
        }}
      >
        <div className="slider-track" style={{ transform: `translate3d(${-shift}px, 0, 0)`, gap }}>
          {items.map((item, itemIndex) => (
            <div key={itemIndex} className="slider-slide" style={{ width: slideWidth || "100%" }}>
              {item}
            </div>
          ))}
        </div>
      </div>
      {max > 0 && (
        <div className="slider-bar">
          <button
            type="button"
            className="slider-arrow"
            aria-label={`${label}: предыдущий слайд`}
            onClick={() => go(page - 1)}
            disabled={page === 0}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <div className="slider-dots" role="tablist" aria-label={label}>
            {Array.from({ length: max + 1 }, (_, dot) => (
              <button
                key={dot}
                type="button"
                role="tab"
                aria-selected={dot === page}
                aria-label={`${label}, слайд ${dot + 1} из ${max + 1}`}
                className={dot === page ? "dot on" : "dot"}
                onClick={() => go(dot)}
              />
            ))}
          </div>
          <button
            type="button"
            className="slider-arrow"
            aria-label={`${label}: следующий слайд`}
            onClick={() => go(page + 1)}
            disabled={page === max}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      )}
    </div>
  );
}
