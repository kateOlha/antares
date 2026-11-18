import { FormEvent, useState } from "react";

const kinds = ["Фотозона", "Стенд", "Реквизит", "Конструкция", "Пока не решили"];
const budgets = ["До 100 000 ₽", "100–300 тыс. ₽", "300–700 тыс. ₽", "От 700 тыс. ₽", "Пока не считали"];

const empty = {
  name: "",
  contact: "",
  kind: kinds[0],
  when: "",
  budget: budgets[4],
  message: "",
};

export function ContactForm() {
  const [fields, setFields] = useState(empty);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const body = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !body.ok) {
        setStatus("error");
        setError(body.error || "Не удалось отправить заявку.");
        return;
      }
      setStatus("ok");
      setFields(empty);
    } catch {
      setStatus("error");
      setError("Сервер недоступен. Запустите API и попробуйте ещё раз.");
    }
  }

  return (
    <div className="contact-panel">
      <div className="contact-copy">
        <p className="kicker">Остались вопросы?</p>
        <h2>Расскажите задачу до запуска в производство</h2>
        <p>
          Короткого брифа достаточно, чтобы разобрать риски, предложить варианты и сказать, где экономия
          убьёт эффект. Пишем по указанному контакту.
        </p>
        <ol className="contact-points">
          <li>
            <span>01</span>
            <strong>Референс или набросок</strong>
            Что должно получиться в кадре и на площадке
          </li>
          <li>
            <span>02</span>
            <strong>Дата и место</strong>
            Событие, монтажное окно и габариты площадки
          </li>
          <li>
            <span>03</span>
            <strong>Масштаб бюджета</strong>
            Не точная смета, а ориентир, от которого можно считать
          </li>
        </ol>
      </div>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-grid">
          <label>
            <span>Имя</span>
            <input
              name="name"
              autoComplete="name"
              placeholder="Как к вам обращаться"
              value={fields.name}
              onChange={(event) => set("name", event.target.value)}
            />
          </label>
          <label>
            <span>Телефон или email</span>
            <input
              name="contact"
              autoComplete="email"
              placeholder="+7 900 000-00-00"
              value={fields.contact}
              onChange={(event) => set("contact", event.target.value)}
              required
            />
          </label>
          <label>
            <span>Что делаем</span>
            <select name="kind" value={fields.kind} onChange={(event) => set("kind", event.target.value)}>
              {kinds.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Когда нужно</span>
            <input
              name="when"
              placeholder="Дата события или срок"
              value={fields.when}
              onChange={(event) => set("when", event.target.value)}
            />
          </label>
          <label className="span-2">
            <span>Ориентир по бюджету</span>
            <select name="budget" value={fields.budget} onChange={(event) => set("budget", event.target.value)}>
              {budgets.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="span-2">
            <span>Задача</span>
            <textarea
              name="message"
              placeholder="Площадка, габариты, что должно сработать в кадре и чего точно нельзя упрощать"
              value={fields.message}
              onChange={(event) => set("message", event.target.value)}
              required
            />
          </label>
        </div>
        <button className="button" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Отправляем…" : "Отправить бриф"}
        </button>
        {status === "ok" && <p className="form-note ok">Заявка отправлена. Мы свяжемся с вами.</p>}
        {status === "error" && <p className="form-note">{error}</p>}
      </form>
    </div>
  );
}
