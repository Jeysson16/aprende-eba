import { clsx } from "clsx";

export function cn(...values: Array<string | boolean | undefined | null>) {
  return clsx(values);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function titleCaseLevel(level: string) {
  return level
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
