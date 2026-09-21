// ============================================================
// SWEET TOP BITE / SHOE STORE
// MAIN JAVASCRIPT
// ============================================================


// ============================================================
// 1. CHAT / SOCKET STATE
// ============================================================

const seenMessages = new Set();
const USER_ROLE = "user";


// ============================================================
// 2. GET CURRENT ORDER ID
// ============================================================

const getOrderId = () => {
  return (
    localStorage.getItem("currentOrderId") ||
    new URLSearchParams(window.location.search).get("orderId")
  );
};


// ============================================================
// 3. SOCKET CONNECTION
// ============================================================

const socket = io(
  "https://storebackend-production-f58c.up.railway.app",
  {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000
  }
);


// ============================================================
// 4. SOCKET CONNECTED
// ============================================================

socket.on("connect", () => {
  console.log("🟢 Connected:", socket.id);

  const orderId = getOrderId();

  if (!orderId) {
    return;
  }

  socket.emit("join-order", {
    orderId
  });

  loadMessages();
});


// ============================================================
// 5. RECEIVE CHAT MESSAGE
// ============================================================

socket.on("receive-message", (data) => {
  if (!data) {
    return;
  }

  const key =
    data._id ||
    `${data.sender}-${data.message}`;

  if (seenMessages.has(key)) {
    return;
  }

  seenMessages.add(key);

  renderMessage(data);
});


// ============================================================
// 6. RENDER CHAT MESSAGE
// ============================================================

function renderMessage(data) {
  const chatBox = document.getElementById("userChatBox");

  if (!chatBox || !data) {
    return;
  }

  const div = document.createElement("div");

  const sender =
    data.senderRole ||
    data.sender ||
    "system";

  if (sender === "admin") {
    div.className = "msg admin";
  } else if (sender === "user") {
    div.className = "msg user";
  } else {
    div.className = "msg system";
  }

  div.textContent = data.message || "";

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
}


// ============================================================
// 7. SEND CHAT MESSAGE
// ============================================================

function sendMessage(message) {
  const orderId = getOrderId();

  if (!orderId || !message) {
    return;
  }

  const payload = {
    orderId,
    message,
    sender: USER_ROLE,
    senderRole: USER_ROLE,
    senderName:
      localStorage.getItem("userName") || "Guest",
    createdAt: new Date().toISOString()
  };

  // Show immediately on the user's screen
  renderMessage(payload);

  // Send to server
  socket.emit("send-message", payload);
}


// ============================================================
// 8. LOAD CHAT HISTORY
// ============================================================

async function loadMessages() {
  const orderId = getOrderId();

  if (!orderId) {
    return;
  }

  const chatBox =
    document.getElementById("userChatBox");

  if (chatBox) {
    chatBox.innerHTML = "";
  }

  try {
    const response = await fetch(
      `https://storebackend-production-f58c.up.railway.app/api/messages/${orderId}`
    );

    const result = await response.json();

    if (!result.success) {
      return;
    }

    result.data.forEach((message) => {
      const key =
        message._id ||
        `${message.sender}-${message.message}`;

      if (seenMessages.has(key)) {
        return;
      }

      seenMessages.add(key);

      renderMessage(message);
    });

  } catch (error) {
    console.error(
      "Failed to load messages:",
      error
    );
  }
}


// ============================================================
// 9. GLOBAL USER VARIABLES
// ============================================================

let userModal;
let greeting;


// ============================================================
// 10. EMAIL VALIDATION
// ============================================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// ============================================================
// 11. WHATSAPP NUMBER
// ============================================================

const WHATSAPP_NUMBER = "233206092604";


// ============================================================
// 12. PRODUCT DATA
// ============================================================
//
// This is still your existing product data.
// We are NOT changing your product system yet.
//
// Later, this section will be replaced by the
// admin CRUD/backend system.
// ============================================================

