document.addEventListener("DOMContentLoaded", () => {
    const localFrontend = ["", "localhost", "127.0.0.1"].includes(window.location.hostname);
    const apiBase = window.HELEMAYS_API_BASE || (localFrontend
        ? "http://localhost:5000/api"
        : "https://storebackend-production-f58c.up.railway.app/api");
    const readList = key => {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch {
            return [];
        }
    };
    const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
    const formatDate = value => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString([], { dateStyle: "medium" });
    };
    const statusClass = status => String(status || "New").toLowerCase().replace(/[^a-z-]/g, "");
    const source = localStorage.getItem("userName") ? localStorage : sessionStorage;
    const name = source.getItem("userName") || "";
    const email = (source.getItem("userEmail") || "").trim().toLowerCase();

    if (!name) {
        window.location.href = "./index.html";
        return;
    }

    const firstName = name.trim().split(/\s+/)[0];
    const savedOrdersByInvoice = new Map(readList("helemays.orders.v1").map(order => [order.invoice, order]));
    const orders = readList("helemays.trackedOrders.v1").map(tracked => {
        const savedOrder = savedOrdersByInvoice.get(tracked.invoice) || {};
        return {
            ...savedOrder,
            ...tracked,
            customer: savedOrder.customer,
            items: savedOrder.items || tracked.items || [],
            total: savedOrder.total ?? tracked.total,
            status: tracked.status || savedOrder.status || "New",
            messages: []
        };
    }).sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
    let messages = [];
    let cart = readList("helemays.cart.v1");

    document.getElementById("profileHeading").textContent = `Welcome back, ${firstName}`;
    document.getElementById("profileSubtitle").textContent = "Your orders, store messages and shopping bag are all here.";
    document.getElementById("profileName").textContent = name;
    document.getElementById("profileEmail").textContent = email || "Not available";

    const emptyState = (title, detail, link = "./index.html", linkText = "Visit the store") =>
        `<div class="empty-activity"><i class="fa-solid fa-shoe-prints" aria-hidden="true"></i><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p><a href="${link}">${escapeHtml(linkText)} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>`;

    function renderOrderRows(target, list) {
        if (!list.length) {
            target.innerHTML = emptyState("No orders yet", "Your purchases will appear here after you place an order.");
            return;
        }
        target.innerHTML = list.map(order => {
            const itemCount = (order.items || []).reduce((count, item) => count + Number(item.qty || 0), 0);
            const countLabel = itemCount ? `${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Order details";
            return `<a class="activity-row account-row-link" href="./orders.html?orderId=${encodeURIComponent(order.invoice)}"><span class="activity-row-main"><strong>${escapeHtml(order.invoice)}</strong><small>${escapeHtml(formatDate(order.createdAt))} · ${escapeHtml(countLabel)}</small></span><span class="activity-row-end"><span class="status-label ${escapeHtml(statusClass(order.status))}">${escapeHtml(order.status || "New")}</span><i class="fa-solid fa-angle-right" aria-hidden="true"></i></span></a>`;
        }).join("");
    }

    function renderMessages(target, list, limit) {
        const visibleMessages = [...list].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt)).slice(0, limit);
        if (!visibleMessages.length) {
            target.innerHTML = emptyState("No messages yet", "Store replies to your order conversations will appear here.", "./orders.html", "Go to order tracking");
            return;
        }
        target.innerHTML = visibleMessages.map(message => `<article class="message-${target.id === "profileRecentMessages" ? "preview" : "item"}"><strong>${escapeHtml(message.senderName || (message.sender === "admin" ? "Store team" : "You"))} · ${escapeHtml(message.invoice || "Order support")}</strong><p>${escapeHtml(message.text)}</p><time>${escapeHtml(formatDate(message.createdAt))}</time></article>`).join("");
    }

    function renderCart() {
        const totalItems = cart.reduce((count, item) => count + (Number(item.qty) || 0), 0);
        const total = cart.reduce((amount, item) => amount + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);
        document.getElementById("profileCartCount").textContent = String(totalItems);
        document.getElementById("sidebarCartCount").textContent = String(totalItems);
        document.getElementById("overviewCartSummary").textContent = totalItems
            ? `${totalItems} ${totalItems === 1 ? "item" : "items"} · GH₵ ${total.toFixed(2)}`
            : "Your bag is empty.";
        const list = document.getElementById("profileCartList");
        if (!cart.length) {
            list.innerHTML = emptyState("Your cart is empty", "Find your next pair in the store and it will appear here.");
            document.getElementById("profileCartTotal").innerHTML = "";
            return;
        }
        list.innerHTML = cart.map((item, index) => `<article class="activity-row"><span class="activity-row-main"><strong>${escapeHtml(item.name || "Store item")}</strong><small>Size ${escapeHtml(item.size || "N/A")} · ${escapeHtml(item.color || "N/A")} · Qty ${Number(item.qty || 0)}</small></span><span class="activity-row-end"><strong>GH₵ ${(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}</strong><span class="cart-row-actions"><button type="button" data-cart-change="-1" data-cart-index="${index}" aria-label="Decrease ${escapeHtml(item.name)} quantity"><i class="fa-solid fa-minus" aria-hidden="true"></i></button><button type="button" data-cart-change="1" data-cart-index="${index}" aria-label="Increase ${escapeHtml(item.name)} quantity"><i class="fa-solid fa-plus" aria-hidden="true"></i></button></span></span></article>`).join("");
        document.getElementById("profileCartTotal").innerHTML = `<span>Cart total</span><strong>GH₵ ${total.toFixed(2)}</strong>`;
    }

    function renderDashboard() {
        document.getElementById("profileOrderCount").textContent = String(orders.length);
        document.getElementById("sidebarOrderCount").textContent = String(orders.length);
        document.getElementById("profileMessageCount").textContent = String(messages.length);
        document.getElementById("sidebarMessageCount").textContent = String(messages.length);
        renderOrderRows(document.getElementById("profileRecentOrders"), orders.slice(0, 4));
        renderOrderRows(document.getElementById("profileOrdersList"), orders);
        renderMessages(document.getElementById("profileRecentMessages"), messages, 3);
        renderMessages(document.getElementById("profileMessagesList"), messages, messages.length);
        renderCart();
    }

    async function refreshActivity() {
        const refreshButton = document.getElementById("refreshDashboard");
        const feedback = document.getElementById("profileFeedback");
        refreshButton.disabled = true;
        feedback.textContent = "Refreshing store activity...";
        messages = [];
        await Promise.all(orders.map(async order => {
            const token = localStorage.getItem(`helemays.orderToken.${order.invoice}`);
            if (!token) return;
            const headers = { "X-Order-Token": token };
            try {
                const [orderResponse, messageResponse] = await Promise.all([
                    fetch(`${apiBase}/orders/track/${encodeURIComponent(order.invoice)}`, { headers }),
                    fetch(`${apiBase}/orders/${encodeURIComponent(order.invoice)}/messages`, { headers })
                ]);
                if (orderResponse.ok) {
                    const result = await orderResponse.json();
                    if (result.order) Object.assign(order, result.order);
                }
                if (messageResponse.ok) {
                    const result = await messageResponse.json();
                    order.messages = result.messages || [];
                    messages.push(...order.messages.map(message => ({ ...message, invoice: order.invoice })));
                }
            } catch (error) {
                console.warn(`Activity refresh failed for ${order.invoice}:`, error);
            }
        }));
        try {
            const updatedOrders = new Map(orders.map(order => [order.invoice, order]));
            const seenInvoices = new Set();
            const trackedOrders = readList("helemays.trackedOrders.v1").map(tracked => {
                const updated = updatedOrders.get(tracked.invoice);
                if (!updated) return tracked;
                seenInvoices.add(tracked.invoice);
                return { ...tracked, createdAt: updated.createdAt, status: updated.status };
            });
            orders.forEach(order => {
                if (!seenInvoices.has(order.invoice)) {
                    trackedOrders.unshift({ invoice: order.invoice, createdAt: order.createdAt, status: order.status });
                }
            });
            localStorage.setItem("helemays.trackedOrders.v1", JSON.stringify(trackedOrders.slice(0, 100)));
        } catch (error) {
            console.warn("Order activity could not be saved:", error);
        }
        cart = readList("helemays.cart.v1");
        renderDashboard();
        feedback.textContent = "";
        refreshButton.disabled = false;
    }

    document.body.addEventListener("click", event => {
        const navButton = event.target.closest("[data-profile-view]");
        if (navButton) {
            const view = navButton.dataset.profileView;
            document.querySelectorAll("[data-profile-panel]").forEach(panel => {
                panel.hidden = panel.dataset.profilePanel !== view;
            });
            document.querySelectorAll(".account-nav-item[data-profile-view]").forEach(button => {
                const active = button.dataset.profileView === view;
                button.classList.toggle("active", active);
                if (active) button.setAttribute("aria-current", "page");
                else button.removeAttribute("aria-current");
            });
            document.getElementById("accountBreadcrumb").textContent = ({ overview: "Overview", orders: "Orders", messages: "Messages", cart: "Cart", account: "Account details" })[view] || "Overview";
        }

        const quantityButton = event.target.closest("[data-cart-index]");
        if (quantityButton) {
            const index = Number(quantityButton.dataset.cartIndex);
            const item = cart[index];
            if (!item) return;
            item.qty = Number(item.qty || 0) + Number(quantityButton.dataset.cartChange || 0);
            if (item.qty <= 0) cart.splice(index, 1);
            try {
                localStorage.setItem("helemays.cart.v1", JSON.stringify(cart));
            } catch (error) {
                console.warn("Cart could not be saved on this device:", error);
            }
            renderCart();
        }
    });

    const signOut = () => {
        [localStorage, sessionStorage].forEach(storage => {
            storage.removeItem("helemays.authToken");
            storage.removeItem("userName");
            storage.removeItem("userEmail");
        });
        window.location.href = "./index.html";
    };
    document.getElementById("logoutButton").addEventListener("click", signOut);
    document.getElementById("profileSignOut").addEventListener("click", signOut);
    document.getElementById("refreshDashboard").addEventListener("click", refreshActivity);
    window.addEventListener("storage", event => {
        if (event.key === "helemays.cart.v1") {
            cart = readList("helemays.cart.v1");
            renderCart();
        }
    });

    renderDashboard();
    refreshActivity();
});