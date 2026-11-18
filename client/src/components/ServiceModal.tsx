import { services } from "../data";
import { CaseDialog } from "./CaseDialog";

export function ServiceModal({
  slug,
  onChange,
  onClose,
  onContact,
}: {
  slug: string;
  onChange: (slug: string) => void;
  onClose: () => void;
  onContact: () => void;
}) {
  const index = services.findIndex((item) => item.slug === slug);
  if (index < 0) return null;

  return (
    <CaseDialog
      label="Услуги"
      index={index}
      onIndex={(nextIndex) => {
        const target = services[nextIndex];
        if (target) onChange(target.slug);
      }}
      onClose={onClose}
      extra={
        <button className="button" type="button" onClick={onContact}>
          Обсудить задачу
        </button>
      }
      items={services.map((item) => ({
        slug: item.slug,
        image: item.image,
        alt: item.title.replaceAll("\n", " "),
        kicker: item.caption,
        title: item.title,
        text: item.text,
      }))}
    />
  );
}
