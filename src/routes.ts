// Programmatically generated route table and navigation manifest
export interface RouteItem {
  path: string;
  name: string;
  filePath: string;
  navLabel?: string;
  showInNav: boolean;
}

export const APP_ROUTES: RouteItem[] = [
  {
    "path": "/",
    "name": "HomePage",
    "filePath": "src/pages/HomePage.tsx",
    "navLabel": "Home",
    "showInNav": true
  },
  {
    "path": "/shop",
    "name": "CatalogPage",
    "filePath": "src/pages/CatalogPage.tsx",
    "navLabel": "Shop",
    "showInNav": true
  },
  {
    "path": "/product/:id",
    "name": "ProductDetailPage",
    "filePath": "src/pages/ProductDetailPage.tsx",
    "showInNav": false
  },
  {
    "path": "/checkout",
    "name": "CheckoutPage",
    "filePath": "src/pages/CheckoutPage.tsx",
    "showInNav": false
  },
  {
    "path": "/about",
    "name": "AboutPage",
    "filePath": "src/pages/AboutPage.tsx",
    "navLabel": "About",
    "showInNav": true
  },
  {
    "path": "/contact",
    "name": "ContactPage",
    "filePath": "src/pages/ContactPage.tsx",
    "navLabel": "Contact",
    "showInNav": true
  }
];

export const NAV_LINKS: Array<{ path: string; label: string }> = [
  {
    "path": "/",
    "label": "Home"
  },
  {
    "path": "/shop",
    "label": "Shop"
  },
  {
    "path": "/about",
    "label": "About"
  },
  {
    "path": "/contact",
    "label": "Contact"
  }
];
