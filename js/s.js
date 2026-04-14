// the first apperearing user modal and greeting handler
document.addEventListener('DOMContentLoaded', function () {// function domcontentloaded review 
  const modalEl = document.getElementById('userModal');// modal to collect user data to google sheet/ upgrade to the backend later 
  const modal = new bootstrap.Modal(modalEl);
  const userForm = document.getElementById('userForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const greeting = document.getElementById('greeting');


  // search logic for live search  with key press// not done i will continue
  const searchInput=document.getElementById("searchInput");
  searchInput.addEventListener("input",()=>{
    const value = searchInput.value.toLowerCase();
    document.querySelectorAll(".food-card").forEach(card=>{
      const name = card.dataset.name.toLowerCase();
      if(name.includes(value)){
        card.style.display="block";
      }else{card.style.display="none";}//review this line of code 
    })
  })// not done with the search modal 

  // greetings with time on the header and on the user dashboard
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

// injections of foods cards in a div
const localFoods =[// item arrays
  {
    name:"Waakye",
    price:45,
    description:"hello this is best food in the city",
   
  },
  {
    name:"fufu",
    price:74,
    description:"the best fufu in gh",
  },
  {
    name:"rice",
    price:46,
    description:"zongo rice",
  },
  {
    name:"banku and tilapia",
    price:57,
    description:"the banku in town",
  },
  {
    name:"konkonte",
    price:748,
    description:"konkonte best food",
  },
  {
    name:"omo tuo",
    price:35,
    description:"very delicious",
  
  },
];
const breakFast= [{name:"meat pie",price:787,description:"the best in town"},{name:"cinnamon rolls",price:55,description:"the best in the city"}]
const mainDishes= [{name:"meat pie",price:787,description:"the best in town"},{name:"cinnamon rolls",price:55,description:"the best in the city"}]
const sides= [{name:"meat pie",price:787,description:"the best in town"},{name:"cinnamon rolls",price:55,description:"the best in the city"}]

// logic to inject card to rows
const localFoodsEl= document.getElementById("localFoodsRow");
const breakFastEl= document.getElementById("breakFastRow");
const mainDishEl = document.getElementById("mainDishRow");
const sidesEl = document.getElementById("sidesRow");

localFoods.forEach(localfood=>{
  localFoodsEl.insertAdjacentHTML("beforeend",`
     <div class="card product-card shadow-sm border-0 h-100" style="min-width: 12rem;">
 <div class="position-relative">
 <img src="./images/food1.png" class="card-img-top rounded-top" alt="Food-image">
<span class="badge bg-danger position-absolute top-0 end-0 m-2 shadow-sm">GHC ${localfood.price}</span>
</div>
<div class="card-body d-flex flex-column"><!--card body-->
<h5 class="card-title mb-1 fw-bold">${localfood.name}</h5>
<p class="card-text small text-muted">${localfood.description}</p>

<div class="mb-2">
  <span class="text-warning">&#9733;&#9733;&#9733;&#9733;&#9734;</span><!--review-->
  <small class="text-muted">(120 reviews)</small>
</div>
<button class="btn btn-outline-primary mt-auto w-100 view-details-btn" data-bs-toggle="modal" data-bs-target="#productModal">
  View Details
</button>
</div>
</div>
    
  `);
});
breakFast.forEach(breakfast=>{
  breakFastEl.insertAdjacentHTML("beforeend",`
     <div class="card product-card shadow-lg border-0 h-100" style="min-width: 12rem; max-width:12rem">
 <div class="position-relative">
 <img src="./images/food1.png" class="card-img-top rounded-top" alt="Food-image">
<span class="badge bg-danger position-absolute top-0 end-0 m-2 shadow-sm">GHC ${breakfast.price}</span>
</div>
<div class="card-body d-flex flex-column"><!--card body-->
<h5 class="card-title mb-1 fw-bold">${breakfast.name}</h5>
<p class="card-text small text-muted">${breakfast.description}</p>
<button class="btn btn-outline-primary mt-auto w-100 view-details-btn" id="view" onclick="viewDetails(id)">
  View Details
</button>
</div>
</div>
    
  `);
});

mainDishes.forEach(mainDish=>{
  mainDishEl.insertAdjacentHTML("beforeend",`
     <div class="card product-card shadow-lg border-0 h-100" style="min-width: 12rem; max-width:12rem">
 <div class="position-relative">
 <img src="./images/food1.png" class="card-img-top rounded-top" alt="Food-image">
<span class="badge bg-danger position-absolute top-0 end-0 m-2 shadow-sm">GHC ${mainDish.price}</span>
</div>
<div class="card-body d-flex flex-column"><!--card body-->
<h5 class="card-title mb-1 fw-bold">${mainDish.name}</h5>
<p class="card-text small text-muted">${mainDish.description}</p>
<button class="btn btn-outline-primary mt-auto w-100 view-details-btn" id="view" onclick="viewDetails(id)">
  View Details
</button>
</div>
</div>
    
  `);
});
sides.forEach(side=>{
  sidesEl.insertAdjacentHTML("beforeend",`
     <div class="card product-card shadow-lg border-0 h-100" style="min-width: 12rem; max-width:12rem">
 <div class="position-relative">
 <img src="./images/food1.png" class="card-img-top rounded-top" alt="Food-image">
<span class="badge bg-danger position-absolute top-0 end-0 m-2 shadow-sm">GHC ${side.price}</span>
</div>
<div class="card-body d-flex flex-column"><!--card body-->
<h5 class="card-title mb-1 fw-bold">${side.name}</h5>
<p class="card-text small text-muted">${side.description}</p>
<button class="btn btn-outline-primary mt-auto w-100 view-details-btn" id="view" onclick="viewDetails(id)">
  View Details
</button>
</div>
</div>
    
  `);
});

/*<div class="col-8 col-sm-6 col-md-4 col-lg-3" >
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h6 class="card-title">${food.name}</h6>
          <p class="card-text">GHc${food.price}</p>
          <button class="btn btn-sm btn-primary w-100">Add to Cart</button>
        </div>
      </div>
    </div>*/

  // Show modal only if no userName in localStorage


  /*const storedName = localStorage.getItem('userName');
  if (!storedName) {
    modal.show();
  } else {
    greeting.textContent = `Hi,${greet} ${storedName}! AKWAABA!`;
  }
*/
  // On user form submit, validate and store user info
  userForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();

    if (name && email && isValidEmail(email)) {// isValidEmail review
      localStorage.setItem('userName', name);/// storing user data in the local storage
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
// food data 

// -----------------------------
// EMAIL VALIDATION FUNCTION
// -----------------------------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// -----------------------------
// REVIEW FORM HANDLING
// -----------------------------
// Place this after DOM is ready or inside a DOMContentLoaded listener if you want strict ordering
const reviewForm = document.getElementById('reviewForm');// implement after a purchase from the store,get accesss to the review after making and order // routing /or blocking routes 
if (reviewForm) {
  reviewForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    const stars = document.querySelectorAll('#rating .star-icon.active');
    const rating = stars.length;

    if (name && message && rating > 0) {
      document.getElementById('outputName').textContent = name;
      document.getElementById('outputMessage').textContent = message;

      let starIcons = '';
      for (let i = 0; i < rating; i++) {
        starIcons += '<i class="bi bi-star-fill text-warning"></i>';
      }
      document.getElementById('outputStars').innerHTML = starIcons;

      const output = document.getElementById('output');
      output.style.display = 'block';
      output.classList.add('review-output');

      reviewForm.reset();

      // Clear star rating
      document.querySelectorAll('.star-icon').forEach(star => star.classList.remove('active'));
    } else {
      alert("Please fill in your name, message, and select a rating.");
    }
  });
}

// -----------------------------
// STAR RATING INTERACTION
// -----------------------------
document.querySelectorAll('#rating .star-icon').forEach(star => {
  star.setAttribute('tabindex', '0'); // make keyboard accessible
  star.setAttribute('role', 'button'); // accessibility role
  star.setAttribute('aria-label', 'Rate ' + star.getAttribute('data-value') + ' stars');

  // On click or keyboard Enter/Space
  star.addEventListener('click', updateStarRating);
  star.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      updateStarRating.call(this);
    }
  });
});

