import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js"; 

const router = Router();

const productManager = new ProductManager();

// Home 
router.get("/", async (req, res) => {
  const products = await productManager.getAll();
  res.render("home", { products });
});

// Vista en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getAll();
  res.render("realTimeProducts", { products });
});

export default router;
