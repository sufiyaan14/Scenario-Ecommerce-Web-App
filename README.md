# ShopSwift — Vanilla JS E‑commerce Starter

A lightweight e‑commerce web app built with **HTML**, **CSS**, and **JavaScript** (no frameworks). It includes:

- Product grid with search, category filter, and sorting
- Add to cart, quantity controls, remove, and persistent cart via `localStorage`
- Slide‑out cart panel and mock checkout
- Modern, responsive UI — all vanilla

## Quick start

```bash
# 1) Unzip / clone this folder
# 2) Open index.html in your browser (just double‑click)
#    — or — serve it locally for better dev experience:
python -m http.server 5173
# then open http://localhost:5173
```

> No build step required. If you prefer, use any static server (Live Server VS Code extension works great).

## Project structure

```
ecommerce-webapp/
├─ index.html
├─ styles.css
├─ app.js
├─ assets/
│  ├─ logo.svg
│  ├─ favicon.svg
│  ├─ p-*.svg (placeholder product images)
└─ README.md
```

## Customize products

Open `app.js` and edit the `PRODUCTS` array. Each product supports:

```js
{
  id: 'p-001',            // unique string
  title: 'Wireless Headphones',
  price: 79.99,           // number
  compareAt: 99.99,       // number (optional strike‑through)
  category: 'Audio',      // string
  rating: 4.6,            // 0..5 (for display only)
  reviews: 812,           // popularity proxy
  img: 'assets/p-phones.svg', // image path
  createdAt: '2025-07-20' // ISO date for "Newest" sort
}
```

You can add more categories and items freely. Images are simple SVG placeholders you can replace with your own product photos.

## Notes & next steps

- This is a **front‑end only** demo. Hook it to a real backend (e.g., Node/Express or any headless commerce API) for production.
- For routing (multi‑page), add additional `.html` files or switch to a router.
- Accessibility: cart is a dialog with semantic roles; further ARIA improvements are welcome.
- Performance: all assets are tiny SVGs; no external libraries.

## License

MIT — use it freely in your projects.
