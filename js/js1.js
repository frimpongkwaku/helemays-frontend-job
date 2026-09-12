// the first apperearing user modal and greeting handler
// connecting socket to my front end server
// ==========================
// 🚀 SOCKET CONNECTION
// ==========================
// ==========================
// 🚀 SOCKET CONNECTIONg
// ==========================
// ==========================
// 💬 CHAT STATE
// ==========================
const seenMessages = new Set();
const USER_ROLE = "user";

const getOrderId = () =>
  localStorage.getItem("currentOrderId") ||
  new URLSearchParams(window.location.search).get("orderId");

// ==========================
// 🚀 SOCKET CONNECTION
// ==========================
const socket = io("https://storebackend-production-f58c.up.railway.app", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

// ==========================
// 🔌 CONNECT
// ==========================
socket.on("connect", () => {
  console.log("🟢 connected:", socket.id);

  const orderId = getOrderId();
  if (!orderId) return;

  socket.emit("join-order", { orderId });
  loadMessages();
});

// ==========================
// 📩 RECEIVE MESSAGE
// ==========================
socket.on("receive-message", (data) => {
  const key = data._id || `${data.sender}-${data.message}`;

  if (seenMessages.has(key)) return;
  seenMessages.add(key);

  renderMessage(data);
});

// ==========================
// 💬 RENDER MESSAGE
// ==========================
function renderMessage(data) {
  const chatBox = document.getElementById("userChatBox");
  if (!chatBox) return;

  const div = document.createElement("div");

  const sender = data.senderRole || data.sender || "system";

  if (sender === "admin") div.className = "msg admin";
  else if (sender === "user") div.className = "msg user";
  else div.className = "msg system";

  div.textContent = data.message;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ==========================
// 📤 SEND MESSAGE
// ==========================
function sendMessage(message) {
  const orderId = getOrderId();
  if (!orderId || !message) return;

  const payload = {
    orderId,
    message,
    sender: USER_ROLE,
    senderRole: USER_ROLE,
    senderName: localStorage.getItem("userName") || "Guest",
    createdAt: new Date().toISOString()
  };

  // ✅ show instantly (optimistic UI)
  renderMessage(payload);

  socket.emit("send-message", payload);
}

// ==========================
// 📥 LOAD HISTORY
// ==========================
async function loadMessages() {
  const orderId = getOrderId();
  if (!orderId) return;

  const chatBox = document.getElementById("userChatBox");
  if (chatBox) chatBox.innerHTML = "";

  try {
    const res = await fetch(
      `https://storebackend-production-f58c.up.railway.app/api/messages/${orderId}`
    );

    const result = await res.json();
    if (!result.success) return;

    result.data.forEach((msg) => {
      const key = msg._id || `${msg.sender}-${msg.message}`;
      if (seenMessages.has(key)) return;

      seenMessages.add(key);
      renderMessage(msg);
    });
  } catch (err) {
    console.error("Failed to load messages:", err);
  }
}


let userModal; 
let greeting;
// Add this at the top of your JS file, before you reference it
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const products = [{
    id: "shoe001",

    name: "Classic Leather Derby",

    category: "Formal",

    price: 450,

    description: "Handcrafted leather derby shoe made for timeless everyday elegance.",

    images: [
        "./images/loaffers.png",
        "./images/derby-side.png",
        "./images/derby-top.png",
        "./images/derby-back.png"
    ],

    colors: [
        "Black",
        "Brown"
    ],

    sizes: [
        { size: 40, stock: 5 },
        { size: 41, stock: 7 },
        { size: 42, stock: 0 },
        { size: 43, stock: 3 },
        { size: 44, stock: 2 }
    ],

    featured: true,

    active: true
},
{
    id: "shoe002",

    name: "Classic Leather Derby",

    category: "Loafers",

    price: 450,

    description: "Handcrafted leather derby shoe made for timeless everyday elegance.",

    images: [
        "./images/loaffers.png",
        "./images/derby-side.png",
        "./images/derby-top.png",
        "./images/derby-back.png"
    ],

    colors: [
        "Black",
        "Brown"
    ],

    sizes: [
        { size: 40, stock: 5 },
        { size: 41, stock: 7 },
        { size: 42, stock: 0 },
        { size: 43, stock: 3 },
        { size: 44, stock: 2 }
    ],

    featured: true,

    active: true
}
]
/*
const products =[// item arrays// this product is for admin backend// use create data through admin to post this data
{id:"local1", name:"Waakye",price:1,description:"the best waakye in the city",category:"local1",},
{id:"local2", name:"jollof",price:1,description:" The best jollof in the city",category:"local2"},
{id:"local3", name:"Ampesie",price:1,description:"The best in the city",category:"local1"},
{id:"local4", name:"fufu",price:1,description:"hello this is best food in the city",category:"local2"},
{id:"local5", name:"Banku",price:1,description:"hello this is best food in the city",category:"breakfast"},
{id:"local6", name:"Rice with beans",price:67,description:"this is best food in the city",category:"local1"},
{id:"local7", name:"plain rice",price:87,description:"this is best food in the city",category:"local2"},
{id:"local8", name:"brown rice",price:100,description:"YO this is best food in the city",category:"local1"},
{id:"local9", name:"local rice",price:190,description:" this is best food in the city",category:"local2"},
{id:"local20", name:"Banku",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local21", name:"Rice with beans",price:67,description:"this is best food in the city",category:"local1"},
{id:"local22", name:"plain rice",price:87,description:"this is best food in the city",category:"local2"},
{id:"local23", name:"brown rice",price:100,description:"YO this is best food in the city",category:"local1"},
{id:"local24", name:"local rice",price:190,description:" this is best food in the city",category:"local2"},
{id:"local25", name:"Banku",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local26", name:"Rice with beans",price:67,description:"this is best food in the city",category:"local1"},
{id:"local27", name:"plain rice",price:87,description:"this is best food in the city",category:"local2"},
{id:"local28", name:"brown rice",price:100,description:"YO this is best food in the city",category:"local1"},
{id:"local29", name:"local rice",price:190,description:" this is best food in the city",category:"local2"},
// main course data
{id:"local20", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local21", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local22", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local23", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local24", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local25", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local20", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local21", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local22", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local23", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local24", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local25", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
//breakfast data
//breakfast data
{id:"local26", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local27", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local28", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local29", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local30", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local31", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local32", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local33", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local34", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local35", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local36", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
{id:"local37",name:"ice cream",price:464,description:"The best ice cream in town",category:"sides"},
];
*/
//loading effect 
const modalLoader= document.getElementById("modalLoader");
const pageLoader= document.getElementById("loader");
function showLoader(){
  if(modalLoader){
    modalLoader.style.display = "flex";
  }

}

function hideLoader(){
  if(modalLoader){
    modalLoader.classList.add("fade-out");
    setTimeout(()=>{
      modalLoader.style.display="none";
      modalLoader.classList.remove("fade-out");
    },800);
  }

}

// universal modal opener
function openModalWithLoader(modal){

  // show top loading bar
  if(pageLoader){
    pageLoader.style.display = "block";
  }
showLoader();

setTimeout(()=>{
hideLoader();
// hide top loading bar
    if(pageLoader){
      pageLoader.style.display = "none"; }
modal.show();

  },500);
}


const scrollBox = document.querySelector(".about-scroll-wrapper");
const scrollContent = document.querySelector(".about-scroll-content");

scrollBox.addEventListener("touchstart", () => {
  scrollContent.style.animationPlayState = "paused";
});

scrollBox.addEventListener("touchend", () => {
  scrollContent.style.animationPlayState = "running";
});


// cart function 
let cart=[];
let cartInitialized=false;
function addToCart(productId){
  const product = products.find(p=>p.id===(productId));
  if(!product){
    console.error("product not found");
    return;
  }
  
  const cartItem= cart.find(item=>item.id===productId);
  if(cartItem){
    cartItem.qty+=1;
  }else{
    cart.push({...product,qty:1});
  }
  if(!cartInitialized){// showing sticky cart 
    document.getElementById("cartBadgeContainer").classList.remove("d-none");
    cartInitialized=true;
  }
  renderCart();
}

// closing cart modal cartmodal and cart modal declaring 
let cartModal;
let checkoutModal; 
let confirmModal;


//render cart items 
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartItemCount = document.getElementById("cartItemCount"); // badge showing number of items
  const cartTotalAmount = document.getElementById("modalCartTotal"); // total price display
  const emptyCartText = document.getElementById("emptyCartText"); // empty cart message
  const stickyCart= document.getElementById("stickyCartTotal");
  const cartheaderCount= document.getElementById("cartHeaderCount");
  cartItems.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  if (cart.length === 0) {
    emptyCartText.classList.remove("d-none"); // show empty cart text
  } else {
    emptyCartText.classList.add("d-none"); // hide empty cart text
  }

  cart.forEach(item => {
    total += item.price * item.qty;
    itemCount += item.qty;


    cartItems.insertAdjacentHTML("beforeend", `
     <div class="cart-item-modern" data-id="${item.id}">
    
    <div class="cart-thumb">
      <img src="./images/food1.png" alt="${item.name}">
    </div>

    <div class="cart-info">
      <h6 class="cart-title">${item.name}<span><p class="cart-price"> ${item.price}</p></span></h6>
      

      <div class="cart-qty">
        <button class="qty-btn decrease" onclick="changeQty('${item.id}',-1)">−</button>
        <span class="qty-number">${item.qty}</span>
        <button class="qty-btn increase" onclick="changeQty('${item.id}',1)">+</button>
      </div>
    </div>

    <div class="cart-side">
      <div class="item-total">GHS ${item.price * item.qty}</div>
      <button class="delete-btn" onclick="removeItem('${item.id}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>

  </div>
    `);
  });
  


  // Update cart badge / sticky cart count
  cartItemCount.textContent = `${itemCount} item${itemCount !== 1 ? "s" : ""}`;

  // Update total amount
  cartTotalAmount.textContent = `GHS ${total}`;
  stickyCart.textContent=`GHS ${total}`;
  cartheaderCount.textContent=itemCount;

  console.log("Cart updated:", itemCount, "items | Total:", total);
}

//helpers

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}



