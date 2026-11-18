import { works } from "../data";
import { CaseDialog } from "./CaseDialog";

export function WorkModal({
  slug,
  onChange,
  onClose,
}: {
  slug: string;
  onChange: (slug: string) => void;
  onClose: () => void;
}) {
  const index = works.findIndex((item) => item.slug === slug);
  if (index < 0) return null;

  return (
    <CaseDialog
      label="Проекты"
      index={index}
      onIndex={(nextIndex) => {
        const target = works[nextIndex];
        if (target) onChange(target.slug);
      }}
      onClose={onClose}
      items={works.map((item) => ({
        slug: item.slug,
        image: item.image,
        alt: item.alt,
        kicker: item.category,
        title: item.title,
        text: item.text,
        facts: item.facts,
      }))}
    />
  );
}
