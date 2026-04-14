// the first apperearing user modal and greeting handler

const products =[// item arrays
{id:"local1", name:"Waakye",price:90,description:"the best waakye in the city",category:"lcoal"},
{id:"local2", name:"jollof",price:876,description:" The best jollof in the city",category:"local"},
{id:"local3", name:"Ampesie",price:457,description:"The best in the city",category:"local"},
{id:"local4", name:"fufu",price:345,description:"hello this is best food in the city",category:"local"},
{id:"local5", name:"Banku",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local6", name:"Rice with beans",price:67,description:"this is best food in the city",category:"local"},
{id:"local7", name:"plain rice",price:87,description:"this is best food in the city",category:"local"},
{id:"local8", name:"brown rice",price:100,description:"YO this is best food in the city",category:"local"},
{id:"local9", name:"local rice",price:190,description:" this is best food in the city",category:"local"},
// main course data
{id:"mainCourse1", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"mainCourse2", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"mainCourse2", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"mainCourse2", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"mainCourse2", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"mainCourse2", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
//breakfast data
{id:"breakfast1", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"breakfast2", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"breakfast3", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"breakfast4", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"breakfast5", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"breakfast6", name:"Waakye",price:45,description:"hello this is best food in the city"},
{id:"breakfast7", name:"Waakye",price:45,description:"hello this is best food in the city"},
{id:"breakfast8", name:"Waakye",price:45,description:"hello this is best food in the city"},
];
let cart=[];
function addToCart(productId){
  const product = products.find(p=>p.id===productId);
  const cartItem= cart.find(item=>item.id===productId);
  if(cartItem){
    cartItem.qty+=1;
  }else{
    cart.push({...product,qty:1});
  }
  renderCart();
}
//render cart items 
function renderCart(){
  const cartItems=document.getElementById("cartItems");
  const cartTotal= document.getElementById("cartTotal");
  cartItems.innerHTML="";
  let total=0;
  cart.forEach(item=>{
    total+=item.price*item.qty;
    cartItems.innerHTML+= `<div class="d-flex justify-content-between align-items-center mb-2">
      <div><strong>${item.name}</strong><br>
      GHS ${item.price}
      </div>
      <div class="d-flex align-items-center">
        <button onclick="changeQty(${item.id},-1)">-</button>
        <span class="mx-2">${item.qty}</span>
        <button onclick="changeQty(${item.id},1)">+</button>
      </div>
    </div>`;
  });
  cartTotal.textContent= total;
}
//change quantity function 
function changeQty(id,change){
  const item=cart.find(p=>p.id !==id);
  item.qty+=change;
  if(item.qty<=0){
    cart=cart.filter(p=>p.id !==id);
  }
  renderCart();
}

// eventlistener to load after the page is ready its reads ones 
document.addEventListener('DOMContentLoaded', function () {
  const modalEl = document.getElementById('userModal');
  const modal = new bootstrap.Modal(modalEl);
  const userForm = document.getElementById('userForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const greeting = document.getElementById('greeting');

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
    searchRow.innerHTML+= ` <div class="col-6 mb-3">
      <div class="card p-3 text-center">
       <img src="./images/food1.png" class="card-img-top rounded-top" alt="Food-image">
        <h6 class="mb-1">${product.name}</h6>
        <small class="text-muted">GHC${product.price}</small>
        <button class="btn btn-sm btn-dark mt-2">Add</button>
      </div>
    </div>`;// holding few data in the all / trying text in a empty frame or before users start searching for prou
  });
  if(!filtered.length){
    searchRow.innerHTML= `<p class="text-center text-muted">no food found</p>`;
  }
};

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
function greetUser() {
      let hour = new Date().getHours();
      let greet;

      if (hour < 12) {
        greet = "Good morning";
      } else if (hour < 18) {
        greet = "Good afternoon";
      } else {
        greet = "Good evening";
      }

const storedName = localStorage.getItem('userName');
  if (!storedName) {
    modal.show();
  } else {
    greeting.textContent = `Hi ${greet},${storedName}! AKWAABA!`;
  }
 
}
greetUser();

// function to render cards 
function render(category, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  products.filter(item => item.category === category).forEach(item => {
      container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="card product-card shadow-sm border-0 h-100"
             style="min-width:12rem;max-width:14rem; cursor:pointer;"
             onclick="viewDetails('${item.id}')">

          <img src="${item.img || './images/food1.png'}"
               class="card-img-top rounded-top" />

          <div class="card-body">
            <h6 class="fw-bold">${item.name}</h6>
            <p class="text-muted small">${item.description}</p>
            <span class="badge bg-danger">GHC ${item.price}</span>
          </div>
        </div>
        `
      );
    });
}


//render by category
render("local","localFoodsRow");
render("breakfast","breakFastRow");
render("mainDish","mainDishRow");

// function submit user data
  userForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();

    if (name && email && isValidEmail(email)) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      modal.hide();
      greeting.textContent = `Hi, ${name}! Welcome to Our Shoe Store!`;
    } else {
      alert('Please enter a valid name and email!');
      if (!name) userNameInput.focus();
      else if (!isValidEmail(email)) userEmailInput.focus();
    }
  });
});

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

// function to handle forms 
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (name && message && email && isValidEmail(email)) {
      alert(`Thank you for contacting us, ${name}. We will get back to you shortly!`);
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



