import { Router } from "express";
import { CartModel } from "../models/cart.models.js";
import { productModel } from "../models/products.models.js";
import { getCart } from "../controllers/cart.controllers.js";

const cartRouter = Router();

cartRouter.get("/", getCart);

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await CartModel.findById(cid).populate("products.id_prod");
    if (cart) {
      res.status(200).send(cart);
    } else {
      res.status(404).send("Carrito no encontrado");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

cartRouter.post("/:cid/products/:pid/", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity || isNaN(quantity) || quantity <= 0) {
    return res.status(400).send("Cantidad inválida");
  }

  try {
    const cart = await CartModel.findById(cid);
    if (cart) {
      const prod = await productModel.findById(pid);
      if (prod) {
        const indice = cart.products.findIndex(
          (prod) => prod.id_prod._id.toString() === pid
        );
        if (indice !== -1) {
          cart.products[indice].quantity = quantity;
        } else {
          cart.products.push({ id_prod: pid, quantity: quantity });
        }
        await CartModel.findByIdAndUpdate(cid, cart);
        return res.status(200).send({
          respuesta: "Ok",
          mensaje: "Producto actualizado en el carrito",
        });
      } else {
        return res.status(404).send({
          respuesta: "Error al agregar un producto a este carrito",
          mensaje: "Producto no encontrado",
        });
      }
    } else {
      return res.status(404).send({
        respuesta: "Error al agregar un producto a este carrito",
        mensaje: "Carrito no encontrado",
      });
    }
  } catch (error) {
    return res.status(500).send({
      respuesta: "Error al agregar un producto a este carrito",
      mensaje: error,
    });
  }
});
cartRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const cart = await CartModel.findById(cid);
    if (cart) {
      cart.products = products; // Asigna el nuevo arreglo de productos al carrito
      await CartModel.findByIdAndUpdate(cid, cart);
      return res.status(200).send({
        respuesta: "Ok",
        mensaje: "Carrito actualizado",
      });
    } else {
      return res.status(404).send({
        respuesta: "Error al actualizar el carrito",
        mensaje: "Carrito no encontrado",
      });
    }
  } catch (error) {
    return res.status(500).send({
      respuesta: "Error al actualizar el carrito",
      mensaje: error,
    });
  }
});
cartRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await CartModel.findById(cid);
    if (cart) {
      const productIndex = cart.products.findIndex(
        (prod) => prod.id_prod._id.toString() === pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
        await CartModel.findByIdAndUpdate(cid, cart);

        return res.status(200).send({
          status: "success",
          payload: `Cantidad de ejemplares actualizada para el producto ${pid}`,
        });
      } else {
        return res.status(404).send({
          status: "error",
          payload: `Producto ${pid} no encontrado en el carrito`,
        });
      }
    } else {
      return res.status(404).send({
        status: "error",
        payload: "Carrito no encontrado",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      payload: error,
    });
  }
});

cartRouter.delete("/:cid/", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await CartModel.findById(cid);
    if (cart) {
      cart.products = []; // Elimina todos los productos del carrito
      await cart.save();

      return res.status(200).send({
        status: "success",
        payload: "Todos los productos han sido eliminados del carrito",
      });
    } else {
      return res.status(404).send({
        status: "error",
        payload: "Carrito no encontrado",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      payload: error,
    });
  }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await CartModel.findById(cid);
    if (cart) {
      const indice = cart.products.findIndex(
        (prod) => prod.id_prod._id.toString() === pid
      );

      if (indice !== 1) {
        cart.products.splice(indice, 1); // Elimina el producto del array de productos
        await CartModel.findByIdAndUpdate(cid, cart);
        return res.status(200).send({
          respuesta: "Ok",
          mensaje: "Producto eliminado del carrito",
        });
      } else {
        return res.status(404).send({
          respuesta: "Error al eliminar un producto de este carrito",
          mensaje: "Producto no encontrado en el carrito",
        });
      }
    } else {
      return res.status(404).send({
        respuesta: "Error al eliminar un producto de este carrito",
        mensaje: "Carrito no encontrado",
      });
    }
  } catch (error) {
    return res.status(500).send({
      respuesta: "Error al eliminar un producto de este carrito",
      mensaje: error,
    });
  }
});

export default cartRouter;
