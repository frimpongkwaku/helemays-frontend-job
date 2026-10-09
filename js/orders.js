(() => {
    const localFrontend = ["", "localhost", "127.0.0.1"].includes(window.location.hostname);
    const API_BASE = window.HELEMAYS_API_BASE || (localFrontend
        ? "http://localhost:5000/api"
        : "https://storebackend-production-f58c.up.railway.app/api");
    const orderList = document.getElementById("ordersList");
    const orderDetails = document.getElementById("orderDetails");
    const message = document.getElementById("ordersMessage");
    const refreshButton = document.getElementById("refreshOrders");
    const query = new URLSearchParams(window.location.search);
    const requestedInvoice = query.get("orderId");
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const linkToken = fragment.get("token");
    let statusNotice = query.get("emailStatus") === "failed"
        ? "Your order is saved, but the invoice email could not be sent. You can track it here; contact the store if you need the invoice resent."
        : "";

    if (linkToken) {
        const validInvoice = /^[a-z0-9_-]{1,64}$/i.test(requestedInvoice || "");
        const validToken = /^[a-f0-9]{64}$/i.test(linkToken);
        if (validInvoice && validToken) {
            localStorage.setItem(`helemays.orderToken.${requestedInvoice}`, linkToken);
            try {
                const tracked = JSON.parse(localStorage.getItem("helemays.trackedOrders.v1") || "[]");
                if (Array.isArray(tracked) && !tracked.some(order => order.invoice === requestedInvoice)) {
                    tracked.unshift({ invoice: requestedInvoice, createdAt: new Date().toISOString(), status: "New" });
                    localStorage.setItem("helemays.trackedOrders.v1", JSON.stringify(tracked.slice(0, 100)));
                }
            } catch (error) {
                console.warn("Guest order shortcut could not be saved:", error);
            }
            statusNotice = "Secure tracking access saved on this device.";
        } else {
            statusNotice = "This order tracking link is invalid. Use the latest link from your invoice email.";
        }
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    const savedOrders = (() => {
        try {
            const orders = JSON.parse(localStorage.getItem("helemays.trackedOrders.v1") || "[]");
            return Array.isArray(orders) ? orders : [];
        } catch {
            return [];
        }
    })();

    const orders = savedOrders.map(item => ({ ...item, data: null, messages: [], error: "" }));
    let selectedInvoice = requestedInvoice || orders[0]?.invoice || "";
    let isRefreshing = false;

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
    }

    function statusClass(status) {
        return String(status || "New").toLowerCase();
    }

    function formatDate(value) {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "Order date unavailable" : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
    }

    function renderOrderList() {
        document.getElementById("ordersCount").textContent = orders.length;
        if (!orders.length) {
            orderList.innerHTML = '<div class="empty-state"><i class="fa-solid fa-box-open"></i><h2>No tracked orders</h2><p>Orders placed on this device will appear here.</p><a href="./index.html">Continue shopping</a></div>';
            return;
        }
        orderList.innerHTML = orders.map(order => {
            const status = order.data?.status || (order.error ? "Unavailable" : "Loading");
            return `<button class="order-list-item ${order.invoice === selectedInvoice ? "active" : ""}" type="button" data-order-invoice="${escapeHtml(order.invoice)}"><strong>${escapeHtml(order.invoice)}</strong><span class="order-list-meta"><time>${escapeHtml(formatDate(order.data?.createdAt || order.createdAt))}</time><span class="status-tag ${escapeHtml(statusClass(status))}">${escapeHtml(status)}</span></span></button>`;
        }).join("");
    }

    function renderDetail(order) {
        if (!order) {
            orderDetails.innerHTML = '<div class="empty-state"><i class="fa-solid fa-box-open"></i><h2>Track an order</h2><p>Choose an order from the list to see its current status.</p></div>';
            return;
        }
        if (order.error) {
            orderDetails.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h2>Could not load this order</h2><p>${escapeHtml(order.error)}</p></div>`;
            return;
        }
        if (!order.data) {
            orderDetails.innerHTML = '<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><h2>Loading order</h2><p>Checking the latest update from the store.</p></div>';
            return;
        }

        const messageDraft = document.getElementById("orderMessageInput")?.value || "";
        const data = order.data;
        const statuses = ["New", "Confirmed", "Preparing", "Completed"];
        const currentIndex = statuses.indexOf(data.status);
        const isCancelled = data.status === "Cancelled";
        const steps = statuses.map((status, index) => {
            const done = !isCancelled && currentIndex >= index;
            const icon = done ? "fa-check" : `${String(index + 1).padStart(2, "0")}`;
            return `<div class="progress-step ${done ? "done" : ""}"><span class="progress-dot">${icon.startsWith("fa-") ? `<i class="fa-solid ${icon}"></i>` : icon}</span><span>${status}</span></div>`;
        }).join("");
        const items = (data.items || []).map(item => `
            <div class="order-item">
                <div><div class="order-item-name">${escapeHtml(item.name)}</div><div class="order-item-meta">Size ${escapeHtml(item.size || "N/A")} · ${escapeHtml(item.color || "N/A")} · Qty ${Number(item.qty || 1)}</div></div>
                <span class="order-item-price">GH₵ ${(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}</span>
            </div>`).join("");

        orderDetails.innerHTML = `
            <article class="order-detail">
                <header class="order-detail-header">
                    <div><span class="eyebrow">ORDER TRACKING</span><h2>${escapeHtml(data.invoice)}</h2><p>Placed ${escapeHtml(formatDate(data.createdAt))}</p></div>
                    <span class="current-status ${escapeHtml(statusClass(data.status))}">${escapeHtml(data.status)}</span>
                </header>
                ${isCancelled ? '<div class="alert alert-danger mt-3 mb-0 py-2 small">This order has been cancelled. Contact the store if you need help.</div>' : `<div class="progress-track" aria-label="Order progress">${steps}</div>`}
                <div class="order-items">${items || '<p class="text-muted small mb-0">No item details available.</p>'}</div>
                <div class="order-total"><span>Order total</span><strong>GH₵ ${Number(data.total || 0).toFixed(2)}</strong></div>
                <div class="order-summary"><div class="summary-cell"><span>Delivery</span><strong>${escapeHtml(data.delivery || "Not specified")}</strong></div><div class="summary-cell"><span>Payment</span><strong>${escapeHtml(data.payment || "Not specified")}</strong></div></div>
                <section class="order-chat" aria-labelledby="orderChatTitle">
                    <div class="order-chat-heading"><div><span class="eyebrow">ORDER SUPPORT</span><h3 id="orderChatTitle">Message the store</h3></div><span class="chat-private"><i class="fa-solid fa-lock" aria-hidden="true"></i> Private</span></div>
                    <div class="order-chat-messages" id="orderChatMessages" aria-live="polite">${renderMessageRows(order)}</div>
                    <form id="orderMessageForm" class="order-chat-form">
                        <input id="orderMessageInput" name="text" type="text" maxlength="2000" placeholder="Ask us about this order..." value="${escapeHtml(messageDraft)}" required>
                        <button type="submit" aria-label="Send message"><i class="fa-solid fa-paper-plane"></i></button>
                    </form>
                    <p class="order-chat-error" id="orderChatError" role="status"></p>
                </section>
            </article>`;
    }

    function renderMessageRows(order) {
        if (!order.messages?.length) return '<p class="chat-empty">Ask a question about this order. Store replies will appear here.</p>';
        return order.messages.map(item => `<div class="order-chat-message ${item.sender === "customer" ? "sent" : "received"}"><p>${escapeHtml(item.text)}</p><time>${escapeHtml(formatDate(item.createdAt))}</time></div>`).join("");
    }

    function renderPendingCount() {
        const pendingCount = orders.filter(order => {
            const status = order.data?.status || order.status || "New";
            return !["Completed", "Cancelled"].includes(status);
        }).length;
        document.querySelectorAll("[data-orders-count]").forEach(badge => {
            badge.textContent = pendingCount > 99 ? "99+" : String(pendingCount);
            badge.hidden = pendingCount === 0;
        });
    }

    function render() {
        renderOrderList();
        renderDetail(orders.find(order => order.invoice === selectedInvoice));
    }

    async function loadOrder(order) {
        const token = localStorage.getItem(`helemays.orderToken.${order.invoice}`);
        if (!token) {
            order.error = "This order has no tracking key saved on this device. Open the Track order link from the checkout confirmation on the device used to place it.";
            return;
        }
        const response = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(order.invoice)}`, {
            headers: { "X-Order-Token": token }
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || "Order status is unavailable.");
        order.data = result.order;
        order.status = result.order.status;
        order.error = "";
        updateSavedOrderStatus(order.invoice, order.data.status, order.data.createdAt);
    }

    function updateSavedOrderStatus(invoice, status, createdAt) {
        try {
            const tracked = JSON.parse(localStorage.getItem("helemays.trackedOrders.v1") || "[]");
            const updated = tracked.map(order => order.invoice === invoice ? { ...order, status, createdAt } : order);
            localStorage.setItem("helemays.trackedOrders.v1", JSON.stringify(updated));
        } catch (error) {
            console.warn("Tracked order status could not be saved:", error);
        }
    }

    async function loadMessages(order) {
        const token = localStorage.getItem(`helemays.orderToken.${order.invoice}`);
        if (!token) return;
        const response = await fetch(`${API_BASE}/orders/${encodeURIComponent(order.invoice)}/messages`, {
            headers: { "X-Order-Token": token }
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || "Could not load order messages.");
        order.messages = result.messages || [];
    }

    async function refreshOrders() {
        if (isRefreshing) return;
        isRefreshing = true;
        refreshButton.disabled = true;
        message.textContent = statusNotice;
        await Promise.all(orders.map(async order => {
            try {
                await loadOrder(order);
            } catch (error) {
                order.error = error.message;
            }
        }));
        const selectedOrder = orders.find(order => order.invoice === selectedInvoice);
        if (selectedOrder && !selectedOrder.error) {
            try {
                await loadMessages(selectedOrder);
            } catch (error) {
                selectedOrder.messageError = error.message;
            }
        }
        if (!orders.length && !statusNotice) message.textContent = "Place an order to start tracking its progress.";
        render();
        renderPendingCount();
        refreshButton.disabled = false;
        isRefreshing = false;
    }

    orderList.addEventListener("click", event => {
        const button = event.target.closest("[data-order-invoice]");
        if (!button) return;
        selectedInvoice = button.dataset.orderInvoice;
        refreshOrders();
        const url = new URL(window.location.href);
        url.searchParams.set("orderId", selectedInvoice);
        history.replaceState(null, "", url);
        render();
    });

    orderDetails.addEventListener("submit", async event => {
        if (event.target.id !== "orderMessageForm") return;
        event.preventDefault();
        const order = orders.find(item => item.invoice === selectedInvoice);
        const input = document.getElementById("orderMessageInput");
        const submit = event.target.querySelector("button[type=submit]");
        const errorElement = document.getElementById("orderChatError");
        const text = input.value.trim();
        if (!order || !text) return;
        const token = localStorage.getItem(`helemays.orderToken.${order.invoice}`);
        submit.disabled = true;
        errorElement.textContent = "";
        try {
            const response = await fetch(`${API_BASE}/orders/${encodeURIComponent(order.invoice)}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Order-Token": token },
                body: JSON.stringify({ text })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || "Could not send your message.");
            order.messages.push(result.message);
            input.value = "";
            render();
        } catch (error) {
            errorElement.textContent = error.message;
        } finally {
            const activeSubmit = document.querySelector("#orderMessageForm button[type=submit]");
            if (activeSubmit) activeSubmit.disabled = false;
        }
    });

    refreshButton.addEventListener("click", refreshOrders);
    if (requestedInvoice && !orders.some(order => order.invoice === requestedInvoice)) {
        const token = localStorage.getItem(`helemays.orderToken.${requestedInvoice}`);
        if (token) orders.unshift({ invoice: requestedInvoice, createdAt: new Date().toISOString(), data: null, messages: [], error: "" });
    }
    render();
    refreshOrders();
    setInterval(refreshOrders, 10000);
    window.addEventListener("storage", event => {
        if (event.key === "helemays.trackedOrders.v1") window.location.reload();
    });
})();
