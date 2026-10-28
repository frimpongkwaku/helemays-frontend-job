const storeApiBaseUrl =
  window.HELEMAYS_API_BASE ||
  "https://shoe-store-backend-rra0.onrender.com/api";

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
/* =========================================================
   SHOE HERO CAROUSEL
========================================================= */


const seenMessages = new Set();
const USER_ROLE = "user";

const getOrderId = () =>
  localStorage.getItem("currentOrderId") ||
  new URLSearchParams(window.location.search).get("orderId");
const savedLocalChatMessages = JSON.parse(localStorage.getItem("helemays.chat.v1") || "[]");
const previousLocalThreadId = savedLocalChatMessages.findLast(message => message.sender === "customer")?.threadId;
const localChatThreadId = previousLocalThreadId || localStorage.getItem("helemays.chatSession.v1") || `visitor-${crypto.randomUUID()}`;
localStorage.setItem("helemays.chatSession.v1", localChatThreadId);

const socket = typeof io === "function"
  ? io("https://storebackend-production-f58c.up.railway.app", {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    })
  : { on() {}, emit() {} };

socket.on("connect", () => {
  const orderId = getOrderId();
  if (!orderId) return;
  socket.emit("join-order", { orderId });
  loadMessages();
});

socket.on("receive-message", data => {
  const key = data._id || `${data.sender}-${data.message}`;
  if (seenMessages.has(key)) return;
  seenMessages.add(key);
  renderMessage(data);
});

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

function sendMessage(message) {
  if (!message) return;
  const orderId = getOrderId();
  const payload = {
    orderId: orderId || localChatThreadId,
    message,
    sender: USER_ROLE,
    senderRole: USER_ROLE,
    senderName: localStorage.getItem("userName") || "Guest",
    createdAt: new Date().toISOString()
  };
  renderMessage(payload);
  const storedMessages = JSON.parse(localStorage.getItem("helemays.chat.v1") || "[]");
  storedMessages.push({
    id: crypto.randomUUID(),
    threadId: localChatThreadId,
    sender: "customer",
    senderName: payload.senderName,
    text: message,
    createdAt: payload.createdAt,
    read: false
  });
  localStorage.setItem("helemays.chat.v1", JSON.stringify(storedMessages.slice(-500)));
  if (orderId) socket.emit("send-message", payload);
}

window.addEventListener("storage", event => {
  if (event.key !== "helemays.chat.v1" || !event.newValue) return;
  try {
    const messages = JSON.parse(event.newValue);
    const latestReply = messages.filter(message => message.threadId === localChatThreadId && message.sender === "admin").at(-1);
    if (latestReply && !seenMessages.has(latestReply.id)) {
      seenMessages.add(latestReply.id);
      renderMessage({ senderRole: "admin", message: latestReply.text });
    }
  } catch (error) {
    console.warn("Local support replies could not be read:", error);
  }
});

try {
  JSON.parse(localStorage.getItem("helemays.chat.v1") || "[]")
    .filter(message => message.threadId === localChatThreadId)
    .forEach(message => {
      const key = message.id || `${message.sender}-${message.createdAt}`;
      if (seenMessages.has(key)) return;
      seenMessages.add(key);
      renderMessage({ senderRole: message.sender === "admin" ? "admin" : "user", message: message.text });
    });
} catch (error) {
  console.warn("Saved local chat could not be loaded:", error);
}

async function loadMessages() {
  const orderId = getOrderId();
  if (!orderId) return;
  const chatBox = document.getElementById("userChatBox");
  if (chatBox) chatBox.innerHTML = "";
  try {
    const response = await fetch(`https://storebackend-production-f58c.up.railway.app/api/messages/${orderId}`);
    const result = await response.json();
    if (!result.success) return;
    result.data.forEach(message => {
      const key = message._id || `${message.sender}-${message.message}`;
      if (seenMessages.has(key)) return;
      seenMessages.add(key);
      renderMessage(message);
    });
  } catch (error) {
    console.error("Failed to load messages:", error);
  }
}


