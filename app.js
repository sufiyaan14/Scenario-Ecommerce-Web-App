/* ShopSwift — Minimal E‑commerce JS (vanilla) */
const PRODUCTS = [
  { id: 'p-001', title: 'Wireless Headphones', price: 79.99, compareAt: 99.99, category: 'Audio', rating: 4.6, reviews: 812, img: 'assets/p-phones.svg', createdAt: '2025-07-20' },
  { id: 'p-002', title: 'Smart Watch', price: 119.00, compareAt: 149.00, category: 'Wearables', rating: 4.4, reviews: 640, img: 'assets/p-watch.svg', createdAt: '2025-06-02' },
  { id: 'p-003', title: 'Mechanical Keyboard', price: 69.50, compareAt: 89.00, category: 'Computers', rating: 4.7, reviews: 420, img: 'assets/p-keyboard.svg', createdAt: '2025-05-10' },
  { id: 'p-004', title: '4K Action Camera', price: 159.99, compareAt: 199.99, category: 'Cameras', rating: 4.3, reviews: 215, img: 'assets/p-camera.svg', createdAt: '2025-08-05' },
  { id: 'p-005', title: 'Bluetooth Speaker', price: 39.99, compareAt: 59.99, category: 'Audio', rating: 4.5, reviews: 1250, img: 'assets/p-speaker.svg', createdAt: '2025-07-12' },
  { id: 'p-006', title: 'USB‑C Charger 65W', price: 29.99, compareAt: 39.99, category: 'Accessories', rating: 4.8, reviews: 93, img: 'assets/p-charger.svg', createdAt: '2025-03-22' },
  { id: 'p-007', title: 'Gaming Mouse', price: 34.00, compareAt: 49.00, category: 'Computers', rating: 4.2, reviews: 506, img: 'assets/p-mouse.svg', createdAt: '2025-04-19' },
  { id: 'p-008', title: 'LED Desk Lamp', price: 24.99, compareAt: 35.00, category: 'Home', rating: 4.4, reviews: 178, img: 'assets/p-lamp.svg', createdAt: '2025-01-14' },
  { id: 'p-009', title: 'Portable SSD 1TB', price: 109.00, compareAt: 139.00, category: 'Computers', rating: 4.9, reviews: 990, img: 'assets/p-ssd.svg', createdAt: '2025-08-15' },
  { id: 'p-010', title: 'Fitness Tracker Band', price: 44.99, compareAt: 59.99, category: 'Wearables', rating: 4.1, reviews: 302, img: 'assets/p-band.svg', createdAt: '2025-07-01' }
];

const qs = (s, el=document)=>el.querySelector(s);
const qsa = (s, el=document)=>Array.from(el.querySelectorAll(s));

const state = {
  products: PRODUCTS,
  term: '',
  category: '',
  sort: 'popularity',
  cart: loadCart()
};

function loadCart(){
  try{ return JSON.parse(localStorage.getItem('cart')||'{}'); }catch{ return {}; }
}
function saveCart(){
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartBadge();
}

function currency(n){ return '$' + n.toFixed(2); }

function renderCategoryOptions(){
  const categories = Array.from(new Set(PRODUCTS.map(p=>p.category))).sort();
  const sel = qs('#categoryFilter');
  categories.forEach(c=>{
    const o = document.createElement('option');
    o.value=c; o.textContent=c;
    sel.appendChild(o);
  });
}

function filteredProducts(){
  let items = [...state.products];
  if(state.term){
    const t = state.term.toLowerCase();
    items = items.filter(p=>p.title.toLowerCase().includes(t));
  }
  if(state.category){
    items = items.filter(p=>p.category===state.category);
  }
  switch(state.sort){
    case 'price-asc': items.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': items.sort((a,b)=>b.price-a.price); break;
    case 'rating-desc': items.sort((a,b)=>b.rating-a.rating); break;
    case 'newest': items.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); break;
    default: items.sort((a,b)=>b.reviews-a.reviews); // popularity proxy
  }
  return items;
}

function productCard(p){
  const el = document.createElement('article');
  el.className='card';
  el.innerHTML = `
    <div class="thumb"><img src="${p.img}" alt="${p.title}"></div>
    <div class="body">
      <h3 title="${p.title}">${p.title}</h3>
      <div class="price"><span class="curr">${currency(p.price)}</span> <span class="strike">${currency(p.compareAt)}</span></div>
      <div class="rating">★ ${p.rating} • ${p.reviews} reviews</div>
      <div class="foot">
        <button class="add-btn primary" data-id="${p.id}">Add to cart</button>
        <button class="icon-btn" title="More">⋯</button>
      </div>
    </div>
  `;
  el.querySelector('.add-btn').addEventListener('click', ()=>addToCart(p.id));
  return el;
}

