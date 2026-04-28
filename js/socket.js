const socket = io("https://storebackend-production-f58c.up.railway.app", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

const USER_ROLE = localStorage.getItem("role") || "user";
const seenMessages = new Set();

socket.on("connect", () => {
  console.log("🟢 connected:", socket.id);

  const orderId = localStorage.getItem("currentOrderId");

  if (orderId) {
    socket.emit("join-order", { orderId });
    loadMessages();
  }
});

socket.on("receive-message", (data) => {
  const key = data._id || data.message + data.sender;

  if (seenMessages.has(key)) return;
  seenMessages.add(key);

  addMessageToUI({
    message: data.message,
    sender: data.senderRole || data.sender
  });
});

socket.on("disconnect", () => {
  console.log("🔴 disconnected");
});

// expose if needed elsewhere
window.socket = socket;
window.USER_ROLE = USER_ROLE;