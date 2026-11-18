export type ClientTemplate = {
  slug: string;
  name: string;
  short: string;
  figma: string;
  note: string;
};

/** Четыре варианта лендинга из Figma Antares-Landing */
export const clients: ClientTemplate[] = [
  {
    slug: "01",
    name: "Capture Desktop",
    short: "Шаблон 01",
    figma: "1:2",
    note: "Базовый полный лендинг",
  },
  {
    slug: "02",
    name: "Capture Desktop_2",
    short: "Шаблон 02",
    figma: "27:3860",
    note: "Макет Figma 27:3860 — тёмно-синие плоскости без серого",
  },
  {
    slug: "03",
    name: "Capture Desktop_1",
    short: "Шаблон 03",
    figma: "26:3014",
    note: "Макет Figma 26:3014 — светлые about / band / audiences",
  },
  {
    slug: "04",
    name: "Capture Desktop_3",
    short: "Шаблон 04",
    figma: "26:2168",
    note: "Как шаблон 03, но серые плоскости #303441 как у шаблона 01",
  },
];

export function getClient(slug: string | undefined) {
  return clients.find((item) => item.slug === slug);
}
