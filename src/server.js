import { ProductManager } from "./managers/ProductManager.js"; 
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

const productManager = new ProductManager(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta public - realtime.js
app.use(express.static(path.join(__dirname, "../public")));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../views"));

// Rutas API 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Ruta de vistas
app.use("/", viewsRouter);

// Servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Socket.io
const io = new Server(httpServer);

// lo guardo 
app.set("io", io);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado 🩷");

  // lista inicial
  const products = await productManager.getAll();   // no getProducts()
  socket.emit("productsUpdated", products);

  // crear producto desde websocket
  socket.on("newProduct", async (data) => {
    await productManager.create(data);              // no addProduct()
    const updated = await productManager.getAll();  // no getProducts()
    io.emit("productsUpdated", updated);
  });

  // eliminar producto desde websocket
  socket.on("deleteProduct", async (id) => {
    await productManager.delete(id);                // no deleteProduct()
    const updated = await productManager.getAll();  // no getProducts()
    io.emit("productsUpdated", updated);
  });
});