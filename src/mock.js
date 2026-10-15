// All MOCK data and helpers for Nishant Waters
// Explicitly mocked instead of any backend integration

export const palette = {
  cream: "#FFF8F0",
  terracotta: "#D9822B",
  forest: "#1B3A2D",
  coral: "#FF6B61",
  ink: "#1F2933",
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function makeId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

export function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

export const bottleBaseTypes = [
  "Glass Cylinder",
  "Insulated Steel",
  "Travel Tumbler",
];

export const patternOptions = [
  {
    id: "terra-ripple",
    name: "Terracotta Ripples",
    preview:
      "https://images.pexels.com/photos/6311667/pexels-photo-6311667.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "forest-leaf",
    name: "Forest Leaves",
    preview:
      "https://images.pexels.com/photos/1903965/pexels-photo-1903965.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "coral-sun",
    name: "Coral Sunburst",
    preview:
      "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "minimal-grid",
    name: "Minimal Grid",
    preview:
      "https://images.pexels.com/photos/4475927/pexels-photo-4475927.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export const products = [
  {
    id: "bottle-1",
    name: "Solstice Glass Carafe",
    description:
      "Hand-blown borosilicate glass with a soft-touch silicone sleeve. Designed for slow mornings and sunlit desks.",
    price: 38,
    baseBottleType: "Glass Cylinder",
    images: [
      "https://images.pexels.com/photos/3735210/pexels-photo-3735210.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4245826/pexels-photo-4245826.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/7691538/pexels-photo-7691538.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    availableColors: [palette.terracotta, palette.forest, palette.coral],
  },
  {
    id: "bottle-2",
    name: "Dawn Insulated Flask",
    description:
      "18/8 stainless steel with a fine-powder matte finish. Keeps water crisp for 24 hours, coffee warm for 12.",
    price: 44,
    baseBottleType: "Insulated Steel",
    images: [
      "https://images.pexels.com/photos/3738341/pexels-photo-3738341.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4109993/pexels-photo-4109993.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    availableColors: [palette.forest, "#8C5A3A", "#E2B497"],
  },
  {
    id: "bottle-3",
    name: "Everyday Carry Tumbler",
    description:
      "Slim profile tumbler that slips into any bag. Spill-resistant lid and soft-touch base.",
    price: 32,
    baseBottleType: "Travel Tumbler",
    images: [
      "https://images.pexels.com/photos/3735209/pexels-photo-3735209.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/414645/pexels-photo-414645.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    availableColors: [palette.coral, "#C4A484", palette.forest],
  },
];

export const aboutEditorial = {
  heroImage:
    "https://images.pexels.com/photos/3735210/pexels-photo-3735210.jpeg?auto=compress&cs=tinysrgb&w=1200",
  sections: [
    {
      title: "Water, Reframed",
      body:
        "Nishant Waters was born from a belief that hydration can be both ritual and reminder. Every bottle is a small altar to the moments you choose yourself.",
    },
    {
      title: "Crafted Quietly",
      body:
        "We partner with small-batch makers and responsible manufacturers to create pieces that feel like objects of care—not merch.",
    },
    {
      title: "Labels as Love Notes",
      body:
        "From wedding parties to studio desks, our custom labels carry mantras, names, and inside jokes that travel through your days.",
    },
  ],
};

export const contactContent = {
  intro:
    "We love hearing about rituals, routines, and the small ways water moves through your life. Share a note, a question, or an idea.",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509008!2d144.9556513156449!3d-37.81732397975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f0b1fb%3A0x5045675218ce840!2sMelbourne%20VIC!5e0!3m2!1sen!2sau!4v1600000000000!5m2!1sen!2sau",
};

export function validateLabel(label) {
  const errors = {};
  if (!label.text || !label.text.trim()) {
    errors.text = "Add a message for your label.";
  } else if (label.text.length > 100) {
    errors.text = "Label text must be under 100 characters.";
  }
  if (label.images) {
    label.images.forEach((img, idx) => {
      if (!img.url) errors[`image-${idx}`] = "Image is missing a URL.";
    });
  }
  if (!label.backgroundPattern) {
    errors.backgroundPattern = "Choose a background pattern.";
  }
  return errors;
}

export const initialLabelTemplate = (productId) => ({
  id: makeId("label"),
  productId,
  text: "Sip slow, stay soft.",
  textFont: "Inter",
  textColor: palette.ink,
  backgroundPattern: patternOptions[0]?.id,
  images: [],
});

export function estimateDeliveryDate(orderDate = new Date()) {
  const d = new Date(orderDate);
  d.setDate(d.getDate() + 7);
  return d;
}

export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export const shippingMethods = [
  { id: "standard", label: "Standard (5–7 days)", price: 6 },
  { id: "express", label: "Express (2–3 days)", price: 14 },
];

export const taxRate = 0.08;

export function computeCartTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

// MOCK store for messages and orders (client-only, in-memory)
export const mockStore = {
  messages: [],
  orders: [],
};

export function saveUserMessage({ name, email, message }) {
  const entry = {
    id: makeId("msg"),
    name,
    email,
    message,
    submittedAt: new Date().toISOString(),
  };
  mockStore.messages.push(entry);
  return entry;
}

export function saveOrder(order) {
  const stored = {
    ...order,
    id: makeId("order"),
  };
  mockStore.orders.push(stored);
  return stored;
}