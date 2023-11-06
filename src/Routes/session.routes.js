import { Router } from "express";
import passport from "passport";
import { authorization, passportError } from "../utils/messagesError.js";
import { generateToken } from "../utils/jwt.js";
const SessionRouter = Router();
import {
  GithubLogin,
  current,
  login,
  logout,
  register,
  tryJwt,
} from "../controllers/sessions.controllers.js";

SessionRouter.post("/login", passport.authenticate("login"), login);
SessionRouter.post("/register", passport.authenticate("register"), register);
SessionRouter.get("/logout", logout);
SessionRouter.get(
  "/testJWT",
  passport.authenticate("jwt", { session: false }, tryJwt)
);
SessionRouter.get(
  "/current",
  passportError("jwt"),
  authorization("user"),
  current
);

// GITHUB LOGIN

SessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.status(200).send({ mensaje: "Usuario registrado mediante Github" });
    res.redirect("/login");
  }
);

SessionRouter.get(
  "/githubCallback",
  passport.authenticate("github"),
  GithubLogin
);

export default SessionRouter;
