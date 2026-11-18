import { ContactForm } from "../components/ContactForm";
import { PageIntro } from "../components/PageIntro";
import { useTitle } from "../components/useTitle";

export function PresentationPage() {
  useTitle("Презентация");

  return (
    <section className="section contact-section">
      <PageIntro
        kicker="Презентация"
        title="Пришлём презентацию мастерской"
        lede="Оставьте телефон или email и пару слов о задаче — отправим презентацию и ответим по проекту."
      />
      <ContactForm />
    </section>
  );
}
