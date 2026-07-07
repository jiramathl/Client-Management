import type { MetadataRoute } from "next";

// Satisfies the "Mobile App" capability via an installable PWA + responsive
// layout, rather than a native iOS/Android build (not feasible in this
// project) — see the plan's note on this tradeoff.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Harbor — Client Portal",
    short_name: "Harbor",
    description: "Files, tasks, and one real conversation thread with your account team.",
    start_url: "/portal",
    display: "standalone",
    background_color: "#F6F3EC",
    theme_color: "#10263B",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
