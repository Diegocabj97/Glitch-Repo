import { Schema, model } from "mongoose";

const messagesSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  postTime: {
    type: Date,
    default: Date.now(),
  },
});

//Parametro 1: Nombre de la coleccion - Parametro 2:Schema
export const MsgModel = model("messages", messagesSchema);
