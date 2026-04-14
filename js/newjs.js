(() => {
  // ===============================
  // PRODUCTS DATA & UTILS
  // ===============================
  const products = [
    { id:"local1", name:"Waakye", price:90, description:"the best waakye in the city", category:"local" },
    { id:"local2", name:"Jollof", price:876, description:"The best jollof in the city", category:"local" },
    { id:"local3", name:"Ampesie", price:457, description:"The best in the city", category:"local" },
    { id:"local4", name:"Fufu", price:345, description:"Hello this is best food in the city", category:"local" },
    { id:"local37", name:"Ice Cream", price:464, description:"The best ice cream in town", category:"sides" },
    // Add the rest as needed
  ];

  const findProduct = (id) => products.find(p => p.id === id);

  // ===============================
  // MODALS (USER / CART / CONFIRM)
  // ===============================
  let userModal, cartModal, checkoutModal, confirmModal;
  let greeting, userForm, userNameInput, userEmailInput;

  const initModals = () => {
    const modalEl = document.getElementById("userModal");
    if(modalEl) userModal = new bootstrap.Modal(modalEl);

    userForm = document.getElementById("userForm");
    userNameInput = document.getElementById("userName");
    userEmailInput = document.getElementById("userEmail");
    greeting = document.getElementById("greeting");

    if(userForm) {
      userForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = userNameInput.value.trim();
        const email = userEmailInput.value.trim();
        if(name && isValidEmail(email)) {
          localStorage.setItem("userName", name);
          localStorage.setItem("userEmail", email);
          userModal.hide();
          renderGreeting();
        } else {
          alert("Please enter valid name and email");
          if(!name) userNameInput.focus();
          else userEmailInput.focus();
        }
      });
    }

    // Cart / Checkout / Confirmation modals
    cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
    checkoutModal = new bootstrap.Modal(document.getElementById("checkoutModal"));
    confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));

    renderGreeting();
  };

  const renderGreeting = () => {
    const storedName = localStorage.getItem("userName");
    if(storedName && greeting) {
      const hour = new Date().getHours();
      let greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
      greeting.textContent = `Hi ${greet}, ${storedName}! AKWAABA!`;
    } else if(userModal) userModal.show();
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // ===============================
  // CART MODULE
  // ===============================
  let cart = [];
  let cartInitialized = false;
  const stickyCartWrapper = document.getElementById("cartBadgeContainer");

  const addToCart = (id) => {
    const product = findProduct(id);
    if(!product) return console.error("Product not found");

    const existing = cart.find(item => item.id === id);
    if(existing) existing.qty++;
    else cart.push({...product, qty:1});

    if(!cartInitialized) {
      stickyCartWrapper?.classList.remove("d-none");
      cartInitialized = true;
    }
    renderCart();
  };

  const renderCart = () => {
    const cartItems = document.getElementById("cartItems");
    const cartItemCount = document.getElementById("cartItemCount");
    const cartTotalAmount = document.getElementById("modalCartTotal");
    const emptyCartText = document.getElementById("emptyCartText");
    const cartheaderCount = document.getElementById("cartHeaderCount");
    const stickyCart = stickyCartWrapper;

    if(!cartItems || !cartItemCount || !cartTotalAmount || !emptyCartText || !cartheaderCount) return;

    cartItems.innerHTML = "";
    let total = 0, itemCount = 0;

    if(cart.length === 0) emptyCartText.classList.remove("d-none");
    else emptyCartText.classList.add("d-none");

    cart.forEach(item => {
      total += item.price * item.qty;
      itemCount += item.qty;
      cartItems.insertAdjacentHTML("beforeend", `
        <div class="cart-item-modern" data-id="${item.id}">
          <div class="cart-thumb"><img src="./images/food1.png" alt="${item.name}"></div>
          <div class="cart-info">
            <h6 class="cart-title">${item.name}<span><p class="cart-price">${item.price}</p></span></h6>
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

    cartItemCount.textContent = `${itemCount} item${itemCount !== 1 ? "s" : ""}`;
    cartTotalAmount.textContent = `GHS ${total}`;
    stickyCart.textContent = `GHS ${total}`;
    cartheaderCount.textContent = itemCount;
  };

  const removeItem = (id) => {
    cart = cart.filter(item => item.id !== id);
    renderCart();
  };

  const clearCart = () => {
    cart = [];
    renderCart();
  };

  const changeQty = (id, change) => {
    const item = cart.find(p => p.id === id);
    if(!item) return;
    item.qty += change;
    if(item.qty <= 0) cart = cart.filter(p => p.id !== id);
    renderCart();
  };

  const generateInvoice = () => "HMF-" + Date.now();
  const getOrderTime = () => new Date().toLocaleString();

  const buildOrderItemsText = () => cart.map(item => `• ${item.name} x${item.qty} = GHS ${item.price * item.qty}`).join("\n");

  const sendToWhatsApp = (order) => {
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
    window.open("https://wa.me/233593189155?text=" + encodeURIComponent(message), "_blank");
  };

  // ===============================
  // PRODUCT RENDER & SEARCH
  // ===============================
  let activeCategory = "all";
  const renderProducts = (category, containerId) => {
    const container = document.getElementById(containerId);
    if(!container) return;

    container.innerHTML = products.filter(p => p.category === category).map(item => `
      <div class="col d-flex">
        <div class="card shadow-sm border-0 product-card h-100 d-flex flex-column" style="cursor:pointer;" onclick="addToCart('${item.id}')">
          <div class="position-relative">
            <img src="./images/food1.png" class="card-img-top rounded-top product-img" alt="${item.name}">
            <span class="badge bg-danger position-absolute top-0 end-0 m-2 shadow-sm">$${item.price}</span>
          </div>
          <div class="card-body d-flex flex-column">
            <h6 class="fw-bold">${item.name}</h6>
            <p class="text-muted small product-description">${item.description}</p>
            <div class="mt-auto pt-2 add-cart-text"><i class="fa-regular fa-cart-shopping me-2"></i>Add to cart</div>
          </div>
        </div>
      </div>
    `).join("");
  };

  const renderAllProducts = () => {
    renderProducts("local","localFoodsRow");
    renderProducts("breakfast","breakFastRow");
    renderProducts("mainDish","mainDishRow");
    renderProducts("sides","sidesRow");
  };

  const initSearch = () => {
    const searchInput = document.getElementById("searchInput");
    const searchRow = document.getElementById("searchFoodRow");

    if(!searchInput || !searchRow) return;

    const renderSearch = () => {
      const query = searchInput.value.toLowerCase();
      const filtered = products.filter(p =>
        (activeCategory === "all" || p.category === activeCategory) &&
        p.name.toLowerCase().includes(query)
      );

      searchRow.innerHTML = filtered.length ? filtered.map(p => `
        <div class="col-6 col-md-4 col-lg-3 card product-card shadow-sm border-0 h-100" onclick="addToCart('${p.id}')">
          <div class="position-relative">
            <img src="./images/food1.png" class="card-img-top rounded-top" alt="${p.name}">
            <span class="badge bg-danger position-absolute top-0 end-0 m-2 shadow-sm">$${p.price}</span>
          </div>
          <div class="card-body">
            <h6 class="fw-bold">${p.name}</h6>
            <p class="text-muted small">${p.description}</p>
          </div>
        </div>
      `).join('') : `<p class="text-center text-muted">No food found</p>`;
    };

    searchInput.addEventListener("input", renderSearch);

    document.querySelectorAll(".category-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.category;
        renderSearch();
      });
    });

    document.getElementById("searchModal")?.addEventListener("shown.bs.modal", () => {
      searchInput.value = "";
      activeCategory = "all";
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      document.querySelector("[data-category='all']")?.classList.add("active");
      renderSearch();
    });
  };

  // ===============================
  // INITIALIZATION
  // ===============================
  const init = () => {
    initModals();
    renderAllProducts();
    initSearch();

    // Sticky Cart click
    document.getElementById("cartIcon")?.addEventListener("click", () => cartModal?.show());
    stickyCartWrapper?.addEventListener("click", () => cartModal?.show());

    // Checkout button
    document.getElementById("checkoutBtn")?.addEventListener("click", () => {
      if(cart.length === 0) return alert("Your cart is empty");
      cartModal.hide();
      setTimeout(() => checkoutModal?.show(), 300);
    });

    // WhatsApp checkout
    document.getElementById("checkoutWhatsApp")?.addEventListener("click", () => {
      if(cart.length === 0) return alert("Cart is empty");

      const name = document.getElementById("custName").value.trim();
      const phone = document.getElementById("custPhone").value.trim();
      const address = document.getElementById("custAddress").value.trim();
      const delivery = document.getElementById("deliveryType").value;
      const payment = document.getElementById("paymentMethod").value;
      const note = document.getElementById("orderNote").value.trim() || "None";

      if(!name || !phone) return alert("Name and phone are required");

      const invoice = generateInvoice();
      const time = getOrderTime();

      sendToWhatsApp({ name, phone, address, delivery, payment, note, invoice, time, total: cart.reduce((sum, i) => sum + i.price*i.qty, 0) });

      confirmModal.hide();
      clearCart();
    });
  };

  // ===============================
  // EXPOSE FUNCTIONS FOR INLINE HTML
  // ===============================
  window.addToCart = addToCart;
  window.changeQty = changeQty;
  window.removeItem = removeItem;

  document.addEventListener("DOMContentLoaded", init);
})();