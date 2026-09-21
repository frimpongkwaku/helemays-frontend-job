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
const WHATSAPP_NUMBER = "233206092604";

const products = [{id: "shoe001",name: "Classic Leather sandals",category: "Sandals",price: 450,description: "Handcrafted leather derby shoe made for timeless everyday elegance.",
images: ["./images/sandals2.png","./images/derby-side.png","./images/derby-top.png","./images/derby-back.png"],
colors: ["Black","Brown"],
sizes: [{ size: 40, stock: 5 },{ size: 41, stock: 7 },{ size: 42, stock: 0 },{ size: 43, stock: 3 },{ size: 44, stock: 2 }],
featured: true,active: true
},
{id: "shoe002",name: "Classic Leather Shoe",category: "Formal",price: 450,description: "Handcrafted leather derby shoe made for timeless everyday elegance.",
images: ["./images/shoes-removebg-preview.png","./images/derby-side.png","./images/derby-top.png","./images/derby-back.png"],
colors: ["Black","Brown"],
sizes: [{ size: 40, stock: 5 },{ size: 41, stock: 7 },{ size: 42, stock: 0 },{ size: 43, stock: 3 },{ size: 44, stock: 2 }],
featured: true,active: true
},
{id: "shoe003",name: "Classic Leather Loafers",category: "Loafers",price: 450,description: "Handcrafted leather derby shoe made for timeless everyday elegance.",
images: ["./images/loaffers.png","./images/derby-side.png","./images/derby-top.png","./images/derby-back.png"],
colors: ["Black","Brown"],
sizes: [{ size: 40, stock: 5 },{ size: 41, stock: 7 },{ size: 42, stock: 0 },{ size: 43, stock: 3 },{ size: 44, stock: 2 }],
featured: true,active: true
},
{id: "shoe004",name: "Classic Leather Derby",category: "Slippers",price: 450,description: "Handcrafted leather derby shoe made for timeless everyday elegance.",
images: ["./images/sandals2.png","./images/derby-side.png","./images/derby-top.png","./images/derby-back.png"],
colors: ["Black","Brown"],
sizes: [{ size: 40, stock: 5 },{ size: 41, stock: 7 },{ size: 42, stock: 0 },{ size: 43, stock: 3 },{ size: 44, stock: 2 }],
featured: true,active: true
},
{
    id: "shoe005",

    name: "Classic Leather Boots",

    category: "Boots",

    price: 450,

    description: "Handcrafted leather derby shoe made for timeless everyday elegance.",

    images: [
        "./images/boots-removebg-preview.png",
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


//render cart items 
function renderCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const emptyCartText = document.getElementById("emptyCartText");
  const cartFooter = document.querySelector("#cartModal .cart-footer");

  const modalCartTotal = document.getElementById("modalCartTotal");
  const cartHeaderCount = document.getElementById("cartHeaderCount");

  const cartTotalElement = document.getElementById("cartTotal");
  const cartBadge = document.getElementById("cartBadge");

  const mobileCartBar = document.getElementById("mobileCartBar");

  if (!cartItemsContainer) return;


  // =========================================
  // EMPTY CART
  // =========================================

  if (cart.length === 0) {

    cartItemsContainer.innerHTML = "";

    // Show premium empty-cart section
    if (emptyCartText) {
      emptyCartText.classList.remove("d-none");
    }

    // Hide footer when cart is empty
    if (cartFooter) {
      cartFooter.classList.add("d-none");
    }

    // Update totals
    if (modalCartTotal) {
      modalCartTotal.textContent = "GH₵ 0.00";
    }

    if (cartHeaderCount) {
      cartHeaderCount.textContent = "0";
    }

    // Keep old elements working if they still exist
    if (cartTotalElement) {
      cartTotalElement.textContent = "GH₵ 0";
    }

    if (cartBadge) {
      cartBadge.textContent = "0";
    }

    // Hide mobile cart bar
    if (mobileCartBar) {
      mobileCartBar.classList.add("d-none");
    }

    return;
  }


  // =========================================
  // CART HAS ITEMS
  // =========================================

  // Hide empty-cart section
  if (emptyCartText) {
    emptyCartText.classList.add("d-none");
  }

  // Show footer
  if (cartFooter) {
    cartFooter.classList.remove("d-none");
  }


  let total = 0;
  let totalItems = 0;

  cartItemsContainer.innerHTML = "";


  // =========================================
  // RENDER CART ITEMS
  // =========================================

  cart.forEach((item) => {

    const itemTotal = item.price * item.qty;

    total += itemTotal;
    totalItems += item.qty;


    const cartItemElement = document.createElement("div");

    cartItemElement.className = "cart-item";


    cartItemElement.innerHTML = `
      <div class="cart-item-image">
        <img
          src="${item.image}"
          alt="${item.name}"
        >
      </div>

      <div class="cart-item-content">

        <div class="cart-item-top">

          <div class="cart-item-details">

            <h4>${item.name}</h4>

            <div class="cart-item-options">
              <span>${item.color}</span>
              <span>Size ${item.size}</span>
            </div>

            <span class="cart-item-price">
              GH₵ ${item.price.toFixed(2)}
            </span>

          </div>

          <strong class="cart-item-total">
            GH₵ ${itemTotal.toFixed(2)}
          </strong>

        </div>


        <div class="cart-item-bottom">

          <div class="cart-quantity">

            <button
              type="button"
              onclick="changeQty(
                '${item.productId}',
                '${item.size}',
                '${item.color}',
                -1
              )"
              aria-label="Decrease quantity"
            >
              <i class="fa-solid fa-minus"></i>
            </button>

            <span>${item.qty}</span>

            <button
              type="button"
              onclick="changeQty(
                '${item.productId}',
                '${item.size}',
                '${item.color}',
                1
              )"
              aria-label="Increase quantity"
            >
              <i class="fa-solid fa-plus"></i>
            </button>

          </div>


          <button
            type="button"
            class="cart-remove"
            onclick="removeItem(
              '${item.productId}',
              '${item.size}',
              '${item.color}'
            )"
            aria-label="Remove item"
          >
            <i class="fa-solid fa-trash"></i>
          </button>

        </div>

      </div>
    `;


    cartItemsContainer.appendChild(cartItemElement);

  });


  // =========================================
  // UPDATE CART TOTAL
  // =========================================

  if (modalCartTotal) {
    modalCartTotal.textContent = `GH₵ ${total.toFixed(2)}`;
  }


  // =========================================
  // UPDATE HEADER COUNT
  // =========================================

  if (cartHeaderCount) {
    cartHeaderCount.textContent = totalItems;
  }


  // =========================================
  // KEEP OLD CART ELEMENTS WORKING
  // =========================================

  if (cartTotalElement) {
    cartTotalElement.textContent = `GH₵ ${total.toFixed(2)}`;
  }

  if (cartBadge) {
    cartBadge.textContent = totalItems;
  }


  // =========================================
  // MOBILE CART BAR
  // =========================================

  if (mobileCartBar) {

    const mobileCartTotal =
      mobileCartBar.querySelector(".mobile-cart-total");

    const mobileCartCount =
      mobileCartBar.querySelector(".mobile-cart-count");


    if (mobileCartTotal) {
      mobileCartTotal.textContent =
        `GH₵ ${total.toFixed(2)}`;
    }


    if (mobileCartCount) {
      mobileCartCount.textContent =
        totalItems;
    }


    mobileCartBar.classList.remove("d-none");
  }
}

//helpers

function removeItem(productId, size, color) {
  cart = cart.filter(
    item =>
      !(
        item.productId === productId &&
        Number(item.size) === Number(size) &&
        item.color === color
      )
  );

  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}



//change quantity function 
function changeQty(productId, size, color, change) {
  const cartItem = cart.find(
    item =>
      item.productId === productId &&
      Number(item.size) === Number(size) &&
      item.color === color
  );

  if (!cartItem) return;

  const product = products.find(
    item => item.id === productId
  );

  if (!product) return;

  const sizeItem = product.sizes.find(
    item => Number(item.size) === Number(size)
  );

  if (!sizeItem) return;

  const newQuantity = cartItem.qty + change;

  // Remove item if quantity reaches zero
  if (newQuantity <= 0) {
    removeItem(productId, size, color);
    return;
  }

  // Do not exceed available stock
  if (newQuantity > sizeItem.stock) {
    console.log("Maximum available stock reached.");
    return;
  }

  cartItem.qty = newQuantity;

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

/*
function renderSearch(){
  const search = searchInput.value.toLowerCase();
  searchRow.innerHTML="";
  
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
};*/
// =========================================================
// RENDER SHOE SEARCH RESULTS
// =========================================================

function renderSearch() {

  if (!searchInput || !searchRow) return;

  const search = searchInput.value
    .trim()
    .toLowerCase();

  searchRow.innerHTML = "";

  const filtered = products.filter(product => {

    const name =
      product.name?.toLowerCase() || "";

    const category =
      product.category?.toLowerCase() || "";

    const description =
      product.description?.toLowerCase() || "";

    return (
      !search ||
      name.includes(search) ||
      category.includes(search) ||
      description.includes(search)
    );
  });

  if (!filtered.length) {
    searchRow.innerHTML = `
      <div class="search-empty-state">
        <i class="fa-solid fa-magnifying-glass"></i>

        <h4>No shoes found</h4>

        <p>
          Try another shoe or category.
        </p>
      </div>
    `;

    return;
  }

  filtered.forEach(product => {

    const image =
      product.images?.[0] ||
      "./images/shoe-placeholder.png";

    searchRow.insertAdjacentHTML(
      "beforeend",
      `
        <div
          class="search-shoe-result"
          onclick="openProductDetails('${product.id}')"
        >

          <div class="search-shoe-image">
            <img
              src="${image}"
              alt="${product.name}"
              loading="lazy"
            >
          </div>

          <div class="search-shoe-info">

            <span class="search-shoe-category">
              ${product.category || "Footwear"}
            </span>

            <h4 class="search-shoe-name">
              ${product.name}
            </h4>

            <strong class="search-shoe-price">
              GH₵ ${product.price}
            </strong>

          </div>

          <div class="search-shoe-arrow">
            <i class="fa-solid fa-arrow-right"></i>
          </div>

        </div>
      `
    );
  });
}


// checkout function for cart confirmation
// =========================================================
// PREMIUM CHECKOUT FLOW
// =========================================================

const checkoutScreen =
  document.getElementById("checkoutScreen");

const confirmationScreen =
  document.getElementById("confirmationScreen");

const checkoutProgress =
  document.getElementById("checkoutProgress");

const checkoutStep =
  document.getElementById("checkoutStep");

const confirmationStep =
  document.getElementById("confirmationStep");

const backToCheckoutBtn =
  document.getElementById("backToCheckoutBtn");


// =========================================================
// CHECKOUT SUMMARY
// =========================================================

function renderCheckoutSummary() {

  const itemsContainer =
    document.getElementById("checkoutOrderItems");

  const subtotalElement =
    document.getElementById("checkoutSubtotal");

  const deliveryElement =
    document.getElementById("checkoutDelivery");

  const totalElement =
    document.getElementById("checkoutTotal");


  if (!itemsContainer) return;


  itemsContainer.innerHTML = "";


  let subtotal = 0;


  cart.forEach(item => {

    const itemTotal =
      item.price * item.qty;

    subtotal += itemTotal;


    itemsContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="checkout-order-item">

          <div class="checkout-order-item-image">

            <img
              src="${item.image || "./images/shoe-placeholder.png"}"
              alt="${item.name}"
            >

          </div>


          <div class="checkout-order-item-info">

            <div class="checkout-order-item-name">
              ${item.name}
            </div>

            <div class="checkout-order-item-meta">
              ${item.color || "Default"}
              · Size ${item.size || "—"}
              · ×${item.qty}
            </div>

          </div>


          <div class="checkout-order-item-price">
            GH₵ ${itemTotal.toFixed(2)}
          </div>

        </div>
      `
    );

  });


  // For now delivery is displayed as zero.
  // Your existing delivery calculation can be connected later.

  const deliveryFee = 0;

  const total =
    subtotal + deliveryFee;


  if (subtotalElement) {

    subtotalElement.textContent =
      `GH₵ ${subtotal.toFixed(2)}`;

  }


  if (deliveryElement) {

    deliveryElement.textContent =
      `GH₵ ${deliveryFee.toFixed(2)}`;

  }


  if (totalElement) {

    totalElement.textContent =
      `GH₵ ${total.toFixed(2)}`;

  }

}


// =========================================================
// DELIVERY / PICKUP
// =========================================================

const pickupBtn =
  document.getElementById("pickupBtn");

const deliveryBtn =
  document.getElementById("deliveryBtn");

const deliveryType =
  document.getElementById("deliveryType");

const deliveryFields =
  document.getElementById("deliveryFields");

const pickupMessage =
  document.getElementById("pickupMessage");


function selectFulfillment(type) {

  if (!deliveryType) return;


  deliveryType.value = type;


  const isDelivery =
    type === "Delivery";


  if (pickupBtn) {

    pickupBtn.classList.toggle(
      "active",
      !isDelivery
    );

    const icon =
      pickupBtn.querySelector(
        ".fulfillment-check"
      );

    if (icon) {

      icon.className =
        !isDelivery
          ? "fa-solid fa-circle-check fulfillment-check"
          : "fa-regular fa-circle fulfillment-check";

    }

  }


  if (deliveryBtn) {

    deliveryBtn.classList.toggle(
      "active",
      isDelivery
    );

    const icon =
      deliveryBtn.querySelector(
        ".fulfillment-check"
      );

    if (icon) {

      icon.className =
        isDelivery
          ? "fa-solid fa-circle-check fulfillment-check"
          : "fa-regular fa-circle fulfillment-check";

    }

  }


  if (deliveryFields) {

    deliveryFields.classList.toggle(
      "show",
      isDelivery
    );

  }


  if (pickupMessage) {

    pickupMessage.style.display =
      isDelivery
        ? "none"
        : "flex";

  }


  renderCheckoutSummary();

}


if (pickupBtn) {

  pickupBtn.addEventListener(
    "click",
    () => selectFulfillment("Pickup")
  );

}


if (deliveryBtn) {

  deliveryBtn.addEventListener(
    "click",
    () => selectFulfillment("Delivery")
  );

}


// =========================================================
// PAYMENT METHOD
// =========================================================

const codBtn =
  document.getElementById("codBtn");

const momoBtn =
  document.getElementById("momoBtn");

const paymentMethod =
  document.getElementById("paymentMethod");


function selectPayment(method) {

  if (!paymentMethod) return;


  paymentMethod.value = method;


  const isMomo =
    method === "Mobile Money";


  if (codBtn) {

    codBtn.classList.toggle(
      "active",
      !isMomo
    );

    const icon =
      codBtn.querySelector(
        "i:last-child"
      );

    if (icon) {

      icon.className =
        !isMomo
          ? "fa-solid fa-circle-check"
          : "fa-regular fa-circle";

    }

  }


  if (momoBtn) {

    momoBtn.classList.toggle(
      "active",
      isMomo
    );

    const icon =
      momoBtn.querySelector(
        "i:last-child"
      );

    if (icon) {

      icon.className =
        isMomo
          ? "fa-solid fa-circle-check"
          : "fa-regular fa-circle";

    }

  }

}


if (codBtn) {

  codBtn.addEventListener(
    "click",
    () => selectPayment("Cash on Delivery")
  );

}


if (momoBtn) {

  momoBtn.addEventListener(
    "click",
    () => selectPayment("Mobile Money")
  );

}


// =========================================================
// BUILD CONFIRMATION
// =========================================================

function buildConfirmation() {

  const name =
    document.getElementById("custName")
      ?.value.trim();

  const phone =
    document.getElementById("custPhone")
      ?.value.trim();

  const address =
    document.getElementById("custAddress")
      ?.value.trim();

  const email =
    document.getElementById("custEmail")
      ?.value.trim();

  const note =
    document.getElementById("orderNote")
      ?.value.trim() || "None";


  if (!name || !phone) {

    alert("Name and phone are required.");

    return false;

  }


  if (!email || !email.includes("@")) {

    alert("Please enter a valid email.");

    return false;

  }


  const invoice =
    generateInvoice();


  // Save invoice for payment stage
  localStorage.setItem(
    "checkoutInvoice",
    invoice
  );


  // Fill confirmation
  const invoiceElement =
    document.getElementById("confirmInvoice");

  const nameElement =
    document.getElementById("confirmName");

  const phoneElement =
    document.getElementById("confirmPhone");

  const deliveryElement =
    document.getElementById("confirmDelivery");

  const paymentElement =
    document.getElementById("confirmPayment");

  const addressElement =
    document.getElementById("confirmAddress");

  const noteElement =
    document.getElementById("confirmNote");


  if (invoiceElement) {

    invoiceElement.textContent =
      `#${invoice}`;

  }


  if (nameElement) {

    nameElement.textContent =
      name;

  }


  if (phoneElement) {

    phoneElement.textContent =
      phone;

  }


  if (deliveryElement) {

    deliveryElement.textContent =
      deliveryType?.value || "Pickup";

  }


  if (paymentElement) {

    paymentElement.textContent =
      paymentMethod?.value || "Cash on Delivery";

  }


  if (addressElement) {

    addressElement.textContent =
      address || "Pickup from branch";

  }


  if (noteElement) {

    noteElement.textContent =
      note;

  }


  // Build confirmation items

  const confirmItems =
    document.getElementById("confirmItems");


  let total = 0;


  if (confirmItems) {

    confirmItems.innerHTML = "";


    cart.forEach(item => {

      const itemTotal =
        item.price * item.qty;

      total += itemTotal;


      confirmItems.insertAdjacentHTML(
        "beforeend",
        `
          <div class="confirmation-item">

            <div class="confirmation-item-image">

              <img
                src="${item.image || "./images/shoe-placeholder.png"}"
                alt="${item.name}"
              >

            </div>


            <div class="confirmation-item-info">

              <div class="confirmation-item-name">
                ${item.name}
              </div>

              <div class="confirmation-item-meta">
                ${item.color || "Default"}
                · Size ${item.size || "—"}
                · ×${item.qty}
              </div>

            </div>


            <div class="confirmation-item-price">
              GH₵ ${itemTotal.toFixed(2)}
            </div>

          </div>
        `
      );

    });

  }


  const confirmTotal =
    document.getElementById("confirmTotal");


  if (confirmTotal) {

    confirmTotal.textContent =
      total.toFixed(2);

  }


  return true;

}


// =========================================================
// MOVE CHECKOUT → CONFIRMATION
// =========================================================

const checkoutWhatsApp =
  document.getElementById("checkoutWhatsApp");


if (checkoutWhatsApp) {

  checkoutWhatsApp.addEventListener(
    "click",
    () => {

      if (!cart.length) {

        alert("Your cart is empty.");

        return;

      }


      const valid =
        buildConfirmation();


      if (!valid) return;


      // Animate checkout out

      checkoutScreen.classList.add(
        "checkout-exit"
      );


      setTimeout(() => {

        checkoutScreen.style.display =
          "none";


        // Update progress

        checkoutStep.classList.remove(
          "active"
        );

        checkoutStep.classList.add(
          "completed"
        );


        confirmationStep.classList.add(
          "active"
        );


        checkoutProgress.classList.add(
          "confirmed"
        );
        // Show confirmation
       
confirmationScreen.style.display = "block";
confirmationScreen.classList.add("active");


      }, 350);

    }
  );

}


// =========================================================
// BACK TO CHECKOUT
// =========================================================

if (backToCheckoutBtn) {

  backToCheckoutBtn.addEventListener(
    "click",
    () => {

      confirmationScreen.classList.remove("active");


      setTimeout(() => {

        confirmationScreen.style.display =
          "none";


        checkoutScreen.style.display =
          "flex";


        checkoutScreen.classList.remove(
          "checkout-exit"
        );


        checkoutStep.classList.add(
          "active"
        );

        checkoutStep.classList.remove(
          "completed"
        );


        confirmationStep.classList.remove(
          "active"
        );


        checkoutProgress.classList.remove(
          "confirmed"
        );

      }, 350);

    }
  );

}


// =========================================================
// OPEN CHECKOUT
// =========================================================

function resetCheckoutFlow() {

  if (!checkoutScreen ||
      !confirmationScreen) return;


 confirmationScreen.classList.remove("active");

  confirmationScreen.style.display =
    "none";


  checkoutScreen.style.display =
    "flex";

  checkoutScreen.classList.remove(
    "checkout-exit"
  );


  checkoutStep.classList.add(
    "active"
  );

  checkoutStep.classList.remove(
    "completed"
  );


  confirmationStep.classList.remove(
    "active"
  );


  checkoutProgress.classList.remove(
    "confirmed"
  );


  renderCheckoutSummary();

}


// =========================================================
// RESET WHEN CHECKOUT OPENS
// =========================================================

const checkoutModalElement =
  document.getElementById("checkoutModal");


if (checkoutModalElement) {

  checkoutModalElement.addEventListener(
    "show.bs.modal",
    () => {

      resetCheckoutFlow();

      selectFulfillment(
        deliveryType?.value || "Pickup"
      );

      selectPayment(
        paymentMethod?.value ||
        "Cash on Delivery"
      );

    }
  );

}


// =========================================================
// PROCEED TO PAYMENT
// =========================================================

/*const buyBtn =
  document.getElementById("buyBtn");


if (buyBtn) {

  buyBtn.addEventListener(
    "click",
    async () => {

      if (buyBtn.disabled) return;


      const name =
        document.getElementById("custName")
          ?.value.trim();

      const phone =
        document.getElementById("custPhone")
          ?.value.trim();

      const email =
        document.getElementById("custEmail")
          ?.value.trim();

      const address =
        document.getElementById("custAddress")
          ?.value.trim();


      if (!name || !phone) {

        alert("Name and phone are required.");

        return;

      }


      if (!email || !email.includes("@")) {

        alert("Please enter a valid email.");

        return;

      }


      if (!cart.length) {

        alert("Your cart is empty.");

        return;

      }


      buyBtn.disabled = true;

      buyBtn.querySelector("span").textContent =
        "Processing...";


      try {

        const items =
          cart.map(item => ({

            name: item.name,

            price: item.price,

            qty: item.qty

          }));


        const payload = {

          items,

          customer: {

            name,

            email,

            phone

          }

        };


        console.log(
          "Payload to backend:",
          payload
        );


        const response =
          await fetch(
            "https://storebackend-production-f58c.up.railway.app/api/orders",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify(payload)

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to create order."
          );

        }


        const orderId =
          data.orderId;


        // Store order for tracking

        if (orderId) {

          localStorage.setItem(
            "currentOrderId",
            orderId
          );


          if (typeof socket !== "undefined") {

            socket.emit(
              "join-order",
              { orderId }
            );

          }

        }


        // Payment URL

        if (!data.authorization_url) {

          throw new Error(
            "Payment initialization failed."
          );

        }


        // Save checkout information
        // before leaving for Paystack

        localStorage.setItem(
          "checkoutCustomer",
          JSON.stringify({
            name,
            email,
            phone,
            address,
            delivery:
              deliveryType?.value ||
              "Pickup",
            payment:
              paymentMethod?.value ||
              "Cash on Delivery",
            note:
              document.getElementById(
                "orderNote"
              )?.value.trim() || "None"
          })
        );


        // Continue to Paystack

        window.location.href =
          data.authorization_url;


      } catch (error) {

        console.error(
          "Payment error:",
          error
        );


        alert(
          error.message ||
          "Something went wrong. Please try again."
        );


        buyBtn.disabled = false;

        buyBtn.querySelector("span").textContent =
          "Proceed to payment";

      }

    }
  );

}*/

// =========================================================
// SEND ORDER TO WHATSAPP
// =========================================================
const buyBtn = document.getElementById("buyBtn");

if (buyBtn) {
  buyBtn.addEventListener("click", () => {

    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    // Get checkout customer information
    const name = document.getElementById("custName")?.value.trim();
    const phone = document.getElementById("custPhone")?.value.trim();
    const email = document.getElementById("custEmail")?.value.trim();
    const address = document.getElementById("custAddress")?.value.trim();
    const note = document.getElementById("orderNote")?.value.trim();

    const delivery =
      document.getElementById("deliveryType")?.value ||
      "Not specified";

    const payment =
      document.getElementById("paymentMethod")?.value ||
      "Not specified";

    if (!name || !phone) {
      alert("Name and phone are required.");
      return;
    }

    // Get invoice generated by buildConfirmation()
    const invoice =
      localStorage.getItem("checkoutInvoice") || generateInvoice();

    const orderTime = getOrderTime();

    // Build item list
    const itemsText = cart.map((item, index) => {
      const subtotal = Number(item.price || 0) * Number(item.qty || 1);

      return (
        `${index + 1}. ${item.name}\n` +
        `   Size: ${item.size || "N/A"}\n` +
        `   Color: ${item.color || "N/A"}\n` +
        `   Qty: ${item.qty || 1}\n` +
        `   Price: ${item.price}\n` +
        `   Subtotal: ${subtotal}`
      );
    }).join("\n\n");

    // Calculate total
    const total = cart.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.qty || 1);
    }, 0);

    const message = `
🛍️ NEW ORDER

Invoice: ${invoice}
Time: ${orderTime}

CUSTOMER
Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}

ORDER TYPE
Delivery: ${delivery}
Payment: ${payment}

ADDRESS
${address || "Not provided"}

ITEMS
${itemsText}

TOTAL
${total}

NOTE
${note || "None"}
`.trim();

    // Open WhatsApp
    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  });
}


// confirmation element from front end 

const custName = document.getElementById("custName");
const custPhone = document.getElementById("custPhone");
const custAddress = document.getElementById("custAddress");

const orderNote = document.getElementById("orderNote");

const confirmInvoice = document.getElementById("confirmInvoice");
//const confirmTime = document.getElementById("confirmTime");
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

cartModal = cartModalEl
  ? new bootstrap.Modal(cartModalEl)
  : null;

checkoutModal = checkoutModalEl
  ? new bootstrap.Modal(checkoutModalEl)
  : null;
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
// =========================================================
// GOOGLE-STYLE SHOE SEARCH
// =========================================================

const searchWrapper = document.querySelector(".shoe-search-wrapper");
const searchDropdown = document.getElementById("searchDropdown");
const searchClear = document.getElementById("searchClear");


// ---------------------------------------------------------
// OPEN SEARCH DROPDOWN
// ---------------------------------------------------------

function openSearchDropdown() {

  if (!searchWrapper) return;

  searchWrapper.classList.add("active");

}


// ---------------------------------------------------------
// CLOSE SEARCH DROPDOWN
// ---------------------------------------------------------

function closeSearchDropdown() {

  if (!searchWrapper) return;

  searchWrapper.classList.remove("active");

}


// ---------------------------------------------------------
// SEARCH INPUT
// ---------------------------------------------------------

if (searchInput) {

  searchInput.addEventListener("focus", () => {

    openSearchDropdown();

    renderSearch();

  });


  searchInput.addEventListener("input", () => {

    openSearchDropdown();

    renderSearch();


    // Show clear button
    if (searchClear) {

      if (searchInput.value.trim() !== "") {

        searchClear.classList.add("show");

      } else {

        searchClear.classList.remove("show");

      }

    }

  });

}


// ---------------------------------------------------------
// CLEAR SEARCH
// ---------------------------------------------------------

if (searchClear) {

  searchClear.addEventListener("click", (event) => {

    event.preventDefault();
    event.stopPropagation();

    searchInput.value = "";

    searchClear.classList.remove("show");

    searchInput.focus();

    renderSearch();

  });

}


// ---------------------------------------------------------
// POPULAR SEARCH BUTTONS
// ---------------------------------------------------------

document
  .querySelectorAll(".search-suggestions button")
  .forEach(button => {

    button.addEventListener("click", () => {

      const value = button.textContent.trim();

      searchInput.value = value;

      openSearchDropdown();

      if (searchClear) {
        searchClear.classList.add("show");
      }

      renderSearch();

    });

  });


// ---------------------------------------------------------
// CLOSE WHEN CLICKING OUTSIDE
// ---------------------------------------------------------

document.addEventListener("click", (event) => {

  if (!searchWrapper) return;

  if (!searchWrapper.contains(event.target)) {

    closeSearchDropdown();

  }

});


// ---------------------------------------------------------
// ESCAPE KEY
// ---------------------------------------------------------

document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {

    closeSearchDropdown();

    if (searchInput) {
      searchInput.blur();
    }

  }

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

 
const product = products.find(
  item => item.id === productId
);

if (!product) {
  console.error("Product not found:", productId);
  return;
}

// ========================================
// PRODUCT DETAILS STATE
// ========================================

window.productDetailsState = {
  product: product,
  selectedSize: null,
  selectedColor: product.colors?.[0] || "Default",
  quantity: 1
};

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
      window.productDetailsState.selectedColor = color;

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
window.productDetailsState.selectedSize = null;

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
         window.productDetailsState.selectedSize = sizeItem.size;

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
// Store the current product details selection
window.productDetailsState = {
  product: product,
  selectedSize: null,
  selectedColor: product.colors?.[0] || "Default",
  quantity: 1
};

// Reset quantity when product opens
productQtyText.textContent = productQuantity;

// Decrease quantity
productQtyMinus.addEventListener("click", () => {

  if (productQuantity <= 1) {
    return;
  }

  productQuantity--;

  productQtyText.textContent = productQuantity;
  window.productDetailsState.quantity = productQuantity;

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
  window.productDetailsState.quantity = productQuantity;

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
//product modal close button// ========================================
// 14. CLOSE PRODUCT DETAILS MODAL
// ========================================

const productDetailsModal = document.getElementById("productDetailsModal");
const closeProductDetails = document.getElementById("closeProductDetails");
const productDetailsOverlay = productDetailsModal.querySelector(
  "[data-close-product-modal]"
);

// Close with X button
closeProductDetails.addEventListener("click", () => {
  productDetailsModal.classList.remove("active");
  productDetailsModal.setAttribute("aria-hidden", "true");
});

// Close when clicking outside the modal
productDetailsOverlay.addEventListener("click", () => {
  productDetailsModal.classList.remove("active");
  productDetailsModal.setAttribute("aria-hidden", "true");
});

// add to cart handler 
// ========================================
// 13. PRODUCT ADD TO CART BUTTON
// ========================================

const productAddToCart = document.getElementById("productAddToCart");

productAddToCart.addEventListener("click", () => {
  const state = window.productDetailsState;

  if (!state || !state.product) {
    console.error("Product details state not found.");
    return;
  }

  const { product, selectedSize, selectedColor, quantity } = state;

  // Size is required
  if (!selectedSize) {
    selectedSizeText.textContent = "Please select a size";
    return;
  }

  // Find the selected size and check stock
  const sizeItem = product.sizes.find(
    sizeItem => Number(sizeItem.size) === Number(selectedSize)
  );

  if (!sizeItem) {
    console.error("Selected size not found.");
    return;
  }

  if (quantity > sizeItem.stock) {
    console.log("Not enough stock.");
    return;
  }

  // Create the cart item
  const cartItem = {
    productId: product.id,
    name: product.name,
    image: product.images?.[0] || "./images/shoe-placeholder.png",
    price: product.price,
    size: sizeItem.size,
    color: selectedColor || "Default",
    qty: quantity
  };

  console.log("Cart item ready:", cartItem);

  // Check if the exact same product + size + color is already in cart
  const existingItem = cart.find(
    item =>
      item.productId === cartItem.productId &&
      Number(item.size) === Number(cartItem.size) &&
      item.color === cartItem.color
  );

  if (existingItem) {
    const newQuantity = existingItem.qty + cartItem.qty;

    if (newQuantity > sizeItem.stock) {
      console.log("Cannot add more than available stock.");
      return;
    }

    existingItem.qty = newQuantity;
  } else {
    cart.push(cartItem);
  }

  console.log("Updated cart:", cart);

  // Show the cart
renderCart();

productDetailsModal.classList.remove("active");
productDetailsModal.setAttribute("aria-hidden", "true");

// Open cart modal
if (cartModal) {
  openModalWithLoader(cartModal);
}
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

if (row) {

  let scrollAmount = 0;

  function autoScroll() {

    scrollAmount += 1;

    if (row.scrollLeft >= row.scrollWidth / 2) {
      row.scrollLeft = 0;
    }

    row.scrollLeft = scrollAmount;

    if (scrollAmount >= row.scrollWidth - row.clientWidth) {
      scrollAmount = 0;
    }
  }

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
}

// ==========================
// 💬 CHAT FUNCTIONS
// ==========================





document.getElementById("userSendBtn").addEventListener("click", () => {
  const input = document.getElementById("userChatInput");

  if (!input.value) return;

  sendMessage(input.value);
  input.value = "";
});
/* =========================================================
   SHOE HERO CAROUSEL
========================================================= */

const shoeHero = document.getElementById("shoeHero");

if (shoeHero) {

    const heroSlides = shoeHero.querySelectorAll(".shoe-hero-slide");
    const heroDots = shoeHero.querySelectorAll(".shoe-hero-dot");
    const heroPrev = shoeHero.querySelector(".shoe-hero-prev");
    const heroNext = shoeHero.querySelector(".shoe-hero-next");

    let currentHeroSlide = 0;
    let heroAutoSlide;

    function showHeroSlide(index) {

        // Wrap around
        if (index >= heroSlides.length) {
            currentHeroSlide = 0;
        } else if (index < 0) {
            currentHeroSlide = heroSlides.length - 1;
        } else {
            currentHeroSlide = index;
        }

        // Remove active state
        heroSlides.forEach((slide) => {
            slide.classList.remove("active");
        });

        heroDots.forEach((dot) => {
            dot.classList.remove("active");
        });

        // Activate current slide
        heroSlides[currentHeroSlide].classList.add("active");

        if (heroDots[currentHeroSlide]) {
            heroDots[currentHeroSlide].classList.add("active");
        }
    }

    function nextHeroSlide() {
        showHeroSlide(currentHeroSlide + 1);
    }

    function previousHeroSlide() {
        showHeroSlide(currentHeroSlide - 1);
    }

    function startHeroAutoSlide() {

        clearInterval(heroAutoSlide);

        heroAutoSlide = setInterval(() => {
            nextHeroSlide();
        }, 6000);
    }

    // NEXT BUTTON
    if (heroNext) {
        heroNext.addEventListener("click", () => {
            nextHeroSlide();
            startHeroAutoSlide();
        });
    }

    // PREVIOUS BUTTON
    if (heroPrev) {
        heroPrev.addEventListener("click", () => {
            previousHeroSlide();
            startHeroAutoSlide();
        });
    }

    // DOTS
    heroDots.forEach((dot) => {

        dot.addEventListener("click", () => {

            const slideIndex = Number(dot.dataset.slide);

            showHeroSlide(slideIndex);

            startHeroAutoSlide();
        });

    });

    // Start carousel
    showHeroSlide(0);
    startHeroAutoSlide();
}
const featuredButtons = document.querySelectorAll(".featured-view");

featuredButtons.forEach(button => {
    button.addEventListener("click", () => {

        const productId = button.dataset.productId;

        openProductDetails(productId);

    });
});

// refactor this code to make more moduler form 
// refactor to react front end 
// refactor to react native and to android and ios mobile version