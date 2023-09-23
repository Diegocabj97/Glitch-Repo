import { Router } from "express";
import { userModel } from "../models/users.models.js";

const SessionRouter = Router();

//Metodo de login
SessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (req.session.login) {
      res.status(200) - send({ resultado: "login ya existente" });
    } else {
      const user = await userModel.findOne({ email: email });
      if (user) {
        if (user.password == password) {
          req.session.login = true;
          res.status(200).send({ resultado: "Login correcto", mensaje: user });
        } else {
          res
            .status(400)
            .send({ resultado: "Contraseña incorrecta", mensaje: password });
        }
      } else {
        res.status(404).send({ resultado: "Usuario no existente" });
      }
    }
  } catch (error) {
    res.status(404).send({ error: `Error en login: ${error}` });
  }
});

SessionRouter.post("/logout", async (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.status(200).send({ resultado: "Sesion cerrada" });
});

export default SessionRouter;
