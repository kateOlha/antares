import { ContactForm } from "../components/ContactForm";
import { PageIntro } from "../components/PageIntro";
import { useTitle } from "../components/useTitle";

export function ContactPage() {
  useTitle("Контакты");

  return (
    <section className="section contact-section">
      <PageIntro
        kicker="Контакты"
        title="Расскажите о задаче"
        lede="Телефон или email и коротко, что нужно сделать. Мы ответим по этой заявке."
      />
      <ContactForm />
    </section>
  );
}