const products = [
  {
    id: "shoe001",

    name: "Classic Leather sandals",

    category: "Sandals",

    price: 450,

    description:
      "Handcrafted leather derby shoe made for timeless everyday elegance.",

    images: [
      "./images/sandals2.png",
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

    name: "Classic Leather Shoe",

    category: "Formal",

    price: 450,

    description:
      "Handcrafted leather derby shoe made for timeless everyday elegance.",

    images: [
      "./images/shoes-removebg-preview.png",
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
    id: "shoe003",

    name: "Classic Leather Loafers",

    category: "Loafers",

    price: 450,

    description:
      "Handcrafted leather derby shoe made for timeless everyday elegance.",

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
    id: "shoe004",

    name: "Classic Leather Derby",

    category: "Slippers",

    price: 450,

    description:
      "Handcrafted leather derby shoe made for timeless everyday elegance.",

    images: [
      "./images/sandals2.png",
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
    id: "shoe005",

    name: "Classic Leather Boots",

    category: "Boots",

    price: 450,

    description:
      "Handcrafted leather derby shoe made for timeless everyday elegance.",

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
];
// ============================================================
// 13. DOM REFERENCES
// ============================================================

const pageLoader = document.getElementById("loader");
const modalLoader = document.getElementById("modalLoader");

const shoeHero = document.getElementById("shoeHero");

const menuGrid = document.getElementById("menuGrid");
const popularProducts =
  document.getElementById("popularProducts");

const productModalOverlay =
  document.getElementById("productModalOverlay");

const productDetailsModal =
  document.getElementById("productDetailsModal");

const cartModal =
  document.getElementById("cartModal");

const cartIcon =
  document.getElementById("cartIcon");

const mobileCartBar =
  document.getElementById("mobileCartBar");


// ============================================================
// 14. HERO CAROUSEL
// ============================================================

if (shoeHero) {

  const heroSlides =
    shoeHero.querySelectorAll(
      ".shoe-hero-slide"
    );

  const heroDots =
    shoeHero.querySelectorAll(
      ".shoe-hero-dot"
    );

  const heroPrev =
    shoeHero.querySelector(
      ".shoe-hero-prev"
    );

  const heroNext =
    shoeHero.querySelector(
      ".shoe-hero-next"
    );

  let currentHeroSlide = 0;
  let heroAutoSlide = null;


  // ----------------------------------------------------------
  // SHOW HERO SLIDE
  // ----------------------------------------------------------

  function showHeroSlide(index) {

    if (!heroSlides.length) {
      return;
    }

    if (index >= heroSlides.length) {
      currentHeroSlide = 0;

    } else if (index < 0) {
      currentHeroSlide =
        heroSlides.length - 1;

    } else {
      currentHeroSlide = index;
    }


    // Remove active class from slides

    heroSlides.forEach((slide) => {
      slide.classList.remove("active");
    });


    // Remove active class from dots

    heroDots.forEach((dot) => {
      dot.classList.remove("active");
    });


    // Activate current slide

    const currentSlide =
      heroSlides[currentHeroSlide];

    if (currentSlide) {
      currentSlide.classList.add("active");
    }


    // Activate current dot

    const currentDot =
      heroDots[currentHeroSlide];

    if (currentDot) {
      currentDot.classList.add("active");
    }
  }


  // ----------------------------------------------------------
  // NEXT SLIDE
  // ----------------------------------------------------------

  function nextHeroSlide() {
    showHeroSlide(
      currentHeroSlide + 1
    );
  }


  // ----------------------------------------------------------
  // PREVIOUS SLIDE
  // ----------------------------------------------------------

  function previousHeroSlide() {
    showHeroSlide(
      currentHeroSlide - 1
    );
  }


  // ----------------------------------------------------------
  // START AUTO SLIDE
  // ----------------------------------------------------------

  function startHeroAutoSlide() {

    if (heroAutoSlide) {
      clearInterval(heroAutoSlide);
    }

    heroAutoSlide = setInterval(() => {
      nextHeroSlide();
    }, 6000);
  }


  // ----------------------------------------------------------
  // NEXT BUTTON
  // ----------------------------------------------------------

  if (heroNext) {

    heroNext.addEventListener(
      "click",
      () => {

        nextHeroSlide();

        startHeroAutoSlide();
      }
    );
  }


  // ----------------------------------------------------------
  // PREVIOUS BUTTON
  // ----------------------------------------------------------

  if (heroPrev) {

    heroPrev.addEventListener(
      "click",
      () => {

        previousHeroSlide();

        startHeroAutoSlide();
      }
    );
  }


  // ----------------------------------------------------------
  // DOT BUTTONS
  // ----------------------------------------------------------

  heroDots.forEach((dot) => {

    dot.addEventListener(
      "click",
      () => {

        const slideIndex =
          Number(dot.dataset.slide);

        showHeroSlide(slideIndex);

        startHeroAutoSlide();
      }
    );
  });


  // ----------------------------------------------------------
  // INITIAL SLIDE
  // ----------------------------------------------------------

  showHeroSlide(0);

  startHeroAutoSlide();
}


// ============================================================
// 15. HERO TOUCH / SWIPE SUPPORT
// ============================================================

if (shoeHero) {

  let touchStartX = 0;
  let touchEndX = 0;


  shoeHero.addEventListener(
    "touchstart",
    (event) => {

      if (
        !event.touches ||
        !event.touches.length
      ) {
        return;
      }

      touchStartX =
        event.touches[0].clientX;
    },
    { passive: true }
  );


  shoeHero.addEventListener(
    "touchend",
    (event) => {

      if (
        !event.changedTouches ||
        !event.changedTouches.length
      ) {
        return;
      }

      touchEndX =
        event.changedTouches[0].clientX;


      const swipeDistance =
        touchEndX - touchStartX;


      // Ignore very small movements

      if (
        Math.abs(swipeDistance) < 50
      ) {
        return;
      }


      const nextButton =
        shoeHero.querySelector(
          ".shoe-hero-next"
        );

      const previousButton =
        shoeHero.querySelector(
          ".shoe-hero-prev"
        );


      if (swipeDistance < 0) {

        if (nextButton) {
          nextButton.click();
        }

      } else {

        if (previousButton) {
          previousButton.click();
        }
      }
    },
    { passive: true }
  );
}
// ============================================================
// 16. LOADER FUNCTIONS
// ============================================================

// ------------------------------------------------------------
// SHOW MODAL LOADER
// ------------------------------------------------------------

function showLoader() {

  if (!modalLoader) {
    return;
  }

  modalLoader.style.display = "flex";
}


// ------------------------------------------------------------
// HIDE MODAL LOADER
// ------------------------------------------------------------

function hideLoader() {

  if (!modalLoader) {
    return;
  }

  modalLoader.classList.add("fade-out");

  setTimeout(() => {

    modalLoader.style.display = "none";

    modalLoader.classList.remove(
      "fade-out"
    );

  }, 800);
}


// ------------------------------------------------------------
// OPEN MODAL WITH LOADER
// ------------------------------------------------------------

function openModalWithLoader(modal) {

  if (!modal) {
    return;
  }


  // Show page loader temporarily
  // only when the element exists.

  if (pageLoader) {
    pageLoader.style.display = "block";
  }


  showLoader();


  setTimeout(() => {

    hideLoader();


    if (pageLoader) {
      pageLoader.style.display = "none";
    }


    // Bootstrap modal

    if (
      modal &&
      typeof modal.show === "function"
    ) {
      modal.show();
    }

  }, 500);
}


// ============================================================
// 17. PAGE LOADER
// ============================================================
//
// IMPORTANT:
// This is kept near the beginning of the JavaScript so the
// page loader setup is registered as early as possible.
//
// The previous version had this code much later in the file.
// If an earlier JavaScript error happened on iPhone, the code
// could never reach the loader event listener.
// ============================================================

window.addEventListener(
  "load",
  () => {

    if (!pageLoader) {
      return;
    }


    setTimeout(() => {

      pageLoader.classList.add(
        "fade-out"
      );


      setTimeout(() => {

        pageLoader.style.display =
          "none";

      }, 500);

    }, 1500);

  }
);


// ============================================================
// 18. GREETING
// ============================================================

function greetUser() {

  const greet =
    document.getElementById("greet");

  const currentTime =
    document.getElementById(
      "current-time"
    );


  if (!greet) {
    return;
  }


  const now = new Date();

  const hour = now.getHours();


  let greetingText;


  if (hour >= 5 && hour < 12) {

    greetingText = "Good Morning";

  } else if (hour >= 12 && hour < 17) {

    greetingText = "Good Afternoon";

  } else {

    greetingText = "Good Evening";
  }


  greet.textContent =
    greetingText;


  // ----------------------------------------------------------
  // CURRENT TIME
  // ----------------------------------------------------------

  if (currentTime) {

    currentTime.textContent =
      now.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );
  }
}


// ============================================================
// 19. UPDATE CURRENT TIME
// ============================================================

function updateCurrentTime() {

  const currentTime =
    document.getElementById(
      "current-time"
    );


  if (!currentTime) {
    return;
  }


  const now = new Date();


  currentTime.textContent =
    now.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
}


// ============================================================
// 20. START GREETING + CLOCK
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    greetUser();

    updateCurrentTime();

    setInterval(
      updateCurrentTime,
      60000
    );

  }
);
// ============================================================
// 21. PRODUCT RENDERING
// ============================================================


// ------------------------------------------------------------
// FORMAT PRICE
// ------------------------------------------------------------

function formatPrice(price) {

  const number = Number(price) || 0;

  return `GH₵${number.toFixed(2)}`;
}


// ------------------------------------------------------------
// GET ACTIVE PRODUCTS
// ------------------------------------------------------------

function getActiveProducts() {

  return products.filter((product) => {
    return product.active !== false;
  });
}


// ------------------------------------------------------------
// GET FEATURED PRODUCTS
// ------------------------------------------------------------

function getFeaturedProducts() {

  return getActiveProducts().filter(
    (product) => product.featured === true
  );
}


// ============================================================
// 22. PRODUCT CARD
// ============================================================

function createProductCard(product) {

  if (!product) {
    return "";
  }


  const image =
    product.images &&
    product.images.length
      ? product.images[0]
      : "";


  const price =
    formatPrice(product.price);


  return `
    <div
      class="product-card"
      data-product-id="${product.id}"
    >

      <div class="product-image-wrapper">

        <img
          src="${image}"
          alt="${product.name}"
          class="product-image"
          loading="lazy"
        >

      </div>


      <div class="product-card-content">

        <span class="product-category">
          ${product.category || ""}
        </span>


        <h3 class="product-name">
          ${product.name}
        </h3>


        <div class="product-card-bottom">

          <span class="product-price">
            ${price}
          </span>


          <button
            type="button"
            class="product-view-btn"
            data-product-id="${product.id}"
          >
            View
          </button>

        </div>

      </div>

    </div>
  `;
}


// ============================================================
// 23. RENDER PRODUCT GRID
// ============================================================

function renderProducts(
  container,
  productList
) {

  if (!container) {
    return;
  }


  if (!Array.isArray(productList)) {

    container.innerHTML = "";

    return;
  }


  if (!productList.length) {

    container.innerHTML = `
      <div class="empty-products">
        <p>No products available.</p>
      </div>
    `;

    return;
  }


  container.innerHTML =
    productList
      .map((product) => {
        return createProductCard(product);
      })
      .join("");
}


// ============================================================
// 24. RENDER MAIN PRODUCTS
// ============================================================

function renderMainProducts() {

  if (!menuGrid) {
    return;
  }


  const activeProducts =
    getActiveProducts();


  renderProducts(
    menuGrid,
    activeProducts
  );
}


// ============================================================
// 25. RENDER FEATURED PRODUCTS
// ============================================================

function renderFeaturedProducts() {

  if (!popularProducts) {
    return;
  }


  const featuredProducts =
    getFeaturedProducts();


  renderProducts(
    popularProducts,
    featuredProducts
  );
}


// ============================================================
// 26. RENDER ALL PRODUCTS
// ============================================================

function renderAllProducts() {

  renderMainProducts();

  renderFeaturedProducts();
}


// ============================================================
// 27. OPEN PRODUCT FROM CARD
// ============================================================

function handleProductCardClick(event) {

  const button =
    event.target.closest(
      "[data-product-id]"
    );


  if (!button) {
    return;
  }


  const productId =
    button.dataset.productId;


  if (!productId) {
    return;
  }


  if (
    typeof openProductDetails ===
    "function"
  ) {
    openProductDetails(productId);
  }
}


// ============================================================
// 28. PRODUCT CARD EVENTS
// ============================================================
//
// Event delegation means we don't need to add a separate
// click listener to every product card.
//
// This is also better when products are rendered dynamically.
// ============================================================

if (menuGrid) {

  menuGrid.addEventListener(
    "click",
    handleProductCardClick
  );
}


if (popularProducts) {

  popularProducts.addEventListener(
    "click",
    handleProductCardClick
  );
}


// ============================================================
// 29. INITIAL PRODUCT RENDER
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderAllProducts();

  }
);
// ============================================================
// 30. PRODUCT DETAILS MODAL
// ============================================================

