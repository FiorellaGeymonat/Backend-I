const socket = io();

// DOM
const productList = document.getElementById("productList");
const productForm = document.getElementById("productForm");
const deleteForm = document.getElementById("deleteForm");

socket.on("productsUpdated", (products) => {
  renderProducts(products);
});

function renderProducts(products) {
  productList.innerHTML = "";

  products.forEach((p) => {
    const li = document.createElement("li");
    li.dataset.id = p.id;
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price} (id: ${p.id})`;
    productList.appendChild(li);
  });
}

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);

  const newProduct = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
    status: true,
    thumbnails: []
  };

  console.log("Emitiendo newProduct", newProduct);
  socket.emit("newProduct", newProduct);

  productForm.reset();
});


deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(deleteForm);
  const id = formData.get("id");

  console.log("Emitiendo deleteProduct", id);
  socket.emit("deleteProduct", id);

  deleteForm.reset();
});
