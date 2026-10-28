export const colors = {
  // ============================================================
  // BRAND / CORE
  // ============================================================

  ink: "#17181A",
  paper: "#FAF8F5",
  rule: "#E3DFD8",
  muted: "#857F73",
  accent: "#454F45",
  canvas: "#1B1B19",
  surfaceHover: "#F0EDE7",
  white: "#FFFFFF",

  // ============================================================
  // TEXT
  // ============================================================

  text: {
    primary: "#17181A",
    secondary: "#857F73",
    inverse: "#FFFFFF",
    accent: "#454F45",
    disabled: "#B8B3AA",
    placeholder: "#857F73",
    link: "#454F45",
    linkHover: "#343D34",
  },

  // ============================================================
  // BACKGROUNDS / SURFACES
  // ============================================================

  background: {
    primary: "#FAF8F5",
    secondary: "#F0EDE7",
    surface: "#FFFFFF",
    dark: "#1B1B19",
    darkSurface: "#242421",
    muted: "#EAE6DE",
  },

  // ============================================================
  // BORDERS / DIVIDERS
  // ============================================================

  border: {
    default: "#E3DFD8",
    subtle: "#ECE9E3",
    strong: "#CFC9BF",
    dark: "#3A3A36",
    focus: "#454F45",
  },

  // ============================================================
  // INTERACTION
  // ============================================================

  interaction: {
    hover: "#F0EDE7",
    active: "#E3DFD8",
    focus: "#454F45",
    focusRing: "#454F45",
    selected: "#454F45",
    disabled: "#E3DFD8",
  },

  // ============================================================
  // BUTTONS
  // ============================================================

  button: {
    primary: {
      background: "#17181A",
      text: "#FFFFFF",
      hover: "#343538",
      active: "#0F1011",
    },

    secondary: {
      background: "#FFFFFF",
      text: "#17181A",
      border: "#E3DFD8",
      hover: "#F0EDE7",
      active: "#E3DFD8",
    },

    accent: {
      background: "#454F45",
      text: "#FFFFFF",
      hover: "#343D34",
      active: "#293129",
    },

    ghost: {
      background: "transparent",
      text: "#17181A",
      hover: "#F0EDE7",
      active: "#E3DFD8",
    },

    disabled: {
      background: "#E3DFD8",
      text: "#857F73",
    },
  },

  // ============================================================
  // FORM ELEMENTS
  // ============================================================

  input: {
    background: "#FFFFFF",
    text: "#17181A",
    placeholder: "#857F73",
    border: "#E3DFD8",
    hoverBorder: "#CFC9BF",
    focusBorder: "#454F45",
    disabledBackground: "#F0EDE7",
    disabledText: "#B8B3AA",
  },

  // ============================================================
  // STATUS
  // ============================================================

  status: {
    success: {
      main: "#3F6B4F",
      background: "#EEF4EF",
      border: "#C9DACD",
      text: "#31553E",
    },

    error: {
      main: "#A64B45",
      background: "#FAEFEE",
      border: "#E5C7C4",
      text: "#843B36",
    },

    warning: {
      main: "#9A7135",
      background: "#F8F2E7",
      border: "#E3D2B3",
      text: "#765522",
    },

    info: {
      main: "#536A78",
      background: "#EEF2F4",
      border: "#CBD5DA",
      text: "#40535F",
    },
  },

  // ============================================================
  // E-COMMERCE
  // ============================================================

  ecommerce: {
    price: "#17181A",

    sale: "#9A413B",
    saleBackground: "#F8ECEA",

    discount: "#454F45",
    discountBackground: "#EEF1EC",

    outOfStock: "#857F73",
    outOfStockBackground: "#F0EDE7",

    inStock: "#3F6B4F",

    newBadge: "#454F45",
    newBadgeBackground: "#EEF1EC",

    featuredBadge: "#17181A",
    featuredBadgeBackground: "#F0EDE7",
  },

  // ============================================================
  // RATING
  // ============================================================

  rating: {
    star: "#9A7135",
    empty: "#D8D3CA",
  },

  // ============================================================
  // NAVIGATION
  // ============================================================

  navigation: {
    text: "#17181A",
    muted: "#857F73",
    hover: "#454F45",
    active: "#454F45",
    border: "#E3DFD8",
    background: "#FAF8F5",
  },

  // ============================================================
  // ICONS
  // ============================================================

  icon: {
    primary: "#17181A",
    secondary: "#857F73",
    muted: "#B8B3AA",
    accent: "#454F45",
    inverse: "#FFFFFF",
    danger: "#A64B45",
    success: "#3F6B4F",
  },

  // ============================================================
  // OVERLAYS
  // ============================================================

  overlay: {
    light: "rgba(23, 24, 26, 0.04)",
    medium: "rgba(23, 24, 26, 0.08)",
    dark: "rgba(23, 24, 26, 0.45)",
    heavy: "rgba(23, 24, 26, 0.7)",
  },

  // ============================================================
  // SKELETON / LOADING
  // ============================================================

  skeleton: {
    base: "#EAE6DE",
    highlight: "#F0EDE7",
  },

  // ============================================================
  // DARK MODE
  // ============================================================

  dark: {
    background: "#17181A",
    surface: "#222321",
    surfaceHover: "#2C2D2A",

    text: {
      primary: "#FAF8F5",
      secondary: "#B8B3AA",
      muted: "#857F73",
      inverse: "#17181A",
    },

    border: "#3A3A36",
    accent: "#AEB9AA",

    input: {
      background: "#222321",
      border: "#3A3A36",
      text: "#FAF8F5",
      placeholder: "#857F73",
    },
  },
} as const;