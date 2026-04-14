

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
{id:"local20", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local21", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local22", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local23", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local24", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local25", name:"Waakye",price:45,description:"hello this is best food in the city",category:"mainDish"},
{id:"local26", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local27", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local28", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local29", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local30", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local31", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breaakfast"},
{id:"local32", name:"Waakye",price:45,description:"hello this is best food in the city",category:"breakfast"},
{id:"local33", name:"Waakye",price:45,description:"hello this is best food in the city"},
];

let cart=[];
function addToCart(productId){
  alert("hello:"+id);
  const product = products.find(p=>p.id===productId);
  if(cartItem){
    cartItem.qty+=1;
  }else{
    cart.push({...product,qty:1});
  }
  renderCart();
}




document.addEventListener('DOMContentLoaded',function{
  const modalEl = document.getElementById('userModal');// modal to collect user data to google sheet/ upgrade to the backend later 
  const modal = new bootstrap.Modal(modalEl);
  const userForm = document.getElementById('userForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const greeting = document.getElementById('greeting');
const searchInput = document.getElementById("searchInput");
const searchRow = document.getElementById("searchFoodRow");

//searh bar
let activeCategory ="all";// breaking down from the all elements// debugging the entire search block of codes
//render search modal results
function renderSearch(){
  const search = searchInput.value.toLowerCase();
  searchRow.innerHTML="";
  // understanding the filtered function to display the data
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


function render(category, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

products.filter(item => item.category === category).forEach(item => {
      container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="card product-card shadow-sm border-0 h-100"
             style="min-width:12rem;max-width:14rem; cursor:pointer;">

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
    const productCards = document.querySelectorAll("product-card");
    productCards.forEach(card=>{
      card.addEventListener("click",()=>{
        addToCart(card.dataset.id);
      });
    });
    
}

function renderCart(){
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  cartItems.innerHTML="";
  let total =0;
  cart.forEach(item=>{
    total+=item.price*item.qty;
    cartItems.innerHTML+=  `<div class="d-flex justify-content-between align-items-center mb-2">
      <div><strong>${item.name}</strong><br>GHS${item.price}
      </div>
      <div class="d-flex align-items-center">
        <button onclick="changeQty(${item.id},-1)">-</button>
        <span class="mx-2">${item.qty}</span>
        <button onclick="changeQty(${item.id}),1">+</button>
      </div>
    </div>`;
  });

  cartTotal.textContent=total;
}
function changeQty(id,change){
  const item=cart.find(p=>p.id===id);
  item.qty+=change;
  if(item.qty<=0){
    cart=cart.filter(p=>p.id!==id);
  }
  renderCart();
}

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

// -----------------------------
// PAGE LOADER FADE-OUT EFFECT
// -----------------------------
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


})