//change quantity function 
function changeQty(id, change) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.qty += change;
 if (item.qty <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  renderCart();
}

// generate invoice function 
function generateInvoice() {
  return "HMF-" + Date.now();
}
function getOrderTime() {
  return new Date().toLocaleString();
}

// build cart summary for confirmation 
function buildOrderItemsText() {
  let text = "";
  cart.forEach(item => {
    text += `• ${item.name} x${item.qty} = GHS ${item.price * item.qty}\n`;
  });
  return text;
}

// reset cart 
function resetCart(){
  stickyCartWrapper.style.display="none"//hide sticky cart 
}

// whatsapp function to send orders 

function sendToWhatsApp(order) {
  const itemsText = buildOrderItemsText();

  const message = `
🧾 *NEW ORDER — HELEMAYS FOODS*

Invoice: ${order.invoice}
Time: ${order.time}

Name: ${order.name}
Phone: ${order.phone}
Delivery: ${order.delivery}
Payment: ${order.payment}
Address: ${order.address}

Items:
${itemsText}

Total: GHS ${order.total}

Note: ${order.note}
`;

  const whatsappURL =
    "https://wa.me/233593189155?text=" +
    encodeURIComponent(message);

  window.open(whatsappURL, "_blank");
}




// eventlistener to load after the page is ready its reads ones 
document.addEventListener('DOMContentLoaded', function () {
  const modalEl = document.getElementById('userModal');
  userModal = modalEl ? new bootstrap.Modal(modalEl) : null;
  
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  greeting = document.getElementById('greeting');
  
const userForm = document.getElementById('userForm');
// search section for live search with key press on 26/01/26
const searchInput = document.getElementById("searchInput");
const searchRow = document.getElementById("searchFoodRow");
let activeCategory ="all";// breaking down from the all elements// debugging the entire search block of codes

// socket message ui 
/*function addMessageToUI(data) {
  const chatBox = document.getElementById("chatBox");

  const div = document.createElement("div");
  div.classList.add("message");

  div.innerHTML = `
    <div class="bubble">${data.message}</div>
  `;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}*/  

//render search modal results
function renderSearch(){
  const search = searchInput.value.toLowerCase();
  searchRow.innerHTML="";
  // the filtered function to display the data
  const filtered = products.filter(product=>(activeCategory==="all"|| product.category===activeCategory)&&product.name.toLowerCase().includes(search));
  filtered.forEach(product=>{// resizing the card in search modal
    searchRow.innerHTML+= `
        <div class="col-12 mb-3">
  <div class="search-list-card d-flex justify-content-between align-items-center p-3">

    <div class="d-flex align-items-center gap-3">

      <img src="./images/food1.png"
           class="list-img"
           alt="food">

      <div>
        <h6 class="fw-bold mb-1">${product.name}</h6>
        <p class="text-muted small mb-1">
          ${product.description}
        </p>
        <span class="list-price">GH${product.price}</span>
      </div>

    </div>

    <button onclick="addToCart('${product.id}')"
            class="list-add-btn" style="color:white;">+
          </button>

  </div>
</div>`;// holding few data in the all / trying text in a empty frame or before users start searching for prou
  });
  if(!filtered.length){
    searchRow.innerHTML= `<p class="text-center text-muted">no food found</p>`;
  }
};


// checkout function for cart confirmation
document.getElementById("checkoutWhatsApp").addEventListener("click", () => {
  if (!cart.length) {
    alert("Cart is empty");
    return;
  } 

  let name = custName.value.trim();
  let phone = custPhone.value.trim();
  let address = custAddress.value.trim();
  let delivery = deliveryType.value;
  let payment = paymentMethod.value;
  let note = orderNote.value.trim() || "None";

  if (!name || !phone) {
    alert("Name and phone are required");
    return;
  }

  const invoice = generateInvoice();
  const time = getOrderTime();

  // Fill confirmation modal
  confirmInvoice.textContent = invoice;
  confirmTime.textContent = time;
  confirmName.textContent = name;
  confirmPhone.textContent = phone;
  confirmDelivery.textContent = delivery;
  confirmPayment.textContent = payment;
  confirmAddress.textContent = address || "None";
  confirmNote.textContent = note;

  confirmItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    confirmItems.innerHTML += `
      <div class="d-flex justify-content-between">
        <span>${item.name} x${item.qty}</span>
        <span>GHS ${item.price * item.qty}</span>
      </div>
    `;
  });

  confirmTotal.textContent = total;
    
  checkoutModal.hide();
  openModalWithLoader(confirmModal);
  name.textContent="";phone="";address="";delivery="";payment="";note="";



  // Attach WhatsApp send
  const buyBtn = document.getElementById("buyBtn");

buyBtn.onclick = async () => {

  if (buyBtn.disabled) return;
  buyBtn.disabled = true;
  buyBtn.textContent = "Processing...";

  try {
    let name = custName.value.trim();
    let phone = custPhone.value.trim();
    let address = custAddress.value.trim();

    if (!name || !phone) {
      alert("Name and phone are required");
      return;
    }

    // auto-generate email for Paystack
    let email = document.getElementById("custEmail").value.trim();
    if (!email || !email.includes("@")) {
  alert("Please enter a valid email");
  return;
}

    // map cart to backend structure: items array with name, price, qty
    const items = cart.map(item => ({
      name: item.name,
      price: item.price,
      qty: item.qty
    }));

    const payload = {
      items,
      customer: { name, email, phone }
    };

    console.log("Payload to backend:", payload); // debug the payload with console

    const response = await fetch("https://storebackend-production-f58c.up.railway.app/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)//payloads
    });

    const data = await response.json();

    const orderId = data.orderId; // make sure backend returns this

// join chat room for this order
socket.emit("join-order", { orderId }); 

// store for later messaging
localStorage.setItem("currentOrderId", orderId);

    if (!data.authorization_url) {
      alert("Payment initialization failed");
      return;
    }

    // redirect to Paystack
    window.location.href = data.authorization_url;

  } catch (error) {
    console.error("Payment error:", error);
    alert("Something went wrong. Try again.");
  }
};

  /*buyBtn.addEventListener("click" ,()=> {
    sendToWhatsApp({
      name,
      phone,
      delivery,
      payment,
      address,
      note,
      invoice,
      time,
      total
    });

   
   confirmModal.hide();
   clearCart();
  
   
  });*/
});

