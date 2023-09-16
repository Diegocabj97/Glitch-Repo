import { Router } from "express";
import { productModel } from "../models/products.models.js";
import paginate from "mongoose-paginate-v2";
const prodsRouter = Router();

prodsRouter.get("/", async (req, res) => {
  const { sort, limit = 10, page = 1, category } = req.query;

  try {
    let query = {};
    if (category) {
      query.category = category;
    }
    let resultado;
    const filtros = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    if (sort === "asc") {
      resultado = await productModel.paginate(query, {
        sort: { price: "asc" },
        ...filtros,
      });
    } else if (sort === "desc") {
      resultado = await productModel.paginate(query, {
        sort: { price: "desc" },
        ...filtros,
      });
    } else {
      resultado = await productModel.paginate(query, filtros);
    }

    res.status(200).send({ respuesta: "Ok", mensaje: resultado });
  } catch (error) {
    res
      .status(404)
      .send({ respuesta: "Error al consultar productos", mensaje: error });
  }
});

prodsRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    if (prod) {
      res.status(200).send({ respuesta: "Ok", mensaje: prod });
    } else {
      res.status(404).send({ respuesta: "Not Found", mensaje: "Not Found" });
    }
  } catch {
    res.status(404).send({ respuesta: "Not Found", mensaje: "Not Found" });
  }
  const prod = await productModel.findById(pid);
});

prodsRouter.post("/", async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  try {
    const prod = await productModel.create(
      title,
      description,
      code,
      price,
      stock,
      category
    );
    res.status(200).send({ respuesta: "Ok", mensaje: prod });
  } catch (error) {
    res
      .status(404)
      .send({ respuesta: "Error al agregar producto", mensaje: error });
  }
});

prodsRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    status,
    thumbnails,
  } = req.body;
  try {
    const prod = await productModel.findByIdAndUpdate(pid, {
      title,
      description,
      code,
      price,
      stock,
      category,
      status,
      thumbnails,
    });
    res
      .status(200)
      .send({ respuesta: "Producto actualizado correctamente", mensaje: prod });
  } catch (error) {
    res
      .status(404)
      .send({ respuesta: "Error al actualizar producto", mensaje: error });
  }
});

prodsRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await productModel.findByIdAndDelete(pid);
    res.status(200).send("Producto eliminado correctamente");
  } catch (error) {
    res
      .status(404)
      .send({ respuesta: "Error al eliminar producto", mensaje: error });
  }
});

export default prodsRouter;
