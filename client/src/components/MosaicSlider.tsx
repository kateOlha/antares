import { useState } from "react";
import { works } from "../data";
import { CaseCard } from "./CaseCard";

const size = 6;

export function MosaicSlider({ onOpen }: { onOpen: (slug: string) => void }) {
  const pages = Math.ceil(works.length / size);
  const [page, setPage] = useState(0);
  const slice = works.slice(page * size, page * size + size);

  function step(delta: number) {
    setPage((current) => (current + delta + pages) % pages);
  }

  return (
    <div className="slider">
      <div className="work-grid mosaic-page" key={page}>
        {slice.map((item) => (
          <CaseCard key={item.slug} item={item} onOpen={onOpen} />
        ))}
      </div>
      <nav className="pager pager-round" aria-label="Подборки работ">
        <button type="button" aria-label="Предыдущая подборка" onClick={() => step(-1)}>
          ‹
        </button>
        {Array.from({ length: pages }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-current={index === page ? "page" : undefined}
            aria-label={`Подборка ${index + 1}`}
            onClick={() => setPage(index)}
          >
            {index + 1}
          </button>
        ))}
        <button type="button" aria-label="Следующая подборка" onClick={() => step(1)}>
          ›
        </button>
      </nav>
    </div>
  );
}
