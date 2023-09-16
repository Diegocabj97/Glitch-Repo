import { Router } from "express";
import { MsgModel } from "../models/messages.models.js";

const msgRouter = Router();

msgRouter.get("/", async (req, res) => {
  try {
    const messages = await MsgModel.find();
    res.status(200).send(messages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ respuesta: "Error al obtener mensajes", error: error.message });
  }
});

msgRouter.post("/", async (req, res) => {
  try {
       const newMessage = new MsgModel.create();

    await newMessage.save();

    res.status(201).send({ respuesta: "Mensaje creado exitosamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ respuesta: "Error al crear mensaje", error: error.message });
  }
});

export default msgRouter;
