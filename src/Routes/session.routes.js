import { Router } from "express";
import { userModel } from "../models/users.models.js";
import passport from "passport";

const SessionRouter = Router();

//Metodo de login
SessionRouter.post(
  "/login",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      // Si ya está autenticado, responde con un mensaje adecuado.
      return res
        .status(401)
        .json({
          mensaje:
            "Ya estás autenticado. cierra sesión para volver a iniciar sesión.",
        });
    }
    next();
  },
  passport.authenticate("login"),
  async (req, res) => {
    try {
      if (req.user) {
        // Si req.user existe, significa que el usuario ha iniciado sesión.
        res.status(200).send({
          mensaje: "Has iniciado sesión",
          user: req.user,
        });
      } else {
        // Si req.user no existe, significa que la autenticación fue exitosa y puedes enviar una respuesta 200 OK.
        req.session.user = {
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          email: req.user.email,
          age: req.user.age,
        };
        res.status(200).send({ payload: req.user });
      }
    } catch (error) {
      res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
    }
  }
);

//Metodo de register

SessionRouter.post(
  "/register",
  passport.authenticate("register"),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(501).send({ mensaje: "Usuario ya existente" });
      } else {
        res.status(200).send({ mensaje: "Usuario registrado" });
      }
    } catch (error) {
      res.status(500).send({ mensaje: `Error al registrar usuario ${error}` });
    }
  }
);

SessionRouter.post("/logout", async (req, res) => {
  try {
    if (!req.session.login) {
      req.session.destroy(() => {
        res.redirect("/login");
      });
    } else {
      res.status(200).send({ resultado: "no hay una sesion activa" });
    }
  } catch (error) {
    res.status(500).send({ resultado: "Error al cerrar sesión", error: error });
  }
});

// GITHUB LOGIN

SessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.status(200).send({ mensaje: "Usuario registrado mediante Github" });
  }
);

SessionRouter.get(
  "/githubCallback",
  passport.authenticate("github"),
  async (req, res) => {
    req.session.user = req.user;

    res.status(200).send({ mensaje: "Usuario logeado" });
  }
);

export default SessionRouter;
