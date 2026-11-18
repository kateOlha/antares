import { useEffect, useState } from "react";
import {
  applyBackdrop,
  applyBackdropMotion,
  getStoredBackdrop,
  getStoredBackdropMotion,
  setBackdrop,
  setBackdropMotion,
  type Backdrop,
  type BackdropMotion,
} from "../backdrop";

const options: { id: Backdrop; label: string }[] = [
  { id: "geometry", label: "Геометрия" },
  { id: "rings", label: "Круги" },
];

export function BackdropToggle() {
  const [backdrop, setLocal] = useState<Backdrop>("geometry");
  const [motion, setMotionLocal] = useState<BackdropMotion>("off");

  useEffect(() => {
    const current = getStoredBackdrop();
    const currentMotion = getStoredBackdropMotion();
    applyBackdrop(current);
    applyBackdropMotion(currentMotion);
    setLocal(current);
    setMotionLocal(currentMotion);
  }, []);

  return (
    <div className="backdrop-controls">
      <div className="backdrop-toggle" role="group" aria-label="Подложка">
        {options.map((item) => (
          <button
            key={item.id}
            type="button"
            className={backdrop === item.id ? "on" : undefined}
            aria-pressed={backdrop === item.id}
            onClick={() => setLocal(setBackdrop(item.id))}
          >
            {item.label}
          </button>
        ))}
      </div>
      {backdrop === "geometry" ? (
        <div className="backdrop-toggle" role="group" aria-label="Анимация фона">
          <button
            type="button"
            className={motion === "on" ? "on" : undefined}
            aria-pressed={motion === "on"}
            onClick={() =>
              setMotionLocal(setBackdropMotion(motion === "on" ? "off" : "on"))
            }
          >
            Анимация
          </button>
        </div>
      ) : null}
    </div>
  );
}
