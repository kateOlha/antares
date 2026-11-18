import { asset } from "../assets";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { BackdropToggle } from "./BackdropToggle";
import { ContactFan } from "./ContactFan";
import { TemplateSwitcher } from "./TemplateSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const sections = [
  { id: "about", label: "О нас" },
  { id: "works", label: "Примеры" },
  { id: "process", label: "Как мы работаем" },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = ["about", "works", "process", "contact"]
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setCurrent(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className={scrolled ? "header scrolled" : "header"}>
        <a className="logo-link" href="#top" aria-label="Антарес" onClick={closeMenu}>
          <img src={asset("/images/logo.png")} alt="Антарес" />
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Основное меню">
          <div className="nav-pill">
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={current === item.id ? "active" : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </div>
          <a className="button" href="#contact" onClick={closeMenu}>
            Связаться с нами
          </a>
          <TemplateSwitcher />
          <BackdropToggle />
          <ThemeToggle />
        </nav>
        <button
          className={menuOpen ? "menu-toggle open" : "menu-toggle"}
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <div className="sticky-actions">
        <a className="presentation-chip" href="#contact">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3a1 1 0 0 1 1 1v9.6l2.8-2.8a1 1 0 1 1 1.4 1.4l-4.5 4.5a1 1 0 0 1-1.4 0L6.8 12.2a1 1 0 1 1 1.4-1.4L11 13.6V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"
            />
          </svg>
          <span>Скачать презентацию</span>
        </a>
        <ContactFan />
      </div>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src={asset("/images/logo.png")} alt="Антарес" />
            <p>Мастерская полного цикла с 2014 года. От задачи и конструкции до монтажа на площадке.</p>
            <a className="button" href="#contact">
              Связаться с нами
            </a>
          </div>
          <nav className="footer-col" aria-label="Нижнее меню">
            <p>Разделы</p>
            <a href="#about">О нас</a>
            <a href="#works">Примеры</a>
            <a href="#process">Как мы работаем</a>
            <a href="#faq">Почему не Китай</a>
            <a href="#audiences">Кому мы полезны</a>
            <Link to="/clients">Шаблоны клиентов</Link>
          </nav>
          <div className="footer-col">
            <p>Задача</p>
            <a href="#contact">Обсудить бриф</a>
            <a href="#contact">Скачать презентацию</a>
            <button type="button" onClick={() => setPrivacyOpen(true)}>
              Политика конфиденциальности
            </button>
          </div>
        </div>
        <div className="footer-meta">
          <p>© 2014–2026 Антарес. Мастерская полного цикла.</p>
          <a href="#top">Наверх</a>
        </div>
      </footer>
      {privacyOpen && (
        <div className="modal" role="presentation" onClick={() => setPrivacyOpen(false)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="privacy-title">Политика конфиденциальности</h2>
            <p>
              Форма на сайте собирает только телефон или email и текст задачи. Эти данные сохраняются
              локально на сервере проекта, чтобы с вами можно было связаться. Мы не передаём их третьим
              сторонам из этого шаблона.
            </p>
            <button className="button" type="button" onClick={() => setPrivacyOpen(false)}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
