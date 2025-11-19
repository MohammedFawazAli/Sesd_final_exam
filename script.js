/* Basic sample data and UI interactions for the mock store */
const products = [
  { id: 1, title: "Wireless Headphones", price: 2499, category: "tech", img: "https://images.unsplash.com/photo-1518444020308-9fbdde3d5f11?w=800&q=60" },
  { id: 2, title: "LED Desk Lamp", price: 1199, category: "home", img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=60" },
  { id: 3, title: "Mechanical Keyboard", price: 3499, category: "tech", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=60" },
  { id: 4, title: "Ceramic Mug - 2 pack", price: 499, category: "home", img: "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=800&q=60" },
  { id: 5, title: "Intro to JS - Paperback", price: 899, category: "books", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=60" },
  { id: 6, title: "Smart Watch", price: 5999, category: "tech", img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=60" }
];

let cart = {}; // { productId: qty }

const grid = document.getElementById("product-grid");
const cartCountEl = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const categorySelect = document.getElementById("category-select");

function formatRupee(n){ return n.toLocaleString('en-IN'); }

function renderProducts(list){
  grid.innerHTML = "";
  if(list.length === 0){
    grid.innerHTML = `<div style="grid-column:1/-1;padding:20px;color:var(--muted)">No products found.</div>`;
    return;
  }
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("role","listitem");
    card.innerHTML = `
      <div class="product-media"><img src="${p.img}" alt="${p.title}" loading="lazy"/></div>
      <div class="product-title">${p.title}</div>
      <div class="product-price">₹${formatRupee(p.price)}</div>
      <div class="card-actions">
        <button class="small-btn add-btn" data-id="${p.id}">Add to cart</button>
        <button class="small-btn" onclick="alert('Quick view: ${p.title}\\nPrice: ₹${formatRupee(p.price)}')">Quick view</button>
      </div>
    `;
    grid.appendChild(card);
  });
  // attach add handlers
  document.querySelectorAll(".add-btn").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = Number(e.currentTarget.dataset.id);
      addToCart(id);
    });
  });
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
}

function removeFromCart(id){
  delete cart[id];
  updateCartUI();
}

function updateCartUI(){
  const count = Object.values(cart).reduce((s,v)=>s+v,0);
  cartCountEl.textContent = count;
  // render cart modal contents
  cartItemsEl.innerHTML = "";
  let total = 0;
  for(const [idStr, qty] of Object.entries(cart)){
    const id = Number(idStr);
    const p = products.find(x=>x.id===id);
    if(!p) continue;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <div class="meta">
        <div style="font-weight:600">${p.title}</div>
        <div style="color:var(--muted)">₹${formatRupee(p.price)} × ${qty}</div>
        <div style="margin-top:8px">
          <button class="small-btn dec" data-id="${id}">-</button>
          <button class="small-btn inc" data-id="${id}">+</button>
          <button class="small-btn" data-id="${id}" style="margin-left:8px">Remove</button>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(li);
    total += p.price * qty;
  }
  cartTotalEl.textContent = formatRupee(total);

  // attach inc/dec/remove handlers
  cartItemsEl.querySelectorAll(".inc").forEach(b=>b.addEventListener("click", e=>{
    const id = Number(e.currentTarget.dataset.id);
    cart[id] = (cart[id] || 0) + 1;
    updateCartUI();
  }));
  cartItemsEl.querySelectorAll(".dec").forEach(b=>b.addEventListener("click", e=>{
    const id = Number(e.currentTarget.dataset.id);
    if(!cart[id]) return;
    cart[id]--;
    if(cart[id] <= 0) delete cart[id];
    updateCartUI();
  }));
  cartItemsEl.querySelectorAll(".small-btn[data-id]").forEach(b=>{
    if(b.textContent.trim() === "Remove"){
      b.addEventListener("click", e=>{
        const id = Number(e.currentTarget.dataset.id);
        removeFromCart(id);
      });
    }
  });
}

function openCart(){
  cartModal.setAttribute("aria-hidden","false");
}
function closeCart(){
  cartModal.setAttribute("aria-hidden","true");
}

document.getElementById("cart-btn").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
cartModal.addEventListener("click", e => {
  if(e.target === cartModal) closeCart();
});
document.getElementById("checkout").addEventListener("click", ()=>{
  if(Object.keys(cart).length === 0){
    alert("Your cart is empty.");
    return;
  }
  alert("Checkout simulated. Thanks for trying the mock store!");
  cart = {};
  updateCartUI();
  closeCart();
});

// Search & filters
function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  let list = products.slice();
  if(cat !== "all"){
    list = list.filter(p => p.category === cat);
  }
  if(q){
    list = list.filter(p => p.title.toLowerCase().includes(q));
  }
  renderProducts(list);
}
searchBtn.addEventListener("click", applyFilters);
searchInput.addEventListener("keydown", e => { if(e.key === "Enter") applyFilters(); });
categorySelect.addEventListener("change", applyFilters);

// init
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts(products);
updateCartUI();
document.getElementById("shop-now").addEventListener("click", ()=> window.scrollTo({top: document.querySelector(".products-section").offsetTop - 20, behavior:"smooth"}));