function openProductDetails(productId) {

  // ----------------------------------------------------------
  // FIND PRODUCT
  // ----------------------------------------------------------

  const product = products.find(
    (item) => item.id === productId
  );

  if (!product) {
    console.error(
      "Product not found:",
      productId
    );

    return;
  }


  // ----------------------------------------------------------
  // PRODUCT DETAILS STATE
  // ----------------------------------------------------------

  window.productDetailsState = {
    product: product,
    selectedSize: null,
    selectedColor:
      product.colors?.[0] || "Default",
    quantity: 1
  };


  console.log(
    "Opening product:",
    product
  );


  // ----------------------------------------------------------
  // GET MODAL ELEMENTS
  // ----------------------------------------------------------

  const modal =
    document.getElementById(
      "productDetailsModal"
    );

  const mainImage =
    document.getElementById(
      "productMainImage"
    );

  const thumbnails =
    document.getElementById(
      "productThumbnails"
    );

  const title =
    document.getElementById(
      "productDetailsTitle"
    );

  const category =
    document.getElementById(
      "productDetailsCategory"
    );

  const price =
    document.getElementById(
      "productDetailsPrice"
    );

  const description =
    document.getElementById(
      "productDetailsDescription"
    );


  // ----------------------------------------------------------
  // MAKE SURE REQUIRED ELEMENTS EXIST
  // ----------------------------------------------------------

  if (
    !modal ||
    !mainImage ||
    !thumbnails ||
    !title ||
    !category ||
    !price ||
    !description
  ) {

    console.error(
      "Product modal elements are missing."
    );

    return;
  }


  // ----------------------------------------------------------
  // PRODUCT INFORMATION
  // ----------------------------------------------------------

  title.textContent =
    product.name;

  category.textContent =
    product.category;

  price.textContent =
    `GH₵ ${product.price}`;

  description.textContent =
    product.description || "";


  // ----------------------------------------------------------
  // PRODUCT IMAGES
  // ----------------------------------------------------------

  const productImages =
    product.images?.length
      ? product.images
      : [
          "./images/shoe-placeholder.png"
        ];


  // ----------------------------------------------------------
  // MAIN IMAGE
  // ----------------------------------------------------------

  mainImage.src =
    productImages[0];

  mainImage.alt =
    product.name;


  // ----------------------------------------------------------
  // CLEAR OLD THUMBNAILS
  // ----------------------------------------------------------

  thumbnails.innerHTML = "";


  // ----------------------------------------------------------
  // CREATE THUMBNAILS
  // ----------------------------------------------------------

  productImages.forEach(
    (image, index) => {

      const thumbnail =
        document.createElement(
          "button"
        );

      thumbnail.type = "button";

      thumbnail.className =
        "product-thumbnail";


      // First image is active

      if (index === 0) {
        thumbnail.classList.add(
          "active"
        );
      }


      thumbnail.innerHTML = `
        <img
          src="${image}"
          alt="${product.name} image ${index + 1}"
        >
      `;


      // Change main image

      thumbnail.addEventListener(
        "click",
        () => {

          mainImage.src =
            image;

          mainImage.alt =
            `${product.name} image ${index + 1}`;


          thumbnails
            .querySelectorAll(
              ".product-thumbnail"
            )
            .forEach((item) => {

              item.classList.remove(
                "active"
              );

            });


          thumbnail.classList.add(
            "active"
          );

        }
      );


      thumbnails.appendChild(
        thumbnail
      );

    }
  );


  // ==========================================================
  // PRODUCT COLOR OPTIONS
  // ==========================================================

  const colorOptions =
    document.getElementById(
      "productColorOptions"
    );

  const selectedColorText =
    document.getElementById(
      "selectedColor"
    );


  if (colorOptions) {

    colorOptions.innerHTML = "";


    const colors =
      product.colors?.length
        ? product.colors
        : ["Default"];


    colors.forEach(
      (color, index) => {

        const colorButton =
          document.createElement(
            "button"
          );

        colorButton.type = "button";

        colorButton.className =
          "product-color-option";


        colorButton.textContent =
          color;


        if (index === 0) {

          colorButton.classList.add(
            "active"
          );

          window.productDetailsState.selectedColor =
            color;


          if (selectedColorText) {

            selectedColorText.textContent =
              color;

          }
        }


        colorButton.addEventListener(
          "click",
          () => {

            colorOptions
              .querySelectorAll(
                ".product-color-option"
              )
              .forEach((item) => {

                item.classList.remove(
                  "active"
                );

              });


            colorButton.classList.add(
              "active"
            );


            window.productDetailsState.selectedColor =
              color;


            if (selectedColorText) {

              selectedColorText.textContent =
                color;

            }

          }
        );


        colorOptions.appendChild(
          colorButton
        );

      }
    );
  }


  // ==========================================================
  // PRODUCT SIZE OPTIONS
  // ==========================================================

  const sizeOptions =
    document.getElementById(
      "productSizeOptions"
    );

  const selectedSizeText =
    document.getElementById(
      "selectedSize"
    );


  if (sizeOptions) {

    sizeOptions.innerHTML = "";


    if (
      product.sizes &&
      product.sizes.length
    ) {

      product.sizes.forEach(
        (sizeItem) => {

          const sizeButton =
            document.createElement(
              "button"
            );

          sizeButton.type =
            "button";

          sizeButton.className =
            "product-size-option";


          sizeButton.textContent =
            sizeItem.size;


          // ------------------------------------------------
          // OUT OF STOCK
          // ------------------------------------------------

          if (sizeItem.stock <= 0) {

            sizeButton.disabled =
              true;

            sizeButton.classList.add(
              "disabled"
            );

          }


          // ------------------------------------------------
          // SIZE CLICK
          // ------------------------------------------------

          sizeButton.addEventListener(
            "click",
            () => {

              if (
                sizeItem.stock <= 0
              ) {
                return;
              }


              sizeOptions
                .querySelectorAll(
                  ".product-size-option"
                )
                .forEach((item) => {

                  item.classList.remove(
                    "active"
                  );

                });


              sizeButton.classList.add(
                "active"
              );


              window.productDetailsState.selectedSize =
                sizeItem.size;


              if (selectedSizeText) {

                selectedSizeText.textContent =
                  sizeItem.size;

              }


              // Reset quantity
              // when size changes

              productQuantity = 1;


              if (productQtyText) {

                productQtyText.textContent =
                  productQuantity;

              }


              window.productDetailsState.quantity =
                productQuantity;

            }
          );


          sizeOptions.appendChild(
            sizeButton
          );

        }
      );

    }
  }


  // ==========================================================
  // PRODUCT QUANTITY
  // ==========================================================

  productQuantity = 1;


  if (productQtyText) {

    productQtyText.textContent =
      productQuantity;

  }


  window.productDetailsState.quantity =
    productQuantity;


  // ==========================================================
  // SHOW MODAL
  // ==========================================================

  modal.classList.add(
    "active"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );
}


