const localFrontend = ["", "localhost", "127.0.0.1"].includes(window.location.hostname);
const API_BASE = window.HELEMAYS_API_BASE || (localFrontend
    ? "http://localhost:5000/api"
    : "https://storebackend-production-f58c.up.railway.app/api");
const modal = document.getElementById("userModal");
const authFeedback = document.getElementById("authFeedback");
const authTabs = document.querySelector(".auth-tabs");
const resendVerificationButton = document.getElementById("resendVerificationButton");
const resetCodeFields = document.getElementById("resetCodeFields");
let pendingVerificationEmail = "";

function getStoredUser() {
    const source = localStorage.getItem("userName") ? localStorage : sessionStorage;
    const name = source.getItem("userName") || "";
    const email = source.getItem("userEmail") || "";
    return { name, email };
}

function persistAuthSession(token, user) {
    if (token) localStorage.setItem("helemays.authToken", token);
    if (user?.name) localStorage.setItem("userName", user.name);
    if (user?.email) localStorage.setItem("userEmail", user.email);
    sessionStorage.setItem("helemays.authToken", token || sessionStorage.getItem("helemays.authToken") || "");
    sessionStorage.setItem("userName", user?.name || sessionStorage.getItem("userName") || "");
    sessionStorage.setItem("userEmail", user?.email || sessionStorage.getItem("userEmail") || "");
    updateNavAccountState();
}

function clearAuthSession() {
    localStorage.removeItem("helemays.authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("helemays.authToken");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    updateNavAccountState();
}

function updateNavAccountState() {
    const accountButton = document.querySelector(".nav-account-link");
    if (!accountButton) return;

    const { name } = getStoredUser();
    if (name) {
        const firstName = name.trim().split(/\s+/)[0];
        accountButton.innerHTML = `<i class="fa-regular fa-user" aria-hidden="true"></i><span>Hi, ${firstName}</span>`;
        accountButton.type = "button";
        accountButton.removeAttribute("data-bs-toggle");
        accountButton.removeAttribute("data-bs-target");
        accountButton.setAttribute("aria-label", "Open your profile");
        accountButton.title = "Open your profile";
        accountButton.onclick = event => {
            event.preventDefault();
            window.location.href = "./profile.html";
        };
        return;
    }

    accountButton.innerHTML = '<i class="fa-regular fa-user" aria-hidden="true"></i><span>Sign in</span>';
    accountButton.type = "button";
    accountButton.setAttribute("data-bs-toggle", "modal");
    accountButton.setAttribute("data-bs-target", "#userModal");
    accountButton.setAttribute("aria-label", "Open sign in");
    accountButton.title = "Sign in";
    accountButton.onclick = null;
}

function setAuthFeedback(message, success = false) {
    authFeedback.textContent = message;
    authFeedback.classList.toggle("success", success);
}

function redirectToStorefront() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.classList.remove("fade-out");
        loader.style.display = "flex";
    }

    window.bootstrap?.Modal.getOrCreateInstance(modal).hide();
    window.setTimeout(() => window.location.assign("./index.html"), 350);
}