let userModal; 
let greeting;
let searchInput;
let searchRow;
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
images: ["./images/featured1.png","./images/derby-side.png","./images/derby-top.png","./images/derby-back.png"],
colors: ["Black","Brown"],
sizes: [{ size: 40, stock: 5 },{ size: 41, stock: 7 },{ size: 42, stock: 0 },{ size: 43, stock: 3 },{ size: 44, stock: 2 }],
featured: true,active: true
},
{id: "shoe004",name: "Classic Leather Derby",category: "Slippers",price: 450,description: "Handcrafted leather derby shoe made for timeless everyday elegance.",
images: ["./images/featured.jpg","./images/derby-side.png","./images/derby-top.png","./images/derby-back.png"],
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

const localProductStorageKey = "helemays.products.v1";
let storeCatalogReady = false;
const savedProducts = localStorage.getItem(localProductStorageKey);

if (savedProducts) {
  try {
    const parsedProducts = JSON.parse(savedProducts);
    if (Array.isArray(parsedProducts)) {
      products.splice(0, products.length, ...parsedProducts);
    }
  } catch (error) {
    console.warn("Saved product list could not be read:", error);
  }
}

function addProductCategoryFilters() {
  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];
  const filters = document.querySelector(".collection-filters");
  if (!filters) return;

  categories.forEach(category => {
    const exists = [...filters.querySelectorAll(".collection-filter")]
      .some(button => button.dataset.category.toLowerCase() === category.toLowerCase());
    if (exists) return;

    const button = document.createElement("button");
    button.className = "collection-filter";
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.dataset.category = category;
    button.innerHTML = `<span class="collection-filter-image" aria-hidden="true"><img src="./images/shoes.png" alt="" loading="lazy"></span><span></span>`;
    button.querySelector("span:last-child").textContent = category;
    filters.appendChild(button);
  });
}

addProductCategoryFilters();

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

/*
const scrollBox = document.querySelector(".about-scroll-wrapper");
const scrollContent = document.querySelector(".about-scroll-content");

scrollBox.addEventListener("touchstart", () => {
  scrollContent.style.animationPlayState = "paused";
});

scrollBox.addEventListener("touchend", () => {
  scrollContent.style.animationPlayState = "running";
});*/


// cart function 
let cart = (() => {
  try {
    const savedCart = JSON.parse(localStorage.getItem("helemays.cart.v1") || "[]");
    return Array.isArray(savedCart) ? savedCart : [];
  } catch {
    return [];
  }
})();
let cartInitialized = cart.length > 0;
let cartAddedTimer;
function addToCart(productId){
  if (!storeCatalogReady) {
    alert("The live catalog is unavailable. Please try again in a moment.");
    return;
  }

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
  renderCart(true);
}

// closing cart modal cartmodal and cart modal declaring 
let cartModal;
let checkoutModal;


