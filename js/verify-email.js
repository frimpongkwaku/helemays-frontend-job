const localFrontend = ["", "localhost", "127.0.0.1"].includes(window.location.hostname);
const API_BASE = window.HELEMAYS_API_BASE || (localFrontend
    ? "http://localhost:5000/api"
    : "https://storebackend-production-f58c.up.railway.app/api");
const title = document.getElementById("verificationTitle");
const message = document.getElementById("verificationMessage");
const signInLink = document.getElementById("verificationLogin");
const token = new URLSearchParams(window.location.search).get("token");

if (!token) {
    title.textContent = "Verification link missing";
    message.textContent = "Open the complete link from your verification email, or request a new verification email from the sign-in form.";
} else {
    try {
        const response = await fetch(`${API_BASE}/users/verify-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || "This verification link is invalid or expired.");
        title.textContent = "Email verified";
        message.textContent = result.message;
        signInLink.hidden = false;
    } catch (error) {
        title.textContent = "Could not verify email";
        message.textContent = error.message || "We could not reach the store. Try the link again later.";
    }
}