async function authRequest(endpoint, payload) {
    let response;
    try {
        response = await fetch(`${API_BASE}/users/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch {
        throw new Error("We could not reach the store. Check your connection and try again.");
    }

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(result.message || "That request could not be completed.");
        error.code = result.code;
        throw error;
    }
    return result;
}

function switchAuthView(view) {
    document.querySelectorAll("[data-auth-panel]").forEach(panel => {
        panel.hidden = panel.dataset.authPanel !== view;
    });
    document.querySelectorAll(".auth-tabs [data-auth-view]").forEach(tab => {
        const selected = tab.dataset.authView === view;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", String(selected));
    });
    authTabs.hidden = view === "reset";
    document.getElementById("userModalLabel").textContent = ({
        login: "Welcome back",
        register: "Create your account",
        reset: "Reset your password"
    })[view] || "Welcome back";
    document.querySelector(".auth-intro p").textContent = ({
        login: "Sign in to manage your orders and account.",
        register: "Create an account to keep your orders together.",
        reset: "We will email you a short code to choose a new password."
    })[view] || "Sign in to manage your orders and account.";
    setAuthFeedback("");
    resendVerificationButton.hidden = true;
}

modal.addEventListener("click", event => {
    const passwordToggle = event.target.closest("[data-toggle-password]");
    if (passwordToggle) {
        const passwordInput = document.getElementById(passwordToggle.dataset.togglePassword);
        if (passwordInput) {
            const showPassword = passwordInput.type === "password";
            passwordInput.type = showPassword ? "text" : "password";
            passwordToggle.setAttribute("aria-pressed", String(showPassword));
            passwordToggle.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
            passwordToggle.innerHTML = `<i class="fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}" aria-hidden="true"></i>`;
        }
        return;
    }

    const button = event.target.closest("[data-auth-view]");
    if (!button) return;

    if (button.dataset.authView === "reset") {
            const loginEmail = document.getElementById("loginEmail").value.trim();
            if (loginEmail) document.getElementById("resetEmail").value = loginEmail;
            resetCodeFields.hidden = true;
            document.getElementById("resetCode").required = false;
            document.getElementById("resetPassword").required = false;
    }
    switchAuthView(button.dataset.authView);
});

document.getElementById("loginForm").addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = event.submitter;
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    setAuthFeedback("Signing you in...", true);
    if (submitButton) submitButton.disabled = true;

    try {
        const result = await authRequest("login", { email, password });
        persistAuthSession(result.token, result.user);
        redirectToStorefront();
    } catch (error) {
        setAuthFeedback(error.message);
        if (error.code === "EMAIL_NOT_VERIFIED") {
            pendingVerificationEmail = email;
            resendVerificationButton.hidden = false;
        }
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
});

document.getElementById("registerForm").addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = event.submitter;
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    setAuthFeedback("Creating your account...", true);
    if (submitButton) submitButton.disabled = true;

    try {
        const result = await authRequest("", { name, email, password });
        pendingVerificationEmail = email;
        localStorage.setItem("pendingRegistrationName", name);
        document.getElementById("loginEmail").value = email;
        setAuthFeedback(result.message, true);
        resendVerificationButton.hidden = false;

        if (!window.location.pathname.toLowerCase().endsWith("index.html")) {
            window.location.href = "./index.html";
            return;
        }
    } catch (error) {
        setAuthFeedback(error.message);
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
});

resendVerificationButton.addEventListener("click", async () => {
    const email = pendingVerificationEmail || document.getElementById("loginEmail").value.trim().toLowerCase();
    if (!email) {
        setAuthFeedback("Enter the email address you registered with.");
        return;
    }
    resendVerificationButton.disabled = true;
    try {
        const result = await authRequest("resend-verification", { email });
        setAuthFeedback(result.message, true);
    } catch (error) {
        setAuthFeedback(error.message);
    } finally {
        resendVerificationButton.disabled = false;
    }
});

document.getElementById("sendResetCodeButton").addEventListener("click", async event => {
    const button = event.currentTarget;
    const emailInput = document.getElementById("resetEmail");
    if (!emailInput.reportValidity()) return;
    button.disabled = true;
    try {
        const result = await authRequest("forgot-password", { email: emailInput.value.trim().toLowerCase() });
        resetCodeFields.hidden = false;
        document.getElementById("resetCode").required = true;
        document.getElementById("resetPassword").required = true;
        setAuthFeedback(result.message, true);
    } catch (error) {
        setAuthFeedback(error.message);
    } finally {
        button.disabled = false;
    }
});

document.getElementById("resetForm").addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = event.submitter;
    const email = document.getElementById("resetEmail").value.trim().toLowerCase();
    const code = document.getElementById("resetCode").value.trim();
    const password = document.getElementById("resetPassword").value;
    if (submitButton) submitButton.disabled = true;
    setAuthFeedback("Updating your password...", true);
    try {
        const result = await authRequest("reset-password", { email, code, password });
        switchAuthView("login");
        document.getElementById("loginEmail").value = email;
        setAuthFeedback(result.message, true);
    } catch (error) {
        setAuthFeedback(error.message);
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
});

updateNavAccountState();

if (new URLSearchParams(window.location.search).get("auth") === "login") {
    window.bootstrap?.Modal.getOrCreateInstance(modal).show();
}