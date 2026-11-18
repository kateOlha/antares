import { useEffect, useState } from "react";
import { getStoredEditMode, setEditMode } from "../blockColors";

export function EditModeToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(getStoredEditMode());
  }, []);

  return (
    <button
      className={on ? "theme-toggle on" : "theme-toggle"}
      type="button"
      aria-pressed={on}
      title={on ? "Выйти из редактора" : "Режим редактирования цветов"}
      onClick={() => {
        const next = !on;
        setEditMode(next);
        setOn(next);
        window.dispatchEvent(new Event("antares-edit-mode"));
      }}
    >
      {on ? "Редактор · вкл" : "Редактор"}
    </button>
  );
}
