const cart = [];
const cartPanel = document.querySelector(".cart-panel");
const overlay = document.querySelector(".overlay");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total");
const toast = document.querySelector(".toast");
const reservationDialog = document.querySelector(".reservation-dialog");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function toggleCart(open) {
  cartPanel.classList.toggle("open", open);
  overlay.classList.toggle("show", open);
  cartPanel.setAttribute("aria-hidden", String(!open));
}

function renderCart() {
  cartCount.textContent = cart.length;
  cartTotal.textContent = `$${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`;
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is waiting for a little treat.</p>';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <p><strong>${item.name}</strong><br><small>$${item.price.toFixed(2)}</small></p>
      <button class="remove-item" data-index="${index}" type="button">Remove</button>
    </div>`).join("");
}

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    cart.push({ name: button.dataset.name, price: Number(button.dataset.price) });
    renderCart();
    showToast(`${button.dataset.name} added to your order`);
    button.innerHTML = "Added! <span>✓</span>";
    setTimeout(() => button.innerHTML = "Add to order <span>+</span>", 1200);
  });
});

cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-item");
  if (!removeButton) return;
  cart.splice(Number(removeButton.dataset.index), 1);
  renderCart();
});

document.querySelector(".cart-button").addEventListener("click", () => toggleCart(true));
document.querySelector(".close-cart").addEventListener("click", () => toggleCart(false));
overlay.addEventListener("click", () => toggleCart(false));

document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    filter.classList.add("active");
    document.querySelectorAll(".menu-card").forEach((card) => {
      card.classList.toggle("hidden", filter.dataset.filter !== "all" && card.dataset.category !== filter.dataset.filter);
    });
  });
});

document.querySelectorAll(".open-reservation").forEach((button) => {
  button.addEventListener("click", () => reservationDialog.showModal());
});
document.querySelector(".close-dialog").addEventListener("click", () => reservationDialog.close());
reservationDialog.querySelector("form").addEventListener("submit", () => {
  setTimeout(() => showToast("Your cozy corner is reserved!"), 100);
});
document.querySelector(".checkout-button").addEventListener("click", () => {
  if (!cart.length) return showToast("Add a little treat first");
  cart.length = 0;
  renderCart();
  toggleCart(false);
  showToast("Order placed! We'll start brewing.");
});

renderCart();