// ============================================================
// 31. MAKE PRODUCT MODAL AVAILABLE TO INLINE HTML
// ============================================================

window.openProductDetails =
  openProductDetails;
  // ============================================================
// 32. PRODUCT QUANTITY
// ============================================================

const productQtyMinus =
  document.getElementById(
    "productQtyMinus"
  );

const productQtyPlus =
  document.getElementById(
    "productQtyPlus"
  );

const productQtyText =
  document.getElementById(
    "productQty"
  );


let productQuantity = 1;


// ============================================================
// 33. UPDATE PRODUCT QUANTITY DISPLAY
// ============================================================

function updateProductQuantity() {

  if (productQtyText) {

    productQtyText.textContent =
      productQuantity;

  }


  if (
    window.productDetailsState
  ) {

    window.productDetailsState.quantity =
      productQuantity;

  }
}


// ============================================================
// 34. DECREASE QUANTITY
// ============================================================

if (productQtyMinus) {

  productQtyMinus.addEventListener(
    "click",
    () => {

      if (productQuantity <= 1) {
        return;
      }


      productQuantity--;


      updateProductQuantity();

    }
  );
}


// ============================================================
// 35. INCREASE QUANTITY
// ============================================================

if (productQtyPlus) {

  productQtyPlus.addEventListener(
    "click",
    () => {

      const state =
        window.productDetailsState;


      if (
        !state ||
        !state.product
      ) {

        return;
      }


      // ------------------------------------------------------
      // FIND SIZE OPTIONS
      // ------------------------------------------------------

      const sizeOptions =
        document.getElementById(
          "productSizeOptions"
        );


      if (!sizeOptions) {
        return;
      }


      // ------------------------------------------------------
      // FIND SELECTED SIZE
      // ------------------------------------------------------

      const activeSize =
        sizeOptions.querySelector(
          ".product-size-option.active"
        );


      if (!activeSize) {

        console.log(
          "Please select a size first."
        );

        return;
      }


      // ------------------------------------------------------
      // GET SIZE VALUE
      // ------------------------------------------------------

      const selectedSize =
        state.product.sizes?.find(
          (sizeItem) =>
            String(sizeItem.size) ===
            String(
              activeSize.textContent
            )
        );


      if (!selectedSize) {
        return;
      }


      // ------------------------------------------------------
      // CHECK STOCK
      // ------------------------------------------------------

      if (
        productQuantity >=
        selectedSize.stock
      ) {

        console.log(
          "Maximum available stock:",
          selectedSize.stock
        );

        return;
      }


      // ------------------------------------------------------
      // INCREASE QUANTITY
      // ------------------------------------------------------

      productQuantity++;


      updateProductQuantity();

    }
  );
}


