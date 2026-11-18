import { useEffect, useRef, type ReactNode } from "react";
import { Lines } from "./Lines";
import { Modal } from "./Modal";

export type CaseItem = {
  slug: string;
  image: string;
  alt: string;
  kicker: string;
  title: string;
  text: string;
  facts?: string[];
};

export function CaseDialog({
  items,
  index,
  label,
  pointsLabel = "Что учли",
  onIndex,
  onClose,
  extra,
}: {
  items: CaseItem[];
  index: number;
  label: string;
  pointsLabel?: string;
  onIndex: (index: number) => void;
  onClose: () => void;
  extra?: ReactNode;
}) {
  const film = useRef<HTMLDivElement>(null);
  const item = items[index];
  const total = items.length;
  const previous = (index - 1 + total) % total;
  const next = (index + 1) % total;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") onIndex(previous);
      if (event.key === "ArrowRight") onIndex(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, onIndex, previous]);

  useEffect(() => {
    const parent = film.current;
    const node = parent?.querySelector<HTMLElement>(".case-thumb.on");
    if (!parent || !node) return;
    parent.scrollTo({
      left: node.offsetLeft - parent.clientWidth / 2 + node.clientWidth / 2,
      behavior: "smooth",
    });
  }, [index]);

  if (!item) return null;

  const count = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <Modal title={item.title.replaceAll("\n", " ")} onClose={onClose}>
      <article className="case">
        <div className="case-stage">
          <div className="case-frame">
            <img key={item.slug} src={item.image} alt={item.alt} />
            <p className="case-count">{count}</p>
            <button
              className="case-arrow is-prev"
              type="button"
              aria-label={`${label}: предыдущий`}
              onClick={() => onIndex(previous)}
            >
              ‹
            </button>
            <button
              className="case-arrow is-next"
              type="button"
              aria-label={`${label}: следующий`}
              onClick={() => onIndex(next)}
            >
              ›
            </button>
          </div>
          <div className="case-film" ref={film} role="tablist" aria-label={label}>
            {items.map((entry, entryIndex) => (
              <button
                key={entry.slug}
                className={entryIndex === index ? "case-thumb on" : "case-thumb"}
                type="button"
                role="tab"
                aria-selected={entryIndex === index}
                aria-label={entry.title.replaceAll("\n", " ")}
                onClick={() => onIndex(entryIndex)}
              >
                <img src={entry.image} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="case-copy" key={item.slug}>
          <p className="kicker">{item.kicker}</p>
          <h3 className="modal-heading">
            <Lines text={item.title} />
          </h3>
          <p className="case-lead">{item.text}</p>
          {item.facts && item.facts.length > 0 && (
            <div className="case-points">
              <p className="case-label">{pointsLabel}</p>
              <ol>
                {item.facts.map((fact, factIndex) => (
                  <li key={fact}>
                    <span>{String(factIndex + 1).padStart(2, "0")}</span>
                    {fact}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {extra}
        </div>
        <div className="case-switch">
          <button className="case-jump" type="button" onClick={() => onIndex(previous)}>
            <span className="case-jump-photo">
              <img src={items[previous].image} alt="" />
            </span>
            <span>
              <small>Предыдущий</small>
              <strong>{items[previous].title.replaceAll("\n", " ")}</strong>
            </span>
          </button>
          <button className="case-jump is-next" type="button" onClick={() => onIndex(next)}>
            <span>
              <small>Следующий</small>
              <strong>{items[next].title.replaceAll("\n", " ")}</strong>
            </span>
            <span className="case-jump-photo">
              <img src={items[next].image} alt="" />
            </span>
          </button>
        </div>
      </article>
    </Modal>
  );
}
