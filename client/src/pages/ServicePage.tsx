import { Link, useNavigate, useParams } from "react-router-dom";
import { services } from "../data";
import { Lines } from "../components/Lines";
import { Slider } from "../components/Slider";
import { useTitle } from "../components/useTitle";
import { NotFoundPage } from "./NotFoundPage";

export function ServicePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const index = services.findIndex((item) => item.slug === slug);
  const service = services[index];
  useTitle(service ? service.title.replace("\n", " ") : "Услуга не найдена");

  if (!service) return <NotFoundPage />;

  const previous = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];

  return (
    <section className="section detail">
      <p className="kicker">{service.caption}</p>
      <h1>
        <Lines text={service.title} />
      </h1>
      <Slider
        label="Услуги"
        index={index}
        onIndexChange={(nextIndex) => {
          const target = services[nextIndex];
          if (target) navigate(`/services/${target.slug}`);
        }}
        items={services.map((item) => (
          <img key={item.slug} className="detail-photo" src={item.image} alt="" />
        ))}
      />
      <p className="lede detail-text">{service.text}</p>
      <div className="detail-nav">
        <Link to={`/services/${previous.slug}`}>← {previous.title.replace("\n", " ")}</Link>
        <Link to={`/services/${next.slug}`}>{next.title.replace("\n", " ")} →</Link>
      </div>
      <Link className="button" to="/contact">
        Обсудить задачу
      </Link>
    </section>
  );
}