// confirmation element from front end 

const custName = document.getElementById("custName");
const custPhone = document.getElementById("custPhone");
const custAddress = document.getElementById("custAddress");
const deliveryType = document.getElementById("deliveryType");
const paymentMethod = document.getElementById("paymentMethod");
const orderNote = document.getElementById("orderNote");

const confirmInvoice = document.getElementById("confirmInvoice");
const confirmTime = document.getElementById("confirmTime");
const confirmName = document.getElementById("confirmName");
const confirmPhone = document.getElementById("confirmPhone");
const confirmDelivery = document.getElementById("confirmDelivery");
const confirmPayment = document.getElementById("confirmPayment");
const confirmAddress = document.getElementById("confirmAddress");
const confirmNote = document.getElementById("confirmNote");
const confirmItems = document.getElementById("confirmItems");
const confirmTotal = document.getElementById("confirmTotal");

const sendWhatsAppBtn = document.getElementById("sendWhatsAppBtn");





const stickyCart = document.getElementById("cartBadgeContainer");


 const CartIcon= document.getElementById("cartIcon");
 CartIcon.addEventListener("click",function(){
  openModalWithLoader(cartModal);
 }) 

  stickyCart.addEventListener("click", () => {
    if (cartModal) {
      openModalWithLoader(cartModal);
    }
  });

