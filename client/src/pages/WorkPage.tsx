import { Link, useNavigate, useParams } from "react-router-dom";
import { works } from "../data";
import { Slider } from "../components/Slider";
import { useTitle } from "../components/useTitle";
import { NotFoundPage } from "./NotFoundPage";

export function WorkPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const index = works.findIndex((item) => item.slug === slug);
  const work = works[index];
  useTitle(work ? work.title : "Проект не найден");

  if (!work || index < 0) return <NotFoundPage />;

  const previous = works[(index - 1 + works.length) % works.length];
  const next = works[(index + 1) % works.length];

  return (
    <section className="section detail">
      <p className="kicker">{work.category}</p>
      <h1>{work.title}</h1>
      <Slider
        label="Проекты"
        index={index}
        onIndexChange={(nextIndex) => {
          const target = works[nextIndex];
          if (target) navigate(`/works/${target.slug}`);
        }}
        items={works.map((item) => (
          <img key={item.slug} className="detail-photo" src={item.image} alt={item.alt} />
        ))}
      />
      <p className="lede detail-text">{work.text}</p>
      <div className="facts">
        {work.facts.map((fact) => (
          <span key={fact}>{fact}</span>
        ))}
      </div>
      <div className="detail-nav">
        <Link to={`/works/${previous.slug}`}>← {previous.title}</Link>
        <Link to={`/works/${next.slug}`}>{next.title} →</Link>
      </div>
      <Link className="button" to="/works">
        Все примеры
      </Link>
    </section>
  );
}
