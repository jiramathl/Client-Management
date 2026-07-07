// Ported from the prototype's slugify()/orgInitials() helpers (harbor-handoff/index.html ~line 1162).
export const clientColorPalette = ["#C08829", "#3D7A5C", "#B4553F", "#1F4B4F", "#16324B", "#7A3B3D"];

export function orgInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function uniqueSlug(name: string, existingIds: string[]) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "client";
  if (!existingIds.includes(base)) return base;
  let n = 2;
  while (existingIds.includes(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
