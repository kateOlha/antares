/** Плавный дрейф геометрии, привязанный к скроллу (lerp). */

let running = false;
let frame = 0;
let target = 0;
let current = 0;

function progressFromScroll(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

function writeVars(t: number) {
  const root = document.documentElement;
  const x = (t * -11).toFixed(3);
  const y = (t * -18).toFixed(3);
  const r = (t * 4.5).toFixed(3);
  const s = (1 + t * 0.1).toFixed(4);
  const x2 = (t * 9).toFixed(3);
  const y2 = (t * 14).toFixed(3);
  const r2 = (t * -3.6).toFixed(3);

  root.style.setProperty("--geo-x", `${x}vw`);
  root.style.setProperty("--geo-y", `${y}vh`);
  root.style.setProperty("--geo-r", `${r}deg`);
  root.style.setProperty("--geo-s", s);
  root.style.setProperty("--geo-x2", `${x2}vw`);
  root.style.setProperty("--geo-y2", `${y2}vh`);
  root.style.setProperty("--geo-r2", `${r2}deg`);
}

function clearVars() {
  const root = document.documentElement;
  [
    "--geo-x",
    "--geo-y",
    "--geo-r",
    "--geo-s",
    "--geo-x2",
    "--geo-y2",
    "--geo-r2",
  ].forEach((name) => root.style.removeProperty(name));
}

function tick() {
  frame = 0;
  if (!running) return;

  target = progressFromScroll();
  current += (target - current) * 0.12;

  if (Math.abs(target - current) < 0.0004) {
    current = target;
  } else {
    frame = window.requestAnimationFrame(tick);
  }

  writeVars(current);
}

function requestTick() {
  if (!running || frame) return;
  frame = window.requestAnimationFrame(tick);
}

function onScrollOrResize() {
  if (!running) return;
  requestTick();
}

export function isGeometryMotionActive(): boolean {
  const root = document.documentElement;
  return (
    root.getAttribute("data-backdrop") === "geometry" &&
    root.getAttribute("data-backdrop-motion") === "on" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function syncGeometryMotion() {
  const shouldRun = isGeometryMotionActive();

  if (shouldRun && !running) {
    running = true;
    current = progressFromScroll();
    target = current;
    writeVars(current);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    requestTick();
    return;
  }

  if (!shouldRun && running) {
    running = false;
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
    window.removeEventListener("scroll", onScrollOrResize);
    window.removeEventListener("resize", onScrollOrResize);
    clearVars();
  }
}