function renderProducts(){
  const wrap = qs('#products');
  wrap.innerHTML='';
  const items = filteredProducts();
  if(!items.length){
    wrap.innerHTML = `<p class="muted">No products match your search.</p>`;
    return;
  }
  items.forEach(p=>wrap.appendChild(productCard(p)));
}

function addToCart(id){
  state.cart[id] = (state.cart[id]||0) + 1;
  saveCart();
  openCart();
  renderCart();
}

function removeFromCart(id){
  delete state.cart[id];
  saveCart();
  renderCart();
}

function updateQty(id, delta){
  state.cart[id] = Math.max(1, (state.cart[id]||1) + delta);
  saveCart();
  renderCart();
}

function cartEntries(){
  return Object.entries(state.cart).map(([id,qty])=>({ product: PRODUCTS.find(p=>p.id===id), qty }));
}

function cartTotals(){
  const entries = cartEntries();
  const subtotal = entries.reduce((sum, {product, qty})=> sum + product.price*qty, 0);
  return { subtotal };
}

function updateCartBadge(){
  const count = Object.values(state.cart).reduce((a,b)=>a+b,0);
  qs('#cartCount').textContent = count;
}

function renderCart(){
  const itemsEl = qs('#cartItems');
  itemsEl.innerHTML='';
  const entries = cartEntries();
  if(!entries.length){
    itemsEl.innerHTML = `<p class="muted">Your cart is empty.</p>`;
  }else{
    entries.forEach(({product, qty})=>{
      const row = document.createElement('div');
      row.className='cart-item';
      row.innerHTML = `
        <img src="${product.img}" alt="${product.title}">
        <div>
          <div><strong>${product.title}</strong></div>
          <div class="muted small">${product.category}</div>
          <div class="price"><span class="curr">${currency(product.price)}</span></div>
          <div class="qty">
            <button aria-label="Decrease" data-id="${product.id}" data-d="-1">−</button>
            <span>${qty}</span>
            <button aria-label="Increase" data-id="${product.id}" data-d="1">＋</button>
          </div>
        </div>
        <div>
          <button class="icon-btn" aria-label="Remove" data-remove="${product.id}">🗑</button>
        </div>
      `;
      row.querySelector('[data-d="-1"]').addEventListener('click', e=>updateQty(product.id, -1));
      row.querySelector('[data-d="1"]').addEventListener('click', e=>updateQty(product.id, +1));
      row.querySelector('[data-remove]').addEventListener('click', e=>removeFromCart(product.id));
      itemsEl.appendChild(row);
    });
  }
  const { subtotal } = cartTotals();
  qs('#subtotal').textContent = currency(subtotal);
}

function openCart(){
  qs('#cartPanel').hidden=false;
  qs('#overlay').hidden=false;
  requestAnimationFrame(()=>{
    qs('#cartPanel').classList.add('open');
  });
}
function closeCart(){
  qs('#cartPanel').classList.remove('open');
  setTimeout(()=>{
    qs('#cartPanel').hidden=true;
    qs('#overlay').hidden=true;
  }, 250);
}

function bindUI(){
  qs('#year').textContent = new Date().getFullYear();

  qs('#cartButton').addEventListener('click', openCart);
  qs('#closeCart').addEventListener('click', closeCart);
  qs('#overlay').addEventListener('click', closeCart);

  qs('#clearCartBtn').addEventListener('click', ()=>{
    state.cart = {};
    saveCart();
    renderCart();
  });

  qs('#checkoutBtn').addEventListener('click', ()=>{
    const { subtotal } = cartTotals();
    alert('Demo checkout — subtotal: ' + currency(subtotal));
  });

  qs('#searchForm').addEventListener('submit', e=>{
    e.preventDefault();
    state.term = qs('#searchInput').value.trim();
    renderProducts();
  });

  qs('#categoryFilter').addEventListener('change', e=>{
    state.category = e.target.value;
    renderProducts();
  });

  qs('#sortSelect').addEventListener('change', e=>{
    state.sort = e.target.value;
    renderProducts();
  });

  updateCartBadge();
}

function init(){
  renderCategoryOptions();
  renderProducts();
  renderCart();
  bindUI();
}
document.addEventListener('DOMContentLoaded', init);
