import { Link, useLocation } from "react-router-dom";
import { clients } from "../clients";

export function TemplateSwitcher() {
  const { pathname } = useLocation();
  const match = pathname.match(/\/clients\/([^/]+)/);
  const current = match?.[1];
  const onIndex = /\/clients\/?$/.test(pathname);

  return (
    <div className="backdrop-toggle template-switcher" role="group" aria-label="Шаблоны клиентов">
      <Link to="/clients" className={onIndex ? "on" : undefined} aria-current={onIndex ? "page" : undefined}>
        Все
      </Link>
      {clients.map((item) => {
        const active = item.slug === current;
        return (
          <Link
            key={item.slug}
            to={`/clients/${item.slug}`}
            className={active ? "on" : undefined}
            aria-current={active ? "page" : undefined}
            title={item.name}
          >
            {item.slug}
          </Link>
        );
      })}
    </div>
  );
}
