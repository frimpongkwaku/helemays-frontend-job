(() => {
    const PRODUCT_KEY = "helemays.products.v1";
    const BANNER_KEY = "helemays.banners.v1";
    const ORDER_KEY = "helemays.orders.v1";
    const CHAT_KEY = "helemays.chat.v1";

    const seedProducts = [
        { id: "shoe001", name: "Classic Leather sandals", category: "Sandals", price: 450, description: "Handcrafted leather derby shoe made for timeless everyday elegance.", images: ["./images/sandals2.png", "./images/derby-side.png", "./images/derby-top.png", "./images/derby-back.png"], colors: ["Black", "Brown"], sizes: [{ size: 40, stock: 5 }, { size: 41, stock: 7 }, { size: 42, stock: 0 }, { size: 43, stock: 3 }, { size: 44, stock: 2 }], featured: true, active: true },
        { id: "shoe002", name: "Classic Leather Shoe", category: "Formal", price: 450, description: "Handcrafted leather derby shoe made for timeless everyday elegance.", images: ["./images/shoes-removebg-preview.png", "./images/derby-side.png", "./images/derby-top.png", "./images/derby-back.png"], colors: ["Black", "Brown"], sizes: [{ size: 40, stock: 5 }, { size: 41, stock: 7 }, { size: 42, stock: 0 }, { size: 43, stock: 3 }, { size: 44, stock: 2 }], featured: true, active: true },
        { id: "shoe003", name: "Classic Leather Loafers", category: "Loafers", price: 450, description: "Handcrafted leather derby shoe made for timeless everyday elegance.", images: ["./images/loaffers.png", "./images/derby-side.png", "./images/derby-top.png", "./images/derby-back.png"], colors: ["Black", "Brown"], sizes: [{ size: 40, stock: 5 }, { size: 41, stock: 7 }, { size: 42, stock: 0 }, { size: 43, stock: 3 }, { size: 44, stock: 2 }], featured: true, active: true },
        { id: "shoe004", name: "Classic Leather Derby", category: "Slippers", price: 450, description: "Handcrafted leather derby shoe made for timeless everyday elegance.", images: ["./images/sandals2.png", "./images/derby-side.png", "./images/derby-top.png", "./images/derby-back.png"], colors: ["Black", "Brown"], sizes: [{ size: 40, stock: 5 }, { size: 41, stock: 7 }, { size: 42, stock: 0 }, { size: 43, stock: 3 }, { size: 44, stock: 2 }], featured: true, active: true },
        { id: "shoe005", name: "Classic Leather Boots", category: "Boots", price: 450, description: "Handcrafted leather derby shoe made for timeless everyday elegance.", images: ["./images/boots-removebg-preview.png", "./images/derby-side.png", "./images/derby-top.png", "./images/derby-back.png"], colors: ["Black", "Brown"], sizes: [{ size: 40, stock: 5 }, { size: 41, stock: 7 }, { size: 42, stock: 0 }, { size: 43, stock: 3 }, { size: 44, stock: 2 }], featured: true, active: true }
    ];

    const seedBanners = [
        { id: "campaign001", eyebrow: "HANDCRAFTED IN GHANA", title: "Crafted for", highlight: "every step.", description: "Locally crafted leather footwear made with quality, character and timeless style.", image: "./images/sandals2.png", imageAlt: "Handcrafted leather sandals", active: true, order: 0 },
        { id: "campaign002", eyebrow: "TIMELESS LEATHER", title: "Style that", highlight: "speaks.", description: "Premium leather loafers designed to bring effortless elegance to every occasion.", image: "./images/shoes-removebg-preview.png", imageAlt: "Premium leather loafers", active: true, order: 1 },
        { id: "campaign003", eyebrow: "BUILT WITH CHARACTER", title: "Walk with", highlight: "confidence.", description: "Carefully crafted leather shoes combining traditional craftsmanship with modern style.", image: "./images/boots-removebg-preview.png", imageAlt: "Premium leather shoes", active: true, order: 2 }
    ];

    const read = (key, fallback) => {
        try {
            const value = localStorage.getItem(key);
            return value === null ? structuredClone(fallback) : JSON.parse(value);
        } catch {
            return structuredClone(fallback);
        }
    };
    const products = [];
    const banners = read(BANNER_KEY, seedBanners);
    const orders = read(ORDER_KEY, []);
    const messages = read(CHAT_KEY, []);
    const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
    if (localStorage.getItem(BANNER_KEY) === null) write(BANNER_KEY, banners);
    if (localStorage.getItem(ORDER_KEY) === null) write(ORDER_KEY, orders);
    if (localStorage.getItem(CHAT_KEY) === null) write(CHAT_KEY, messages);

    const byId = id => products.find(item => item.id === id);
    const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
    const money = value => `GH₵ ${Number(value || 0).toFixed(2)}`;
    const toast = document.getElementById("toast");
    let toastTimer;
    let apiToken = "";
    let productImages = [];
    let primaryProductImageIndex = 0;

    const MAX_PRODUCT_IMAGES = 4;
    const MAX_IMAGE_BYTES = 550 * 1024;

    function blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error("The selected image could not be read."));
            reader.readAsDataURL(blob);
        });
    }

    async function compressImageFile(file) {
        if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image file.`);
        if (file.size > 15 * 1024 * 1024) throw new Error(`${file.name} is over the 15 MB upload limit.`);
        if (!window.createImageBitmap) throw new Error("This browser cannot prepare local photos. Try a recent browser.");

        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        const context = canvas.getContext("2d", { alpha: false });
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();

        for (const quality of [0.8, 0.68, 0.56]) {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
            if (blob && blob.size <= MAX_IMAGE_BYTES) return blobToDataUrl(blob);
        }
        throw new Error(`${file.name} could not be compressed below 550 KB. Choose a smaller image.`);
    }

    async function apiRequest(path, options = {}) {
        const headers = { "Content-Type": "application/json", ...options.headers };
        if (apiToken) headers.Authorization = `Bearer ${apiToken}`;
        const response = await fetch(`http://localhost:5000/api${path}`, { ...options, headers });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            const error = new Error(result.message || `Request failed (${response.status})`);
            error.code = result.code;
            throw error;
        }
        return result;
    }

    function productFromApi(product) {
        const images = Array.isArray(product.images) && product.images.length
            ? product.images
            : (product.image ? [product.image] : []);
        return {
            ...product,
            id: String(product._id || product.id),
            image: product.image || images[0] || "",
            images,
            active: product.available !== false,
            colors: product.colors || [],
            sizes: (product.sizes || []).map(size => {
                if (typeof size === "object") return { size: Number(size.size), stock: Number(size.stock || 0) };
                const [number, stock = 0] = String(size).split(/[,:]/).map(part => part.trim());
                return { size: Number(number), stock: Number(stock) || 0 };
            })
        };
    }

    function productToApi(product) {
        return {
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            image: product.images?.[0] || product.image,
            images: product.images?.length ? product.images : [product.image],
            colors: product.colors || [],
            sizes: (product.sizes || []).map(size => typeof size === "object" ? `${size.size}:${size.stock}` : String(size)),
            featured: product.featured,
            available: product.active
        };
    }

    function setBackendState(connected) {
        const state = document.getElementById("backendState");
        state.classList.toggle("offline", !connected);
        state.querySelector("span").textContent = connected ? "BACKEND CONNECTED" : "BACKEND OFFLINE";
    }

    function showLogin(show) {
        document.getElementById("adminLogin").hidden = !show;
        document.getElementById("adminApp").hidden = show;
    }

    async function loadBackendProducts() {
        const result = await apiRequest("/products/admin");
        products.splice(0, products.length, ...(result.products || []).map(productFromApi));
        renderProducts();
        document.getElementById("importLocalProducts").hidden = products.length > 0 || localStorage.getItem(PRODUCT_KEY) === null;
    }

    async function loadBackendOrders() {
        const [result, messageResult] = await Promise.all([
            apiRequest("/orders/admin"),
            apiRequest("/orders/admin/messages")
        ]);
        const backendOrders = (result.orders || []).map(order => ({ ...order, _backend: true }));
        const backendInvoices = new Set(backendOrders.map(order => order.invoice));
        const legacyOrders = read(ORDER_KEY, []).filter(order => !backendInvoices.has(order.invoice));
        orders.splice(0, orders.length, ...backendOrders, ...legacyOrders);
        const legacyMessages = messages.filter(message => !backendInvoices.has(message.threadId));
        const backendMessages = (messageResult.messages || []).map(message => ({
            ...message,
            id: String(message._id || message.id),
            threadId: message.invoice,
            createdAt: message.createdAt || message.updatedAt
        }));
        messages.splice(0, messages.length, ...backendMessages, ...legacyMessages);
        renderDashboard();
    }

    async function connectAdmin(token) {
        apiToken = token;
        await apiRequest("/users/admin-test");
        await loadBackendProducts();
        await loadBackendOrders();
        sessionStorage.setItem("helemays.adminToken", token);
        setBackendState(true);
        showLogin(false);
    }

    function notify(message) {
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
    }

    function renderOrders() {
        const query = document.getElementById("orderSearch")?.value.trim().toLowerCase() || "";
        const status = document.getElementById("orderStatusFilter")?.value || "all";
        const sortedOrders = [...orders].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
        const visible = sortedOrders.filter(order => {
            const customer = order.customer || {};
            const matchesQuery = `${order.invoice || order.id} ${customer.name} ${customer.phone}`.toLowerCase().includes(query);
            return matchesQuery && (status === "all" || order.status === status);
        });
        const rows = visible.map(order => {
            const customer = order.customer || {};
            const itemCount = (order.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);
            const statusClass = String(order.status || "New").toLowerCase();
            return `<tr><td><strong class="order-number">${escapeHtml(order.invoice || order.id)}</strong></td><td><strong class="order-customer">${escapeHtml(customer.name || "Guest")}</strong><small class="order-phone">${escapeHtml(customer.phone || "")}</small></td><td>${itemCount} item${itemCount === 1 ? "" : "s"}</td><td><span class="payment-tag">${escapeHtml(order.payment || "Not specified")}</span></td><td class="price-cell">${money(order.total)}</td><td><select class="order-status-select status-${escapeHtml(statusClass)}" data-order-status="${escapeHtml(order.id)}" aria-label="Update order status">${["New", "Confirmed", "Preparing", "Completed", "Cancelled"].map(value => `<option${order.status === value ? " selected" : ""}>${value}</option>`).join("")}</select></td><td>${new Date(order.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</td></tr>`;
        }).join("");
        document.getElementById("orderRows").innerHTML = rows;
        document.getElementById("ordersEmpty").hidden = visible.length > 0;
        document.getElementById("recentOrderRows").innerHTML = sortedOrders.slice(0, 5).map(order => `<tr><td><strong class="order-number">${escapeHtml(order.invoice || order.id)}</strong></td><td>${escapeHtml(order.customer?.name || "Guest")}</td><td>${escapeHtml(order.payment || "Not specified")}</td><td class="price-cell">${money(order.total)}</td><td><span class="status-pill status-${escapeHtml(String(order.status || "New").toLowerCase())}">${escapeHtml(order.status || "New")}</span></td></tr>`).join("");
        document.getElementById("recentOrdersEmpty").hidden = orders.length > 0;
        document.getElementById("orderNavCount").textContent = orders.length;
    }

    function getThreads() {
        const grouped = new Map();
        orders.forEach(order => {
            const threadId = order.invoice;
            if (!threadId) return;
            grouped.set(threadId, {
                id: threadId,
                name: order.customer?.name || "Customer",
                messages: [],
                unread: 0,
                order
            });
        });
        messages.forEach(message => {
            const threadId = message.threadId || "storefront";
            const thread = grouped.get(threadId) || { id: threadId, name: message.senderName || "Store visitor", messages: [], unread: 0 };
            if (message.senderName && !thread.order) thread.name = message.senderName;
            thread.messages.push(message);
            if (message.sender === "customer" && !message.read) thread.unread += 1;
            grouped.set(threadId, thread);
        });
        return [...grouped.values()].sort((first, second) => {
            const firstAt = first.messages.at(-1)?.createdAt || first.order?.createdAt;
            const secondAt = second.messages.at(-1)?.createdAt || second.order?.createdAt;
            return new Date(secondAt) - new Date(firstAt);
        });
    }

    let activeThread = "";

    function renderInbox() {
        const threads = getThreads();
        if (!activeThread && threads.length) activeThread = threads[0].id;
        document.getElementById("conversationCount").textContent = threads.length;
        document.getElementById("inboxEmpty").hidden = threads.length > 0;
        document.getElementById("conversationList").innerHTML = threads.map(thread => {
            const last = thread.messages.at(-1);
            return `<button class="conversation-item ${activeThread === thread.id ? "active" : ""}" type="button" data-thread="${escapeHtml(thread.id)}"><span class="conversation-avatar"><i class="fa-regular fa-user"></i></span><span class="conversation-summary"><strong>${escapeHtml(thread.name)}</strong><small>${escapeHtml(last?.text || "No messages")}</small></span><span class="conversation-meta"><time>${last ? new Date(last.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</time>${thread.unread ? `<b>${thread.unread}</b>` : ""}</span></button>`;
        }).join("");
        renderConversation();
    }

    function renderConversation() {
        const thread = getThreads().find(item => item.id === activeThread);
        const list = document.getElementById("adminMessageList");
        const input = document.getElementById("adminReplyInput");
        const submit = document.querySelector("#adminReplyForm button");
        if (!thread) {
            document.getElementById("conversationHeading").innerHTML = '<span class="conversation-avatar"><i class="fa-regular fa-user"></i></span><div><strong>Select a conversation</strong><small>Local browser inbox</small></div>';
            list.innerHTML = '<div class="conversation-placeholder">Choose a conversation to read the messages.</div>';
            input.disabled = true;
            submit.disabled = true;
            return;
        }
        document.getElementById("conversationHeading").innerHTML = `<span class="conversation-avatar"><i class="fa-regular fa-user"></i></span><div><strong>${escapeHtml(thread.name)}</strong><small>${thread.order ? `Order ${escapeHtml(thread.order.invoice)}` : "Browser-local support thread"}</small></div>`;
        list.innerHTML = thread.messages.length ? thread.messages.map(message => `<div class="message-bubble ${message.sender === "admin" ? "outgoing" : "incoming"}"><p>${escapeHtml(message.text)}</p><time>${new Date(message.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</time></div>`).join("") : '<div class="conversation-placeholder">No messages yet. Send a message to this customer about their order.</div>';
        list.scrollTop = list.scrollHeight;
        input.disabled = false;
        submit.disabled = false;
    }

    function renderDashboard() {
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === today);
        const todaySales = todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
        const pending = orders.filter(order => ["New", "Confirmed", "Preparing"].includes(order.status || "New")).length;
        const unread = messages.filter(message => message.sender === "customer" && !message.read).length;
        document.getElementById("ordersTodayMetric").textContent = todayOrders.length;
        document.getElementById("salesTodayMetric").textContent = money(todaySales);
        document.getElementById("ordersTodayNote").textContent = `${orders.length} total local order${orders.length === 1 ? "" : "s"}`;
        document.getElementById("pendingMetric").textContent = pending;
        document.getElementById("unreadMetric").textContent = unread;
        document.getElementById("inboxNavCount").textContent = unread;

        const paymentTotals = orders.reduce((totals, order) => {
            const method = order.payment || "Not specified";
            totals[method] = (totals[method] || 0) + Number(order.total || 0);
            return totals;
        }, {});
        const paymentEntries = Object.entries(paymentTotals).sort((first, second) => second[1] - first[1]);
        const maxPayment = Math.max(1, ...paymentEntries.map(([, total]) => total));
        document.getElementById("paymentChart").innerHTML = paymentEntries.length ? paymentEntries.map(([method, total], index) => `<div class="payment-row"><div><span>${escapeHtml(method)}</span><strong>${money(total)}</strong></div><span class="payment-track"><i class="payment-fill fill-${index % 3}" style="width:${Math.max(4, total / maxPayment * 100)}%"></i></span></div>`).join("") : '<div class="chart-empty">Payment totals will appear when the first checkout is recorded.</div>';
        document.getElementById("paymentLegend").innerHTML = paymentEntries.map(([method], index) => `<span><i class="legend-dot dot-${index % 3}"></i>${escapeHtml(method)}</span>`).join("");

        const activities = [
            ...orders.map(order => ({ type: "order", at: order.createdAt, title: `Order ${order.invoice || order.id}`, detail: `${order.customer?.name || "Customer"} · ${money(order.total)}` })),
            ...messages.map(message => ({ type: "chat", at: message.createdAt, title: message.sender === "admin" ? "Admin replied" : "Customer message", detail: `${message.senderName || "Customer"} · ${message.text}` }))
        ].sort((first, second) => new Date(second.at) - new Date(first.at)).slice(0, 8);
        document.getElementById("activityList").innerHTML = activities.length ? activities.map(activity => `<article class="activity-item"><span class="activity-icon ${activity.type}"><i class="fa-solid ${activity.type === "order" ? "fa-bag-shopping" : "fa-comment-dots"}"></i></span><div><strong>${escapeHtml(activity.title)}</strong><p>${escapeHtml(activity.detail)}</p><time>${new Date(activity.at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</time></div></article>`).join("") : '<div class="chart-empty">Checkout and support activity will appear here as it happens.</div>';
        renderOrders();
        renderInbox();
    }

    function renderProducts() {
        const query = document.getElementById("productSearch").value.trim().toLowerCase();
        const filter = document.getElementById("productFilter").value;
        const visible = products.filter(product => {
            const matchesText = `${product.name} ${product.category}`.toLowerCase().includes(query);
            const matchesFilter = filter === "all" || (filter === "active" && product.active !== false) || (filter === "inactive" && product.active === false) || (filter === "featured" && product.featured);
            return matchesText && matchesFilter;
        });

        document.getElementById("productRows").innerHTML = visible.map(product => {
            const stock = (product.sizes || []).reduce((sum, size) => sum + (Number(size.stock) || 0), 0);
            const image = (product.images && product.images[0]) || product.image || "./images/shoe-placeholder.png";
            const state = product.active === false ? "Inactive" : "Active";
            return `<tr>
                <td><div class="product-cell"><img class="product-thumb" src="${escapeHtml(image)}" alt="" onerror="this.src='./images/shoe-placeholder.png'"><span><span class="product-title">${escapeHtml(product.name)}</span><span class="product-subtitle">${escapeHtml(product.id)}${product.featured ? " · Featured" : ""}</span></span></div></td>
                <td>${escapeHtml(product.category)}</td><td class="price-cell">${money(product.price)}</td><td>${stock} units</td>
                <td><span class="status-pill ${state === "Inactive" ? "inactive" : ""}">${state}</span></td>
                <td><div class="row-actions"><button class="icon-button" type="button" data-action="edit-product" data-id="${escapeHtml(product.id)}" aria-label="Edit ${escapeHtml(product.name)}" title="Edit"><i class="fa-solid fa-pen"></i></button><button class="icon-button danger" type="button" data-action="delete-product" data-id="${escapeHtml(product.id)}" aria-label="Delete ${escapeHtml(product.name)}" title="Delete"><i class="fa-solid fa-trash"></i></button></div></td>
            </tr>`;
        }).join("");
        document.getElementById("productEmpty").hidden = visible.length > 0;
    }

    function renderBanners() {
        const sorted = [...banners].sort((first, second) => Number(first.order || 0) - Number(second.order || 0));
        document.getElementById("bannerGrid").innerHTML = sorted.map(banner => `
            <article class="campaign-card">
                <div class="campaign-image"><img src="${escapeHtml(banner.image)}" alt="${escapeHtml(banner.imageAlt)}" onerror="this.src='./images/shoe-placeholder.png'"><span class="campaign-order">SLIDE ${Number(banner.order || 0) + 1}</span></div>
                <div class="campaign-content"><span class="eyebrow">${escapeHtml(banner.eyebrow || "CAMPAIGN")}</span><h3>${escapeHtml(`${banner.title} ${banner.highlight || ""}`)}</h3><p>${escapeHtml(banner.description)}</p>
                    <div class="campaign-footer"><span class="status-pill ${banner.active ? "" : "inactive"}">${banner.active ? "Published" : "Draft"}</span><div class="campaign-actions"><button class="icon-button" type="button" data-action="edit-banner" data-id="${escapeHtml(banner.id)}" aria-label="Edit campaign" title="Edit"><i class="fa-solid fa-pen"></i></button><button class="icon-button" type="button" data-action="toggle-banner" data-id="${escapeHtml(banner.id)}" aria-label="${banner.active ? "Unpublish" : "Publish"} campaign" title="${banner.active ? "Unpublish" : "Publish"}"><i class="fa-solid ${banner.active ? "fa-eye-slash" : "fa-eye"}"></i></button><button class="icon-button danger" type="button" data-action="delete-banner" data-id="${escapeHtml(banner.id)}" aria-label="Delete campaign" title="Delete"><i class="fa-solid fa-trash"></i></button></div></div>
                </div>
            </article>`).join("");
        document.getElementById("bannerEmpty").hidden = sorted.length > 0;
    }

    function openProduct(product) {
        document.getElementById("productForm").reset();
        document.getElementById("productMessage").textContent = "";
        document.getElementById("productImageMessage").textContent = "";
        document.getElementById("productImageFiles").value = "";
        document.getElementById("productId").value = product?.id || "";
        document.getElementById("productDialogTitle").textContent = product ? "Edit product" : "Add product";
        document.getElementById("productName").value = product?.name || "";
        document.getElementById("productCategory").value = product?.category || "";
        document.getElementById("productPrice").value = product?.price ?? "";
        productImages = Array.isArray(product?.images) ? [...product.images] : (product?.image ? [product.image] : []);
        primaryProductImageIndex = 0;
        document.getElementById("productImage").value = productImages[0] || product?.image || "";
        renderProductImageThumbnails();
        document.getElementById("productDescription").value = product?.description || "";
        document.getElementById("productColors").value = (product?.colors || []).join(", ");
        document.getElementById("productSizes").value = (product?.sizes || []).map(size => `${size.size}, ${size.stock}`).join("\n");
        document.getElementById("productActive").checked = product?.active !== false;
        document.getElementById("productFeatured").checked = Boolean(product?.featured);
        document.getElementById("productDialog").showModal();
    }

    function openBanner(banner) {
        document.getElementById("bannerForm").reset();
        document.getElementById("bannerMessage").textContent = "";
        document.getElementById("bannerImageMessage").textContent = "";
        document.getElementById("bannerImageFile").value = "";
        document.getElementById("bannerId").value = banner?.id || "";
        document.getElementById("bannerDialogTitle").textContent = banner ? "Edit campaign" : "Add campaign";
        document.getElementById("bannerImage").value = banner?.image || "";
        renderBannerImagePreview();
        document.getElementById("bannerEyebrow").value = banner?.eyebrow || "";
        document.getElementById("bannerAlt").value = banner?.imageAlt || "";
        document.getElementById("bannerTitle").value = banner?.title || "";
        document.getElementById("bannerHighlight").value = banner?.highlight || "";
        document.getElementById("bannerDescription").value = banner?.description || "";
        document.getElementById("bannerOrder").value = banner?.order ?? banners.length;
        document.getElementById("bannerActive").checked = banner?.active !== false;
        document.getElementById("bannerDialog").showModal();
    }

    function renderProductImageThumbnails() {
        const container = document.getElementById("productImageThumbnails");
        container.innerHTML = productImages.map((image, index) => `
            <div class="image-thumbnail-wrap">
                <button class="image-thumbnail ${index === primaryProductImageIndex ? "is-primary" : ""}" type="button" data-image-index="${index}" aria-label="${index === primaryProductImageIndex ? "Primary image" : "Select as primary image"} ${index + 1}">
                    <img src="${escapeHtml(image)}" alt="Product photo ${index + 1}">
                    ${index === primaryProductImageIndex ? '<span class="primary-tag">MAIN</span>' : ""}
                </button>
                <button class="remove-thumbnail" type="button" data-remove-image="${index}" aria-label="Remove photo ${index + 1}" title="Remove photo"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
            </div>`).join("");
    }

    function renderBannerImagePreview() {
        const source = document.getElementById("bannerImage").value.trim();
        const preview = document.getElementById("bannerImagePreview");
        const image = document.getElementById("bannerImagePreviewImage");
        preview.hidden = !source;
        image.onerror = () => { preview.hidden = true; };
        image.onload = () => { preview.hidden = false; };
        image.src = source;
    }

    async function processProductImageFiles(files) {
        const selectedFiles = [...files].filter(file => file.type.startsWith("image/"));
        if (!selectedFiles.length) return;
        const slots = MAX_PRODUCT_IMAGES - productImages.length;
        const message = document.getElementById("productImageMessage");
        if (slots <= 0) {
            message.textContent = `A product can have up to ${MAX_PRODUCT_IMAGES} photos.`;
            return;
        }
        message.classList.remove("is-error");
        message.textContent = "Preparing photos...";
        for (const file of selectedFiles.slice(0, slots)) {
            try {
                const dataUrl = await compressImageFile(file);
                productImages.push(dataUrl);
                if (productImages.length === 1) {
                    primaryProductImageIndex = 0;
                    document.getElementById("productImage").value = dataUrl;
                }
            } catch (error) {
                message.classList.add("is-error");
                message.textContent = error.message;
                break;
            }
        }
        if (!message.classList.contains("is-error")) message.textContent = `${productImages.length} of ${MAX_PRODUCT_IMAGES} photos selected. Click a thumbnail to choose the main photo.`;
        renderProductImageThumbnails();
    }

    async function processBannerImageFile(file) {
        const message = document.getElementById("bannerImageMessage");
        message.classList.remove("is-error");
        message.textContent = "Preparing photo...";
        try {
            document.getElementById("bannerImage").value = await compressImageFile(file);
            renderBannerImagePreview();
            message.textContent = "Campaign photo ready.";
        } catch (error) {
            message.classList.add("is-error");
            message.textContent = error.message;
        }
    }

    function connectImageDropzone(dropzoneId, inputId, onFiles, multiple = false) {
        const dropzone = document.getElementById(dropzoneId);
        const input = document.getElementById(inputId);
        input.multiple = multiple;
        input.addEventListener("change", () => {
            onFiles(multiple ? input.files : input.files[0] ? [input.files[0]] : []);
            input.value = "";
        });
        ["dragenter", "dragover"].forEach(type => dropzone.addEventListener(type, event => {
            event.preventDefault();
            dropzone.classList.add("is-dragging");
        }));
        ["dragleave", "drop"].forEach(type => dropzone.addEventListener(type, event => {
            event.preventDefault();
            dropzone.classList.remove("is-dragging");
        }));
        dropzone.addEventListener("drop", event => onFiles(multiple ? event.dataTransfer.files : event.dataTransfer.files[0] ? [event.dataTransfer.files[0]] : []));
        dropzone.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                input.click();
            }
        });
    }

    connectImageDropzone("productImageDropzone", "productImageFiles", processProductImageFiles, true);
    connectImageDropzone("bannerImageDropzone", "bannerImageFile", files => {
        if (files[0]) processBannerImageFile(files[0]);
    });

    document.getElementById("productImageThumbnails").addEventListener("click", event => {
        const removeButton = event.target.closest("[data-remove-image]");
        if (removeButton) {
            const removedIndex = Number(removeButton.dataset.removeImage);
            productImages.splice(removedIndex, 1);
            if (primaryProductImageIndex === removedIndex) primaryProductImageIndex = Math.max(0, removedIndex - 1);
            else if (primaryProductImageIndex > removedIndex) primaryProductImageIndex -= 1;
            document.getElementById("productImage").value = productImages[primaryProductImageIndex] || "";
            renderProductImageThumbnails();
            return;
        }
        const thumbnail = event.target.closest("[data-image-index]");
        if (!thumbnail) return;
        primaryProductImageIndex = Number(thumbnail.dataset.imageIndex);
        document.getElementById("productImage").value = productImages[primaryProductImageIndex] || "";
        renderProductImageThumbnails();
    });

    document.getElementById("productImage").addEventListener("change", event => {
        const source = event.currentTarget.value.trim();
        if (!source) return;
        if (primaryProductImageIndex < productImages.length) productImages[primaryProductImageIndex] = source;
        else productImages.push(source);
        renderProductImageThumbnails();
    });
    document.getElementById("bannerImage").addEventListener("input", renderBannerImagePreview);

    document.getElementById("productSearch").addEventListener("input", renderProducts);
    document.getElementById("productFilter").addEventListener("change", renderProducts);
    document.getElementById("adminLoginForm").addEventListener("submit", async event => {
        event.preventDefault();
        const feedback = document.getElementById("adminLoginMessage");
        const resendButton = document.getElementById("adminResendVerification");
        const submit = event.currentTarget.querySelector("button[type=submit]");
        resendButton.hidden = true;
        feedback.textContent = "Signing in...";
        submit.disabled = true;
        setBackendState(false);
        try {
            const result = await apiRequest("/users/login", {
                method: "POST",
                body: JSON.stringify({
                    email: document.getElementById("adminEmail").value.trim(),
                    password: document.getElementById("adminPassword").value
                })
            });
            if (result.user?.role !== "admin") throw new Error("This account does not have admin access.");
            await connectAdmin(result.token);
            feedback.textContent = "";
        } catch (error) {
            apiToken = "";
            setBackendState(false);
            feedback.textContent = error.message;
            resendButton.hidden = error.code !== "EMAIL_NOT_VERIFIED";
        } finally {
            submit.disabled = false;
        }
    });
    document.getElementById("adminResendVerification").addEventListener("click", async event => {
        const button = event.currentTarget;
        const feedback = document.getElementById("adminLoginMessage");
        const email = document.getElementById("adminEmail").value.trim();
        if (!email) {
            feedback.textContent = "Enter your admin email address first.";
            return;
        }
        button.disabled = true;
        feedback.textContent = "Requesting a verification email...";
        try {
            const result = await apiRequest("/users/resend-verification", {
                method: "POST",
                body: JSON.stringify({ email })
            });
            feedback.textContent = result.message || "If an unverified account matches that email, a verification link will be sent.";
        } catch (error) {
            feedback.textContent = error.message;
        } finally {
            button.disabled = false;
        }
    });
    document.getElementById("adminLogout").addEventListener("click", () => {
        sessionStorage.removeItem("helemays.adminToken");
        apiToken = "";
        products.splice(0);
        renderProducts();
        setBackendState(false);
        showLogin(true);
    });
    document.getElementById("importLocalProducts").addEventListener("click", async event => {
        const button = event.currentTarget;
        const legacyProducts = read(PRODUCT_KEY, []);
        if (!legacyProducts.length) {
            button.hidden = true;
            return;
        }
        button.disabled = true;
        try {
            for (const product of legacyProducts) {
                await apiRequest("/products", {
                    method: "POST",
                    body: JSON.stringify(productToApi(product))
                });
            }
            await loadBackendProducts();
            notify(`${legacyProducts.length} local product${legacyProducts.length === 1 ? "" : "s"} imported.`);
        } catch (error) {
            await loadBackendProducts().catch(() => {});
            notify(`Catalog import stopped: ${error.message}`);
        } finally {
            button.disabled = false;
        }
    });
    document.getElementById("orderSearch").addEventListener("input", renderOrders);
    document.getElementById("orderStatusFilter").addEventListener("change", renderOrders);
    document.getElementById("refreshDashboard").addEventListener("click", async () => {
        try {
            if (apiToken) await loadBackendOrders();
            else renderDashboard();
        } catch (error) {
            notify(error.message);
        }
    });
    document.getElementById("addProductButton").addEventListener("click", () => openProduct());
    document.getElementById("addBannerButton").addEventListener("click", () => openBanner());
    document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => document.getElementById(button.dataset.close).close()));

    document.querySelectorAll(".side-link").forEach(button => button.addEventListener("click", () => {
        document.querySelectorAll(".side-link").forEach(link => link.classList.toggle("active", link === button));
        document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === `${button.dataset.view}View`));
        const titles = {
            overview: ["Overview", "OPERATIONS"],
            orders: ["Orders", "FULFILMENT"],
            inbox: ["Customer inbox", "SUPPORT"],
            products: ["Products", "CATALOG"],
            campaigns: ["Hero campaigns", "STOREFRONT"]
        };
        const [title, breadcrumb] = titles[button.dataset.view];
        document.getElementById("pageTitle").textContent = title;
        document.getElementById("breadcrumb").textContent = breadcrumb;
        if (button.dataset.view === "inbox" && activeThread) {
            messages.forEach(message => {
                if ((message.threadId || "storefront") === activeThread && message.sender === "customer") message.read = true;
            });
            write(CHAT_KEY, messages);
            renderDashboard();
        }
    }));

    document.querySelectorAll("[data-open-view]").forEach(button => button.addEventListener("click", () => {
        document.querySelector(`.side-link[data-view="${button.dataset.openView}"]`)?.click();
    }));

    document.getElementById("orderRows").addEventListener("change", async event => {
        const select = event.target.closest("[data-order-status]");
        if (!select) return;
        const order = orders.find(item => item.id === select.dataset.orderStatus);
        if (!order) return;
        const previousStatus = order.status;
        order.status = select.value;
        if (order._backend) {
            select.disabled = true;
            try {
                const result = await apiRequest(`/orders/admin/${encodeURIComponent(order.id)}/status`, {
                    method: "PATCH",
                    body: JSON.stringify({ status: order.status })
                });
                Object.assign(order, result.order, { _backend: true });
            } catch (error) {
                order.status = previousStatus;
                select.value = previousStatus;
                notify(error.message);
                return;
            } finally {
                select.disabled = false;
            }
        } else {
            write(ORDER_KEY, read(ORDER_KEY, []).map(item => item.id === order.id ? { ...item, status: order.status } : item));
        }
        renderDashboard();
        notify(`Order ${order.invoice || order.id} marked ${order.status.toLowerCase()}.`);
    });

    document.getElementById("conversationList").addEventListener("click", async event => {
        const button = event.target.closest("[data-thread]");
        if (!button) return;
        activeThread = button.dataset.thread;
        const order = orders.find(item => item.invoice === activeThread && item._backend);
        if (order) {
            try {
                await apiRequest(`/orders/admin/${encodeURIComponent(activeThread)}/messages/read`, { method: "PATCH" });
                await loadBackendOrders();
            } catch (error) {
                notify(error.message);
            }
            return;
        }
        messages.forEach(message => {
            if ((message.threadId || "storefront") === activeThread && message.sender === "customer") message.read = true;
        });
        write(CHAT_KEY, messages);
        renderDashboard();
    });

    document.getElementById("adminReplyForm").addEventListener("submit", async event => {
        event.preventDefault();
        const input = document.getElementById("adminReplyInput");
        const text = input.value.trim();
        if (!text || !activeThread) return;
        const backendOrder = orders.find(order => order.invoice === activeThread && order._backend);
        if (backendOrder) {
            const submit = event.currentTarget.querySelector("button[type=submit]");
            submit.disabled = true;
            try {
                await apiRequest(`/orders/admin/${encodeURIComponent(activeThread)}/messages`, {
                    method: "POST",
                    body: JSON.stringify({ text })
                });
                input.value = "";
                await loadBackendOrders();
                notify("Reply sent to the customer's order page.");
            } catch (error) {
                notify(error.message);
            } finally {
                submit.disabled = false;
            }
            return;
        }
        messages.push({ id: crypto.randomUUID(), threadId: activeThread, sender: "admin", senderName: "Helemays Support", text, createdAt: new Date().toISOString(), read: true });
        write(CHAT_KEY, messages);
        input.value = "";
        renderDashboard();
        notify("Reply sent to this browser's storefront chat.");
    });

    document.getElementById("productRows").addEventListener("click", async event => {
        const button = event.target.closest("[data-action]");
        if (!button) return;
        const product = byId(button.dataset.id);
        if (button.dataset.action === "edit-product") openProduct(product);
        if (button.dataset.action === "delete-product" && product && window.confirm(`Delete ${product.name}?`)) {
            try {
                const result = await apiRequest(`/products/${encodeURIComponent(product.id)}`, { method: "DELETE" });
                products[products.indexOf(product)] = productFromApi(result.product);
                renderProducts();
                notify("Product deactivated in the catalog.");
            } catch (error) {
                notify(error.message);
            }
        }
    });

    document.getElementById("bannerGrid").addEventListener("click", event => {
        const button = event.target.closest("[data-action]");
        if (!button) return;
        const banner = banners.find(item => item.id === button.dataset.id);
        if (!banner) return;
        if (button.dataset.action === "edit-banner") openBanner(banner);
        if (button.dataset.action === "toggle-banner") {
            banner.active = !banner.active;
            write(BANNER_KEY, banners);
            renderBanners();
            notify(banner.active ? "Campaign published to this browser's storefront." : "Campaign moved to draft.");
        }
        if (button.dataset.action === "delete-banner" && window.confirm("Delete this campaign?")) {
            banners.splice(banners.indexOf(banner), 1);
            write(BANNER_KEY, banners);
            renderBanners();
            notify("Campaign deleted.");
        }
    });

    document.getElementById("productForm").addEventListener("submit", async event => {
        event.preventDefault();
        const sizes = document.getElementById("productSizes").value.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
            const [size, stock] = line.split(/[,:]/).map(part => part.trim());
            return { size: Number(size), stock: Number(stock || 0) };
        });
        if (!sizes.length || sizes.some(size => !Number.isFinite(size.size) || !Number.isFinite(size.stock) || size.stock < 0)) {
            document.getElementById("productMessage").textContent = "Enter each size and stock as: size, stock.";
            return;
        }
        const id = document.getElementById("productId").value;
        const existing = id ? byId(id) : null;
        const primaryImage = document.getElementById("productImage").value.trim();
        const galleryImages = [primaryImage, ...productImages.filter(image => image && image !== primaryImage)];
        const product = {
            ...(existing || {}),
            name: document.getElementById("productName").value.trim(),
            category: document.getElementById("productCategory").value.trim(),
            price: Number(document.getElementById("productPrice").value),
            description: document.getElementById("productDescription").value.trim(),
            image: primaryImage,
            images: galleryImages,
            colors: document.getElementById("productColors").value.split(",").map(color => color.trim()).filter(Boolean),
            sizes,
            active: document.getElementById("productActive").checked,
            featured: document.getElementById("productFeatured").checked
        };
        const submit = event.currentTarget.querySelector("button[type=submit]");
        submit.disabled = true;
        document.getElementById("productMessage").textContent = "Saving product...";
        try {
            const result = await apiRequest(existing ? `/products/${encodeURIComponent(id)}` : "/products", {
                method: existing ? "PUT" : "POST",
                body: JSON.stringify(productToApi(product))
            });
            const saved = productFromApi(result.product);
            if (existing) products[products.indexOf(existing)] = saved;
            else products.unshift(saved);
            renderProducts();
            document.getElementById("productDialog").close();
            notify(existing ? "Product updated." : "Product added.");
        } catch (error) {
            document.getElementById("productMessage").textContent = error.message;
        } finally {
            submit.disabled = false;
        }
    });

    document.getElementById("bannerForm").addEventListener("submit", event => {
        event.preventDefault();
        const id = document.getElementById("bannerId").value || `campaign-${crypto.randomUUID()}`;
        const existing = banners.find(item => item.id === id);
        const banner = {
            ...(existing || {}), id,
            image: document.getElementById("bannerImage").value.trim(),
            eyebrow: document.getElementById("bannerEyebrow").value.trim(),
            imageAlt: document.getElementById("bannerAlt").value.trim(),
            title: document.getElementById("bannerTitle").value.trim(),
            highlight: document.getElementById("bannerHighlight").value.trim(),
            description: document.getElementById("bannerDescription").value.trim(),
            order: Number(document.getElementById("bannerOrder").value) || 0,
            active: document.getElementById("bannerActive").checked
        };
        if (existing) banners[banners.indexOf(existing)] = banner;
        else banners.push(banner);
        write(BANNER_KEY, banners);
        renderBanners();
        document.getElementById("bannerDialog").close();
        notify(existing ? "Campaign updated." : "Campaign added.");
    });

    window.addEventListener("storage", event => {
        if (event.key === BANNER_KEY) {
            banners.splice(0, banners.length, ...read(BANNER_KEY, []));
            renderBanners();
        }
        if (event.key === ORDER_KEY) {
            orders.splice(0, orders.length, ...read(ORDER_KEY, []));
            renderDashboard();
            notify("A storefront order was received.");
        }
        if (event.key === CHAT_KEY) {
            messages.splice(0, messages.length, ...read(CHAT_KEY, []));
            renderDashboard();
        }
    });

    renderProducts();
    renderBanners();
    renderDashboard();

    const savedToken = sessionStorage.getItem("helemays.adminToken");
    if (savedToken) {
        connectAdmin(savedToken).catch(error => {
            sessionStorage.removeItem("helemays.adminToken");
            apiToken = "";
            setBackendState(false);
            showLogin(true);
            document.getElementById("adminLoginMessage").textContent = error.message;
        });
    } else {
        setBackendState(false);
        showLogin(true);
    }
    setInterval(() => {
        if (apiToken) loadBackendOrders().catch(error => console.warn("Admin order refresh failed:", error));
    }, 15000);
})();