// ============================================================
// 36. CLOSE PRODUCT DETAILS MODAL
// ============================================================

const closeProductDetails =
  document.getElementById(
    "closeProductDetails"
  );

const productDetailsOverlay =
  document.querySelector(
    "[data-close-product-modal]"
  );


function closeProductModal() {

  const modal =
    document.getElementById(
      "productDetailsModal"
    );


  if (!modal) {
    return;
  }


  modal.classList.remove(
    "active"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );
}


// ------------------------------------------------------------
// CLOSE WITH X BUTTON
// ------------------------------------------------------------

if (closeProductDetails) {

  closeProductDetails.addEventListener(
    "click",
    closeProductModal
  );
}


// ------------------------------------------------------------
// CLOSE WITH OVERLAY
// ------------------------------------------------------------

if (productDetailsOverlay) {

  productDetailsOverlay.addEventListener(
    "click",
    (event) => {

      // Only close when the actual
      // overlay itself is clicked.

      if (
        event.target ===
        productDetailsOverlay
      ) {

        closeProductModal();

      }

    }
  );
}


// ============================================================
// 37. PRODUCT ADD TO CART
// ============================================================

const productAddToCart =
  document.getElementById(
    "productAddToCart"
  );


if (productAddToCart) {

  productAddToCart.addEventListener(
    "click",
    () => {

      const state =
        window.productDetailsState;


      // ------------------------------------------------------
      // CHECK PRODUCT
      // ------------------------------------------------------

      if (
        !state ||
        !state.product
      ) {

        console.error(
          "Product details state not found."
        );

        return;
      }


      // ------------------------------------------------------
      // GET SELECTED SIZE
      // ------------------------------------------------------

      const sizeOptions =
        document.getElementById(
          "productSizeOptions"
        );


      const activeSize =
        sizeOptions
          ? sizeOptions.querySelector(
              ".product-size-option.active"
            )
          : null;


      if (!activeSize) {

        console.log(
          "Please select a size."
        );

        return;
      }


      // ------------------------------------------------------
      // GET SELECTED SIZE DATA
      // ------------------------------------------------------

      const selectedSize =
        state.product.sizes?.find(
          (sizeItem) =>
            String(sizeItem.size) ===
            String(
              activeSize.textContent
            )
        );


      if (!selectedSize) {
        return;
      }


      // ------------------------------------------------------
      // CHECK STOCK
      // ------------------------------------------------------

      if (
        selectedSize.stock <= 0
      ) {

        console.log(
          "This size is out of stock."
        );

        return;
      }


      // ------------------------------------------------------
      // GET SELECTED COLOR
      // ------------------------------------------------------

      const selectedColor =
        state.selectedColor ||
        state.product.colors?.[0] ||
        "Default";


      // ------------------------------------------------------
      // CREATE CART ITEM
      // ------------------------------------------------------

      const cartItem = {

        productId:
          state.product.id,

        name:
          state.product.name,

        price:
          Number(
            state.product.price
          ),

        image:
          state.product.images?.[0] ||
          "./images/shoe-placeholder.png",

        size:
          selectedSize.size,

        color:
          selectedColor,

        qty:
          productQuantity

      };


      // ------------------------------------------------------
      // ADD TO CART
      // ------------------------------------------------------

      if (
        typeof cart ===
        "undefined"
      ) {

        console.error(
          "Cart is not available."
        );

        return;
      }


      cart.push(cartItem);


      // ------------------------------------------------------
      // SAVE CART
      // ------------------------------------------------------

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );


      // ------------------------------------------------------
      // UPDATE CART UI
      // ------------------------------------------------------

      if (
        typeof renderCart ===
        "function"
      ) {

        renderCart();

      }


      // ------------------------------------------------------
      // CLOSE PRODUCT MODAL
      // ------------------------------------------------------

      closeProductModal();


      // ------------------------------------------------------
      // IMPORTANT:
      // DO NOT OPEN THE CART MODAL HERE.
      //
      // The user wanted the item to be added first,
      // while the cart remains available through the
      // cart indicator.
      // ------------------------------------------------------

      console.log(
        "Added to cart:",
        cartItem
      );

    }
  );
}
// =========================================================
// 🛒 CART SYSTEM
// =========================================================

