import { Link, Navigate, useParams } from "react-router-dom";
import { clients, getClient } from "../clients";
import { HomePage } from "./HomePage";

export function ClientPage() {
  const { slug } = useParams();
  const client = getClient(slug);

  if (!client) {
    return <Navigate to="/clients" replace />;
  }

  return (
    <div className={`client-landing template-${client.slug}`}>
      <nav className="client-switcher" aria-label="Шаблоны клиентов">
        <Link className="client-switcher-all" to="/clients">
          Все шаблоны
        </Link>
        <ul>
          {clients.map((item) => (
            <li key={item.slug}>
              <Link
                to={`/clients/${item.slug}`}
                className={item.slug === client.slug ? "on" : undefined}
                aria-current={item.slug === client.slug ? "page" : undefined}
              >
                {item.short}
              </Link>
            </li>
          ))}
        </ul>
        <p className="client-switcher-meta">{client.name}</p>
      </nav>
      <HomePage
        basePath={`/clients/${client.slug}`}
        pageTitle={`${client.short} · ${client.name}`}
      />
    </div>
  );
}
