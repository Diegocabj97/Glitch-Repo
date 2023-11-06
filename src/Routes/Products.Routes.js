import { Router } from "express";
import {
  getProduct,
  getProducts,
  postProduct,
  putProduct,
  deleteProduct,
} from "../controllers/products.controllers.js";
import { authorization, passportError } from "../utils/messagesError.js";

const prodsRouter = Router();

prodsRouter.get("/", getProducts);

prodsRouter.get("/:id", getProduct);

prodsRouter.post(
  "/",
  passportError("jwt"),
  authorization("Admin"),
  postProduct
);

prodsRouter.put(
  "/:pid",
  passportError("jwt"),
  authorization("Admin"),
  putProduct
);

prodsRouter.delete(
  "/:pid",
  passportError("jwt"),
  authorization("Admin"),
  deleteProduct
);

export default prodsRouter;
