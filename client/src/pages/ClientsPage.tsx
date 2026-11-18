import { Link } from "react-router-dom";
import { clients } from "../clients";
import { useTitle } from "../components/useTitle";

export function ClientsPage() {
  useTitle("Клиенты / шаблоны");

  return (
    <section className="section clients-index">
      <div className="section-head">
        <p className="kicker">Шаблоны</p>
        <h2>Отдельные страницы клиентов</h2>
        <p className="lede">Четыре варианта лендинга из Figma — каждый на своём URL</p>
      </div>
      <ul className="clients-grid">
        {clients.map((item) => (
          <li key={item.slug}>
            <Link className="client-card" to={`/clients/${item.slug}`}>
              <span className="chip">{item.short}</span>
              <strong>{item.name}</strong>
              <p>{item.note}</p>
              <span className="client-card-go">Открыть →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
