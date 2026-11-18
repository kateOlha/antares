import { syncGeometryMotion } from "./geometryMotion";

export type Backdrop = "geometry" | "rings";
export type BackdropMotion = "on" | "off";

const STORAGE_KEY = "antares-backdrop";
const MOTION_KEY = "antares-backdrop-motion";

export function getStoredBackdrop(): Backdrop {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "rings" ? "rings" : "geometry";
}

export function getStoredBackdropMotion(): BackdropMotion {
  return localStorage.getItem(MOTION_KEY) === "on" ? "on" : "off";
}

export function applyBackdrop(backdrop: Backdrop) {
  document.documentElement.setAttribute("data-backdrop", backdrop);
  localStorage.setItem(STORAGE_KEY, backdrop);
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
