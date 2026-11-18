import { works } from "../data";

export function CaseCard({
  item,
  onOpen,
}: {
  item: (typeof works)[number];
  onOpen: (slug: string) => void;
}) {
  return (
    <button className="case-card" type="button" onClick={() => onOpen(item.slug)}>
      <span className="shot">
        <img src={item.image} alt={item.alt} />
      </span>
      <div className="story-body">
        <span className="chip">{item.category}</span>
        <strong>{item.title}</strong>
        <p>{item.text}</p>
        <span className="facts">
          {item.facts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </span>
      </div>
    </button>
  );
}