const cartModalEl = document.getElementById("cartModal");
const checkoutModalEl = document.getElementById("checkoutModal");
const confirmModalEl = document.getElementById("confirmModal");

cartModal = cartModalEl ? new bootstrap.Modal(cartModalEl) : null;
checkoutModal = checkoutModalEl ? new bootstrap.Modal(checkoutModalEl) : null;
confirmModal= confirmModalEl? new bootstrap.Modal(confirmModalEl) : null;

//checkout button //place order button
const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {     
    if (cart.length === 0) {  
      alert("Your cart is empty");
      return;
    }

    // CLOSE cart modal
    cartModal.hide();

    // OPEN checkout modal after backdrop clears
    setTimeout(() => {
      openModalWithLoader(checkoutModal);
    }, 500);
  });
}




// live search key press
searchInput.addEventListener("input",renderSearch);
//cat filter buttons 
document.querySelectorAll(".category-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".category-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory= btn.dataset.category;
    renderSearch();
  });
});
//resetting modal when opened
document.getElementById("searchModal").addEventListener("shown.bs.modal",()=>{
  searchInput.value="";
  activeCategory="all";
  document.querySelectorAll(".category-btn").forEach(b=>b.classList.remove("active"));
  document.querySelector("[data-category='all']").classList.add("active");
  renderSearch();
});


  // greetings with time on the header and on the user dashboard//function to render time and greeting using the user modal 

