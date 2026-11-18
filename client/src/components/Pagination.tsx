import { Link } from "react-router-dom";

export function Pagination({
  page,
  pages,
  to,
}: {
  page: number;
  pages: number;
  to: (page: number) => string;
}) {
  if (pages < 2) return null;
  return (
    <nav className="pager" aria-label="Страницы">
      {page > 1 ? (
        <Link to={to(page - 1)}>Назад</Link>
      ) : (
        <span className="pager-disabled">Назад</span>
      )}
      {Array.from({ length: pages }, (_, index) => {
        const number = index + 1;
        return (
          <Link key={number} to={to(number)} aria-current={number === page ? "page" : undefined}>
            {number}
          </Link>
        );
      })}
      {page < pages ? (
        <Link to={to(page + 1)}>Дальше</Link>
      ) : (
        <span className="pager-disabled">Дальше</span>
      )}
    </nav>
  );
}
