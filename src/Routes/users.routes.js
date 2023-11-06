import { Router } from "express";
import { userModel } from "../models/users.models.js";
import { authorization } from "../utils/messagesError.js";
import {
  getAll,
  getById,
  putById,
  deleteByid,
} from "../controllers/users.controllers.js";

const userRouter = Router();

userRouter.get("/", getAll);
userRouter.get("/:uid", getById);
userRouter.put("/:uid", putById);
userRouter.delete("/:uid", authorization("admin"), deleteByid);

export default userRouter;
