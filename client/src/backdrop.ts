import { asset } from "./assets";
import { syncGeometryMotion } from "./geometryMotion";

export type Backdrop = "geometry" | "rings";
export type BackdropMotion = "on" | "off";

const STORAGE_KEY = "antares-backdrop";
const MOTION_KEY = "antares-backdrop-motion";

const BACKDROP_ASSETS: Record<Backdrop, { url: string; plane: string }> = {
  geometry: {
    url: asset("images/site-geometry.svg?v=wire4"),
    plane: asset("images/site-geometry-plane.svg?v=wire4"),
  },
  rings: {
    url: asset("images/site-rings.svg?v=4"),
    plane: asset("images/site-rings-plane.svg?v=4"),
  },
};

export function getStoredBackdrop(): Backdrop {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "rings" ? "rings" : "geometry";
}

export function getStoredBackdropMotion(): BackdropMotion {
  return localStorage.getItem(MOTION_KEY) === "on" ? "on" : "off";
}

function applyBackdropAssets(backdrop: Backdrop) {
  const root = document.documentElement;
  const pack = BACKDROP_ASSETS[backdrop];
  root.style.setProperty("--backdrop-url", `url("${pack.url}")`);
  root.style.setProperty("--backdrop-plane-url", `url("${pack.plane}")`);

  if (backdrop === "rings") {
    root.style.setProperty("--backdrop-size", "min(140vw, 120rem)");
    root.style.setProperty("--backdrop-pos-x", "right");
  } else {
    root.style.removeProperty("--backdrop-size");
    root.style.removeProperty("--backdrop-pos-x");
  }
}

export function applyBackdrop(backdrop: Backdrop) {
  document.documentElement.setAttribute("data-backdrop", backdrop);
  localStorage.setItem(STORAGE_KEY, backdrop);
  applyBackdropAssets(backdrop);
  syncGeometryMotion();
}

export function applyBackdropMotion(motion: BackdropMotion) {
  document.documentElement.setAttribute("data-backdrop-motion", motion);
  localStorage.setItem(MOTION_KEY, motion);
  syncGeometryMotion();
}

export function initBackdrop() {
  applyBackdrop(getStoredBackdrop());
  applyBackdropMotion(getStoredBackdropMotion());
  document.documentElement.style.setProperty(
    "--hero-image",
    `url("${asset("images/hero.png")}")`,
  );
}

export function setBackdrop(backdrop: Backdrop): Backdrop {
  applyBackdrop(backdrop);
  return backdrop;
}

export function setBackdropMotion(motion: BackdropMotion): BackdropMotion {
  applyBackdropMotion(motion);
  return motion;
}

export function toggleBackdropMotion(): BackdropMotion {
  const next: BackdropMotion = getStoredBackdropMotion() === "on" ? "off" : "on";
  return setBackdropMotion(next);
}
