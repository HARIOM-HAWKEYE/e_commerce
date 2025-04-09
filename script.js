let products = [];
const container = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const themeToggle = document.getElementById("toggleTheme");


if (!localStorage.getItem("currentUser")) {
  alert("Please sign in first.");
  location.href = "index.html";
}


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});


async function loadProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  products = await res.json();
  populateCategories(products);
  displayProducts(products);
}

function populateCategories(data) {
  const categories = [...new Set(data.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function displayProducts(list) {
  container.innerHTML = "";
  const liked = JSON.parse(localStorage.getItem("liked")) || [];

  list.forEach(product => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h4>${product.title.slice(0, 20)}...</h4>
      <p>$${product.price}</p>
      <button onclick="viewDetail(${product.id})">View</button>
      <button onclick="toggleLike(${product.id})">${liked.includes(product.id) ? "❤️" : "🤍"}</button>
    `;
    container.appendChild(div);
  });
}

function toggleLike(id) {
  let liked = JSON.parse(localStorage.getItem("liked")) || [];
  if (liked.includes(id)) {
    liked = liked.filter(pid => pid !== id);
  } else {
    liked.push(id);
  }
  localStorage.setItem("liked", JSON.stringify(liked));
  displayProducts(filterProducts());
}

function filterProducts() {
  const keyword = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

  return products.filter(p =>
    p.title.toLowerCase().includes(keyword) &&
    (category === "" || p.category === category) &&
    p.price >= minPrice &&
    p.price <= maxPrice
  );
}

function viewDetail(id) {
  const selected = products.find(p => p.id === id);
  localStorage.setItem("selectedProduct", JSON.stringify(selected));
  location.href = "detail.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  location.href = "index.html";
}


searchInput.addEventListener("input", () => displayProducts(filterProducts()));
categoryFilter.addEventListener("change", () => displayProducts(filterProducts()));
minPriceInput.addEventListener("input", () => displayProducts(filterProducts()));
maxPriceInput.addEventListener("input", () => displayProducts(filterProducts()));


loadProducts();
