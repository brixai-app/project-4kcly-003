// Design tokens for Nishant Waters
// NOTE: Frontend-only; no backend logic here.

export const palette = {
  terracotta: "#A0522D", // deep, rich
  sand: "#F4E1D2", // warm neutral
  olive: "#708238",
  offwhite: "#FFF8F0",
  coral: "#FF6F61",
  turquoise: "#40E0D0",
  ink: "#1F130F", // deep warm text
  stone: "#4A3B32", // secondary text
  borderSoft: "#E3CBB8",
  borderStrong: "#B27A52",
  danger: "#C2543C",
  success: "#3F8F6B",
};

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "18px",
  xl: "24px",
  round: "999px",
};

export const shadows = {
  soft: "0 10px 30px rgba(31, 19, 15, 0.08)",
  medium: "0 18px 45px rgba(31, 19, 15, 0.16)",
  strong: "0 26px 70px rgba(31, 19, 15, 0.22)",
  focus: `0 0 0 1px ${palette.offwhite}, 0 0 0 3px ${palette.olive}`,
};

export const motion = {
  durations: {
    fast: 120,
    normal: 200,
    slow: 320,
  },
  easing: {
    standard: [0.2, 0.6, 0.2, 1],
    entrance: [0.18, 0.75, 0.25, 1],
  },
};

export const typography = {
  heading: "\"Playfair Display\", ui-serif, Georgia, 'Times New Roman', serif",
  body: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

// For reference when composing Tailwind classes in components
export const layout = {
  pageMaxWidth: "1120px",
  gutterX: "1.5rem",
  sectionY: "4.5rem",
};

export const zIndex = {
  header: 50,
  drawer: 60,
  toast: 70,
  modal: 80,
};

export const themeTokens = {
  palette,
  radii,
  shadows,
  motion,
  typography,
  layout,
  zIndex,
};

export type ButtonVariant = "primary" | "secondary" | "ghost";