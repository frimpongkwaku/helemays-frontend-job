// the first apperearing user modal and greeting handler

let userModal; 
let greeting;

const products =[// item arrays// this product is for admin backend
{id:"local1", name:"Waakye",price:90,description:"the best waakye in the city",category:"local1"},
{id:"local2", name:"jollof",price:876,description:" The best jollof in the city",category:"local2"},
{id:"local3", name:"Ampesie",price:457,description:"The best in the city",category:"local1"},
{id:"local4", name:"fufu",price:345,description:"hello this is best food in the city",category:"local2"},
{id:"local5", name:"Banku",price:45,description:"hello this is best food in the city",category:"breakfast"},
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
        <span class="list-price">$${product.price}</span>
      </div>

    </div>

    <button onclick="addToCart('${product.id}')"
            class="list-add-btn">
      +
    </button>

  </div>
</div>`;// holding few data in the all / trying text in a empty frame or before users start searching for prou
  });
  if(!filtered.length){
    searchRow.innerHTML= `<p class="text-center text-muted">no food found</p>`;
  }
};
// scroll page when arrow is clicked

// hiding arrows after user scrolls 


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
  confirmModal.show();
  name.textContent="";phone="";address="";delivery="";payment="";note="";



  // Attach WhatsApp send
  const buyBtn = document.getElementById("buyBtn");
  buyBtn.addEventListener("click" ,()=> {

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
  
   
  });
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
  cartModal.show();
 }) 

  stickyCart.addEventListener("click", () => {
    if (cartModal) {
      cartModal.show();
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
      checkoutModal.show();
    }, 300);
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
function render(category, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  products.filter(item => item.category === category).forEach(item => {
      container.insertAdjacentHTML(
        "beforeend",`
<div class="col d-flex">
  <div class="card shadow-md border-0.2 product-card h-80 d-flex flex-column"
       style="min-width:10rem; max-width:7rem; cursor:pointer;"
       >

    <div class="position-relative">
      <img src="./images/food1.png"
           class="card-img-top rounded-top product-img"
           alt="item-img"
           id="searchImage">

      <span class="badge bg-danger position-absolute top-0 end-0 m-2 shadow-sm">
        GH ${item.price}
      </span>
    </div>

    <div class="card-body d-flex flex-column">

      <h6 class="fw-bold">${item.name}</h6>

      <p class="text-muted small product-description">
        ${item.description}
      </p>

      <!-- Bottom Right Add to Cart -->
      <div class="mt-auto d-flex justify-content-center border-0.2 "  id="cartdesign" onclick="addToCart('${item.id}')">
        <span class="add-cart-corner" >
          Add <i class="fa-solid fa-cart-shopping me-1"></i>
        </span>
      </div>

    </div>

  </div>
</div>`
      );
    });
}





//render by category
render("local1","localFoodsRow");
render("local2","localFoodsRow2");
render("breakfast","breakFastRow");
render("mainDish","mainDishRow"); 
render("sides","sidesRow");


// function submit user data// need to work on this one to act as a login
    userForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();

    if (name && email && isValidEmail(email)) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      if (userModal) userModal.hide();
      greeting.textContent = `Hi, ${name}! Welcome to Helemays Foods Limited`;
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

  if (hour < 12) greet = "Good morning";
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


// hiding sticky on a page using scroll top and down 
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
      const lat= pos.coords.latitude;
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
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  }, 3000); // 3 seconds delay
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



