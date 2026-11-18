import { useEffect, useRef, useState } from "react";
import { advantages, audiences, services, steps, works } from "../data";
import { ContactForm } from "../components/ContactForm";
import { FaqList } from "../components/FaqList";
import { MosaicSlider } from "../components/MosaicSlider";
import { Reveal } from "../components/Reveal";
import { ServiceModal } from "../components/ServiceModal";
import { WorkModal } from "../components/WorkModal";
import { useParallax } from "../components/useParallax";
import { useTitle } from "../components/useTitle";

type HomePageProps = {
  basePath?: string;
  pageTitle?: string;
};

export function HomePage({ basePath = "/", pageTitle }: HomePageProps) {
  useTitle(pageTitle ?? (basePath === "/" ? "Главная" : "Лендинг"));
  const [workSlug, setWorkSlug] = useState<string | null>(null);
  const [serviceSlug, setServiceSlug] = useState<string | null>(null);
  const [serviceIndex, setServiceIndex] = useState(0);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  useParallax(pageRef);

  useEffect(() => {
    const path = window.location.pathname;
    const workMatch = path.match(/\/works\/([^/]+)$/);
    const serviceMatch = path.match(/\/services\/([^/]+)$/);
    if (workMatch?.[1] && works.some((item) => item.slug === workMatch[1])) {
      setWorkSlug(decodeURIComponent(workMatch[1]));
    }
    if (serviceMatch?.[1] && services.some((item) => item.slug === serviceMatch[1])) {
      setServiceSlug(decodeURIComponent(serviceMatch[1]));
    }
    const normalizedBase = basePath.replace(/\/$/, "") || "";
    const isModalPath = Boolean(workMatch || serviceMatch);
    if (isModalPath && path !== basePath && path !== `${normalizedBase}/`) {
      window.history.replaceState(null, "", `${normalizedBase || "/"}${window.location.hash}`);
    }
  }, [basePath]);

  function stepService(delta: number) {
    setServiceIndex((current) => (current + delta + services.length) % services.length);
  }

  function openContact() {
    setServiceSlug(null);
    setWorkSlug(null);
    document.body.style.overflow = "";
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="page-parallax" ref={pageRef}>
      <section className="hero" id="top">
        <div className="hero-frame">
          <div className="hero-media" data-parallax="-0.28" aria-hidden="true" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-copy" data-parallax="-0.08">
            <p className="eyebrow">Мастерская полного цикла с 2014 года</p>
            <h1>
              Сложные декорации, реквизит и кастомные объекты, которые точно решают вашу задачу
            </h1>
            <p className="hero-lead">
              Превращаем идеи, референсы и черновые брифы в реальные физические объекты.
              Без производственного хаоса, срывов сроков и сюрпризов на монтаже.
            </p>
          </div>
          <div className="hero-base" data-parallax="-0.04">
            <div className="hero-actions">
              <a className="button" href="#contact">
                Обсудить задачу
              </a>
              <a className="hero-link" href="#works">
                Смотреть примеры
              </a>
            </div>
            <ul className="hero-facts">
              <li>
                <strong>С 2014</strong>
                Своё производство, без субподряда
              </li>
              <li>
                <strong>Полный цикл</strong>
                От брифа и конструкции до сдачи
              </li>
              <li>
                <strong>На площадке</strong>
                Стоим рядом, пока объект не встанет
              </li>
              <li>
                <strong>Честная цена</strong>
                Говорим, где экономия убьёт эффект
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section works-section" id="works">
        <div className="section-head">
          <p className="kicker">Наши работы</p>
          <h2>Не просто финальные фото — показываем весь путь: от задачи до монтажа на площадке</h2>
          <p className="lede">От задачи и производства до монтажа на площадке</p>
        </div>
        <MosaicSlider onOpen={setWorkSlug} />
      </section>

      <section className="section about-section" id="about">
        <div className="about-layout">
        <div className="section-head">
          <p className="kicker">Почему мы?</p>
          <h2>Мы не просто изготавливаем — мы снимаем с вас головную боль</h2>
          <p className="lede">Почему с нами сложные объекты не становятся слабым местом события</p>
        </div>
        <div className="cards">
          {advantages.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <article className="card">
                <span className="icon icon-warm">
                  <img src={item.icon} alt="" />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="services-stage">
          <div className="services-copy">
            <p className="kicker">Что мы делаем?</p>
            <h2>Линейка товаров и услуг</h2>
            <p className="lede">Полный цикл — от идеи до монтажа на площадке</p>
            <ol className="service-switch">
              {services.map((item, index) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    className={index === serviceIndex ? "on" : ""}
                    onClick={() => setServiceIndex(index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="service-line">
                      <strong>{item.title.replace(/\n/g, " ")}</strong>
                      <small>{item.text}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="service-nav">
              <button type="button" aria-label="Предыдущая услуга" onClick={() => stepService(-1)}>
                ‹
              </button>
              <button type="button" aria-label="Следующая услуга" onClick={() => stepService(1)}>
                ›
              </button>
            </div>
          </div>
          <div className="service-mosaic" ref={mosaicRef} data-parallax="-0.12">
            {services.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                data-flip={item.slug}
                className={`service-tile tile-${(index - serviceIndex + services.length) % services.length}`}
                onClick={() => {
                  setServiceIndex(index);
                  setServiceSlug(item.slug);
                }}
              >
                <span className="shot">
                  <img src={item.image} alt="" />
                </span>
                <span className="tile-label">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.title.replace(/\n/g, " ")}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="band-orbit band-orbit-a" data-parallax="-0.18" aria-hidden="true" />
        <div className="band-orbit band-orbit-b" data-parallax="-0.1" aria-hidden="true" />
        <div className="band-panel" data-parallax="-0.05">
          <div className="band-copy">
            <p className="kicker">Если коротко</p>
            <h2>Остались вопросы?</h2>
            <a className="button" href="#contact">
              Связаться с нами
            </a>
          </div>
          <div className="band-side">
            <p>
              Мы помогаем превращать идеи, референсы и черновые брифы в реальные физические объекты:
              фотозоны, бутафорию, макеты, объёмные фигуры, арт-объекты, брендированные конструкции и
              нестандартные элементы оформления.
            </p>
            <ul>
              <li>Фотозоны и welcome-зоны</li>
              <li>Выставочные стенды</li>
              <li>Реквизит и бутафория</li>
              <li>Брендированные конструкции</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="section-head">
          <p className="kicker">Как мы работаем</p>
          <h2>
            Мы ведём проект от эскиза до сдачи на площадке. Вы занимаетесь стратегией события — мы
            занимаемся производством.
          </h2>
        </div>
        <ol className="process-rail">
          {steps.map((item, index) => (
            <li key={item.title} className="process-step">
              <Reveal delay={(index % 3) * 80}>
                <article>
                  <span className="process-num">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="step-title">{item.title.replace(/^Шаг \d+:\s*/, "")}</h3>
                  <p>{item.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="section faq-section" id="faq">
        <div className="faq-layout">
          <div className="faq-copy">
            <p className="kicker">FAQ</p>
            <h2>Почему не Китай</h2>
            <p>
              Китай уместен, когда объект простой и срок спокойный. Если экономия даст дешёвый вид или
              сорвёт монтаж — скажем до производства, а не в день события.
            </p>
            <ul className="faq-sides">
              <li>
                <span>01</span>
                <strong>Китай уместен</strong>
                Серия, понятная форма, запас по срокам и никаких правок по ходу.
              </li>
              <li>
                <span>02</span>
                <strong>Здесь риск</strong>
                Сложная форма, короткое монтажное окно, площадка и ответственность за результат.
              </li>
            </ul>
          </div>
          <FaqList />
        </div>
      </section>

      <section className="section audiences-section" id="audiences">
        <div className="section-head">
          <p className="kicker">Кому мы полезны</p>
          <h2>Работаем с теми, кому самим нужна наша работа, а не с посредниками</h2>
        </div>
        <div className="audience-grid">
          {audiences.map((item) => (
            <article className="audience-card" key={item.title}>
              <span className="shot">
                <img src={item.image} alt="" />
              </span>
              <div className="story-body">
                <p className="chip">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul className="audience-points">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <ContactForm />
      </section>
      {workSlug && (
        <WorkModal slug={workSlug} onChange={setWorkSlug} onClose={() => setWorkSlug(null)} />
      )}
      {serviceSlug && (
        <ServiceModal
          slug={serviceSlug}
          onChange={setServiceSlug}
          onClose={() => setServiceSlug(null)}
          onContact={openContact}
        />
      )}
    </div>
  );
}
