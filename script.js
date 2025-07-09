const { jsPDF } = window.jspdf;

const products = [
  { id:1, name:"Wireless Headphones", category:"electronics", price:1999, rating:4.5, image:"assets/product1.jpg", description:"Noise‑cancelling pink headphones." },
  { id:2, name:"Cotton T‑Shirt", category:"clothing", price:499, rating:4.0, image:"assets/product2.jpg", description:"Soft pastel pink cotton t‑shirt." },
  { id:3, name:"Romantic Novel", category:"books", price:299, rating:3.9, image:"assets/product3.jpg", description:"Heartwarming love story." },
  { id:4, name:"Smartphone Case", category:"electronics", price:299, rating:4.2, image:"assets/product4.jpg", description:"Cute protective phone case." },
  { id:5, name:"Floral Skirt", category:"clothing", price:799, rating:4.1, image:"assets/product5.jpg", description:"Chiffon floral pink skirt." },
  { id:6, name:"LED Table Lamp", category:"electronics", price:1299, rating:4.6, image:"assets/product6.jpg", description:"Cute pink LED desk lamp." }
];


let activeFilters = { category:"all" };
let cart = [];
let currentProduct = null;
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const modal = document.getElementById("productModal");
const cartSidebar = document.getElementById("cartSidebar");
const cartToggle = document.getElementById("cartToggle");
const cartItemsDiv = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");

function renderProducts(data){
  productGrid.innerHTML="";
  data.forEach(p=>{
    const card=document.createElement("div");
    card.className="product-card";
    card.innerHTML=`
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p class="price">₹${p.price}</p>
      <p class="rating">⭐ ${p.rating}</p>
    `;
    card.onclick=()=> showModal(p);
    productGrid.appendChild(card);
  });
  if(data.length===0) productGrid.innerHTML="<p>No products found 💔</p>";
}

function applyFilters(){
  let filtered = products.filter(p=>activeFilters.category==="all"||p.category===activeFilters.category);
  const kw=searchInput.value.toLowerCase();
  if(kw) filtered = filtered.filter(p=>p.name.toLowerCase().includes(kw));
  if(sortSelect.value==="price-asc") filtered.sort((a,b)=>a.price-b.price);
  else if(sortSelect.value==="price-desc") filtered.sort((a,b)=>b.price-a.price);
  else if(sortSelect.value==="rating-desc") filtered.sort((a,b)=>b.rating-a.rating);
  renderProducts(filtered);
}

document.querySelectorAll(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(`[data-type="category"]`).forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  activeFilters.category=btn.dataset.value;
  applyFilters();
}));

searchInput.addEventListener("input",applyFilters);
sortSelect.addEventListener("change",applyFilters);

function showModal(p){
  currentProduct = {...p};
  document.getElementById("modalImg").src=p.image;
  document.getElementById("modalTitle").textContent=p.name;
  document.getElementById("modalDesc").textContent=p.description;
  document.getElementById("modalPrice").textContent=p.price;
  document.getElementById("modalRating").textContent=p.rating;
  modal.classList.remove("hidden");
  const formInputs=["cardName","cardNumber","cardExpiry","cardCVV"];
  formInputs.forEach(id=>document.getElementById(id).value="");
}

document.getElementById("closeModal").onclick=()=>modal.classList.add("hidden");

document.getElementById("addToCartBtn").onclick=()=>{
  cart.push(currentProduct);
  updateCart();
  modal.classList.add("hidden");
};

cartToggle.onclick=()=>{
  cartSidebar.classList.toggle("visible");
};

function updateCart(){
  cartItemsDiv.innerHTML="";
  let total=0;
  cart.forEach((p,i)=>{
    total+=p.price;
    const div=document.createElement("div"); div.className="cart-item";
    div.innerHTML=`<p>${p.name} – ₹${p.price}</p>`;
    cartItemsDiv.appendChild(div);
  });
  cartTotalEl.textContent=total;
  cartToggle.textContent=`Cart (${cart.length})`;
}

document.getElementById("checkoutBtn").onclick=()=>{
  modal.classList.remove("hidden");
};

const form=document.getElementById("paymentForm");
const popup=document.getElementById("successPopup");

form.addEventListener("submit",(e)=>{
  e.preventDefault();
  const n=document.getElementById("cardName").value.trim();
  const num=document.getElementById("cardNumber").value.trim();
  const exp=document.getElementById("cardExpiry").value.trim();
  const cvv=document.getElementById("cardCVV").value.trim();
  if(!n||num.length<8||!exp||cvv.length<3){return alert("Fill in all fake card details 💳");}
  popup.classList.remove("hidden");
  generatePDF(n, num);
  setTimeout(()=>{
    popup.classList.add("hidden");
    window.location.href="thankyou.html";
  },2000);
});

function generatePDF(name, number){
  const doc=new jsPDF();
  const d=new Date().toLocaleDateString();
  const masked="**** **** **** "+number.slice(-4);
  doc.setFontSize(16); doc.text("UltraShop Invoice 💖",20,20);
  doc.setFontSize(12);
  doc.text(`Customer: ${name}`,20,40);
  doc.text(`Card: ${masked}`,20,50);
  doc.text(`Date: ${d}`,20,60);
  doc.text(`Total Paid: ₹${cart.reduce((sum,p)=>sum+p.price,0)}`,20,80);
  doc.save(`Invoice_${Date.now()}.pdf`);
}

renderProducts(products);
// ✅ Only close modal if you click directly on the background overlay
document.getElementById("productModal").addEventListener("click", (e) => {
  if (e.target.id === "productModal") {
    document.getElementById("productModal").classList.add("hidden");
  }
});

// 💖 Hide cart sidebar when clicking outside it
window.addEventListener("click", (e) => {
  const cartSidebar = document.getElementById("cartSidebar");
  const cartToggle = document.getElementById("cartToggle");

  if (
    cartSidebar.classList.contains("visible") &&
    !cartSidebar.contains(e.target) &&
    !cartToggle.contains(e.target)
  ) {
    cartSidebar.classList.remove("visible");
  }
});
