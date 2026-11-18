import { useTitle } from "../components/useTitle";

export function PrivacyPage() {
  useTitle("Политика конфиденциальности");

  return (
    <section className="section detail">
      <h1>Политика конфиденциальности</h1>
      <p className="lede detail-text">
        Форма на сайте собирает только телефон или email и текст задачи. Эти данные сохраняются локально
        на сервере проекта, чтобы с вами можно было связаться. Мы не передаём их третьим сторонам из
        этого шаблона.
      </p>
    </section>
  );
}
