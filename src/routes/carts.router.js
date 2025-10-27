import { Router } from "express";
import { CartManager } from "../managers/CartManager.js";


const router = Router();
const cm = new CartManager();


// POST /api/carts
router.post("/", async (req, res) => {
try {
const cart = await cm.createCart();
res.status(201).json(cart);
} catch (e) {
res.status(500).json({ error: e.message });
}
});


// GET /api/carts/:cid 
router.get("/:cid", async (req, res) => {
try {
const cart = await cm.getCartById(req.params.cid);
if (!cart) return res.status(404).json({ error: "Cart not found" });
res.json(cart.products);
} catch (e) {
res.status(500).json({ error: e.message });
}
});


// POST /api/carts/:cid/product/:pid 
router.post("/:cid/product/:pid", async (req, res) => {
try {
const { cid, pid } = req.params;
const { quantity = 1 } = req.body || {};
const cart = await cm.addProductToCart(cid, pid, quantity);
if (!cart) return res.status(404).json({ error: "Cart not found" });
res.status(201).json(cart);
} catch (e) {
res.status(500).json({ error: e.message });
}
});


export default router;