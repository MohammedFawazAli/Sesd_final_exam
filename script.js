const PRODUCTS=[
  {id:1,name:'Aero Wireless Headphones',price:4999,category:'tech',img:'https://images.unsplash.com/photo-1518444020308-9fbdde3d5f11?w=800'},
  {id:2,name:'Lumen Desk Lamp',price:2999,category:'home',img:'https://images.unsplash.com/photo-1534751516642-a1af1ef0b6e7?w=800'},
  {id:3,name:'Pulse Smartwatch',price:9999,category:'tech',img:'https://images.unsplash.com/photo-1541534401786-5a6f8aa5a1c1?w=800'},
  {id:4,name:'Fitness Pack',price:2599,category:'lifestyle',img:'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800'},
  {id:5,name:'Ceramic Mug',price:599,category:'home',img:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800'}
];

let state={products:[...PRODUCTS],cart:{}};

const grid=document.getElementById('productGrid');
const count=document.getElementById('count');
const q=document.getElementById('q');
const sort=document.getElementById('sort');
const category=document.getElementById('category');
const cartBtn=document.getElementById('cartBtn');
const cartPanel=document.getElementById('cartPanel');
const cartItems=document.getElementById('cartItems');
const cartTotal=document.getElementById('cartTotal');
const cartCount=document.getElementById('cartCount');
const closeCart=document.getElementById('closeCart');

document.getElementById('year').innerText=new Date().getFullYear();

function renderProducts(list){
  grid.innerHTML='';
  list.forEach(p=>{
    const card=document.createElement('div');
    card.className='card';
    card.innerHTML=`
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <div class="card-footer">
        <span>${p.category}</span>
        <button class="btn btn-primary" data-id="${p.id}">Add</button>
      </div>
    `;
    grid.append(card);
  });

  count.innerText=list.length;

  document.querySelectorAll('[data-id]').forEach(btn=>{
    btn.onclick=()=>addToCart(parseInt(btn.dataset.id));
  });
}

function applyFilters(){
  let list=[...PRODUCTS];
  const query=q.value.toLowerCase();
  const cat=category.value;

  if(query) list=list.filter(p=>p.name.toLowerCase().includes(query));
  if(cat!=='all') list=list.filter(p=>p.category===cat);

  if(sort.value==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort.value==='price-desc') list.sort((a,b)=>b.price-a.price);

  renderProducts(list);
}

function addToCart(id){
  const p=PRODUCTS.find(x=>x.id===id);
  if(!state.cart[id]) state.cart[id]={...p,qty:0};
  state.cart[id].qty++;
  updateCart();
}

function updateCart(){
  const items=Object.values(state.cart);
  cartItems.innerHTML='';
  let total=0;

  items.forEach(it=>{
    total+=it.price*it.qty;
    const div=document.createElement('div');
    div.className='cart-item';
    div.innerHTML=`
      <div class="cart-thumb"><img src="${it.img}"></div>
      <div style="flex:1">
        <b>${it.name}</b><br>
        Qty: ${it.qty}
      </div>
      <button class="btn btn-ghost" data-dec="${it.id}">-</button>
      <button class="btn btn-ghost" data-inc="${it.id}">+</button>
    `;
    cartItems.append(div);
  });

  document.querySelectorAll('[data-inc]').forEach(b=> b.onclick=()=>{ state.cart[b.dataset.inc].qty++; updateCart(); });
  document.querySelectorAll('[data-dec]').forEach(b=> b.onclick=()=>{
    const item=state.cart[b.dataset.dec];
    item.qty--; if(item.qty<=0) delete state.cart[b.dataset.dec];
    updateCart();
  });

  cartTotal.innerText='₹'+total;
  cartCount.innerText=items.reduce((s,i)=>s+i.qty,0);
  cartCount.style.display=items.length? 'inline-block' : 'none';
}

cartBtn.onclick=()=> cartPanel.style.display='block';
closeCart.onclick=()=> cartPanel.style.display='none';

q.oninput=applyFilters;
sort.onchange=applyFilters;
category.onchange=applyFilters;

applyFilters();
