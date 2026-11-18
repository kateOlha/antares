import { audiences, advantages } from "../data";
import { Lines } from "../components/Lines";
import { PageIntro } from "../components/PageIntro";
import { Reveal } from "../components/Reveal";
import { Slider } from "../components/Slider";
import { useTitle } from "../components/useTitle";

export function AboutPage() {
  useTitle("О нас");

  return (
    <section className="section">
      <PageIntro
        kicker="О нас"
        title="Мастерская полного цикла с 2014 года"
        lede="Делаем физические объекты для событий: от разбора задачи до монтажа на площадке."
      />
      <div className="cards cards-3">
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
      <div className="subsection">
        <div className="section-head">
          <p className="kicker">Кому мы полезны</p>
          <h2>Работаем с теми, кому самим нужна наша работа</h2>
        </div>
        <Slider
          label="Аудитории"
          columns={3}
          items={audiences.map((item) => (
            <article className="audience-card" key={item.title}>
              <span className="shot">
                <img src={item.image} alt="" />
              </span>
              <div className="story-body">
                <h3>
                  <Lines text={item.title} />
                </h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        />
      </div>
    </section>
  );
}
