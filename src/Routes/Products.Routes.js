import { Router } from "express";
import { ProductManager } from "../ProductManager.js";
import { Product } from "../ProductManager.js";

const prodsRouter = Router();
const productManager = new ProductManager();

prodsRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  const prods = await productManager.getProducts();
  const products = prods.slice(0, limit);
  res.status(200).send(products);
});

prodsRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const prod = await productManager.getProductById(parseInt(pid));
  if (prod) {
    res.status(200).send(prod);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

prodsRouter.post("/", async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send("Faltan campos obligatorios");
  }

  const newProduct = new Product(
    code,
    title,
    price,
    description,
    stock,
    category,
    thumbnails || ""
  );

  await productManager.addProduct(newProduct);

  res.status(201).send("Producto agregado correctamente");
});

prodsRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send("Faltan campos obligatorios");
  }

  const updatedProduct = new Product(
    code,
    title,
    price,
    description,
    stock,
    category,
    thumbnails || ""
  );

  await productManager.updateProduct(parseInt(pid), updatedProduct);

  res.status(200).send("Producto actualizado correctamente");
});

prodsRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  await productManager.deleteProduct(parseInt(pid));

  res.status(200).send("Producto eliminado correctamente");
});

export default prodsRouter;