/*
const userdetails= document.getElementById("userdetails");
userdetails.addEventListener("click",function(){
  const username=document.getElementById("userName");
  const useremail= document.getElementById("userEmail");

})*/

// function to render cards 
// function to render skeleton before actual card loads 

function showSkeleton(containerId, count = 6){// what if i want to use show skeleton for my modals
  const container = document.getElementById(containerId);
  container.innerHTML="";

  for(let i=0;i<count;i++){
    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="col d-flex">
        <div class="skeleton-card"></div>
      </div>
      `
    );
  }
}
// product rendering function to render the products in the front end
function render(category = "All") {

    const container = document.getElementById("shoeProductsRow");

    if (!container) return;

    container.innerHTML = "";

    const filteredProducts =
        category === "All"
            ? products.filter(item => item.active !== false)
            : products.filter(
                item =>
                    item.category === category &&
                    item.active !== false
            );

    if (!filteredProducts.length) {

        container.innerHTML = `
            <div class="empty-products">
            <div class="empty-products-icon">
                <i class="fa-solid fa-shoe-prints"></i>
            </div>

            <h3>No shoes in this collection</h3>

            <p>
                We don't have any shoes available in this category yet.
                Check another collection or browse all shoes.
            </p>

            <button
                type="button"
                class="empty-products-btn"
                onclick="render('All')"
            >
                View All Shoes
                <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
        `;

        return;
    }

    filteredProducts.forEach(item => {

        const mainImage =
            item.images?.[0] ||
            "./images/shoe-placeholder.png";

        const badge =
            item.featured
                ? "FEATURED"
                : "";

        container.insertAdjacentHTML(
            "beforeend",
            `
            <article
                class="shoe-product-card"
                data-product-id="${item.id}"
            >

                <div class="shoe-product-image">

                    ${badge ? `
                        <span class="shoe-product-badge">
                            ${badge}
                        </span>
                    ` : ""}

                    <button
                        class="shoe-wishlist"
                        type="button"
                        aria-label="Add ${item.name} to wishlist"
                    >
                        <i class="fa-regular fa-heart"></i>
                    </button>

                    <img
                        src="${mainImage}"
                        alt="${item.name}"
                        loading="lazy"
                    />

                    <button
                        class="shoe-image-view"
                        type="button"
                        onclick="openProductDetails('${item.id}')"
                    >
                        View Details
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>

                </div>

                <div class="shoe-product-info">

                    <span class="shoe-product-category">
                        ${item.category}
                    </span>

                    <h3 class="shoe-product-name">
                        ${item.name}
                    </h3>

                    <div class="shoe-product-bottom">

                        <div class="shoe-product-price">

                            <span>Price</span>

                            <strong>
                                GH₵ ${item.price}
                            </strong>

                        </div>

                        <button
                            class="shoe-product-arrow"
                            type="button"
                            onclick="openProductDetails('${item.id}')"
                            aria-label="View ${item.name}"
                        >
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>

                    </div>

                </div>

            </article>
            `
        );

    });
}


function openProductDetails(productId) {

  // 1. Find the selected product
  const product = products.find(
    item => item.id === productId
  );

  if (!product) {
    console.error("Product not found:", productId);
    return;
  }

  console.log("Opening product:", product);

  // 2. Get modal elements
  const modal = document.getElementById("productDetailsModal");
  const mainImage = document.getElementById("productMainImage");
  const thumbnails = document.getElementById("productThumbnails");

  const title = document.getElementById("productDetailsTitle");
  const category = document.getElementById("productDetailsCategory");
  const price = document.getElementById("productDetailsPrice");
  const description = document.getElementById("productDetailsDescription");

  // 3. Fill product information
  title.textContent = product.name;
  category.textContent = product.category;
  price.textContent = `GH₵ ${product.price}`;
  description.textContent = product.description;

  // 4. Get product images
  const productImages =
    product.images?.length
      ? product.images
      : ["./images/shoe-placeholder.png"];

  // 5. Set the first image as the main image
  mainImage.src = productImages[0];
  mainImage.alt = product.name;

  // 6. Clear old thumbnails
  thumbnails.innerHTML = "";

  // 7. Create thumbnails
  productImages.forEach((image, index) => {

    const thumbnail = document.createElement("button");

    thumbnail.type = "button";
    thumbnail.className = "product-thumbnail";

    // First image is selected
    if (index === 0) {
      thumbnail.classList.add("active");
    }

    thumbnail.innerHTML = `
      <img
        src="${image}"
        alt="${product.name} image ${index + 1}"
      >
    `;

    // 8. Change main image when thumbnail is clicked
    thumbnail.addEventListener("click", () => {

      mainImage.src = image;

      // Remove active from all thumbnails
      thumbnails
        .querySelectorAll(".product-thumbnail")
        .forEach(item => {
          item.classList.remove("active");
        });

      // Make clicked thumbnail active
      thumbnail.classList.add("active");
    });

    thumbnails.appendChild(thumbnail);
  });

  // 9. Open modal
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  // ========================================
// 10. PRODUCT COLOR SELECTION
// ========================================

const colorOptions = document.getElementById("productColorOptions");
const selectedColorText = document.getElementById("selectedColorText");

// Clear colors from previous product
colorOptions.innerHTML = "";

// Reset selected color text
selectedColorText.textContent = "Select a color";

// Check if this product has colors
if (product.colors && product.colors.length > 0) {

  product.colors.forEach((color, index) => {

    const colorButton = document.createElement("button");

    colorButton.type = "button";
    colorButton.className = "product-color-option";

    colorButton.textContent = color;

    // Select first color automatically
    if (index === 0) {
      colorButton.classList.add("active");
      selectedColorText.textContent = color;
    }

    // When customer selects a color
    colorButton.addEventListener("click", () => {

      // Remove active state from all colors
      colorOptions
        .querySelectorAll(".product-color-option")
        .forEach(button => {
          button.classList.remove("active");
        });

      // Activate selected color
      colorButton.classList.add("active");

      // Update selected color text
      selectedColorText.textContent = color;

      console.log("Selected color:", color);
    });

    colorOptions.appendChild(colorButton);
  });

} else {

  // Product has no color options
  selectedColorText.textContent = "Default";

  const defaultColor = document.createElement("span");

  defaultColor.className = "product-color-unavailable";

  defaultColor.textContent = "Standard";

  colorOptions.appendChild(defaultColor);
}
// ========================================
// 11. PRODUCT SIZE SELECTION
// ========================================

const sizeOptions = document.getElementById("productSizeOptions");
const selectedSizeText = document.getElementById("selectedSizeText");

// Clear sizes from previous product
sizeOptions.innerHTML = "";

// Reset selected size text
selectedSizeText.textContent = "Select a size";

// Check if this product has sizes
if (product.sizes && product.sizes.length > 0) {

  product.sizes.forEach((sizeItem) => {

    const sizeButton = document.createElement("button");

    sizeButton.type = "button";
    sizeButton.className = "product-size-option";

    sizeButton.textContent = sizeItem.size;

    // Check stock
    if (sizeItem.stock <= 0) {

      sizeButton.disabled = true;
      sizeButton.classList.add("out-of-stock");

      sizeButton.textContent = `${sizeItem.size} — Out of stock`;

    }

    // When customer selects an available size
    if (sizeItem.stock > 0) {

      sizeButton.addEventListener("click", () => {

        // Remove active state from all sizes
        sizeOptions
          .querySelectorAll(".product-size-option")
          .forEach(button => {
            button.classList.remove("active");
          });

        // Activate selected size
        sizeButton.classList.add("active");

        // Update selected size text
        selectedSizeText.textContent = sizeItem.size;

        console.log("Selected size:", sizeItem.size);
        console.log("Available stock:", sizeItem.stock);

      });

    }

    sizeOptions.appendChild(sizeButton);

  });

} else {

  selectedSizeText.textContent = "One size";

  const defaultSize = document.createElement("span");

  defaultSize.className = "product-size-unavailable";

  defaultSize.textContent = "Standard";

  sizeOptions.appendChild(defaultSize);
}
// ========================================
// 12. PRODUCT QUANTITY
// ========================================

const productQtyMinus = document.getElementById("productQtyMinus");
const productQtyPlus = document.getElementById("productQtyPlus");
const productQtyText = document.getElementById("productQty");

let productQuantity = 1;

// Reset quantity when product opens
productQtyText.textContent = productQuantity;

// Decrease quantity
productQtyMinus.addEventListener("click", () => {

  if (productQuantity <= 1) {
    return;
  }

  productQuantity--;

  productQtyText.textContent = productQuantity;

  console.log("Selected quantity:", productQuantity);
});

// Increase quantity
productQtyPlus.addEventListener("click", () => {

  // Find currently selected size
  const activeSize = sizeOptions.querySelector(
    ".product-size-option.active"
  );

  // If no size has been selected
  if (!activeSize) {
    console.log("Please select a size first.");
    return;
  }

  // Get selected size
  const selectedSize = product.sizes.find(
    sizeItem => String(sizeItem.size) === activeSize.textContent
  );

  if (!selectedSize) {
    return;
  }

  // Prevent quantity from exceeding stock
  if (productQuantity >= selectedSize.stock) {
    console.log("Maximum available stock reached:", selectedSize.stock);
    return;
  }

  productQuantity++;

  productQtyText.textContent = productQuantity;

  console.log("Selected quantity:", productQuantity);
});
}


// Allow inline onclick="openProductDetails(...)"
window.openProductDetails = openProductDetails;



// ==========================
// 👟 CATEGORY SWITCHING
// ==========================

document.querySelectorAll(".collection-filter").forEach(button => {

    button.addEventListener("click", () => {

        // Get the category from the clicked button
        const category = button.dataset.category;

        // Render products for that category
        render(category);

        // Remove active state from all buttons
        document
            .querySelectorAll(".collection-filter")
            .forEach(btn => {
                btn.classList.remove("active");
            });

        // Make the clicked button active
        button.classList.add("active");
    });

});


// ==========================
// 👟 RENDER SHOE COLLECTION
// ==========================

setTimeout(() => {
    render("All");
}, 1200);


//render by category
// show skeleton loaders first
/*
showSkeleton("localFoodsRow");
showSkeleton("localFoodsRow2");
showSkeleton("breakFastRow");
showSkeleton("mainDishRow");
showSkeleton("sidesRow");


setTimeout(()=>{

render("Formal","localFoodsRow");
render("Formal2","localFoodsRow2");
render("breakfast","breakFastRow");
render("mainDish","mainDishRow");
render("sides","sidesRow");

},1200);
*/

// function submit user data// need to work on this one to act as a login
    userForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
// if statement to  check the validation of the email 
    if (name && email && isValidEmail(email)) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      if (userModal) userModal.hide();
      greeting.textContent = `Hi, ${name}! Welcome to Helemays Foods Limited`;
      greetUser();
    } else {
      alert('Please enter a valid name and email!');// 
      if (!name) userNameInput.focus();// focus(come in  view) on wrong or no input space 
      else if (!isValidEmail(email)) userEmailInput.focus();
    }
  });
  greetUser();
}); 
// greeting function 
function greetUser() {
  const storedName = localStorage.getItem('userName');

  let hour = new Date().getHours();
  let greet;    

  if (hour < 11) greet = "Good morning";
  else if (hour < 18) greet = "Good afternoon";
  else greet = "Good evening";

  if (!storedName) {
    if (userModal) userModal.show();
  } else {
    if (greeting) {
      greeting.textContent = `Hi ${greet}, ${storedName}! AKWAABA!`;
    }
  }
}


// scroll function 
let lastScrollTop = 0;
const whatsappButton = document.querySelector('.whatsapp-button');

window.addEventListener("scroll", function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (!whatsappButton) return;

  if (scrollTop > lastScrollTop) {
    // Scrolling down - hide button
    whatsappButton.classList.add("hide");
  } else {
    // Scrolling up - show button
    whatsappButton.classList.remove("hide");
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Avoid negative scroll values//what is negative scroll values;
});


//function to handle location// i need to work on the location of this data 
function openMap(){ // how to design a beautiful online front end and also make it more appealing 
  const destination ="5.6037,-0.1870";// why this numbers 
  if(navigator.geolocation){// 
        navigator.geolocation.getCurrentPosition(pos=>{
      const lat= pos.coords.latitude;// connecting map to the backend to access google maps using extension 
      const lng = pos.coords.longitude;
      const url=`https://www.google.com/maps/dir/${lat},${lng}/${destination}`;
      window.open(url,"blank");
    });
  }else{
    alert("Geolocation not supported");
  }
}