let cart = [];
let cartInitialized = false;


// =========================================================
// ADD PRODUCT TO CART
// Used by search / older product buttons
// =========================================================

function addToCart(productId) {

  const product = products.find(
    product => product.id === productId
  );

  if (!product) {
    console.error("Product not found:", productId);
    return;
  }


  // Older add-to-cart buttons do not provide
  // size/color selections.
  // Use the first available size and first color.

  const defaultSize = product.sizes?.[0];

  const cartItem = {
    productId: product.id,
    name: product.name,
    price: Number(defaultSize?.price ?? product.price),
    image: product.images?.[0] || "./images/shoe-placeholder.png",
    size: defaultSize?.size ?? "Default",
    color: product.colors?.[0] || "Default",
    qty: 1
  };


  // Check whether the exact item already exists

  const existingItem = cart.find(
    item =>
      item.productId === cartItem.productId &&
      String(item.size) === String(cartItem.size) &&
      item.color === cartItem.color
  );


  if (existingItem) {

    const sizeItem = product.sizes?.find(
      size =>
        String(size.size) === String(cartItem.size)
    );

    const maxStock = sizeItem?.stock ?? Infinity;

    if (existingItem.qty >= maxStock) {
      console.log("Maximum available stock reached.");
      return;
    }

    existingItem.qty += 1;

  } else {

    cart.push(cartItem);

  }


  // Show sticky cart

  const stickyCart = document.getElementById(
    "cartBadgeContainer"
  );

  if (stickyCart) {
    stickyCart.classList.remove("d-none");
  }

  cartInitialized = true;


  // Update cart UI

  renderCart();
}


