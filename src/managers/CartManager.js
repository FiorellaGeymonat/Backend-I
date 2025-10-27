import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateId } from "../utils/id.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class CartManager {
constructor(filePath = path.resolve(__dirname, "../../data/carts.json")) {
this.filePath = filePath;
}


async #readFile() {
try {
const data = await fs.readFile(this.filePath, "utf-8");
return JSON.parse(data || "[]");
} catch (e) {
if (e.code === "ENOENT") return [];
throw e;
}
}


async #writeFile(content) {
await fs.writeFile(this.filePath, JSON.stringify(content, null, 2));
}


async createCart() {
const carts = await this.#readFile();
const newCart = { id: generateId("cart"), products: [] };
carts.push(newCart);
await this.#writeFile(carts);
return newCart;
}


async getCartById(id) {
const carts = await this.#readFile();
return carts.find(c => c.id === id) || null;
}


async addProductToCart(cartId, productId, quantity = 1) {
const carts = await this.#readFile();
const cartIndex = carts.findIndex(c => c.id === cartId);
if (cartIndex === -1) return null;


const cart = carts[cartIndex];
const existing = cart.products.find(p => p.product === productId);
if (existing) {
existing.quantity += Number(quantity) || 1;
} else {
cart.products.push({ product: productId, quantity: Number(quantity) || 1 });
}


carts[cartIndex] = cart;
await this.#writeFile(carts);
return cart;
}
}