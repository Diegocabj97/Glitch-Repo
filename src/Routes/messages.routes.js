import { Router } from "express";
import { MsgModel } from "../models/messages.models";

const msgRouter = Router();

msgRouter.get("/", async (req, res) => {
  try {
    const messages = await MsgModel.find();
    res.status(200).send(messages);
  } catch {
    res
      .status(404)
      .send({ respuesta: "Mensajes no encontrados", mensaje: "not found" });
  }
});

msgRouter.post("/", async (req, res) => {
  try {
    const messages = await MsgModel.create();
    res.status(200).send(messages);
  } catch {
    res
      .status(404)
      .send({ respuesta: "Mensajes no encontrados", mensaje: "not found" });
  }
});

export default msgRouter;
