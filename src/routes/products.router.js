import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";


const router = Router();
const pm = new ProductManager();


// GET /api/products
router.get("/", async (req, res) => {
try {
const products = await pm.getAll();
res.json(products);
} catch (e) {
res.status(500).json({ error: e.message });
}
});


// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
try {
const product = await pm.getById(req.params.pid);
if (!product) return res.status(404).json({ error: "Product not found" });
res.json(product);
} catch (e) {
res.status(500).json({ error: e.message });
}
});


// POST /api/products
router.post("/", async (req, res) => {
try {
const created = await pm.create(req.body);
res.status(201).json(created);
} catch (e) {
const code = e.statusCode || 500;
res.status(code).json({ error: e.message });
}
});


// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
try {
const updated = await pm.update(req.params.pid, req.body);
if (!updated) return res.status(404).json({ error: "Product not found" });
res.json(updated);
} catch (e) {
res.status(500).json({ error: e.message });
}
});


// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
try {
const ok = await pm.delete(req.params.pid);
if (!ok) return res.status(404).json({ error: "Product not found" });
res.status(204).send();
} catch (e) {
res.status(500).json({ error: e.message });
}
});


export default router;