// loading page effect
window.addEventListener('load', () => {
  setTimeout(() => {
    if (pageLoader) {
      pageLoader.classList.add('fade-out');
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 500);
    }
  }, 1500); // 3 seconds delay
});

// sticky cart 
 const stickyCartWrapper = document.getElementById("cartBadgeContainer");
function hideSticky(){
 
if (cart.length === 0) {
  stickyCartWrapper.classList.add("d-none");
 }else{
   stickyCartWrapper.classList.remove("d-none");
 }
}

// function to handle forms 
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (name && message && email && isValidEmail(email)) {
      alert(`Thank you for contacting Helemays, ${name}. We will get back to you shortly!`);// this should be in a modal
      contactForm.reset();

      const contactModal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
      if (contactModal) contactModal.hide();
    } else {
      alert('Please fill in all fields with a valid email before submitting.');
      if (!name) document.getElementById('contactName').focus();
      else if (!message) document.getElementById('contactMessage').focus();
      else if (!isValidEmail(email)) document.getElementById('contactEmail').focus();
    }
  });
}

// js croll indacator function 
function scrollRow(rowId, distance) {
  const row = document.getElementById(rowId);
  row.scrollBy({ left: distance, behavior: 'smooth' });
}

const row = document.getElementById("localFoodsRow");
let scrollAmount = 0;
function autoScroll() {
  scrollAmount += 1; // speed (increase for faster)
if (row.scrollLeft >= row.scrollWidth / 2) {
    row.scrollLeft = 0;
  }
row.scrollLeft = scrollAmount;

// reset when it reaches end
  if (scrollAmount >= row.scrollWidth - row.clientWidth) {
    scrollAmount = 0;
  }
}
setInterval(autoScroll, 20); // smooth animation// is setInterval an inbuilt function from js// asking the computer to check if setinterval function is an inbuilt 
let interval;
function startScroll() {
  interval = setInterval(autoScroll, 100);
}
function stopScroll() {
  clearInterval(interval);
}
row.addEventListener("mouseenter", stopScroll);
row.addEventListener("mouseleave", startScroll);
startScroll();

// ==========================
// 💬 CHAT FUNCTIONS
// ==========================





document.getElementById("userSendBtn").addEventListener("click", () => {
  const input = document.getElementById("userChatInput");

  if (!input.value) return;

  sendMessage(input.value);
  input.value = "";
});



// refactor this code to make more moduler form 
// refactor to react front end 
// refactor to react native and to android and ios mobile version