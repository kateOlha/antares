import { useState } from "react";
import { faq } from "../data";

export function FaqList() {
  const [open, setOpen] = useState(1);

  return (
    <div className="faq">
      {faq.map((item, index) => {
        const isOpen = open === index;
        return (
          <div className={isOpen ? "faq-item open" : "faq-item"} key={item.question}>
            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : index)}>
              <span className="faq-index">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.question}</span>
              <i />
            </button>
            <div className="faq-panel" aria-hidden={!isOpen}>
              <div className="faq-panel-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
