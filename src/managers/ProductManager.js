import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateId } from "../utils/id.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class ProductManager {
constructor(filePath = path.resolve(__dirname, "../../data/products.json")) {
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


async getAll() {
return await this.#readFile();
}


async getById(id) {
const products = await this.#readFile();
return products.find(p => p.id === id) || null;
}


async create({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
if (!title || !description || !code || price == null || stock == null || !category) {
const err = new Error("Missing required fields");
err.statusCode = 400;
throw err;
}


const products = await this.#readFile();


// Validar code único (opcional pero recomendado)
if (products.some(p => p.code === code)) {
const err = new Error("Product code must be unique");
err.statusCode = 409;
throw err;
}


const newProduct = {
id: generateId("prod"),
title,
description,
code,
price: Number(price),
status: Boolean(status),
stock: Number(stock),
category,
thumbnails: Array.isArray(thumbnails) ? thumbnails : []
};


products.push(newProduct);
await this.#writeFile(products);
return newProduct;
}


async update(id, updates) {
const products = await this.#readFile();
const index = products.findIndex(p => p.id === id);
if (index === -1) return null;


const { id: _ignored, ...rest } = updates; // no permitir cambiar id
products[index] = { ...products[index], ...rest };


await this.#writeFile(products);
return products[index];
}


async delete(id) {
const products = await this.#readFile();
const index = products.findIndex(p => p.id === id);
if (index === -1) return false;
products.splice(index, 1);
await this.#writeFile(products);
return true;
}
}