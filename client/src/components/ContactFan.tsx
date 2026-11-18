import { useEffect, useRef, useState } from "react";

const items = [
  {
    id: "email",
    href: "mailto:info@antareslab.ru",
    label: "Написать на почту",
    external: false,
    className: "is-email",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2.3V17h16V7.3l-8 5.2-8-5.2Zm1.4-.8L12 11l6.6-4.5H5.4Z"
        />
      </svg>
    ),
  },
  {
    id: "vk",
    href: "https://vk.com/antareslab",
    label: "ВКонтакте",
    external: true,
    className: "is-vk",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.7 17.5c-5.2 0-8.3-3.6-8.4-9.5h2.6c.1 4.4 2 6.2 3.5 6.6V8h2.5v3.8c1.5-.2 3-1.9 3.5-3.8h2.5c-.4 2.3-2.1 4-3.3 4.7 1.2.6 3.1 2.1 3.8 4.8h-2.7c-.6-1.9-2.1-3.3-4-3.5v3.5h-.5Z"
        />
      </svg>
    ),
  },
  {
    id: "telegram",
    href: "https://t.me/antareslab",
    label: "Telegram",
    external: true,
    className: "is-telegram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.8 5.2 3.9 11.3c-1.1.4-1.1 1.1-.2 1.4l3.9 1.2 1.5 4.6c.2.5.7.7 1.1.4l2.1-1.8 4.1 3c.8.4 1.3.2 1.5-.7l2.7-12.8c.3-1.1-.4-1.6-1.2-1.4ZM9.7 13.8l7.4-4.7c.3-.2.7 0 .4.3l-6 5.7-.2 2.6-1.6-3.9Z"
        />
      </svg>
    ),
  },
  {
    id: "phone",
    href: "tel:+79257881448",
    label: "+7 (925) 788-14-48",
    external: false,
    className: "is-phone",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7.2 3.5c.5-.5 1.3-.5 1.7 0l2 2c.5.5.5 1.2 0 1.7L9.4 8.7c.8 1.6 2 2.9 3.6 3.8l1.5-1.5c.5-.5 1.2-.5 1.7 0l2 2c.5.5.5 1.2 0 1.7l-1.2 1.2c-.6.6-1.5.9-2.4.7-2.5-.5-4.9-1.9-6.8-3.9S5.1 9.1 4.6 6.6c-.2-.9.1-1.8.7-2.4l1.9-1.7Z"
        />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    href: "https://wa.me/79257881448",
    label: "WhatsApp",
    external: true,
    className: "is-whatsapp",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3.2A8.3 8.3 0 0 0 5.1 15.7L4 20l4.4-1.1A8.3 8.3 0 1 0 12 3.2Zm0 15.1a6.8 6.8 0 0 1-3.5-1l-.2-.1-2.6.7.7-2.5-.2-.3a6.8 6.8 0 1 1 5.8 3.2Zm3.9-5.1c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1l-.7.8c-.1.2-.3.2-.5.1a5.6 5.6 0 0 1-2.7-2.4c-.1-.2 0-.4.1-.5l.6-.7c.1-.2.1-.3 0-.5l-.7-1.5c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 1.6.6 2.2.5 2.6.5.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1 0-.1-.2-.1-.4-.2Z"
        />
      </svg>
    ),
  },
];

export function ContactFan() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={open ? "contact-fan open" : "contact-fan"}
      onMouseEnter={() => {
        if (window.matchMedia("(hover: hover)").matches) setOpen(true);
      }}
      onMouseLeave={() => {
        if (window.matchMedia("(hover: hover)").matches) setOpen(false);
      }}
    >
      <ul className="contact-fan-list" aria-hidden={!open}>
        {items.map((item, index) => (
          <li key={item.id} style={{ transitionDelay: open ? `${(items.length - index) * 35}ms` : "0ms" }}>
            <a
              className={`contact-fan-item ${item.className}`}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              aria-label={item.label}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              <span className="contact-fan-tip">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <button
        className="contact-fan-toggle"
        type="button"
        aria-expanded={open}
        aria-label={open ? "Закрыть меню связи" : "Для связи"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="contact-fan-tip">Для связи</span>
        <span className="contact-fan-icon" aria-hidden="true">
          <svg className="icon-chat" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-4.2L9.5 20.4c-.6.4-1.3 0-1.3-.7V17H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 4v2h10V8H7Zm0 4v2h7v-2H7Z"
            />
          </svg>
          <svg className="icon-close" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M6.7 6.7a1 1 0 0 1 1.4 0L12 10.6l3.9-3.9a1 1 0 1 1 1.4 1.4L13.4 12l3.9 3.9a1 1 0 0 1-1.4 1.4L12 13.4l-3.9 3.9a1 1 0 0 1-1.4-1.4L10.6 12 6.7 8.1a1 1 0 0 1 0-1.4Z"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