function updateStarRating() {
  const value = parseInt(this.getAttribute('data-value'));
  document.querySelectorAll('#rating .star-icon').forEach((s, index) => {
    s.classList.toggle('active', index < value);
  });
}

// -----------------------------
// PRODUCT MODAL DYNAMIC CONTENT
// -----------------------------
// Make sure your product modal has elements with these IDs
/*function openProductModal(title, description, image, price) {
  document.getElementById('productTitle').textContent = title;
  document.getElementById('productDescription').textContent = description;
  document.getElementById('productImage').src = image;
  document.getElementById('productPrice').textContent = price};*/
// we are taking the product details from the data set on the page 

function viewDetails(id){
  const product = foods1.find(food1=>
    food1.id===id);
    doccument.getElementById("modalTitle").innerText= product.name;
    document.getElementById("modalTmage".src=product.image);
    document.getElementsByName("modalDescription").innerText=product.description;
    document.getElementsByName("modalPrice").innerText=+product.price;
    document.getElementById("addToCart").onclick=()=>addTocart(product);
    new bootstrap.Modal(document.getElementById("productMdal")).show();//next update on the project;
};

// -----------------------------
// WHATSAPP BUTTON SHOW/HIDE ON SCROLL
// -----------------------------
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

// -----------------------------
// CONTACT FORM HANDLING
// -----------------------------
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

// -----------------------------
// SEARCH FILTERING WITH DEBOUNCE
// -----------------------------
function filterProducts() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach(card => {
    const productName = card.getAttribute("data-name").toLowerCase();
    card.style.display = productName.includes(searchInput) ? "block" : "none";
  });
}

// Debounce utility to limit function calls on input events
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

// Attach search handlers
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    filterProducts();
  });

  searchInput.addEventListener("input", debounce(filterProducts, 500));
}
// -----------------------------
// PRODUCT MODAL TRIGGER HANDLING
// -----------------------------
document.querySelectorAll('.view-details-btn').forEach(button => {
  button.addEventListener('click', function () {
    const card = this.closest('.product-card');
    const title = card.getAttribute('data-name') || 'Product';
    const description = card.getAttribute('data-description') || '';
    const image = card.getAttribute('data-image') || '';
    const price = card.getAttribute('data-price') || '';

    openProductModal(title, description, image, price);
  });
});
// how to call a modal is a priority and also