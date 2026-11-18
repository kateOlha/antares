import { Link, Navigate, useParams } from "react-router-dom";
import { steps } from "../data";
import { PageIntro } from "../components/PageIntro";
import { Pagination } from "../components/Pagination";
import { useTitle } from "../components/useTitle";

export function ProcessPage() {
  useTitle("Как мы работаем");
  const { step } = useParams();
  const requested = step == null ? 1 : Number(step);
  const invalid = step != null && (!Number.isInteger(requested) || requested < 1 || requested > steps.length);
  if (invalid) return <Navigate to="/process" replace />;

  const current = steps[requested - 1];

  return (
    <section className="section">
      <PageIntro
        kicker="Как мы работаем"
        title="От эскиза до сдачи на площадке"
        lede="Шесть шагов. Переключайте их стрелками или номерами — адрес страницы меняется вместе с шагом."
      />
      <article className="card step-stage" key={requested}>
        <span className="icon icon-cool">
          <img src={current.icon} alt="" />
        </span>
        <h2 className="step-title">{current.title}</h2>
        <p>{current.text}</p>
        <div className="step-progress" aria-hidden="true">
          <span style={{ width: `${(requested / steps.length) * 100}%` }} />
        </div>
      </article>
      <Pagination
        page={requested}
        pages={steps.length}
        to={(next) => (next === 1 ? "/process" : `/process/${next}`)}
      />
      <div className="detail-nav">
        {requested > 1 ? (
          <Link to={requested - 1 === 1 ? "/process" : `/process/${requested - 1}`}>← Предыдущий шаг</Link>
        ) : (
          <span />
        )}
        {requested < steps.length ? (
          <Link to={`/process/${requested + 1}`}>Следующий шаг →</Link>
        ) : (
          <Link to="/contact">Обсудить задачу →</Link>
        )}
      </div>
    </section>
  );
}