// =========================================================
// RENDER CART
// =========================================================

function renderCart() {

  const cartItemsContainer =
    document.getElementById("cartItems");

  const emptyCartText =
    document.getElementById("emptyCartText");

  const cartFooter =
    document.querySelector("#cartModal .cart-footer");

  const modalCartTotal =
    document.getElementById("modalCartTotal");

  const cartHeaderCount =
    document.getElementById("cartHeaderCount");

  const cartTotalElement =
    document.getElementById("cartTotal");

  const cartBadge =
    document.getElementById("cartBadge");

  const mobileCartBar =
    document.getElementById("mobileCartBar");


  // Nothing to render

  if (!cartItemsContainer) {
    return;
  }


  // =======================================================
  // EMPTY CART
  // =======================================================

  if (cart.length === 0) {

    cartItemsContainer.innerHTML = "";


    if (emptyCartText) {
      emptyCartText.classList.remove("d-none");
    }


    if (cartFooter) {
      cartFooter.classList.add("d-none");
    }


    if (modalCartTotal) {
      modalCartTotal.textContent = "GH₵ 0.00";
    }


    if (cartHeaderCount) {
      cartHeaderCount.textContent = "0";
    }


    if (cartTotalElement) {
      cartTotalElement.textContent = "GH₵ 0";
    }


    if (cartBadge) {
      cartBadge.textContent = "0";
    }


    if (mobileCartBar) {
      mobileCartBar.classList.add("d-none");
    }


    hideSticky();

    return;
  }


  // =======================================================
  // CART HAS ITEMS
  // =======================================================

  if (emptyCartText) {
    emptyCartText.classList.add("d-none");
  }


  if (cartFooter) {
    cartFooter.classList.remove("d-none");
  }


  let total = 0;
  let totalItems = 0;


  cartItemsContainer.innerHTML = "";


  // =======================================================
  // CREATE CART ITEMS
  // =======================================================

  cart.forEach(item => {

    const itemTotal =
      Number(item.price) * Number(item.qty);


    total += itemTotal;
    totalItems += Number(item.qty);


    const cartItemElement =
      document.createElement("div");


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

              <span>
                Size ${item.size}
              </span>

            </div>

            <span class="cart-item-price">
              GH₵ ${Number(item.price).toFixed(2)}
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


            <span>
              ${item.qty}
            </span>


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


    cartItemsContainer.appendChild(
      cartItemElement
    );

  });


  // =======================================================
  // UPDATE TOTAL
  // =======================================================

  if (modalCartTotal) {

    modalCartTotal.textContent =
      `GH₵ ${total.toFixed(2)}`;

  }


  // =======================================================
  // UPDATE HEADER COUNT
  // =======================================================

  if (cartHeaderCount) {

    cartHeaderCount.textContent =
      totalItems;

  }


  // =======================================================
  // OLD CART ELEMENTS
  // =======================================================

  if (cartTotalElement) {

    cartTotalElement.textContent =
      `GH₵ ${total.toFixed(2)}`;

  }


  if (cartBadge) {

    cartBadge.textContent =
      totalItems;

  }


  // =======================================================
  // MOBILE CART BAR
  // =======================================================

  if (mobileCartBar) {

    const mobileCartTotal =
      mobileCartBar.querySelector(
        ".mobile-cart-total"
      );

    const mobileCartCount =
      mobileCartBar.querySelector(
        ".mobile-cart-count"
      );


    if (mobileCartTotal) {

      mobileCartTotal.textContent =
        `GH₵ ${total.toFixed(2)}`;

    }


    if (mobileCartCount) {

      mobileCartCount.textContent =
        totalItems;

    }


    mobileCartBar.classList.remove(
      "d-none"
    );

  }


  // Make sure sticky cart is visible

  hideSticky();

}


// =========================================================
// REMOVE ITEM
// =========================================================

function removeItem(productId, size, color) {

  cart = cart.filter(
    item =>
      !(
        item.productId === productId &&
        String(item.size) === String(size) &&
        item.color === color
      )
  );


  renderCart();
}


// =========================================================
// CLEAR CART
// =========================================================

function clearCart() {

  cart = [];

  renderCart();

}


// =========================================================
// CHANGE CART QUANTITY
// =========================================================

function changeQty(
  productId,
  size,
  color,
  change
) {

  const cartItem = cart.find(
    item =>
      item.productId === productId &&
      String(item.size) === String(size) &&
      item.color === color
  );


  if (!cartItem) {
    return;
  }


  const product = products.find(
    product => product.id === productId
  );


  if (!product) {
    return;
  }


  const sizeItem = product.sizes?.find(
    item =>
      String(item.size) === String(size)
  );


  if (!sizeItem) {
    return;
  }


  const newQuantity =
    Number(cartItem.qty) + Number(change);


  // =======================================================
  // REMOVE WHEN QUANTITY REACHES ZERO
  // =======================================================

  if (newQuantity <= 0) {

    removeItem(
      productId,
      size,
      color
    );

    return;
  }


  // =======================================================
  // STOCK LIMIT
  // =======================================================

  if (newQuantity > sizeItem.stock) {

    console.log(
      "Maximum available stock reached."
    );

    return;
  }


  cartItem.qty =
    newQuantity;


  renderCart();

}


