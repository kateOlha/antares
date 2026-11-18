import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { pageSize, works } from "../data";
import { CaseCard } from "../components/CaseCard";
import { PageIntro } from "../components/PageIntro";
import { Pagination } from "../components/Pagination";
import { useTitle } from "../components/useTitle";

export function WorksPage() {
  useTitle("Примеры");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const raw = params.get("page");
  const requested = raw == null ? 1 : Number(raw);
  const pages = Math.ceil(works.length / pageSize);
  const invalid = raw != null && (!Number.isInteger(requested) || requested < 1 || requested > pages);
  if (invalid) return <Navigate to="/works" replace />;

  const page = requested;
  const slice = works.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="section">
      <PageIntro
        kicker="Наши работы"
        title="Примеры объектов"
        lede={`Страница ${page} из ${pages}. Откройте проект, чтобы посмотреть его отдельно и перелистнуть соседние.`}
      />
      <div className="work-grid">
        {slice.map((item) => (
          <CaseCard key={item.slug} item={item} onOpen={(slug) => navigate(`/works/${slug}`)} />
        ))}
      </div>
      <Pagination page={page} pages={pages} to={(next) => (next === 1 ? "/works" : `/works?page=${next}`)} />
    </section>
  );
}