//render cart items 
function renderCart(animateAdded = false) {
  const cartItemsContainer = document.getElementById("cartItems");
  const emptyCartText = document.getElementById("emptyCartText");
  const cartFooter = document.querySelector("#cartModal .cart-footer");

  const modalCartTotal = document.getElementById("modalCartTotal");
  const cartHeaderCount = document.getElementById("cartHeaderCount");
  const cartSummaryItems = document.getElementById("cartSummaryItems");

  const cartTotalElement = document.getElementById("cartTotal");
  const cartBadge = document.getElementById("cartBadge");
  const stickyCartItemCount = document.getElementById("cartItemCount");
  const stickyCartTotal = document.getElementById("stickyCartTotal");

  const mobileCartBar = document.getElementById("mobileCartBar");
  const mobileCartCount = document.getElementById("mobileCartCount");
  const mobileCartTotal = document.getElementById("mobileCartTotal");
  const mobileCartIcon = document.getElementById("mobileCartIcon");
  const cartAddedMessage = document.getElementById("cartAddAnimation");
  const stickyCartContainer = document.getElementById("cartBadgeContainer");

  const totalItems = cart.reduce(
    (count, item) => count + (Number(item.qty) || 0),
    0
  );
  const total = cart.reduce(
    (amount, item) => amount + (Number(item.price) || 0) * (Number(item.qty) || 0),
    0
  );

  try {
    localStorage.setItem("helemays.cart.v1", JSON.stringify(cart));
  } catch (error) {
    console.warn("Cart could not be saved on this device:", error);
  }

  if (stickyCartItemCount) {
    stickyCartItemCount.textContent = `${totalItems} ${totalItems === 1 ? "item" : "items"}`;
  }

  if (stickyCartTotal) {
    stickyCartTotal.textContent = `GH₵ ${total.toFixed(2)}`;
  }

  if (stickyCartContainer) {
    stickyCartContainer.classList.toggle("d-none", totalItems === 0);
  }

  if (mobileCartCount) {
    mobileCartCount.textContent = totalItems;
    mobileCartCount.hidden = totalItems === 0;
  }

  if (mobileCartTotal) {
    mobileCartTotal.textContent = `${totalItems} ${totalItems === 1 ? "item" : "items"} · GH₵ ${total.toFixed(2)}`;
    mobileCartTotal.hidden = totalItems === 0;
  }

  const mobileCartButton = mobileCartCount?.closest(".mobile-nav-cart");
  if (mobileCartButton) {
    mobileCartButton.setAttribute(
      "aria-label",
      totalItems
        ? `Cart, ${totalItems} ${totalItems === 1 ? "item" : "items"}, total GH₵ ${total.toFixed(2)}`
        : "Cart, empty, total GH₵ 0.00"
    );
  }

  if (animateAdded && totalItems > 0 && mobileCartIcon) {
    mobileCartIcon.classList.remove("is-popping");
    void mobileCartIcon.offsetWidth;
    mobileCartIcon.classList.add("is-popping");
  }

  if (animateAdded && totalItems > 0 && stickyCartContainer) {
    stickyCartContainer.classList.remove("d-none");
    stickyCartContainer.classList.remove("pop");
    void stickyCartContainer.offsetWidth;
    stickyCartContainer.classList.add("pop");
  }

  if (animateAdded && cartAddedMessage) {
    cartAddedMessage.textContent = "Added!";
    cartAddedMessage.setAttribute("aria-label", `${cart.at(-1)?.name || "Item"} added to cart`);
    cartAddedMessage.classList.remove("show");
    void cartAddedMessage.offsetWidth;
    cartAddedMessage.classList.add("show");
    clearTimeout(cartAddedTimer);
    cartAddedTimer = setTimeout(() => cartAddedMessage.classList.remove("show"), 1800);
  }

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

    if (cartSummaryItems) {
      cartSummaryItems.textContent = "0 items";
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


  cartItemsContainer.innerHTML = "";


  // =========================================
  // RENDER CART ITEMS
  // =========================================

  cart.forEach((item) => {

    const itemTotal = item.price * item.qty;

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
            <i class="fa-solid fa-trash" style="color:red;"></i>
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

  if (cartSummaryItems) {
    cartSummaryItems.textContent = `${totalItems} ${totalItems === 1 ? "item" : "items"} in your bag`;
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
        `${totalItems} ${totalItems === 1 ? "item" : "items"} · GH₵ ${total.toFixed(2)}`;
      mobileCartTotal.hidden = totalItems === 0;
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
  return "EDS" + Date.now();
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
searchInput = document.querySelector(".shoe-search-section #searchInput");
searchRow = document.getElementById("searchFoodRow");

document.addEventListener('DOMContentLoaded', function () {
  const modalEl = document.getElementById('userModal');
  userModal = modalEl ? new bootstrap.Modal(modalEl) : null;
  modalEl?.addEventListener('hide.bs.modal', () => {
    sessionStorage.setItem("helemays.userModalDismissed", "true");
  });
  
  greeting = document.getElementById('greeting');
// search section for live search with key press on 26/01/26
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
      product.name ? product.name.toLowerCase() : "";

    const category =
      product.category ? product.category.toLowerCase() : "";

    const description =
      product.description ? product.description.toLowerCase() : "";

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
      product.images && product.images[0]
        ? product.images[0]
        : "./images/shoe-placeholder.png";

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
    codBtn.setAttribute("aria-pressed", String(!isMomo));

  }


  if (momoBtn) {

    momoBtn.classList.toggle(
      "active",
      isMomo
    );
    momoBtn.setAttribute("aria-pressed", String(isMomo));

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

  const nameInput = document.getElementById("custName");
  const phoneInput = document.getElementById("custPhone");
  const addressInput = document.getElementById("custAddress");
  const emailInput = document.getElementById("custEmail");
  const noteInput = document.getElementById("orderNote");
  const name = nameInput ? nameInput.value.trim() : "";
  const phone = phoneInput ? phoneInput.value.trim() : "";
  const address = addressInput ? addressInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const note = noteInput ? noteInput.value.trim() || "None" : "None";


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
      deliveryType ? deliveryType.value : "Pickup";

  }


  if (paymentElement) {

    paymentElement.textContent =
      paymentMethod ? paymentMethod.value : "Cash on Delivery";

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
        deliveryType ? deliveryType.value : "Pickup"
      );

      selectPayment(
        paymentMethod ? paymentMethod.value : "Cash on Delivery"
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
            socket.emit("join-order", { orderId });
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
function updatePendingOrderCount() {
  let trackedOrders = [];
  try {
    trackedOrders = JSON.parse(localStorage.getItem("helemays.trackedOrders.v1") || "[]");
  } catch {
    trackedOrders = [];
  }
  const pendingCount = trackedOrders.filter(order => !["Completed", "Cancelled"].includes(order.status)).length;
  document.querySelectorAll("[data-orders-count]").forEach(badge => {
    badge.textContent = pendingCount > 99 ? "99+" : String(pendingCount);
    badge.hidden = pendingCount === 0;
  });
}

updatePendingOrderCount();
window.addEventListener("storage", event => {
  if (event.key === "helemays.trackedOrders.v1") updatePendingOrderCount();
});

const buyBtn = document.getElementById("buyBtn");

if (buyBtn) {
  buyBtn.addEventListener("click", async () => {

    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    // Get checkout customer information
    const nameInput = document.getElementById("custName");
    const phoneInput = document.getElementById("custPhone");
    const emailInput = document.getElementById("custEmail");
    const addressInput = document.getElementById("custAddress");
    const noteInput = document.getElementById("orderNote");
    const name = nameInput ? nameInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const address = addressInput ? addressInput.value.trim() : "";
    const note = noteInput ? noteInput.value.trim() : "";

    const delivery =
      (document.getElementById("deliveryType") || {}).value ||
      "Not specified";

    const payment =
      (document.getElementById("paymentMethod") || {}).value ||
      "Not specified";

    if (name.length < 2 || name.length > 80 || phone.length < 7 || phone.length > 25) {
      alert("Enter a name (2-80 characters) and a phone number (7-25 characters).");
      return;
    }

    // Get invoice generated by buildConfirmation()
    let invoice = localStorage.getItem("checkoutInvoice") || "";
    if (!/^[a-z0-9_-]{1,64}$/i.test(invoice)) {
      invoice = generateInvoice();
      localStorage.setItem("checkoutInvoice", invoice);
    }
    const trackingTokenKey = `helemays.orderToken.${invoice}`;
    let trackingToken = localStorage.getItem(trackingTokenKey);
    if (typeof trackingToken !== "string" || trackingToken.length < 32 || trackingToken.length > 256) {
      const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
      trackingToken = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, "0")).join("");
      localStorage.setItem(trackingTokenKey, trackingToken);
    }

    const localOrders = JSON.parse(localStorage.getItem("helemays.orders.v1") || "[]");
    const localOrder = {
      id: invoice,
      invoice,
      customer: { name, phone, email, address },
      delivery,
      payment,
      note,
      items: cart.map(item => ({
        productId: item.productId || item.id,
        expectedPrice: Number(item.price),
        qty: Number(item.qty),
        size: String(item.size ?? ""),
        color: String(item.color ?? "")
      })),
    };

    buyBtn.disabled = true;
    const buyButtonLabel = buyBtn.querySelector("span");
    const originalLabel = buyButtonLabel?.textContent;
    if (buyButtonLabel) buyButtonLabel.textContent = "Sending order...";
    let orderResult = {};
    try {
      const response = await fetch(`${storeApiBaseUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice,
          customer: localOrder.customer,
          delivery,
          payment,
          note,
          items: localOrder.items,
          trackingToken
        }),
        signal: AbortSignal.timeout(60000)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(result.message || "The order could not be sent to the store.");
        error.code = result.code;
        error.productId = result.productId;
        error.currentPrice = result.currentPrice;
        throw error;
      }
      if (!result.order) throw new Error("The server did not return the saved order. Retry using the same invoice.");
      orderResult = result;
      Object.assign(localOrder, result.order);
    } catch (error) {
      if (error.name === "TimeoutError" || error.name === "AbortError") {
        alert(`The store is taking longer than expected. Your order may still be processing. Wait a moment, then retry; invoice ${invoice} will be reused.`);
      } else if (error.code === "PRICE_CHANGED" && Number.isFinite(Number(error.currentPrice))) {
        const changedItems = cart.filter(item => String(item.productId || item.id) === String(error.productId));
        if (changedItems.length) {
          changedItems.forEach(item => {
            item.price = Number(error.currentPrice);
          });
          renderCart();
        }
        alert(`${error.message} The cart now shows the current catalog price. Review the total and place the order again to confirm.`);
      } else {
        alert(`${error.message} Check your connection and try again.`);
      }
      buyBtn.disabled = false;
      if (buyButtonLabel) buyButtonLabel.textContent = originalLabel;
      return;
    }

    localOrders.unshift(localOrder);
    localStorage.setItem("helemays.orders.v1", JSON.stringify(localOrders.slice(0, 1000)));
    const trackedOrders = JSON.parse(localStorage.getItem("helemays.trackedOrders.v1") || "[]");
    const updatedTrackedOrders = [
      { invoice, createdAt: localOrder.createdAt, status: "New" },
      ...trackedOrders.filter(order => order.invoice !== invoice)
    ].slice(0, 100);
    localStorage.setItem("helemays.trackedOrders.v1", JSON.stringify(updatedTrackedOrders));
    updatePendingOrderCount();

    clearCart();
    cartInitialized = false;
    document.getElementById("cartBadgeContainer")?.classList.add("d-none");
    checkoutModal?.hide();
    const trackingPage = new URL("./orders.html", window.location.href);
    trackingPage.searchParams.set("orderId", invoice);
    if (orderResult.invoiceEmailSent === false) trackingPage.searchParams.set("emailStatus", "failed");
    window.location.href = trackingPage.href;
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

cartModalEl?.addEventListener("show.bs.modal", () => renderCart());
renderCart();

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
const searchSection = document.querySelector(".shoe-search-section");
const searchDropdown = document.getElementById("searchDropdown");
const searchClear = document.getElementById("searchClear");

function updateStickySearch() {
  if (!searchSection) return;
  searchSection.classList.toggle("is-search-sticky", searchSection.getBoundingClientRect().top <= 0);
}

window.addEventListener("scroll", updateStickySearch, { passive: true });
window.addEventListener("resize", updateStickySearch);
window.addEventListener("pageshow", updateStickySearch);
updateStickySearch();


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
        ? products.filter(item => item.active !== false && item.featured !== true)
            : products.filter(
                item =>
                String(item.category).toLowerCase() === String(category).toLowerCase() &&
            item.active !== false && item.featured !== true
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
            item.images && item.images[0]
              ? item.images[0]
              : "./images/shoe-placeholder.png";

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

  window.render = render;


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
  selectedColor: product.colors && product.colors.length ? null : "Default",
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
    product.images && product.images.length
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
document.getElementById("productColorAlert").hidden = true;
document.getElementById("productSizeAlert").hidden = true;

// Clear colors from previous product
colorOptions.innerHTML = "";

// Reset selected color text
selectedColorText.textContent = "Select a color";

// Check if this product has colors
if (product.colors && product.colors.length > 0) {

  product.colors.forEach(color => {

    const colorButton = document.createElement("button");

    colorButton.type = "button";
    colorButton.className = "product-color-option";

    colorButton.textContent = color;

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
      document.getElementById("productColorAlert").hidden = true;

      console.log("Selected color:", color);
    });

    colorOptions.appendChild(colorButton);
  });

} else {

  // Product has no color options
  selectedColorText.textContent = "Default";
  window.productDetailsState.selectedColor = "Default";

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
        document.getElementById("productSizeAlert").hidden = true;

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
  selectedColor: product.colors && product.colors.length ? null : "Default",
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

document.querySelector(".collection-filters")?.addEventListener("click", event => {
  const button = event.target.closest(".collection-filter");
  if (!button) return;

  render(button.dataset.category);
  document.querySelectorAll(".collection-filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
    filter.setAttribute("aria-pressed", String(filter === button));
  });
  document.querySelector(".collection-products-header")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  if (!storeCatalogReady) {
    alert("The live catalog is unavailable. Please try again in a moment.");
    return;
  }

  const state = window.productDetailsState;

  if (!state || !state.product) {
    console.error("Product details state not found.");
    return;
  }

  const { product, selectedSize, selectedColor, quantity } = state;
  const sizeAlert = document.getElementById("productSizeAlert");
  const colorAlert = document.getElementById("productColorAlert");

  sizeAlert.hidden = Boolean(selectedSize) || !product.sizes?.length;
  colorAlert.hidden = Boolean(selectedColor) || !product.colors?.length;

  // Size is required
  if (!selectedSize && product.sizes?.length) {
    return;
  }

  if (!selectedColor && product.colors?.length) {
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
    image: product.images && product.images[0]
      ? product.images[0]
      : "./images/shoe-placeholder.png",
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

  renderCart(true);

productDetailsModal.classList.remove("active");
productDetailsModal.setAttribute("aria-hidden", "true");
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
    if (userModal && sessionStorage.getItem("helemays.userModalDismissed") !== "true") {
      userModal.show();
    }
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





const userSendButton = document.getElementById("userSendBtn");

if (userSendButton) {
  userSendButton.addEventListener("click", () => {
    const input = document.getElementById("userChatInput");

    if (!input || !input.value) return;

    sendMessage(input.value);
    input.value = "";
  });
}
/* =========================================================
   SHOE HERO CAROUSEL
========================================================= */

function applyLocalHeroBanners(hero) {
  const storedBanners = localStorage.getItem("helemays.banners.v1");
  if (storedBanners === null || !hero) return false;

  let banners;
  try {
    banners = JSON.parse(storedBanners);
  } catch (error) {
    console.warn("Saved hero campaigns could not be read:", error);
    return false;
  }
  if (!Array.isArray(banners)) return false;

  const track = hero.querySelector(".shoe-hero-track");
  const indicators = hero.querySelector(".shoe-hero-indicators");
  if (!track || !indicators) return false;

  const published = banners
    .filter(banner => banner.active !== false)
    .sort((first, second) => Number(first.order || 0) - Number(second.order || 0));

  track.replaceChildren();
  indicators.replaceChildren();
  hero.hidden = published.length === 0;

  published.forEach((banner, index) => {
    const slide = document.createElement("div");
    slide.className = `shoe-hero-slide${index === 0 ? " active" : ""}`;

    const content = document.createElement("div");
    content.className = "shoe-hero-content";
    const eyebrow = document.createElement("p");
    eyebrow.className = "hero-eyebrow";
    eyebrow.textContent = banner.eyebrow || "HELEMAYS COLLECTION";
    const headline = document.createElement("h1");
    headline.append(document.createTextNode(banner.title || "Discover"));
    if (banner.highlight) {
      const highlight = document.createElement("span");
      highlight.textContent = banner.highlight;
      headline.append(" ", highlight);
    }
    const description = document.createElement("p");
    description.className = "hero-description";
    description.textContent = banner.description || "Explore our latest collection.";
    content.append(eyebrow, headline, description);

    const imageWrap = document.createElement("div");
    imageWrap.className = "shoe-hero-image";
    const image = document.createElement("img");
    image.src = banner.image || "./images/shoe-placeholder.png";
    image.alt = banner.imageAlt || banner.title || "Featured collection";
    imageWrap.append(image);
    slide.append(content, imageWrap);
    track.append(slide);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `shoe-hero-dot${index === 0 ? " active" : ""}`;
    dot.dataset.slide = index;
    dot.setAttribute("aria-label", `Slide ${index + 1}`);
    indicators.append(dot);
  });

  const hasMultipleSlides = published.length > 1;
  hero.querySelectorAll(".shoe-hero-arrow").forEach(button => {
    button.hidden = !hasMultipleSlides;
  });
  indicators.hidden = !hasMultipleSlides;
  return true;
}

const shoeHero = document.getElementById("shoeHero");
applyLocalHeroBanners(shoeHero);
var heroSlides;
var heroDots;
var heroPrev;
var heroNext;
var currentHeroSlide = 0;
var heroAutoSlide;
var touchStartX = 0;

if (shoeHero) {

  heroSlides = shoeHero.querySelectorAll(".shoe-hero-slide");
  heroDots = shoeHero.querySelectorAll(".shoe-hero-dot");
  heroPrev = shoeHero.querySelector(".shoe-hero-prev");
  heroNext = shoeHero.querySelector(".shoe-hero-next");

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
        if (!heroSlides.length) return;

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

    // Delegate indicator clicks so admin-published slides can be refreshed.
    shoeHero.querySelector(".shoe-hero-indicators")?.addEventListener("click", event => {
      const dot = event.target.closest(".shoe-hero-dot");
      if (!dot) return;
      showHeroSlide(Number(dot.dataset.slide));
      startHeroAutoSlide();
    });

    // Start carousel
    showHeroSlide(0);
    startHeroAutoSlide();

    shoeHero.addEventListener("touchstart", (event) => {
      if (event.touches && event.touches.length) {
        touchStartX = event.touches[0].clientX;
      }
    }, { passive: true });

    shoeHero.addEventListener("touchend", (event) => {
      if (!event.changedTouches || !event.changedTouches.length) return;

      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) < 40) return;

      if (distance < 0) {
        nextHeroSlide();
      } else {
        previousHeroSlide();
      }

      startHeroAutoSlide();
    }, { passive: true });

    window.addEventListener("storage", event => {
      if (event.key !== "helemays.banners.v1") return;
      applyLocalHeroBanners(shoeHero);
      heroSlides = shoeHero.querySelectorAll(".shoe-hero-slide");
      heroDots = shoeHero.querySelectorAll(".shoe-hero-dot");
      currentHeroSlide = 0;
      clearInterval(heroAutoSlide);
      if (!heroSlides.length) return;
      showHeroSlide(0);
      if (heroSlides.length > 1) startHeroAutoSlide();
    });
}

function renderFeaturedProducts() {
  const track = document.getElementById("featuredTrack");
  if (!track) return;
  const featuredProducts = products.filter(product => product.active !== false && product.featured);
  const featuredSection = document.querySelector(".featured-shoes");
  if (featuredSection) featuredSection.hidden = featuredProducts.length === 0;
  track.replaceChildren();

  featuredProducts.forEach(product => {
    const item = document.createElement("div");
    item.className = "featured-item";
    const imageWrap = document.createElement("div");
    imageWrap.className = "featured-image";
    const badge = document.createElement("span");
    badge.className = "featured-badge";
    badge.textContent = "FEATURED";
    const image = document.createElement("img");
    image.src = product.images?.[0] || "./images/shoe-placeholder.png";
    image.alt = product.name;
    imageWrap.append(badge, image);

    const info = document.createElement("div");
    info.className = "featured-info";
    const category = document.createElement("span");
    category.textContent = product.category || "COLLECTION";
    const name = document.createElement("h3");
    name.textContent = product.name;
    const bottom = document.createElement("div");
    bottom.className = "featured-bottom";
    const price = document.createElement("strong");
    price.textContent = `GH₵${Number(product.price || 0).toFixed(2)}`;
    const view = document.createElement("button");
    view.className = "featured-view";
    view.type = "button";
    view.dataset.productId = product.id;
    view.innerHTML = 'View Product <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
    bottom.append(price, view);
    info.append(category, name, bottom);
    item.append(imageWrap, info);
    track.append(item);
  });
}

renderFeaturedProducts();

const featuredTrack = document.getElementById("featuredTrack");
const featuredWrapper = document.querySelector(".featured-wrapper");
const featuredStep = () => {
  const item = featuredTrack?.querySelector(".featured-item");
  if (!item || !featuredTrack) return 0;
  return item.getBoundingClientRect().width + (parseFloat(getComputedStyle(featuredTrack).columnGap) || 0);
};

let featuredAutoScrollTimer;
let featuredScrollAnimationFrame = 0;
const featuredCarousel = document.querySelector(".featured-shoes");
const scrollFeaturedTo = target => {
  if (!featuredWrapper) return;
  cancelAnimationFrame(featuredScrollAnimationFrame);
  const start = featuredWrapper.scrollLeft;
  const distance = target - start;
  if (!distance) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    featuredWrapper.scrollLeft = target;
    return;
  }

  const duration = 850;
  const startedAt = performance.now();
  const animate = now => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    featuredWrapper.scrollLeft = start + distance * eased;
    if (progress < 1) featuredScrollAnimationFrame = requestAnimationFrame(animate);
  };
  featuredScrollAnimationFrame = requestAnimationFrame(animate);
};
const advanceFeatured = () => {
  if (!featuredWrapper || !featuredTrack || document.hidden) return;
  const step = featuredStep();
  if (!step) return;
  const maxScroll = featuredWrapper.scrollWidth - featuredWrapper.clientWidth;
  if (maxScroll <= 4) return;
  if (featuredWrapper.scrollLeft >= maxScroll - 4) {
    scrollFeaturedTo(0);
  } else {
    scrollFeaturedTo(Math.min(featuredWrapper.scrollLeft + step, maxScroll));
  }
};
const startFeaturedAutoScroll = () => {
  clearInterval(featuredAutoScrollTimer);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  featuredAutoScrollTimer = setInterval(advanceFeatured, 4000);
};
const pauseFeaturedAutoScroll = () => clearInterval(featuredAutoScrollTimer);

featuredCarousel?.addEventListener("mouseenter", pauseFeaturedAutoScroll);
featuredCarousel?.addEventListener("mouseleave", startFeaturedAutoScroll);
featuredCarousel?.addEventListener("focusin", pauseFeaturedAutoScroll);
featuredCarousel?.addEventListener("focusout", event => {
  if (!featuredCarousel.contains(event.relatedTarget)) startFeaturedAutoScroll();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pauseFeaturedAutoScroll();
  else startFeaturedAutoScroll();
});
startFeaturedAutoScroll();

document.querySelector(".featured-prev")?.addEventListener("click", () => {
  scrollFeaturedTo(Math.max(0, (featuredWrapper?.scrollLeft || 0) - featuredStep()));
});

document.querySelector(".featured-next")?.addEventListener("click", () => {
  const maxScroll = featuredWrapper ? featuredWrapper.scrollWidth - featuredWrapper.clientWidth : 0;
  scrollFeaturedTo(Math.min((featuredWrapper?.scrollLeft || 0) + featuredStep(), maxScroll));
});

window.refreshStoreProducts = storedProducts => {
  products.splice(0, products.length, ...storedProducts);
  addProductCategoryFilters();
  window.render("All");
  renderFeaturedProducts();
};

async function loadStoreProducts() {
  try {
    const response = await fetch(`${storeApiBaseUrl}/products`);
    if (!response.ok) throw new Error(`Product request failed (${response.status})`);
    const result = await response.json();
    if (!Array.isArray(result.products)) throw new Error("Product response is invalid.");

    products.splice(0, products.length, ...result.products.map(product => {
      const images = Array.isArray(product.images) && product.images.length
        ? product.images
        : (product.image ? [product.image] : []);
      return {
        ...product,
        id: String(product._id || product.id),
        image: product.image || images[0] || "./images/shoe-placeholder.png",
        images,
        active: product.available !== false,
        colors: Array.isArray(product.colors) ? product.colors : [],
        sizes: (product.sizes || []).map(size => {
          if (typeof size === "object") return { size: Number(size.size), stock: Number(size.stock || 0) };
          const [number, stock = 0] = String(size).split(/[,:]/).map(part => part.trim());
          return { size: Number(number), stock: Number(stock) || 0 };
        })
      };
    }));

    storeCatalogReady = true;
    addProductCategoryFilters();
    render("All");
    renderFeaturedProducts();
  } catch (error) {
    storeCatalogReady = false;
    products.splice(0, products.length);
    console.error("Store products could not be loaded from the backend.", error);
    render("All");
    renderFeaturedProducts();
  }
}

loadStoreProducts();

document.getElementById("featuredTrack")?.addEventListener("click", event => {
  const button = event.target.closest(".featured-view");
  if (button?.dataset.productId) openProductDetails(button.dataset.productId);
});

window.addEventListener("storage", event => {
  if (event.key !== localProductStorageKey || !event.newValue) return;
  try {
    const storedProducts = JSON.parse(event.newValue);
    if (!Array.isArray(storedProducts)) return;
    window.refreshStoreProducts(storedProducts);
  } catch (error) {
    console.warn("Updated product list could not be read:", error);
  }
});

// refactor this code to make more moduler form 
// refactor to react front end 
// refactor to react native and to android and ios mobile version