// =========================================================
// STICKY CART
// =========================================================

const stickyCartWrapper =
  document.getElementById(
    "cartBadgeContainer"
  );


function hideSticky() {

  if (!stickyCartWrapper) {
    return;
  }


  if (cart.length === 0) {

    stickyCartWrapper.classList.add(
      "d-none"
    );

  } else {

    stickyCartWrapper.classList.remove(
      "d-none"
    );

  }

}


// =========================================================
// RESET CART UI
// =========================================================

function resetCart() {

  if (!stickyCartWrapper) {
    return;
  }


  stickyCartWrapper.style.display =
    "none";

}
// =========================================================
// 🛒 CART MODAL + CHECKOUT MODAL
// =========================================================


// =========================================================
// MODAL ELEMENTS
// =========================================================

const cartModalEl =
  document.getElementById("cartModal");

const checkoutModalEl =
  document.getElementById("checkoutModal");


// =========================================================
// BOOTSTRAP MODALS
// =========================================================

cartModal = cartModalEl
  ? new bootstrap.Modal(cartModalEl)
  : null;


checkoutModal = checkoutModalEl
  ? new bootstrap.Modal(checkoutModalEl)
  : null;


// =========================================================
// CART ICON
// =========================================================

const CartIcon =
  document.getElementById("cartIcon");


if (CartIcon) {

  CartIcon.addEventListener(
    "click",
    () => {

      if (!cartModal) {
        return;
      }

      if (cart.length === 0) {
        renderCart();
      }

      openModalWithLoader(cartModal);

    }
  );

}


// =========================================================
// STICKY CART
// =========================================================

const stickyCart =
  document.getElementById(
    "cartBadgeContainer"
  );


if (stickyCart) {

  stickyCart.addEventListener(
    "click",
    () => {

      if (!cartModal) {
        return;
      }

      if (cart.length === 0) {
        renderCart();
      }

      openModalWithLoader(cartModal);

    }
  );

}


// =========================================================
// CHECKOUT BUTTON
// =========================================================

const checkoutBtn =
  document.getElementById("checkoutBtn");


if (checkoutBtn) {

  checkoutBtn.addEventListener(
    "click",
    () => {


      // -----------------------------------------------
      // DO NOT CHECKOUT AN EMPTY CART
      // -----------------------------------------------

      if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
      }


      // -----------------------------------------------
      // CART MODAL MUST EXIST
      // -----------------------------------------------

      if (!cartModal) {

        console.error(
          "Cart modal was not found."
        );

        return;
      }


      // -----------------------------------------------
      // CHECKOUT MODAL MUST EXIST
      // -----------------------------------------------

      if (!checkoutModal) {

        console.error(
          "Checkout modal was not found."
        );

        return;
      }


      // -----------------------------------------------
      // CLOSE CART
      // -----------------------------------------------

      cartModal.hide();


      // -----------------------------------------------
      // WAIT FOR CART MODAL TO CLOSE
      // THEN OPEN CHECKOUT
      // -----------------------------------------------

      setTimeout(() => {

        openModalWithLoader(
          checkoutModal
        );

      }, 500);

    }
  );

}
// =========================================================
// CONTINUE TO CONFIRMATION
// =========================================================


// =========================================================
// CONTINUE TO CONFIRMATION
// =========================================================

const continueCheckoutBtn =
  document.getElementById("continueCheckoutBtn");

if (continueCheckoutBtn) {

  continueCheckoutBtn.addEventListener("click", () => {

    // Make sure cart has items
    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    // Build and validate confirmation
    const valid = buildConfirmation();

    if (!valid) {
      return;
    }

    // Mark checkout step as completed
    if (checkoutStep) {
      checkoutStep.classList.remove("active");
      checkoutStep.classList.add("completed");
    }

    // Activate confirmation step
    if (confirmationStep) {
      confirmationStep.classList.add("active");
    }

    // Update progress indicator
    if (checkoutProgress) {
      checkoutProgress.classList.add("confirmed");
    }

    // Animate checkout screen out
    if (checkoutScreen) {
      checkoutScreen.classList.add("checkout-exit");
    }

    // Show confirmation after animation
    setTimeout(() => {

      if (checkoutScreen) {
        checkoutScreen.style.display = "none";
      }

      if (confirmationScreen) {
        confirmationScreen.style.display = "block";

        requestAnimationFrame(() => {
          confirmationScreen.classList.add("active");
        });
      }

    }, 350);

  });

}
if (backToCheckoutBtn) {

  backToCheckoutBtn.addEventListener("click", () => {

    if (!confirmationScreen || !checkoutScreen) {
      return;
    }

    // Hide confirmation
    confirmationScreen.classList.remove("active");

    setTimeout(() => {

      confirmationScreen.style.display = "none";

      // Show checkout again
      checkoutScreen.style.display = "flex";
      checkoutScreen.classList.remove("checkout-exit");

      // Reset progress
      if (checkoutStep) {
        checkoutStep.classList.add("active");
        checkoutStep.classList.remove("completed");
      }

      if (confirmationStep) {
        confirmationStep.classList.remove("active");
      }

      if (checkoutProgress) {
        checkoutProgress.classList.remove("confirmed");
      }

    }, 350);

  });

}