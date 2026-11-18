import { Link } from "react-router-dom";
import { useTitle } from "../components/useTitle";

export function NotFoundPage() {
  useTitle("Страница не найдена");

  return (
    <section className="section detail">
      <p className="kicker">404</p>
      <h1>Такой страницы нет</h1>
      <p className="lede detail-text">Проверьте адрес или вернитесь на главную.</p>
      <Link className="button" to="/">
        На главную
      </Link>
    </section>
  );
}
